"use client";

import React, { useState, useEffect } from "react";
import { Search, Loader2, ShieldCheck, Mail, Phone, Calendar, ArrowUpRight, Users } from "lucide-react";

interface Customer {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  kycStatus: {
    citizenship: boolean;
    license: boolean;
    nationalId: boolean;
    ocrVerified: boolean;
    overallVerified: boolean;
  };
  vehiclesPurchasedCount: number;
  vehiclesOwned: string[];
  totalLifetimeSpend: number;
  createdAt: string;
}

export default function CustomerDirectoryClient() {
  const [data, setData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchCustomers();
  }, [debouncedSearch]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const url = new URL("/api/admin/crm/customers", window.location.origin);
      if (debouncedSearch) {
        url.searchParams.set("search", debouncedSearch);
      }
      
      const res = await fetch(url.toString());
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val: number) => `Rs. ${val.toLocaleString()}`;
  
  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900/50 text-gray-900 dark:text-gray-100">
      {/* Top Header / Search */}
      <div className="p-4 md:p-6 border-b border-gray-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
          />
        </div>
        
        <div className="text-sm font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">
          {loading ? (
            <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</span>
          ) : (
            <span>{data.length} Customers Found</span>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left min-w-[900px]">
          <thead className="sticky top-0 bg-gray-50/90 dark:bg-zinc-800/90 backdrop-blur-md z-10 shadow-sm border-b border-gray-200 dark:border-zinc-700">
            <tr className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
              <th className="px-6 py-4">Customer Details</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">KYC Status</th>
              <th className="px-6 py-4 text-center">Vehicles Owned</th>
              <th className="px-6 py-4 text-right">Lifetime Spend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/50">
            {data.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors group cursor-pointer">
                {/* 1. Details */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-black text-gray-900 dark:text-white tracking-tight">{customer.fullName}</span>
                    <div className="flex items-center gap-1 text-xs font-bold text-gray-400 mt-0.5 uppercase">
                      <Calendar className="w-3.5 h-3.5" /> Added {formatDate(customer.createdAt)}
                    </div>
                  </div>
                </td>

                {/* 2. Contact */}
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-gray-400" /> {customer.phone}</div>
                    {customer.email !== "N/A" && (
                      <div className="flex items-center gap-2 text-xs"><Mail className="w-3.5 h-3.5 text-gray-400" /> {customer.email}</div>
                    )}
                  </div>
                </td>

                {/* 3. KYC Status */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {customer.kycStatus.citizenship ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-500/20">
                        <ShieldCheck className="w-3 h-3" /> CTZ
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-zinc-800 text-gray-500 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        Unverified
                      </span>
                    )}
                  </div>
                </td>

                {/* 4. Vehicles Owned */}
                <td className="px-6 py-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="inline-flex items-center justify-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black px-2.5 py-1 rounded-lg text-xs">
                      {customer.vehiclesPurchasedCount}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest line-clamp-1 max-w-[150px]" title={customer.vehiclesOwned.join(", ")}>
                      {customer.vehiclesOwned[0]} {customer.vehiclesPurchasedCount > 1 ? `+${customer.vehiclesPurchasedCount - 1}` : ''}
                    </span>
                  </div>
                </td>

                {/* 5. Lifetime Spend */}
                <td className="px-6 py-4 text-right">
                  <span className="font-black text-primary tracking-tight">
                    {formatCurrency(customer.totalLifetimeSpend)}
                  </span>
                  <div className="flex justify-end mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-widest hover:text-primary">
                      View Profile <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && data.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400 space-y-3">
                    <Users className="w-12 h-12 opacity-20" />
                    <p className="font-bold text-lg text-gray-500">No Customers Found</p>
                    <p className="text-sm font-medium max-w-sm">
                      There are currently no customers who have completed a vehicle purchase.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
