import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { logActivity } from '@/lib/activityLogger';
import { verifySessionToken } from '@/lib/session';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session') || cookieStore.get('auth_session');
    
    // Simplistic auth check (Ideally decode JWT here)
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const token = cookieStore.get('auth_session')?.value || cookieStore.get('session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    const body = await req.json();
    const { 
      customerId, 
      chassisNo, // Using VIN / Chassis number to identify vehicle
      saleType, 
      paymentType, 
      showroomPrice, 
      discount = 0, 
      insurance = 0, 
      registrationCharge = 0, 
      serviceCharge = 0, 
      accessoriesCharge = 0, 
      advancePaid = 0,
      financerName,
      downpayment,
      financeAmount,
      monthlyInstallment,
      installments,
      interestRate,
      exchangeModel,
      exchangeNumber,
      exchangeValue,
      accessories,
      remarks 
    } = body;

    // 1. Strict chassis check
    if (!chassisNo) {
      return NextResponse.json({ error: 'Chassis number (VIN) is required.' }, { status: 400 });
    }

    const vehicle = await prisma.vehicleInventory.findUnique({
      where: { vin: chassisNo }
    });

    if (!vehicle) {
      return NextResponse.json({ error: `Vehicle with Chassis No ${chassisNo} not found in inventory.` }, { status: 404 });
    }

    if (vehicle.status !== 'IN_STOCK') {
      return NextResponse.json({ error: `Vehicle with Chassis No ${chassisNo} is already marked as ${vehicle.status}.` }, { status: 400 });
    }

    // 2. Strict verified-customer check
    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID is required.' }, { status: 400 });
    }

    const customer = await prisma.customer.findUnique({
      where: { id: customerId }
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found.' }, { status: 404 });
    }

    // Must be verified
    if (!customer.isVerified || !customer.citizenshipVerified) {
      return NextResponse.json({ 
        error: 'Customer is not fully verified. Please ensure KYC (Citizenship) is approved before proceeding with the sale.' 
      }, { status: 403 });
    }

    // 3. Calculation
    const calculatedFinalAmount = 
      (showroomPrice || vehicle.purchasePrice) - discount + insurance + registrationCharge + serviceCharge + accessoriesCharge;
    
    const calculatedDueAmount = calculatedFinalAmount - advancePaid;
    const commission = calculatedFinalAmount * 0.015; // 1.5%

    // 4. Generate Invoice Number (e.g. INV-2081-0001)
    const invoiceCount = await prisma.salesTransaction.count();
    const currentYear = new Date().getFullYear();
    const invoiceNo = `INV-${currentYear}-${String(invoiceCount + 1).padStart(4, '0')}`;

    // 5. Create Transaction
    const transaction = await prisma.$transaction(async (tx) => {
      // Create Sale Record
      const sale = await tx.salesTransaction.create({
        data: {
          invoiceNo,
          vehicleId: vehicle.id,
          customerId: customer.id,
          saleType: saleType || 'Retail',
          paymentType: paymentType || 'CASH',
          showroomPrice: showroomPrice || vehicle.purchasePrice,
          discount,
          insurance,
          registrationCharge,
          serviceCharge,
          accessoriesCharge,
          advancePaid,
          finalAmount: calculatedFinalAmount,
          commission,
          totalAmountPaid: advancePaid,
          dueAmount: calculatedDueAmount,
          financerName,
          downpayment,
          financeAmount,
          monthlyInstallment,
          installments,
          interestRate,
          exchangeModel,
          exchangeNumber,
          exchangeValue,
          accessories: accessories || [],
          remarks,
        }
      });

      // Update Vehicle Status
      await tx.vehicleInventory.update({
        where: { id: vehicle.id },
        data: { status: 'SOLD' }
      });

      // If advance paid, record it in PaymentReceipt
      if (advancePaid > 0) {
        const receiptCount = await tx.paymentReceipt.count();
        await tx.paymentReceipt.create({
          data: {
            receiptNo: `REC-${currentYear}-${String(receiptCount + 1).padStart(4, '0')}`,
            transactionId: sale.id,
            amount: advancePaid,
            paymentMethod: paymentType || 'CASH',
            remarks: 'Advance Payment',
          }
        });
      }

      return sale;
    });

    await logActivity({
      userId: session?.userId || session?.id || "system",
      action: "CREATE",
      entity: "Sale",
      entityId: transaction.id,
      details: {
        invoiceNo: transaction.invoiceNo,
        customerId: transaction.customerId,
        vehicleId: transaction.vehicleId,
        finalAmount: transaction.finalAmount,
      }
    });

    return NextResponse.json({ message: 'Sales transaction completed successfully.', transaction }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating sales transaction:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
