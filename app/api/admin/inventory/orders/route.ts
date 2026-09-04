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

    // Resolve colors before creating order
    const resolvedItems = await Promise.all(items.map(async (item: any) => {
      const variant = await prisma.vehicleVariant.findUnique({
        where: { id: item.variantId },
      });
      if (!variant) throw new Error("Invalid variant ID");
      
      let actualColorId = item.colorId;
      
      // If colorId is just a name (not a valid UUID), find or create it
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(item.colorId);
      if (!isUUID) {
        let colorObj = await prisma.vehicleColor.findFirst({
          where: { 
            vehicleMasterId: variant.vehicleMasterId,
            name: { equals: item.colorId, mode: 'insensitive' }
          }
        });
        if (!colorObj) {
          colorObj = await prisma.vehicleColor.create({
            data: {
              vehicleMasterId: variant.vehicleMasterId,
              name: item.colorId,
              hexCode: '#000000'
            }
          });
        }
        actualColorId = colorObj.id;
      }
      
      return {
        variantId: item.variantId,
        colorId: actualColorId,
        quantity: Number(item.quantity)
      };
    }));

    const order = await prisma.purchaseOrder.create({
      data: {
        orderNo,
        date: new Date(),
        status: 'PENDING',
        remarks: remarks || null,
        items: {
          create: resolvedItems
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
