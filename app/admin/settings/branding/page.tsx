import React from 'react';
import BrandingClient from './BrandingClient';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'Branding Setup | Admin Dashboard',
};

export default async function BrandingConfigPage() {
  const settingsRecords = await prisma.systemSetting.findMany({
    where: {
      key: { in: ['showroom_logo', 'business_name', 'address', 'phone', 'invoice_header'] }
    }
  });

  const initialSettings = settingsRecords.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Branding Setup</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Configure showroom branding, logos, and UI themes.</p>
      </div>

      <BrandingClient initialSettings={initialSettings} />
    </div>
  );
}
