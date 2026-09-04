import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activityLogger";
import { verifySessionToken } from "@/lib/session";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const whereClause: any = {
      // Only include SalesTransactions that have a scheduled, delivered or rescheduled status, 
      // or if status is ALL, include all transactions that are not PENDING.
    };

    if (status && status !== 'ALL') {
      whereClause.deliveryStatus = status;
    }

    const deliveries = await prisma.salesTransaction.findMany({
      where: whereClause,
      include: {
        customer: true,
        vehicle: {
          include: {
            variant: {
              include: {
                vehicleMaster: true
              }
            }
          }
        }
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
    const { id, status, feedbackScore, keyNo, tyreMake, batteryNo } = body;
    
    const updateData: any = {};
    if (status) {
      updateData.deliveryStatus = status;
      // When marked as DELIVERED, make sure deliveryDate is set if not already
      if (status === 'DELIVERED') {
        updateData.deliveryDate = new Date();
      }
    }
    
    if (feedbackScore !== undefined) updateData.feedbackScore = parseInt(feedbackScore);
    if (keyNo !== undefined) updateData.keyNo = keyNo;
    if (tyreMake !== undefined) updateData.tyreMake = tyreMake;
    if (batteryNo !== undefined) updateData.batteryNo = batteryNo;

    const delivery = await prisma.salesTransaction.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        vehicle: true
      }
    });

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value || cookieStore.get('session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    await logActivity({
      userId: session?.userId || session?.id || "system",
      action: "UPDATE",
      entity: "SalesTransaction",
      entityId: delivery.id,
      details: {
        action: "Handover Updated",
        customerName: delivery.customer.fullName,
        vehicleName: delivery.vehicle.name,
        status: delivery.deliveryStatus,
        keyNo: delivery.keyNo
      }
    });

    // TODO: Send Email/SMS to customer

    return NextResponse.json(delivery);
  } catch (error) {
    console.error("Failed to update delivery:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
