"use client";

import React, { useState, useEffect } from 'react';
import { Users, Search, ChevronDown, CheckCircle2, Gift } from 'lucide-react';
import { format } from 'date-fns';

export default function ReferralsClient() {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchReferrals();
  }, [statusFilter]);

  const fetchReferrals = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/crm/referrals?status=${statusFilter}`);
      if (res.ok) {
        const data = await res.json();
        setReferrals(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/crm/referrals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        fetchReferrals();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredReferrals = referrals.filter(r => 
    r.referredName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.referredPhone.includes(searchQuery) ||
    r.referrer.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" /> Referrals & Loyalty
          </h2>
          <p className="text-sm text-gray-500 mt-1">Manage customer referrals and reward points.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="SUCCESS">Success</option>
            <option value="REWARDED">Rewarded</option>
          </select>
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search referred or referrer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="text-gray-500 bg-gray-50 dark:bg-slate-950/50 border-y border-gray-100 dark:border-slate-800">
            <tr>
              <th className="px-4 py-3 font-medium">Referred Customer</th>
              <th className="px-4 py-3 font-medium">Referred By</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Reward Points</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">Loading referrals...</td>
              </tr>
            ) : filteredReferrals.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">No referrals found.</td>
              </tr>
            ) : (
              filteredReferrals.map(ref => (
                <tr key={ref.id} className="hover:bg-gray-50 dark:hover:bg-[#141416] transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900 dark:text-white">{ref.referredName}</p>
                    <p className="text-xs text-gray-500">{ref.referredPhone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-900 dark:text-white">{ref.referrer.fullName}</p>
                    <p className="text-xs text-gray-500">Loyalty Points: {ref.rewardPoints}</p>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
                    {format(new Date(ref.createdAt), 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 font-bold text-amber-500">
                      <Gift className="w-4 h-4" /> {ref.rewardPoints}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative group inline-block">
                      <select
                        value={ref.status}
                        onChange={(e) => handleStatusChange(ref.id, e.target.value)}
                        className={`appearance-none pr-8 pl-3 py-1 text-xs font-semibold rounded-full outline-none cursor-pointer border ${
                          ref.status === 'SUCCESS' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' :
                          ref.status === 'REWARDED' ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800' :
                          'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800'
                        }`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="SUCCESS">SUCCESS</option>
                        <option value="REWARDED">REWARDED</option>
                      </select>
                      <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
