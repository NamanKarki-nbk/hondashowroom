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

    const referrals: any[] = [];

    return NextResponse.json(referrals);
  } catch (error) {
    console.error("Failed to fetch referrals:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, remarks, isActive } = body;
    
    const updateData: any = {};
    if (status) updateData.status = status;
    if (remarks !== undefined) updateData.remarks = remarks;

    const referral: any = {};

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value || cookieStore.get('session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    await logActivity({
      userId: session?.userId || session?.id || "system",
      action: "UPDATE",
      entity: "Lead",
      entityId: referral.id,
      details: {
        id: referral.id,
        status: (referral as any).status,
      }
    });

    return NextResponse.json(referral);
  } catch (error) {
    console.error("Failed to update referral:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
