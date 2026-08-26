import React from 'react';
import WhatsAppConfigClient from './WhatsAppConfigClient';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'WhatsApp Integration | Admin Dashboard',
};

export default async function WhatsAppConfigPage() {
  const settingsRecords = await prisma.systemSetting.findMany({
    where: {
      key: { in: ['wa_provider', 'wa_api_key', 'wa_phone_number_id', 'wa_account_id', 'wa_webhook_url'] }
    }
  });

  const initialSettings = settingsRecords.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">WhatsApp Integration</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Configure automated WhatsApp messaging and OTP.</p>
      </div>

      <WhatsAppConfigClient initialSettings={initialSettings} />
    </div>
  );
}
