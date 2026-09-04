import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.purchaseOrder.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            variant: {
              include: {
                vehicleMaster: true
              }
            },
            color: true
          }
        }
      }
    });
    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("GET Orders Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, remarks } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Order must contain at least one item' }, { status: 400 });
    }

    // Generate unique order number
    const dateStr = new Date().toISOString().replace(/[-:T.]/g, '').substring(0, 14);
    const orderNo = `ORD-${dateStr}-${Math.floor(Math.random() * 100)}`;

    const order = await prisma.purchaseOrder.create({
      data: {
        orderNo,
        date: new Date(),
        status: 'PENDING',
        remarks: remarks || null,
        items: {
          create: items.map((item: any) => ({
            variantId: item.variantId,
            colorId: item.colorId,
            quantity: Number(item.quantity)
          }))
        }
      },
      include: {
        items: true
      }
    });

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("POST Order Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
