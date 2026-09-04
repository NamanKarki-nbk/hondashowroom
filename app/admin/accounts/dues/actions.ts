"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addPayment(
  transactionId: string,
  amount: number,
  paymentMethod: string,
  remarks: string
) {
  try {
    const tx = await prisma.salesTransaction.findUnique({
      where: { id: transactionId },
    });

    if (!tx) throw new Error("Transaction not found");
    if (amount > tx.dueAmount) throw new Error("Payment amount cannot exceed the due amount");

    const newDueAmount = tx.dueAmount - amount;
    const newTotalPaid = tx.totalAmountPaid + amount;

    const receiptNo = `REC-${Date.now()}-C`;

    const receipt = await prisma.paymentReceipt.create({
      data: {
        receiptNo,
        amount,
        paymentMethod,
        remarks,
        transactionId: tx.id,
      },
    });

    await prisma.salesTransaction.update({
      where: { id: tx.id },
      data: {
        dueAmount: newDueAmount,
        totalAmountPaid: newTotalPaid,
      },
    });

    revalidatePath("/admin/accounts/dues");

    return {
      success: true,
      receiptId: receipt.id,
      receiptNo: receipt.receiptNo,
      remainingDue: newDueAmount,
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
