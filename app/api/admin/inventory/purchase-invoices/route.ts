import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activityLogger";
import { verifySessionToken } from "@/lib/session";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const invoices = await prisma.purchaseInvoice.findMany({
      include: {
        vehicles: {
          select: { 
            id: true, 
            vin: true,
            variant: {
              select: {
                vehicleMaster: { select: { name: true } }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error("Failed to fetch purchase invoices:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { invoiceNo, invoiceDate, totalAmount, purchaseType } = body;

    const invoice = await prisma.purchaseInvoice.create({
      data: {
        invoiceNo,
        invoiceDate: new Date(invoiceDate),
        totalAmount: parseFloat(totalAmount),
        purchaseType: purchaseType || "DEALER"
      }
    });

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value || cookieStore.get('session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    await logActivity({
      userId: session?.userId || session?.id || "system",
      action: "CREATE",
      entity: "VehicleInventory",
      entityId: invoice.id,
      details: {
        invoiceNo: invoice.invoiceNo,
        totalAmount: invoice.totalAmount,
        purchaseType: invoice.purchaseType,
      }
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Failed to create purchase invoice:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, purchaseType } = await req.json();

    const invoice = await prisma.purchaseInvoice.update({
      where: { id },
      data: { purchaseType }
    });

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value || cookieStore.get('session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    await logActivity({
      userId: session?.userId || session?.id || "system",
      action: "UPDATE",
      entity: "VehicleInventory",
      entityId: invoice.id,
      details: {
        invoiceNo: invoice.invoiceNo,
        purchaseType: invoice.purchaseType,
      }
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Failed to update purchase invoice status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
