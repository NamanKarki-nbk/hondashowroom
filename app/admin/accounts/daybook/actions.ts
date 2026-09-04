"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

export async function addExpense(
  dateStr: string,
  description: string,
  amount: number,
  category: string
) {
  try {
    // Store date at noon NPT to avoid timezone boundary issues
    const expense = await prisma.dayBookExpense.create({
      data: {
        id: randomUUID(),
        date: new Date(dateStr + "T06:15:00.000Z"), // noon NPT = 06:15 UTC
        description,
        amount,
        category,
      },
    });

    revalidatePath("/admin/accounts/daybook");
    return { success: true, expense };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteExpense(id: string) {
  try {
    await prisma.dayBookExpense.delete({ where: { id } });
    revalidatePath("/admin/accounts/daybook");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
