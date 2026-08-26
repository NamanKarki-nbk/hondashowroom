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

    const valuations = await prisma.valuationLog.findMany({
      where: whereClause,
      include: {
        customer: { select: { fullName: true, phone: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(valuations);
  } catch (error) {
    console.error("Failed to fetch valuations:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, finalOffered, remarks } = body;
    
    const updateData: any = {};
    if (status) updateData.status = status;
    if (finalOffered !== undefined) updateData.finalOffered = parseFloat(finalOffered);
    if (remarks !== undefined) updateData.remarks = remarks;

    const valuation = await prisma.valuationLog.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(valuation);
  } catch (error) {
    console.error("Failed to update valuation:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
