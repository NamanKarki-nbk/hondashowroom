import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { vehicleMasterId, variantName, exShowroomPriceNPR, onRoadPriceNPR } = body;

    const newPrice = await prisma.vehicleVariant.create({
      data: {
        vehicleMasterId,
        variantName,
        exShowroomPriceNPR,
        onRoadPriceNPR,
      },
    });

    return NextResponse.json(newPrice);
  } catch (error) {
    console.error("[PRICES_POST]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, vehicleMasterId, variantName, exShowroomPriceNPR, onRoadPriceNPR } = body;

    if (!id) {
      return NextResponse.json({ error: "Price ID is required" }, { status: 400 });
    }

    const updatedPrice = await prisma.vehicleVariant.update({
      where: { id },
      data: {
        vehicleMasterId,
        variantName,
        exShowroomPriceNPR,
        onRoadPriceNPR,
      },
    });

    return NextResponse.json(updatedPrice);
  } catch (error) {
    console.error("[PRICES_PUT]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Price ID is required" }, { status: 400 });
    }

    await prisma.vehicleVariant.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Price deleted successfully" });
  } catch (error) {
    console.error("[PRICES_DELETE]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
