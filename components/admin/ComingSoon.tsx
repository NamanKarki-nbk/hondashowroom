import React from 'react';
import { Construction } from 'lucide-react';

export default function ComingSoonPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 mb-6">
        <Construction className="w-12 h-12" />
      </div>
      <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4">
        Coming Soon
      </h1>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto font-medium">
        This module is currently under development. Please check back later or contact the system administrator.
      </p>
    </div>
  );
}
