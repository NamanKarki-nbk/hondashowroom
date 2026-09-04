"use client";

import React, { useState, useEffect } from 'react';
import { FileText, Plus, Search, ChevronDown, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function PurchaseInvoiceClient() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    invoiceNo: '',
    purchaseType: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    totalAmount: '',
    remarks: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, [statusFilter]);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/inventory/purchase-invoices?status=${statusFilter}`);
      if (res.ok) {
        const data = await res.json();
        setInvoices(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/inventory/purchase-invoices', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        fetchInvoices();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/inventory/purchase-invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({
          invoiceNo: '', purchaseType: '', invoiceDate: new Date().toISOString().split('T')[0], totalAmount: '', remarks: ''
        });
        fetchInvoices();
      } else {
        alert("Failed to create invoice.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredInvoices = invoices.filter(inv => 
    inv.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (inv.purchaseType && inv.purchaseType.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" /> Purchase Invoices
          </h2>
          <p className="text-sm text-gray-500 mt-1">Manage wholesale vehicle invoices from suppliers.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="RECEIVED">Received</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by invoice # or purchase via..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-hover transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add Invoice
          </button>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="text-gray-500 bg-gray-50 dark:bg-slate-950/50 border-y border-gray-100 dark:border-slate-800">
            <tr>
              <th className="px-4 py-3 font-medium">Invoice No</th>
              <th className="px-4 py-3 font-medium">Purchase Via</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Total Amount</th>
              <th className="px-4 py-3 font-medium">Vehicles Linked</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">Loading invoices...</td>
              </tr>
            ) : filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">No invoices found.</td>
              </tr>
            ) : (
              filteredInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-[#141416] transition-colors">
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                    {inv.invoiceNo}
                  </td>
                  <td className="px-4 py-4 text-gray-500 dark:text-gray-400">
                    {inv.purchaseType || '-'}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {format(new Date(inv.invoiceDate), 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">
                    Rs. {inv.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {inv.vehicles.length}
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative group inline-block">
                      <select
                        value={inv.status}
                        onChange={(e) => handleStatusChange(inv.id, e.target.value)}
                        className={`appearance-none pr-8 pl-3 py-1 text-xs font-semibold rounded-full outline-none cursor-pointer border ${
                          inv.status === 'RECEIVED' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' :
                          inv.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800' :
                          'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                        }`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="RECEIVED">RECEIVED</option>
                        <option value="CANCELLED">CANCELLED</option>
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Add Purchase Invoice</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Invoice Number</label>
                <input required type="text" value={formData.invoiceNo} onChange={e => setFormData({...formData, invoiceNo: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="INV-001" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Purchase Via</label>
                <input required type="text" value={formData.purchaseType} onChange={e => setFormData({...formData, purchaseType: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. Syakar Trading Company" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Invoice Date</label>
                <input required type="date" value={formData.invoiceDate} onChange={e => setFormData({...formData, invoiceDate: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Total Amount (Rs.)</label>
                <input required type="number" min="0" value={formData.totalAmount} onChange={e => setFormData({...formData, totalAmount: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Remarks (Optional)</label>
                <textarea value={formData.remarks} onChange={e => setFormData({...formData, remarks: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={isSaving} className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-colors disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isSaving} className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                  {isSaving ? "Saving..." : "Save Invoice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
