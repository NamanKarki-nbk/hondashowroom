import React from 'react';
import { ArrowRightLeft, Building, Truck, Search } from 'lucide-react';

export const metadata = {
  title: 'Branch Transfers | Admin Dashboard',
};

export default function InventoryTransferPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Inventory Transfers</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Manage vehicle stock transfers between branches.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-12 text-center">
        <ArrowRightLeft className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Inter-Branch Transfer System</h3>
        <p className="text-gray-500 max-w-md mx-auto">The stock transfer system is currently being integrated with the logistics module. Soon you will be able to initiate and track stock transfers across all branches.</p>
      </div>
    </div>
  );
}
