import { Metadata } from 'next';
import FeatureManager from './FeatureManager';

export const metadata: Metadata = {
  title: 'Features CMS | Admin Portal',
  description: 'Manage vehicle features for the Honda Showroom',
};

export default function FeaturesCMSPage() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
          Features CMS
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          Select a vehicle model to manage its highlighted features and specifications.
        </p>
      </div>

      <FeatureManager />
    </div>
  );
}
