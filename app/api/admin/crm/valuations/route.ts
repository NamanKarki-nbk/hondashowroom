import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activityLogger";
import { verifySessionToken } from "@/lib/session";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const valuations = await prisma.valuationLog.findMany({
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
    
    // finalOffered and remarks are not in the schema anymore
    // only update what's available
    
    const valuation = await prisma.valuationLog.update({
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
      entityId: valuation.id,
      details: {
        brand: valuation.brand,
        model: valuation.model,
        customerName: valuation.customerName,
        customerPhone: valuation.customerPhone,
      }
    });

    return NextResponse.json(valuation);
  } catch (error) {
    console.error("Failed to update valuation:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
