import { prisma } from "@/lib/prisma";
import OrdersClient from "./OrdersClient";

export const metadata = {
  title: "Vehicle Orders | Inventory | Society Enterprises",
};

export const revalidate = 0;

export default async function OrdersPage() {
  // Fetch existing orders
  const orders = await prisma.purchaseOrder.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          variant: { include: { vehicleMaster: true } },
          color: true,
        },
      },
    },
  });

  // Fetch all vehicle variants (grouped by master) and colors for the form
  const masters = await prisma.vehicleMaster.findMany({
    include: {
      variants: true,
      colors: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="bg-transparent text-gray-900 dark:text-gray-100 p-4 md:p-8 h-full transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              Vehicle Orders
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium tracking-wide">
              Create and manage purchase orders to Syakar Trading Company (STC).
            </p>
          </div>
        </header>

        <OrdersClient 
          orders={JSON.parse(JSON.stringify(orders))} 
          masters={JSON.parse(JSON.stringify(masters))}
        />
      </div>
    </div>
  );
}
