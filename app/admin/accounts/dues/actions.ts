"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addPayment(transactionId: string, amount: number, paymentMethod: string, remarks: string) {
  try {
    const transaction = await prisma.salesTransaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) throw new Error("Transaction not found");

    if (amount <= 0 || amount > transaction.dueAmount) {
      throw new Error("Invalid payment amount");
    }

    const newDueAmount = transaction.dueAmount - amount;
    const newTotalPaid = transaction.totalAmountPaid + amount;

    const receiptNo = `REC-${Date.now()}`;
    const receipt = await prisma.paymentReceipt.create({
      data: {
        receiptNo,
        transactionId,
        amount,
        paymentMethod,
        remarks,
      },
    });

    await prisma.salesTransaction.update({
      where: { id: transactionId },
      data: {
        dueAmount: newDueAmount,
        totalAmountPaid: newTotalPaid,
      },
    });

    revalidatePath("/admin/accounts/dues");
    return { success: true, receiptId: receipt.id };
  } catch (error: any) {
    throw new Error(error.message || "Failed to add payment");
  }
}
