import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    return NextResponse.json(delivery);
  } catch (error) {
    console.error("Failed to update delivery:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
