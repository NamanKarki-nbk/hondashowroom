import React from 'react';
import ApplicationsClient from './ApplicationsClient';

export const metadata = {
  title: 'Finance Applications | Admin Dashboard',
};

export default function FinanceApplicationsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Finance Applications</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Review and manage customer loan applications.</p>
        </div>
      </div>

      <ApplicationsClient />
    </div>
  );
}
