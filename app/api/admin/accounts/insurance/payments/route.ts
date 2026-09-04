import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function GET() {
  const payments = await prisma.insurancePayment.findMany({
    orderBy: { date: "desc" },
  });
  return NextResponse.json(payments);
}

export async function POST(request: Request) {
  try {
    const { date, paidTo, amount, notes, receiptNo } = await request.json();

    if (!date || !paidTo || !amount) {
      return NextResponse.json({ error: "date, paidTo and amount are required" }, { status: 400 });
    }

    const payment = await prisma.insurancePayment.create({
      data: {
        id: randomUUID(),
        date: new Date(date),
        paidTo,
        amount: Number(amount),
        notes: notes || null,
        receiptNo: receiptNo || null,
      },
    });

    return NextResponse.json({ payment });
  } catch (error: any) {
    console.error("Insurance payment error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
