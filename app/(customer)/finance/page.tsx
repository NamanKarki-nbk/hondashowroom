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
      imageUrl = '/inventory/honda-dio-125.png';
    } else if (nameLower.includes('dio')) {
      imageUrl = '/inventory/honda-dio-bs6.png';
    } else if (nameLower.includes('sp 125')) {
      imageUrl = '/inventory/honda-sp-125-.png';
    } else if (nameLower.includes('shine 125')) {
      imageUrl = '/inventory/honda-shine-bs6-transparent.png';
    } else if (nameLower.includes('shine')) {
      imageUrl = '/inventory/honda-shine-bs6-transparent.png';
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

  const financeOrder = [
    "dio bs6 std",
    "dio bs6 dlx",
    "dio 125 std",
    "dio 125 dlx smart",
    "shine 125 drs bs6",
    "shine 125 dss bs6",
    "sp 125 drs bs6",
    "sp 125 dss bs6",
    "hornet",
    "nx 200"
  ];

  modelsData.sort((a, b) => {
    const aLower = a.modelName.toLowerCase();
    const bLower = b.modelName.toLowerCase();
    
    const aIndex = financeOrder.findIndex(o => aLower.includes(o));
    const bIndex = financeOrder.findIndex(o => bLower.includes(o));
    
    const aSort = aIndex === -1 ? 999 : aIndex;
    const bSort = bIndex === -1 ? 999 : bIndex;
    
    return aSort - bSort;
  });

  return (
    <main className="min-h-screen bg-background dark:bg-[#0B0B0C] py-24 text-gray-900 dark:text-primary-foreground transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center lg:text-left">
          <h1 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold md:text-4xl font-bold md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4">
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
