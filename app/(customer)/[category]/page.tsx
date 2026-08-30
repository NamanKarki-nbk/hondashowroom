import React from "react";
import { prisma } from "@/lib/prisma";
import VehiclesClient from "./VehiclesClient";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const products = await prisma.vehicleMaster.findMany({
    orderBy: { category: 'asc' }
  });

  return <VehiclesClient products={products} />;
}
