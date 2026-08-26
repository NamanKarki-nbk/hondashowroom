import React from 'react';
import RolesClient from './RolesClient';

export const metadata = {
  title: 'Roles & Permissions | Admin Dashboard',
  description: 'Manage system access roles and understand permission levels.',
};

export default function RolesPage() {
  return (
    <div className="max-w-[1600px] mx-auto h-[calc(100vh-110px)] flex flex-col px-4 sm:px-6 lg:px-8 pb-4">
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Roles & Permissions</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Define access control and manage user roles across the platform.</p>
      </div>

      <div className="flex-1 min-h-0 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
        <RolesClient />
      </div>
    </div>
  );
}
