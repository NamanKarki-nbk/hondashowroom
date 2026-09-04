import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, remarks } = body;

    const dataToUpdate: any = {};
    if (status) dataToUpdate.status = status;
    if (remarks !== undefined) dataToUpdate.remarks = remarks;

    const updatedOrder = await prisma.purchaseOrder.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error("PATCH Order Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
