import { prisma } from "@/lib/prisma";
import FinanceClient from "./FinanceClient";

export default async function FinancePage() {
  const financePlans = await prisma.financePlan.findMany({
    orderBy: [
      { vehiclePrice: 'asc' },
      { modelName: 'asc' }
    ]
  });

  const products = await prisma.productCatalog.findMany({
    where: {
      category: {
        in: ['MOTORCYCLES', 'SCOOTERS']
      }
    }
  });

  // Group plans by modelName
  const groupedPlans = financePlans.reduce((acc, plan) => {
    if (!acc[plan.modelName]) {
      acc[plan.modelName] = [];
    }
    acc[plan.modelName].push(plan);
    return acc;
  }, {} as Record<string, any[]>);

  const modelsData = Object.entries(groupedPlans).map(([modelName, plans]) => {
    const minPrice = Math.min(...plans.map(p => p.vehiclePrice));
    
    // Explicitly calculate EMI based on 60% Downpayment and 12-Month term
    const downpayment = minPrice * 0.60;
    const principal = minPrice - downpayment;
    const r = 0.14 / 12; // 14% annual interest
    const n = 12; // 12 months
    const minEmi = Math.round((principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));

    const category = plans[0].category;

    // find image
    let imageUrl = '';
    const nameLower = modelName.toLowerCase();
    if (nameLower.includes('dio 125')) {
      imageUrl = products.find(p => p.name.toLowerCase().includes('dio 125'))?.imageUrl || '';
    } else if (nameLower.includes('dio')) {
      imageUrl = products.find(p => p.name.toLowerCase().includes('dio bs6'))?.imageUrl || '';
    } else if (nameLower.includes('sp 125')) {
      imageUrl = products.find(p => p.name.toLowerCase().includes('sp 125'))?.imageUrl || '';
    } else if (nameLower.includes('shine')) {
      imageUrl = products.find(p => p.name.toLowerCase().includes('shine'))?.imageUrl || '';
    }

    return {
      modelName,
      category,
      minPrice,
      minEmi,
      imageUrl,
      plans
    };
  });

  return (
    <main className="min-h-screen bg-background dark:bg-[#0B0B0C] py-24 text-gray-900 dark:text-primary-foreground transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4">
            CALCULATE YOUR <span className="text-[#B83227]">MONTHLY PAYMENTS</span><br />AND DRIVE HOME JOY.
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg uppercase tracking-wider font-bold">
            EXPLORE MORE WAYS TO OWN YOUR HONDA.
          </p>
        </div>

        <FinanceClient modelsData={modelsData} />
      </div>
    </main>
  );
}
