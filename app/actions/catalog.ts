"use server";

import { prisma } from "@/lib/prisma";

export async function getVehicleMasters() {
  try {
    const catalogs = await prisma.vehicleMaster.findMany({
      orderBy: { name: 'asc' }
    });
    return catalogs;
  } catch (error) {
    console.error("Error fetching product catalogs:", error);
    return [];
  }
}
