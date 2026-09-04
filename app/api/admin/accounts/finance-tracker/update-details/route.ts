import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { transactionId, clientId, indexNo, financeAmount, downpayment, installments, serviceCharge, registrationCharge } = body;

    if (!transactionId) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    // Update SalesTransaction
    const updatedTx = await prisma.salesTransaction.update({
      where: { id: transactionId },
      data: { 
        clientId,
        financeAmount: financeAmount ? parseFloat(financeAmount.toString()) : null,
        downpayment: downpayment ? parseFloat(downpayment.toString()) : null,
        installments: installments ? parseInt(installments.toString(), 10) : null,
        serviceCharge: serviceCharge !== '' ? parseFloat(serviceCharge.toString()) : null,
        registrationCharge: registrationCharge !== '' ? parseFloat(registrationCharge.toString()) : null,
      }
    });

    // Update Vehicle's indexNo if provided
    if (indexNo !== undefined && updatedTx.vehicleId) {
      await prisma.vehicleInventory.update({
        where: { id: updatedTx.vehicleId },
        data: { indexNo }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating finance details:', error);
    return NextResponse.json({ error: 'Failed to update details' }, { status: 500 });
  }
}
