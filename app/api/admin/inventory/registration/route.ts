import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { vehicleId, tempRegistrationNo, mechiRegistrationNo } = body;

    if (!vehicleId) {
      return NextResponse.json({ error: "vehicleId is required" }, { status: 400 });
    }

    const updatedVehicle = await prisma.vehicleInventory.update({
      where: { id: vehicleId },
      data: {
        tempRegistrationNo: tempRegistrationNo || null,
        mechiRegistrationNo: mechiRegistrationNo || null,
      },
    });

    return NextResponse.json({ success: true, vehicle: updatedVehicle });
  } catch (error: any) {
    console.error("Error updating registration:", error);
    return NextResponse.json({ error: error.message || "Failed to update registration" }, { status: 500 });
  }
}
