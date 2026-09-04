import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, User, Phone, Mail, MapPin, Calendar, ShieldCheck, Car, FileText } from 'lucide-react';

export default async function CustomerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const customer = await prisma.customer.findUnique({
    where: { id: resolvedParams.id },
    include: {
      user: true,
      documents: true,
      sales: {
        include: {
          vehicle: {
            include: {
              variant: {
                include: { vehicleMaster: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!customer) {
    notFound();
  }

  const formatCurrency = (val: number) => `Rs. ${val.toLocaleString()}`;
  const formatDate = (date: Date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

  const totalSpend = customer.sales.reduce((sum, sale) => sum + sale.finalAmount, 0);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/crm/customers" className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Customer Profile</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Detailed information and purchase history</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
          {customer.user?.avatarUrl ? (
            <img src={customer.user.avatarUrl} alt={customer.fullName} className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-gray-100 dark:border-zinc-800" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-[#CC0000]/10 flex items-center justify-center text-[#CC0000] text-3xl font-black mb-4 border-4 border-[#CC0000]/20">
              {customer.fullName.charAt(0).toUpperCase()}
            </div>
          )}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{customer.fullName}</h2>
          <p className="text-sm text-gray-500 mt-1 flex items-center justify-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Customer since {formatDate(customer.createdAt)}
          </p>

          <div className="w-full mt-6 space-y-3 text-left">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{customer.phone}</span>
            </div>
            {customer.email && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{customer.email}</span>
              </div>
            )}
            {customer.address && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{customer.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Total Lifetime Spend</h3>
              <p className="text-3xl font-black text-[#CC0000]">{formatCurrency(totalSpend)}</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Vehicles Purchased</h3>
              <p className="text-3xl font-black text-gray-900 dark:text-white">{customer.sales.length}</p>
            </div>
          </div>

          {/* KYC Status */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> KYC Verification
            </h3>
            <div className="flex gap-4">
              <div className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border ${customer.documents.some(d => d.type === 'CITIZENSHIP') ? 'bg-emerald-100 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400' : 'bg-gray-100 border-gray-200 text-gray-500 dark:bg-zinc-800 dark:border-zinc-700'}`}>
                Citizenship
              </div>
              <div className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border ${customer.documents.some(d => d.type === 'LICENSE') ? 'bg-emerald-100 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400' : 'bg-gray-100 border-gray-200 text-gray-500 dark:bg-zinc-800 dark:border-zinc-700'}`}>
                License
              </div>
            </div>
          </div>

          {/* Purchase History */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Car className="w-4 h-4" /> Purchase History
            </h3>
            {customer.sales.length > 0 ? (
              <div className="space-y-3">
                {customer.sales.map((sale) => (
                  <div key={sale.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700/50 rounded-xl gap-4">
                    <div className="flex items-center gap-4">
                      {sale.vehicle.variant.vehicleMaster.imageUrl ? (
                        <img src={sale.vehicle.variant.vehicleMaster.imageUrl} alt={sale.vehicle.variant.vehicleMaster.name} className="w-16 h-16 object-contain rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-1" />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-zinc-700 flex items-center justify-center border border-gray-300 dark:border-zinc-600">
                          <Car className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{sale.vehicle.variant.vehicleMaster.name}</p>
                        <p className="text-xs font-medium text-gray-500 mt-1">VIN: {sale.vehicle.vin} | Engine: {sale.vehicle.engineNo}</p>
                      </div>
                    </div>
                    <div className="sm:text-right flex flex-row sm:flex-col justify-between sm:justify-end items-center sm:items-end mt-2 sm:mt-0">
                      <p className="font-bold text-gray-900 dark:text-white">{formatCurrency(sale.finalAmount)}</p>
                      <p className="text-xs font-medium text-gray-500 mt-1 sm:mt-1">{formatDate(sale.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No vehicle purchases found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
