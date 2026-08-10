import { prisma } from "@/lib/prisma";
import FinanceClient from "./FinanceClient";

export default async function FinancePage() {
  const products = await prisma.productCatalog.findMany({
    where: {
      category: {
        in: ["MOTORCYCLES", "SCOOTERS", "AUTOMOBILES"] // excludes power products for EMI usually
      }
    }
  });

  return (
    <main className="min-h-screen bg-background text-foreground pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight uppercase mb-4">
            CALCULATE YOUR MONTHLY PAYMENTS<br />AND DRIVE HOME JOY.
          </h1>
          <p className="text-gray-500 text-lg uppercase tracking-wider">
            EXPLORE MORE WAYS TO OWN YOUR HONDA.
          </p>
        </div>

        <FinanceClient products={products} />
      </div>
    </main>
  );
}
