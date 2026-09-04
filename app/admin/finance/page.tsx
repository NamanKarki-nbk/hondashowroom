import React from 'react';
import { prisma } from '@/lib/prisma';
import FinancePlansManager from './FinancePlansManager';

export const metadata = {
  title: 'Finance Plans Admin | Society Enterprises',
};

export const revalidate = 0;

export default async function FinanceAdminPage() {
  const plans = await prisma.financePlan.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      variant: {
        include: {
          vehicleMaster: true
        }
      }
    }
  });

  const initialPlans = plans.map(p => ({
    ...p,
    name: p.variant.vehicleMaster.name,
    category: p.variant.vehicleMaster.category,
    cc: p.variant.variantName, // using variantName for the "cc" display
    vehicleVariant: p.variant.exShowroomPriceNPR, // mapping price to vehicleVariant for the display
  }));

  return (
    <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Finance Plans</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Manage pre-calculated finance plans, EMIs, and loan data.</p>
      </div>

      <FinancePlansManager initialPlans={initialPlans} />
    </div>
  );
}
