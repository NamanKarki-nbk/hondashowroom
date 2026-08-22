"use server";

import { prisma } from "@/lib/prisma";

export async function getProductCatalogs() {
  try {
    const catalogs = await prisma.productCatalog.findMany({
      orderBy: { name: 'asc' }
    });
    return catalogs;
  } catch (error) {
    console.error("Error fetching product catalogs:", error);
    return [];
  }
}
