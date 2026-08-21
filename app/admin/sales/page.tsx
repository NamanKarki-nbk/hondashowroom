import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import SalesForm from './SalesForm';

export const metadata: Metadata = {
  title: 'Sales & Invoicing | Admin Dashboard',
};

export default async function SalesPage() {
  const customers = await prisma.customer.findMany({
    where: {
      isVerified: true,
      citizenshipVerified: true,
    },
    select: {
      id: true,
      fullName: true,
      phone: true,
    }
  });

  const vehicles = await prisma.vehicleInventory.findMany({
    where: {
      status: 'IN_STOCK'
    },
    select: {
      id: true,
      vin: true,
      modelName: true,
      purchasePrice: true,
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold font-bold text-gray-900 dark:text-white">New Sale / Invoice</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Create a new sales transaction. Only fully verified customers and in-stock vehicles are eligible.
        </p>
      </div>

      <div className="bg-white dark:bg-[#111] p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
        <React.Suspense fallback={<div className="h-40 flex items-center justify-center">Loading form...</div>}>
          <SalesForm customers={customers} vehicles={vehicles} />
        </React.Suspense>
      </div>
    </div>
  );
}
