import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    return NextResponse.json(part);
  } catch (error) {
    console.error("Failed to update spare part:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
