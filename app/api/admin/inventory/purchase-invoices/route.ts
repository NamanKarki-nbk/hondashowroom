import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let whereClause = {};
    if (status && status !== 'ALL') {
      whereClause = { status };
    }

    const invoices = await prisma.purchaseInvoice.findMany({
      where: whereClause,
      include: {
        vehicles: {
          select: { id: true, modelName: true, vinNumber: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error("Failed to fetch purchase invoices:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { invoiceNo, supplierName, invoiceDate, totalAmount, remarks } = body;

    const invoice = await prisma.purchaseInvoice.create({
      data: {
        invoiceNo,
        supplierName,
        invoiceDate: new Date(invoiceDate),
        totalAmount: parseFloat(totalAmount),
        remarks,
        status: "RECEIVED"
      }
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Failed to create purchase invoice:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();

    const invoice = await prisma.purchaseInvoice.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Failed to update purchase invoice status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
