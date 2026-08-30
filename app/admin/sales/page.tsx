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

      <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
        <React.Suspense fallback={<div className="h-40 flex items-center justify-center">Loading form...</div>}>
          <SalesForm customers={customers} vehicles={vehicles} />
        </React.Suspense>
      </div>
    </div>
  );
}
