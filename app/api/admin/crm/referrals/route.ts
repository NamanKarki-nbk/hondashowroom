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

    const referrals = await prisma.referral.findMany({
      where: whereClause,
      include: {
        referrer: { select: { fullName: true, phone: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(referrals);
  } catch (error) {
    console.error("Failed to fetch referrals:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, remarks } = body;
    
    const updateData: any = {};
    if (status) updateData.status = status;
    if (remarks !== undefined) updateData.remarks = remarks;

    const referral = await prisma.referral.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(referral);
  } catch (error) {
    console.error("Failed to update referral:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
