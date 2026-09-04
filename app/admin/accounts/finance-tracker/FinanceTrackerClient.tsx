"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Search, Building, Receipt, FileText } from "lucide-react";

const formatNPR = (amount: number) => new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(amount);

export default function FinanceTrackerClient({ initialSales }: { initialSales: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSales = initialSales.filter(tx => 
    tx.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tx.financerName && tx.financerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    tx.vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalFinancedAmount = initialSales.reduce((sum, tx) => sum + (tx.financeAmount || 0), 0);
  const totalFinanceSales = initialSales.length;

  return (
    <div>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-gray-100 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none rounded-3xl p-6 relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl text-indigo-500 transition-colors shadow-sm">
                 <Building className="w-6 h-6" />
              </div>
           </div>
           <div>
             <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2 group-hover:text-primary transition-colors">{formatNPR(totalFinancedAmount)}</h3>
             <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Total Financed Amount</p>
           </div>
        </div>

        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-gray-100 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none rounded-3xl p-6 relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-emerald-500 transition-colors shadow-sm">
                 <Receipt className="w-6 h-6" />
              </div>
           </div>
           <div>
             <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2 group-hover:text-primary transition-colors">{totalFinanceSales}</h3>
             <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Total Financed Vehicles</p>
           </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text"
          placeholder="Search by customer name, financer name, or VIN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800/80 rounded-2xl pl-12 pr-4 py-4 text-gray-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-slate-800/80 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-800/80">
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500">Date</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500">Customer & Vehicle</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Financer Info</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500">Financing Details</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500">Downpayment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/50">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    No finance sales found.
                  </td>
                </tr>
              ) : (
                filteredSales.map((tx) => (
                  <tr key={tx.id} className="group hover:bg-gray-50/80 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="py-4 px-6 text-sm font-bold text-gray-600 dark:text-gray-300">
                      {format(new Date(tx.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-black text-gray-900 dark:text-white tracking-tight">{tx.customer.fullName}</p>
                      <p className="text-xs font-bold text-gray-500 mb-1">{tx.customer.phone}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="bg-gray-100 dark:bg-slate-800 text-xs px-2 py-1 rounded font-bold">{tx.vehicle.variant.vehicleMaster.name}</span>
                        <span className="text-xs text-gray-400 font-mono">{tx.vehicle.vin}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-black text-indigo-600 dark:text-indigo-400 tracking-tight">{tx.financerName || 'N/A'}</p>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Invoice: {tx.invoiceNo}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-xs text-gray-500 uppercase tracking-wider">Amount:</span>
                          <span className="font-black text-gray-900 dark:text-white">{formatNPR(tx.financeAmount || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-xs text-gray-500 uppercase tracking-wider">EMI:</span>
                          <span className="font-bold text-gray-700 dark:text-gray-300">{formatNPR(tx.emiAmount || 0)} / mo</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-xs text-gray-500 uppercase tracking-wider">Tenure:</span>
                          <span className="font-bold text-gray-700 dark:text-gray-300">{tx.numberOfInstallments || 0} months</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm font-black text-gray-600 dark:text-gray-300 tracking-tight">
                      {formatNPR(tx.downpayment || 0)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
