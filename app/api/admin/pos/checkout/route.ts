import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateReceiptNo } from '@/lib/sequence';
import { PaymentType } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const {
      vehicleId,
      customerId,
      purchaseMethod,
      paymentMethod,
      totalReceivable,
      totalReceived,
      dueAmount,
      accessoriesAmount,
      discountAmount,
      insuranceAmount,
      exchangeModel,
      exchangeNumber,
      exchangeValue,
      downpayment,
      financerName,
      financePdfUrl,
      financeAmount,
      pmCashAmount,
      bankTransfers,
      pmChequeBankName,
      pmChequeNumber,
      pmChequeDate,
      pmChequeAmount,
      accessories,
      serviceBookNo,
      insuranceCompany,
      insuranceType,
      policyNo,
      valuationBy
    } = data;

    if (!vehicleId || !customerId) {
      return NextResponse.json({ error: 'Missing vehicle or customer' }, { status: 400 });
    }

    // Determine payment type based on purchaseMethod
    let pt: PaymentType = 'CASH';
    if (purchaseMethod.includes('FINANCE')) pt = 'FINANCE';
    else if (purchaseMethod.includes('EXCHANGE')) pt = 'EXCHANGE';

    // Generate unique invoice number
    const dateStr = new Date().toISOString().replace(/[-:T.]/g, '').substring(0, 14);
    // Do not auto-generate invoiceNo as it will be added manually later

    const transaction = await prisma.$transaction(async (tx) => {
      const vehicle = await tx.vehicleInventory.findUnique({ 
        where: { id: vehicleId },
        include: { variant: true } 
      });
      if (!vehicle) throw new Error('Vehicle not found');

      const baseSellingPrice = vehicle.variant.exShowroomPriceNPR || (vehicle.purchasePrice * 1.15);

      // 1. Create SalesTransaction
      const sale = await tx.salesTransaction.create({
        data: {
          vehicle: { connect: { id: vehicleId } },
          customer: { connect: { id: customerId } },
          saleType: 'RETAIL',
          paymentType: pt,
          showroomPrice: baseSellingPrice, 
          discount: discountAmount || 0,
          insurance: insuranceAmount || 0,
          accessoriesCharge: accessoriesAmount || 0,
          finalAmount: totalReceivable,
          commission: 0,
          totalAmountPaid: totalReceived,
          dueAmount: dueAmount,
          exchangeModel,
          exchangeNumber,
          exchangeValue,
          downpayment,
          financerName,
          financePdfUrl: financePdfUrl || null,
          financeAmount,
          exchangeModel: exchangeValue > 0 ? exchangeModel : null,
          accessories: accessories ? JSON.stringify(accessories) : null,
          serviceBookNo,
          insuranceCompany: insuranceAmount > 0 ? (insuranceCompany || 'Protective Micro Insurance') : null,
          insuranceType: insuranceAmount > 0 ? (insuranceType || '3rd Party') : null,
          policyNo: policyNo || null,
          remarks: valuationBy || null,
        }
      });

      // 2. Create PaymentReceipts based on paymentMethod
      let receiptOffset = 0;
      if (paymentMethod === 'Cash' || paymentMethod === 'Cash + Bank Transfer') {
        const cashAmt = paymentMethod === 'Cash' ? totalReceived : (pmCashAmount || 0);
        if (cashAmt > 0) {
          await tx.paymentReceipt.create({
            data: {
              receiptNo: await generateReceiptNo(receiptOffset++),
              transactionId: sale.id,
              amount: cashAmt,
              paymentMethod: 'Cash',
              remarks: 'Cash Payment'
            }
          });
        }
      }

      if (paymentMethod === 'Bank Transfer' || paymentMethod === 'Cash + Bank Transfer') {
        if (bankTransfers && Array.isArray(bankTransfers)) {
          for (const transfer of bankTransfers) {
            if (transfer.amount > 0) {
              await tx.paymentReceipt.create({
                data: {
                  receiptNo: await generateReceiptNo(receiptOffset++),
                  transactionId: sale.id,
                  amount: Number(transfer.amount),
                  paymentMethod: 'Bank Transfer',
                  remarks: `Bank: ${transfer.bankName}, Ref: ${transfer.reference}`
                }
              });
            }
          }
        }
      }

      if (paymentMethod === 'Cheque' && pmChequeAmount > 0) {
        await tx.paymentReceipt.create({
           data: {
             receiptNo: await generateReceiptNo(receiptOffset++),
             transactionId: sale.id,
             amount: Number(pmChequeAmount),
             paymentMethod: 'Cheque',
             remarks: `Bank: ${pmChequeBankName}, No: ${pmChequeNumber}, Date: ${pmChequeDate}`
           }
        });
      }

      // 3. Update vehicle inventory status
      await tx.vehicleInventory.update({
        where: { id: vehicleId },
        data: { status: 'SOLD' }
      });

      return sale;
    });

    return NextResponse.json({ success: true, transaction });
  } catch (error: any) {
    console.error('POS Checkout Error:', error);
    return NextResponse.json({ error: 'Failed to process checkout: ' + error.message }, { status: 500 });
  }
}
