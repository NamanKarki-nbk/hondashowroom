"use client";

import React, { useState, useEffect } from 'react';
import { Search, Loader2, IndianRupee, FileText } from 'lucide-react';

interface FinanceApplication {
  id: string;
  loanAmount: number;
  downPayment: number;
  tenureMonths: number;
  monthlyEmi: number;
  employmentType: string | null;
  monthlyIncome: number | null;
  status: string;
  createdAt: string;
  customer: {
    fullName: string;
    phone: string;
    email: string | null;
  };
  plan?: {
    name: string;
    interestRate: number;
  };
}

export default function ApplicationsClient() {
  const [applications, setApplications] = useState<FinanceApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, [filterStatus]);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/finance/applications?status=${filterStatus}`);
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/admin/finance/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        fetchApplications();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredApplications = applications.filter(app => 
    app.customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.customer.phone.includes(searchQuery)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'APPROVED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'DISBURSED': return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
        <div className="flex gap-2">
          {['ALL', 'PENDING', 'APPROVED', 'DISBURSED', 'REJECTED'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filterStatus === status ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'}`}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search applicant name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No finance applications found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500 dark:text-gray-400 font-semibold border-b border-gray-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-6 py-4">Loan Details</th>
                  <th className="px-6 py-4">Income Info</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                {filteredApplications.map(app => (
                  <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 dark:text-gray-100">{app.customer.fullName}</div>
                      <div className="text-gray-500">{app.customer.phone}</div>
                      {app.customer.email && <div className="text-gray-400 text-xs">{app.customer.email}</div>}
                      <div className="text-xs text-gray-400 mt-2">{new Date(app.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-900 dark:text-gray-100 font-bold">
                        <IndianRupee className="w-3 h-3 mr-1 text-gray-400" />
                        {app.loanAmount.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        EMI: ₹{app.monthlyEmi.toLocaleString()}/mo for {app.tenureMonths} mos
                      </div>
                      {app.plan && (
                        <div className="text-xs font-medium text-primary mt-1">
                          {app.plan.name} ({app.plan.interestRate}%)
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 dark:text-gray-100 capitalize">{app.employmentType?.replace('_', ' ') || 'N/A'}</div>
                      {app.monthlyIncome && (
                        <div className="text-xs text-gray-500 mt-1">
                          Income: ₹{app.monthlyIncome.toLocaleString()}/mo
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right relative group">
                      <div className="flex justify-end items-center">
                        {updatingId === app.id ? (
                          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                        ) : (
                          <div className="flex gap-2">
                            {app.status === 'PENDING' && (
                              <>
                                <button onClick={() => updateStatus(app.id, 'APPROVED')} className="text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg">Approve</button>
                                <button onClick={() => updateStatus(app.id, 'REJECTED')} className="text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg">Reject</button>
                              </>
                            )}
                            {app.status === 'APPROVED' && (
                              <button onClick={() => updateStatus(app.id, 'DISBURSED')} className="text-xs font-bold bg-green-50 text-green-600 hover:bg-green-100 px-3 py-1.5 rounded-lg">Disburse</button>
                            )}
                            {(app.status === 'PENDING' || app.status === 'APPROVED') && (
                              <button onClick={() => updateStatus(app.id, 'CANCELLED')} className="text-xs font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-1.5 rounded-lg">Cancel</button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
