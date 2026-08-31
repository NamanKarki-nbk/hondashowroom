import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/session";
import { logActivity } from '@/lib/activityLogger';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const vehicles = await prisma.vehicleMaster.findMany({
      where: category && category !== 'All' ? { category: category as any } : undefined,
      select: {
        id: true,
        name: true,
        category: true,
        features: true,
        imageUrl: true,
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(vehicles);
  } catch (error: any) {
    console.error('Error fetching features:', error);
    return NextResponse.json(
      { error: 'Failed to fetch features', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const token = (await cookies()).get("auth_session")?.value;
    const session = token ? await verifySessionToken(token) : null;
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { vehicleId, features } = body;

    if (!vehicleId || !Array.isArray(features)) {
      return NextResponse.json({ error: 'Invalid data provided' }, { status: 400 });
    }

    const updatedVehicle = await prisma.vehicleMaster.update({
      where: { id: vehicleId },
      data: { features: features },
      select: {
        id: true,
        name: true,
        category: true,
        features: true,
      },
    });

    await logActivity({
      userId: session?.userId || session?.id || "system",
      action: "UPDATE",
      entity: "Product",
      entityId: updatedVehicle.id,
      details: { field: "features", modelName: updatedVehicle.name }
    });

    return NextResponse.json(updatedVehicle);
  } catch (error: any) {
    console.error('Error updating features:', error);
    return NextResponse.json(
      { error: 'Failed to update features', details: error.message },
      { status: 500 }
    );
  }
}
