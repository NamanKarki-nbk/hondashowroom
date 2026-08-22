import { prisma } from "@/lib/prisma";
import PricesAdminClient from "./PricesAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPricesPage() {
  const prices = await prisma.vehiclePrice.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Vehicle Price List
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Manage pricing for all scooters, motorcycles, and power products.
        </p>
      </div>

      <PricesAdminClient initialPrices={prices} />
    </div>
  );
}
