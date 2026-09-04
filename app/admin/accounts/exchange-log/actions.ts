"use server";

import { prisma } from "@/lib/prisma";
import { generateReceiptNo } from "@/lib/sequence";
import { revalidatePath } from "next/cache";

export async function collectExchangerPayment(data: {
  transactionId: string;
  amount: number;
  paymentMethod: string;
  remarks?: string;
}) {
  const { transactionId, amount, paymentMethod, remarks } = data;

  try {
    const tx = await prisma.salesTransaction.findUnique({
      where: { id: transactionId }
    });

    if (!tx) throw new Error("Transaction not found");
    if (!tx.exchangeValue) throw new Error("This transaction has no exchange valuation");

    const outstandingDue = tx.exchangeValue - tx.exchangerPaid;
    if (amount > outstandingDue) {
      throw new Error("Payment amount cannot exceed the outstanding exchanger due");
    }

    const newExchangerPaid = tx.exchangerPaid + amount;
    const receiptNo = await generateReceiptNo(0, true);

    await prisma.$transaction([
      prisma.exchangerPaymentReceipt.create({
        data: {
          receiptNo,
          transactionId,
          amount,
          paymentMethod,
          remarks: remarks || null
        }
      }),
      prisma.salesTransaction.update({
        where: { id: transactionId },
        data: {
          exchangerPaid: newExchangerPaid
        }
      })
    ]);

    revalidatePath("/admin/accounts/exchange-log");
    return { success: true, receiptNo };
  } catch (error: any) {
    console.error("Error collecting exchanger payment:", error);
    return { success: false, error: error.message || "Failed to collect payment" };
  }
}
