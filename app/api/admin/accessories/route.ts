import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const accessories = await prisma.accessory.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(accessories);
  } catch (error) {
    console.error("Error fetching accessories:", error);
    return NextResponse.json({ error: "Failed to fetch accessories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, partNo, category, price, imageUrl, description, stockStatus, vehicleType, compatibility } = body;

    const newAccessory = await prisma.accessory.create({
      data: {
        name,
        partNo: partNo || "N/A",
        category,
        price: Number(price),
        imageUrl,
        description,
        stockStatus: stockStatus || "IN_STOCK",
        vehicleType: vehicleType || "Universal",
        compatibility: compatibility || [],
      },
    });

    return NextResponse.json(newAccessory, { status: 201 });
  } catch (error) {
    console.error("Error creating accessory:", error);
    return NextResponse.json({ error: "Failed to create accessory" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, partNo, category, price, imageUrl, description, stockStatus, vehicleType, compatibility } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const updatedAccessory = await prisma.accessory.update({
      where: { id },
      data: {
        name,
        partNo: partNo || "N/A",
        category,
        price: Number(price),
        imageUrl,
        description,
        stockStatus,
        vehicleType: vehicleType || "Universal",
        compatibility: compatibility || [],
      },
    });

    return NextResponse.json(updatedAccessory);
  } catch (error) {
    console.error("Error updating accessory:", error);
    return NextResponse.json({ error: "Failed to update accessory" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    await prisma.accessory.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting accessory:", error);
    return NextResponse.json({ error: "Failed to delete accessory" }, { status: 500 });
  }
}
