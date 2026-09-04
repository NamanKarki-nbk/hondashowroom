import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/session";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value || cookieStore.get('session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customer = await prisma.customer.findUnique({
      where: { userId: session.userId },
      include: {
        referrals: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({
      loyaltyPoints: customer.loyaltyPoints,
      referrals: customer.referrals
    });

  } catch (error) {
    console.error("Failed to fetch referrals:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value || cookieStore.get('session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customer = await prisma.customer.findUnique({
      where: { userId: session.userId }
    });

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const body = await req.json();
    const { referredName, referredPhone, remarks } = body;

    if (!referredName || !referredPhone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if referral already exists
    const existing = await prisma.referral.findUnique({
      where: { referredPhone }
    });

    if (existing) {
      return NextResponse.json({ error: "This phone number has already been referred." }, { status: 400 });
    }

    const referral = await prisma.referral.create({
      data: {
        referrerId: customer.id,
        referredName,
        referredPhone,
        remarks: remarks || null
      }
    });

    return NextResponse.json(referral, { status: 201 });

  } catch (error) {
    console.error("Failed to create referral:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
