import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activityLogger";
import { verifySessionToken } from "@/lib/session";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let whereClause = {};
    if (status && status !== 'ALL') {
      whereClause = { status };
    }

    const deliveries = await prisma.delivery.findMany({
      where: whereClause,
      include: {
        customer: { select: { fullName: true, phone: true } },
        vehicle: { select: { modelName: true, vinNumber: true } },
        sales: { select: { invoiceNo: true, finalAmount: true } }
      },
      orderBy: { deliveryDate: 'asc' }
    });

    return NextResponse.json(deliveries);
  } catch (error) {
    console.error("Failed to fetch deliveries:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, feedbackScore, feedbackText } = body;
    
    const updateData: any = {};
    if (status) updateData.status = status;
    if (feedbackScore !== undefined) updateData.feedbackScore = parseInt(feedbackScore);
    if (feedbackText !== undefined) updateData.feedbackText = feedbackText;

    const delivery = await prisma.delivery.update({
      where: { id },
      data: updateData
    });

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value || cookieStore.get('session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    await logActivity({
      userId: session?.userId || session?.id || "system",
      action: "UPDATE",
      entity: "Lead",
      entityId: delivery.id,
      details: {
        customerName: delivery.customerName,
        vehicleName: delivery.vehicleName,
        rating: delivery.rating ?? null,
      }
    });

    return NextResponse.json(delivery);
  } catch (error) {
    console.error("Failed to update delivery:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
