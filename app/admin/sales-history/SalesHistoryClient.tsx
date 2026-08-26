"use client";

import React, { useState, useEffect } from 'react';
import { Search, Loader2, FileText, Download } from 'lucide-react';

interface SalesTransaction {
  id: string;
  invoiceNo: string;
  saleType: string;
  paymentType: string;
  finalAmount: number;
  createdAt: string;
  customer: {
    fullName: string;
    phone: string;
  };
  vehicle: {
    vin: string;
  };
}

export default function SalesHistoryClient() {
  const [sales, setSales] = useState<SalesTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/sales-history?limit=100`);
      if (res.ok) {
        const data = await res.json();
        setSales(data);
      }
    } catch (error) {
      console.error('Failed to fetch sales history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSales = sales.filter(s => 
    s.customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.customer.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search invoice no, name or phone..."
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
        ) : filteredSales.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No sales transactions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500 dark:text-gray-400 font-semibold border-b border-gray-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Invoice Info</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Sale Details</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                {filteredSales.map(sale => (
                  <tr key={sale.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 dark:text-gray-100 flex items-center">
                        <FileText className="w-3 h-3 mr-1 text-gray-400" />
                        {sale.invoiceNo}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{new Date(sale.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 dark:text-gray-100">{sale.customer.fullName}</div>
                      <div className="text-gray-500">{sale.customer.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-gray-100">{sale.saleType}</div>
                      <div className="text-xs text-gray-500 mt-1">Payment: {sale.paymentType}</div>
                      {sale.vehicle?.vin && <div className="text-xs text-gray-500 mt-1">VIN: {sale.vehicle.vin}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900 dark:text-white">Rs. {sale.finalAmount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5 rounded-lg flex items-center ml-auto">
                        <Download className="w-3 h-3 mr-1" />
                        Invoice
                      </button>
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
