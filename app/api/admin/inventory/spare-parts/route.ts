import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activityLogger";
import { verifySessionToken } from "@/lib/session";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    let whereClause = {};
    if (search) {
      whereClause = {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { partNumber: { contains: search, mode: "insensitive" } }
        ]
      };
    }

    const parts = await prisma.sparePart.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(parts);
  } catch (error) {
    console.error("Failed to fetch spare parts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { partNumber, name, description, price, stockQty, minStock, location } = body;

    const part = await prisma.sparePart.create({
      data: {
        partNumber,
        name,
        description,
        price: parseFloat(price),
        stockQty: parseInt(stockQty),
        minStock: parseInt(minStock),
        location,
        isActive: true
      }
    });

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value || cookieStore.get('session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    await logActivity({
      userId: session?.userId || session?.id || "system",
      action: "CREATE",
      entity: "VehicleInventory",
      entityId: part.id,
      details: {
        partNumber: part.partNumber,
        name: part.name,
        price: part.price,
        stock: (part as any).stock ?? (part as any).stockQty,
      }
    });

    return NextResponse.json(part);
  } catch (error) {
    console.error("Failed to create spare part:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, stockQty, price, isActive } = body;
    
    const updateData: any = {};
    if (stockQty !== undefined) updateData.stockQty = parseInt(stockQty);
    if (price !== undefined) updateData.price = parseFloat(price);
    if (isActive !== undefined) updateData.isActive = isActive;

    const part = await prisma.sparePart.update({
      where: { id },
      data: updateData
    });

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value || cookieStore.get('session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    await logActivity({
      userId: session?.userId || session?.id || "system",
      action: "UPDATE",
      entity: "VehicleInventory",
      entityId: part.id,
      details: {
        partNumber: part.partNumber,
        name: part.name,
        price: part.price,
      }
    });

    return NextResponse.json(part);
  } catch (error) {
    console.error("Failed to update spare part:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
