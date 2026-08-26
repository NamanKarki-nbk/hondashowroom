import React from 'react';
import CustomerDirectoryClient from './CustomerDirectoryClient';

export const metadata = {
  title: 'Customer Directory | Society Enterprises Admin',
  description: 'Master directory of all real-world business clients who have purchased a vehicle.',
};

export default function CustomerDirectoryPage() {
  return (
    <div className="max-w-[1600px] mx-auto h-[calc(100vh-110px)] flex flex-col px-4 sm:px-6 lg:px-8 pb-4">
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Customer Directory</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Verified buyers and their purchase history.</p>
      </div>

      <div className="flex-1 min-h-0 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
        <CustomerDirectoryClient />
      </div>
    </div>
  );
}
