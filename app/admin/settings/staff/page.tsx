import React from 'react';
import StaffClient from './StaffClient';

export const metadata = {
  title: 'Staff Directory | Society Enterprises Admin',
};

export default function StaffPage() {
  return (
    <div className="max-w-[1600px] mx-auto h-[calc(100vh-110px)] flex flex-col px-4 sm:px-6 lg:px-8 pb-4">
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Staff Directory</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Manage your staff members, their roles, and payroll details.</p>
      </div>

      <div className="flex-1 min-h-0">
        <StaffClient />
      </div>
    </div>
  );
}
