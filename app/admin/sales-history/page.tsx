import React from 'react';
import SalesHistoryClient from './SalesHistoryClient';

export const metadata = {
  title: 'Sales History | Admin Dashboard',
};

export default function SalesHistoryPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Sales History</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">View past sales transactions and invoices.</p>
      </div>

      <SalesHistoryClient />
    </div>
  );
}
