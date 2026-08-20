import React from "react";
import { prisma } from "@/lib/prisma";
import VehiclesClient from "./VehiclesClient";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const products = await prisma.productCatalog.findMany({
    orderBy: { category: 'asc' }
  });

  return <VehiclesClient products={products} />;
}
