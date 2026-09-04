import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { transactionId, clientId } = body;

    if (!transactionId) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    const updated = await prisma.salesTransaction.update({
      where: { id: transactionId },
      data: { clientId }
    });

    return NextResponse.json({ success: true, clientId: updated.clientId });
  } catch (error: any) {
    console.error('Error updating client ID:', error);
    return NextResponse.json({ error: 'Failed to update client ID' }, { status: 500 });
  }
}
