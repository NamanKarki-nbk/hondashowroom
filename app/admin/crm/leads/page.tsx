import React from 'react';
import LeadsClient from './LeadsClient';

export const metadata = {
  title: 'Leads & Follow-ups | Society Enterprises Admin',
};

export default function LeadsPage() {
  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Leads & Follow-ups</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Manage incoming leads, website inquiries, and walk-ins.</p>
      </div>

      <LeadsClient type="leads" />
    </div>
  );
}
