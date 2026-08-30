import React from 'react';
import { prisma } from '@/lib/prisma';
import { ArrowRightLeft, Building, Truck, Search, Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export const metadata = {
  title: 'Branch Transfers | Admin Dashboard',
};

export default async function InventoryTransferPage() {
  const transfers = await prisma.stockTransferLog.findMany({
    include: {
      vehicle: {
        include: { variant: { include: { vehicleMaster: true } } }
      },
      fromBranch: true,
      toBranch: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Inventory Transfers</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Manage and view vehicle stock transfers between branches.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-800 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <th className="px-6 py-4 font-semibold">Transfer Details</th>
                <th className="px-6 py-4 font-semibold">Vehicle</th>
                <th className="px-6 py-4 font-semibold">Route</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
              {transfers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <ArrowRightLeft className="w-12 h-12 text-gray-300 dark:text-slate-700 mx-auto mb-3" />
                    <p className="text-sm">No inventory transfers have been recorded yet.</p>
                  </td>
                </tr>
              ) : (
                transfers.map((transfer) => (
                  <tr key={transfer.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white font-medium mb-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {format(new Date(transfer.transferDate), 'MMM d, yyyy h:mm a')}
                      </div>
                      {transfer.remarks && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-[200px] truncate" title={transfer.remarks}>
                          Note: {transfer.remarks}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{transfer.vehicle?.variant?.variantName || transfer.vehicle?.variant?.vehicleMaster?.name || 'Unknown Vehicle'}</p>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">{transfer.vehicle?.vin || 'No VIN'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">From</span>
                          <span className="font-medium text-gray-900 dark:text-white flex items-center gap-1">
                            {transfer.fromBranch?.name || 'Headquarters'}
                          </span>
                        </div>
                        <ArrowRightLeft className="w-4 h-4 text-gray-300 mx-1" />
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">To</span>
                          <span className="font-medium text-gray-900 dark:text-white flex items-center gap-1">
                            {transfer.toBranch?.name || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        transfer.status === 'COMPLETED' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : transfer.status === 'IN_TRANSIT'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {transfer.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
