import { prisma } from "@/lib/prisma";
import PricesAdminClient from "./PricesAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPricesPage() {
  // Calculate average cost price per model from inventory
  const inventoryAggregation = await prisma.vehicleInventory.groupBy({
    by: ['modelName', 'category'],
    _avg: {
      purchasePrice: true,
    },
  });

  // Auto-sync unique models into VehiclePrice if they don't exist
  for (const agg of inventoryAggregation) {
    const existing = await prisma.vehiclePrice.findFirst({
      where: { modelName: agg.modelName },
    });
    
    if (!existing) {
      await prisma.vehiclePrice.create({
        data: {
          modelName: agg.modelName,
          category: agg.category === "Motorcycle" || agg.category === "Scooter" ? agg.category : "Motorcycle",
          exShowroomPriceNPR: 0,
          onRoadPriceNPR: 0,
        }
      });
    }
  }

  const prices = await prisma.vehiclePrice.findMany({
    orderBy: { createdAt: "desc" },
  });

  const costPrices: Record<string, number> = {};
  inventoryAggregation.forEach((agg) => {
    if (agg._avg.purchasePrice) {
      costPrices[agg.modelName] = agg._avg.purchasePrice;
    }
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

      <PricesAdminClient initialPrices={prices} costPrices={costPrices} />
    </div>
  );
}
