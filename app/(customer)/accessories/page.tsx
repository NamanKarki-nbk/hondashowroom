import React from "react";
import AccessoriesClient from "./AccessoriesClient";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Vehicle Accessories | Honda Showroom",
  description: "Browse genuine Honda accessories for your motorcycle or scooter.",
};

export default async function AccessoriesPage() {
  const accessories = await prisma.accessory.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="pt-[80px] min-h-screen bg-background ">
      <AccessoriesClient initialAccessories={accessories} />
    </div>
  );
}
