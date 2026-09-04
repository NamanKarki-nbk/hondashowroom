import React from 'react';
import { prisma } from '@/lib/prisma';
import ExchangeLogClient from './ExchangeLogClient';

export const metadata = {
  title: 'Exchange Log | Accounts & Collections | Society Enterprises',
};

export const revalidate = 0;

export default async function ExchangeLogPage() {
  const exchangeSales = await prisma.salesTransaction.findMany({
    where: {
      exchangeModel: {
        not: null
      }
    },
    include: {
      customer: true,
      vehicle: {
        include: {
          variant: {
            include: { vehicleMaster: true }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="bg-transparent text-gray-900 dark:text-gray-100 p-4 md:p-8 h-full transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">Exchange Log</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium tracking-wide">Monitor all vehicles traded-in by customers.</p>
          </div>
        </header>

        <ExchangeLogClient initialSales={exchangeSales} />
      </div>
    </div>
  );
}
