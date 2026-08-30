import { prisma } from "@/lib/prisma";
import FinanceClient from "./FinanceClient";

export default async function FinancePage() {
  const financePlansRaw = await prisma.financePlan.findMany({
    include: {
      variant: {
        include: {
          vehicleMaster: true
        }
      }
    },
    orderBy: [
      { variant: { vehicleMaster: { name: 'asc' } } },
      { variant: { variantName: 'asc' } }
    ]
  });

  const financePlans = financePlansRaw.map(plan => ({
    ...plan,
    name: plan.variant.vehicleMaster.name,
    vehicleVariant: plan.variant.exShowroomPriceNPR,
    category: plan.variant.vehicleMaster.category
  }));

  const products = await prisma.vehicleMaster.findMany({
    where: {
      category: {
        in: ['MOTORCYCLE', 'SCOOTER']
      }
    }
  });

  // Group plans by modelName
  const groupedPlans = financePlans.reduce((acc, plan) => {
    if (!acc[plan.name]) {
      acc[plan.name] = [];
    }
    acc[plan.name].push(plan);
    return acc;
  }, {} as Record<string, any[]>);

  const modelsData = Object.entries(groupedPlans).map(([modelName, plans]) => {
    const minPrice = Math.min(...plans.map(p => p.vehicleVariant));
    
    // Get default plan for the card display (Prefer 60% DP / 12 Months)
    let defaultPlan = plans.find(p => p.downPaymentPct === 60 && p.tenureMonths === 12);
    if (!defaultPlan) {
      defaultPlan = plans.find(p => p.downPaymentPct === 50 && p.tenureMonths === 12) || plans[0];
    }
    
    const minEmi = defaultPlan.emi;
    const defaultDpPct = defaultPlan.downPaymentPct;
    const defaultTenure = defaultPlan.tenureMonths;

    const category = plans[0].category;

    // find image dynamically from database products
    let imageUrl = '';
    const nameLower = modelName.toLowerCase();

    const matchedProduct = products.find(p => {
        const productKeywords = p.name.toLowerCase().replace('honda ', '').split(' ');
        return productKeywords.every(kw => nameLower.includes(kw));
    });

    if (matchedProduct && matchedProduct.imageUrl) {
      imageUrl = matchedProduct.imageUrl;
    } else {
      // Fallback
      if (nameLower.includes('dio 125')) {
        imageUrl = '/inventory/honda-dio-bs6-125.png';
      } else if (nameLower.includes('dio')) {
        imageUrl = '/inventory/honda-dio-bs6-110.png';
      } else if (nameLower.includes('sp 125')) {
        imageUrl = '/inventory/honda-sp-shine-125.png';
      } else if (nameLower.includes('shine 125')) {
        imageUrl = '/inventory/honda-shine-bs6.png';
      } else if (nameLower.includes('shine')) {
        imageUrl = '/inventory/honda-shine-bs6.png';
      } else if (nameLower.includes('nx 200')) {
        imageUrl = '/inventory/honda-nx-200.png';
      }
    }

    return {
      modelName,
      category,
      minPrice,
      minEmi,
      defaultDpPct,
      defaultTenure,
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
    <main className="min-h-screen bg-background dark:bg-slate-950 py-24 text-gray-900 dark:text-primary-foreground transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="mb-16 text-center lg:text-left">
          <h1 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold md:text-4xl font-bold md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4">
            CALCULATE YOUR <span className="text-[#CC0000]">MONTHLY PAYMENTS</span><br />AND DRIVE HOME JOY.
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
