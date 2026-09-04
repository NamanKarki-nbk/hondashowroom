import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { id, policyNo, insuranceExpiry } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
    }

    const updated = await prisma.salesTransaction.update({
      where: { id },
      data: {
        policyNo: policyNo || null,
        insuranceExpiry: insuranceExpiry ? new Date(insuranceExpiry) : null,
      },
    });

    return NextResponse.json({ success: true, updated });
  } catch (error: any) {
    console.error("Error updating insurance policy details:", error);
    return NextResponse.json(
      { error: "Failed to update policy details" },
      { status: 500 }
    );
  }
}
