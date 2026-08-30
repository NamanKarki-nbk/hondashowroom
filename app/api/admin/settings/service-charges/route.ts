import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activityLogger";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const charges = await prisma.serviceCharge.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    // Map to what the UI expects (ServiceChargesClient)
    const mapped = charges.map(c => ({
      id: c.id,
      serviceType: "PAID", // Default since it's not stored
      name: c.modelPattern === "DEFAULT" ? "" : c.modelPattern,
      baseCharge: c.amount,
      taxPercent: 13, // Default
      isActive: true // Default
    }));
    
    return NextResponse.json(mapped);
  } catch (error) {
    console.error("Failed to fetch service charges:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serviceType, modelName, baseCharge, taxPercent } = body;

    const charge = await prisma.serviceCharge.create({
      data: {
        modelPattern: modelName || "DEFAULT",
        downpaymentPct: 0,
        tenureMonths: 0,
        amount: parseFloat(baseCharge) || 0,
      }
    });

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    await logActivity({
      userId: session?.userId || session?.id || "system",
      action: "CREATE",
      entity: "SystemSetting",
      entityId: charge.id,
      details: {
        modelPattern: (charge as any).modelPattern,
        amount: (charge as any).amount,
      }
    });

    return NextResponse.json(charge);
  } catch (error) {
    console.error("Failed to create service charge:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, baseCharge, taxPercent, isActive } = body;
    
    const updateData: any = {};
    if (baseCharge !== undefined) updateData.amount = parseFloat(baseCharge);

    const charge = await prisma.serviceCharge.update({
      where: { id },
      data: updateData
    });

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    await logActivity({
      userId: session?.userId || session?.id || "system",
      action: "UPDATE",
      entity: "SystemSetting",
      entityId: charge.id,
      details: {
        modelPattern: (charge as any).modelPattern,
        amount: (charge as any).amount,
      }
    });

    return NextResponse.json(charge);
  } catch (error) {
    console.error("Failed to update service charge:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await prisma.serviceCharge.delete({
      where: { id }
    });

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    await logActivity({
      userId: session?.userId || session?.id || "system",
      action: "DELETE",
      entity: "SystemSetting",
      entityId: id,
      details: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete service charge:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
