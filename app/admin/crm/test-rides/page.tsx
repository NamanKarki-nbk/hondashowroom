import React from 'react';
import TestRidesClient from './TestRidesClient';

export const metadata = {
  title: 'Test Ride Bookings | Admin Dashboard',
};

export default function TestRidesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Test Ride Bookings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Manage customer test ride requests and schedules.</p>
      </div>

      <TestRidesClient />
    </div>
  );
}
