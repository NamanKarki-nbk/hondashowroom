import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { id, maxPrice } = await req.json();

    if (!id || maxPrice === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updated = await prisma.insurancePriceList.update({
      where: { id },
      data: { maxPrice: Number(maxPrice) },
    });

    return NextResponse.json({ success: true, updated });
  } catch (error: any) {
    console.error("Error updating insurance rate:", error);
    return NextResponse.json(
      { error: "Failed to update insurance rate" },
      { status: 500 }
    );
  }
}
