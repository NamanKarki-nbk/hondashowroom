import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PaymentType } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const {
      vehicleId,
      customerId,
      purchaseMethod,
      totalReceivable,
      totalReceived,
      dueAmount,
      accessoriesAmount,
      discountAmount,
      insuranceAmount
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
    const invoiceNo = `INV-${dateStr}-${Math.floor(Math.random() * 1000)}`;

    const transaction = await prisma.$transaction(async (tx) => {
      // 1. Create SalesTransaction
      const sale = await tx.salesTransaction.create({
        data: {
          invoiceNo,
          vehicleId,
          customerId,
          saleType: 'RETAIL',
          paymentType: pt,
          showroomPrice: totalReceivable, 
          discount: discountAmount || 0,
          insurance: insuranceAmount || 0,
          accessoriesCharge: accessoriesAmount || 0,
          finalAmount: totalReceivable,
          commission: 0,
          totalAmountPaid: totalReceived,
          dueAmount: dueAmount
        }
      });

      // 2. Update vehicle inventory status
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
