import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { vatBillNo, vatBillIssuedDate, invoiceNo } = await request.json();

    const updated = await prisma.salesTransaction.update({
      where: { id },
      data: {
        vatBillNo: vatBillNo || null,
        vatBillIssuedDate: vatBillIssuedDate ? new Date(vatBillIssuedDate) : null,
        ...(invoiceNo !== undefined && { invoiceNo: invoiceNo || null }),
      },
      select: {
        id: true,
        vatBillNo: true,
        vatBillIssuedDate: true,
        invoiceNo: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('VAT update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
