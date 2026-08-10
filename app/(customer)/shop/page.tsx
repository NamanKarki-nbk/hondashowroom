import { prisma } from "@/lib/prisma";
import ShopClient from "@/components/ShopClient";
import { Suspense } from "react";

export default async function ShopPage() {
  const products = await prisma.productCatalog.findMany();

  return (
    <main className="min-h-screen bg-[#f3ebdd] dark:bg-[#0B0B0C] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-[#f3ebdd] tracking-tight uppercase mb-8">
          Shop Honda Products
        </h1>
        <Suspense fallback={<div className="animate-pulse h-96 bg-[#e8dfd1] dark:bg-[#111] rounded-2xl w-full"></div>}>
          <ShopClient initialProducts={products} />
        </Suspense>
      </div>
    </main>
  );
}
