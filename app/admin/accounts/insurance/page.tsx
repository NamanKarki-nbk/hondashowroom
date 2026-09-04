import { prisma } from "@/lib/prisma";
import InsuranceClient from "./InsuranceClient";

export const metadata = {
  title: "Insurance Management | Accounts | Society Enterprises",
};

export const revalidate = 0;

export default async function InsurancePage() {
  // Fetch all insured vehicles (where insurance > 0)
  const insuredVehicles = await prisma.salesTransaction.findMany({
    where: { insurance: { gt: 0 } },
    include: {
      customer: true,
      vehicle: {
        include: {
          variant: { include: { vehicleMaster: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch all insurance payments made by company
  const insurancePayments = await prisma.insurancePayment.findMany({
    orderBy: { date: "desc" },
  });

  // Fetch the PMIL price list
  const priceList = await prisma.insurancePriceList.findMany();
  const priceMap = new Map();
  priceList.forEach((p) => {
    priceMap.set(`${p.modelName.toLowerCase()}-${p.insuranceType.toUpperCase()}`, p.maxPrice);
  });

  let totalCustomerPaid = 0;
  let totalPmilCost = 0;

  const enrichedVehicles = insuredVehicles.map(tx => {
    totalCustomerPaid += (tx.insurance || 0);

    const modelName = tx.vehicle.variant.vehicleMaster.name.toLowerCase();
    const variantName = tx.vehicle.variant.variantName.toLowerCase();
    const combinedName = `${modelName} ${variantName}`;
    const type = (tx.insuranceType || "3RD PARTY").toUpperCase();
    const pmilPrice = priceMap.get(`${combinedName}-${type}`) || priceMap.get(`${modelName}-${type}`) || 0;
    
    totalPmilCost += pmilPrice;

    return {
      ...tx,
      pmilPrice,
      commission: (tx.insurance || 0) - pmilPrice,
    };
  });

  const totalPaid = insurancePayments.reduce((sum, p) => sum + p.amount, 0);
  const totalCommission = totalCustomerPaid - totalPmilCost;

  return (
    <div className="bg-transparent text-gray-900 dark:text-gray-100 p-4 md:p-8 h-full transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              Insurance Management
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium tracking-wide">
              Manage insured vehicles and track payments to Protective Micro Insurance Limited (PMIL).
            </p>
          </div>
        </header>

        <InsuranceClient
          insuredVehicles={JSON.parse(JSON.stringify(enrichedVehicles))}
          insurancePayments={JSON.parse(JSON.stringify(insurancePayments))}
          priceList={JSON.parse(JSON.stringify(priceList))}
          totalCustomerPaid={totalCustomerPaid}
          totalPmilCost={totalPmilCost}
          totalCommission={totalCommission}
          totalPaid={totalPaid}
        />
      </div>
    </div>
  );
}
