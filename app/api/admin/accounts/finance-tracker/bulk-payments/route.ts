import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { date, bankTransactionId, receivedBank, amount, sender } = body;

    if (!date || !bankTransactionId || !receivedBank || !amount || !sender) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const newPayment = await prisma.financeBulkPayment.create({
      data: {
        date: new Date(date),
        bankTransactionId,
        receivedBank,
        amount: parseFloat(amount),
        sender,
      }
    });

    return NextResponse.json({ success: true, data: newPayment });
  } catch (error: any) {
    console.error('Error creating finance bulk payment:', error);
    return NextResponse.json({ error: 'Failed to add payment' }, { status: 500 });
  }
}
