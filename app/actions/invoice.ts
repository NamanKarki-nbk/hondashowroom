"use server";

import { prisma } from "@/lib/prisma";

export async function getRecentPurchaseInvoices() {
  try {
    const invoices = await prisma.purchaseInvoice.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        invoiceNo: true,
        invoiceDate: true,
        totalAmount: true,
        createdAt: true,
      },
    });

    return invoices.map((invoice: any) => ({
      id: invoice.id,
      invoiceNo: invoice.invoiceNo,
      totalAmount: invoice.totalAmount,
      date: invoice.invoiceDate || invoice.createdAt.toISOString().split("T")[0],
    }));
  } catch (error) {
    console.error("Failed to fetch purchase invoices:", error);
    return [];
  }
}

export async function getInvoicesByDateRange(startDate: string, endDate: string) {
  try {
    // Fetch all invoices (or a reasonable max limit to prevent massive payload)
    const invoices = await prisma.purchaseInvoice.findMany({
      orderBy: { createdAt: "asc" },
      take: 500,
      select: {
        id: true,
        invoiceNo: true,
        invoiceDate: true,
        totalAmount: true,
        createdAt: true,
      },
    });

    const mappedInvoices = invoices.map((invoice: any) => ({
      id: invoice.id,
      invoiceNo: invoice.invoiceNo,
      totalAmount: invoice.totalAmount,
      date: invoice.invoiceDate || invoice.createdAt.toISOString().split("T")[0],
    }));

    // Filter by the resolved date
    const filtered = mappedInvoices.filter((inv: any) => {
      return inv.date >= startDate && inv.date <= endDate;
    });

    return filtered;
  } catch (error) {
    console.error("Failed to fetch invoices by date range:", error);
    return [];
  }
}
