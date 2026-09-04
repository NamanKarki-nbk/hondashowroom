import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    const sales = await prisma.salesTransaction.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: true,
        vehicle: {
          include: {
            variant: { include: { vehicleMaster: true } },
          },
        },
        receipts: {
          orderBy: { createdAt: 'asc' },
          select: { id: true, receiptNo: true, amount: true, paymentMethod: true },
        },
      },
    });

    return NextResponse.json(sales);
  } catch (error) {
    console.error('Failed to fetch sales history:', error);
    return NextResponse.json({ error: 'Failed to fetch sales history' }, { status: 500 });
  }
}
