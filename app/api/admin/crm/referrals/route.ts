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

    const referrals = await prisma.referral.findMany({
      where: whereClause,
      include: {
        referrer: {
          select: {
            fullName: true,
            phone: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
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
    const { id, status, remarks, rewardPoints } = body;
    
    // Find existing to see if it was already rewarded
    const existing = await prisma.referral.findUnique({
      where: { id },
      include: { referrer: true }
    });

    if (!existing) {
      return NextResponse.json({ error: "Referral not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (remarks !== undefined) updateData.remarks = remarks;
    if (rewardPoints !== undefined) updateData.rewardPoints = rewardPoints;

    // Default reward points to 500 if rewarded without specific points
    if (status === 'REWARDED' && existing.status !== 'REWARDED' && (rewardPoints === undefined || rewardPoints === 0) && existing.rewardPoints === 0) {
      updateData.rewardPoints = 500;
    }

    // Wrap in transaction if we are awarding points
    const transaction = [];
    
    transaction.push(
      prisma.referral.update({
        where: { id },
        data: updateData
      })
    );

    // If changing to REWARDED and it wasn't before, add points
    if (status === 'REWARDED' && existing.status !== 'REWARDED') {
      const pointsToAdd = updateData.rewardPoints || existing.rewardPoints;
      if (pointsToAdd > 0) {
        transaction.push(
          prisma.customer.update({
            where: { id: existing.referrerId },
            data: {
              loyaltyPoints: {
                increment: pointsToAdd
              }
            }
          })
        );
      }
    }

    const [updatedReferral] = await prisma.$transaction(transaction);

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value || cookieStore.get('session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    await logActivity({
      userId: session?.userId || session?.id || "system",
      action: "UPDATE",
      entity: "Referral",
      entityId: updatedReferral.id,
      details: {
        id: updatedReferral.id,
        status: updatedReferral.status,
        points: updatedReferral.rewardPoints
      }
    });

    return NextResponse.json(updatedReferral);
  } catch (error) {
    console.error("Failed to update referral:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
