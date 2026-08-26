import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const charges = await prisma.serviceCharge.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(charges);
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
        serviceType,
        modelName: modelName || null,
        baseCharge: parseFloat(baseCharge),
        taxPercent: parseFloat(taxPercent) || 0,
        isActive: true
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
    if (baseCharge !== undefined) updateData.baseCharge = parseFloat(baseCharge);
    if (taxPercent !== undefined) updateData.taxPercent = parseFloat(taxPercent);
    if (isActive !== undefined) updateData.isActive = isActive;

    const charge = await prisma.serviceCharge.update({
      where: { id },
      data: updateData
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete service charge:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
