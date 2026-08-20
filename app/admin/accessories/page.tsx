import React from "react";
import AccessoriesAdminClient from "./AccessoriesAdminClient";
import { prisma } from "@/lib/prisma";

export default async function AdminAccessoriesPage() {
  const accessories = await prisma.accessory.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Accessories</h1>
      <AccessoriesAdminClient initialAccessories={accessories} />
    </div>
  );
}
