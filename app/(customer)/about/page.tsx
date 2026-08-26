import React from 'react';
import AboutClient from './AboutClient';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'About Us | Society Enterprises Pvt. Ltd.',
  description: 'Authorized Dealer of Syakar Trading Company for Honda Motorcycles and Power Products in Goarkha Department Building, Ganga Nagari, Damak-05, Jhapa.',
};

export default async function AboutPage() {
  const happyCustomers = await prisma.salesTransaction.count();
  const branchesCount = await prisma.branch.count();
  
  return <AboutClient happyCustomers={happyCustomers} branchesCount={branchesCount} />;
}
