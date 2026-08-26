"use client";

import React, { useState, useEffect } from 'react';
import { Settings, Plus, Search, CheckCircle2, AlertTriangle, XCircle, Wrench } from 'lucide-react';

export default function SparePartsClient() {
  const [parts, setParts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    partNumber: '',
    name: '',
    description: '',
    price: '',
    stockQty: '0',
    minStock: '5',
    location: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchParts();
  }, [searchQuery]);

  const fetchParts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/inventory/spare-parts?search=${searchQuery}`);
      if (res.ok) {
        const data = await res.json();
        setParts(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStockUpdate = async (id: string, newStock: number) => {
    try {
      const res = await fetch('/api/admin/inventory/spare-parts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, stockQty: newStock })
      });
      if (res.ok) {
        fetchParts();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/inventory/spare-parts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({
          partNumber: '', name: '', description: '', price: '', stockQty: '0', minStock: '5', location: ''
        });
        fetchParts();
      } else {
        alert("Failed to add spare part.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Wrench className="w-6 h-6 text-primary" /> Spare Parts Inventory
          </h2>
          <p className="text-sm text-gray-500 mt-1">Manage OEM spare parts stock and pricing.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by part # or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-hover transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add Part
          </button>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="text-gray-500 bg-gray-50 dark:bg-slate-950/50 border-y border-gray-100 dark:border-slate-800">
            <tr>
              <th className="px-4 py-3 font-medium">Part Number</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Price (Rs.)</th>
              <th className="px-4 py-3 font-medium">Stock Qty</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">Loading spare parts...</td>
              </tr>
            ) : parts.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">No parts found.</td>
              </tr>
            ) : (
              parts.map(part => {
                const isLowStock = part.stockQty <= part.minStock;
                return (
                  <tr key={part.id} className="hover:bg-gray-50 dark:hover:bg-[#141416] transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                      {part.partNumber}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {part.name}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">
                      Rs. {part.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          defaultValue={part.stockQty}
                          onBlur={(e) => handleStockUpdate(part.id, parseInt(e.target.value))}
                          className={`w-16 px-2 py-1 text-xs border rounded-md outline-none ${
                            isLowStock ? 'bg-red-50 border-red-200 text-red-700 font-bold' : 'bg-white border-gray-200 text-gray-900'
                          }`}
                        />
                        {isLowStock && <AlertTriangle className="w-4 h-4 text-red-500" title="Low Stock!" />}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {part.location || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      {part.isActive ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Active</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Inactive</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Add Spare Part</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Part Number</label>
                  <input required type="text" value={formData.partNumber} onChange={e => setFormData({...formData, partNumber: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="OEM-XXXX" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Price (Rs.)</label>
                  <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="0.00" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Part Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Brake Pad Front" />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Initial Stock</label>
                  <input required type="number" min="0" value={formData.stockQty} onChange={e => setFormData({...formData, stockQty: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Min Stock Alert</label>
                  <input required type="number" min="0" value={formData.minStock} onChange={e => setFormData({...formData, minStock: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Warehouse Location (Optional)</label>
                  <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Aisle 4, Shelf B" />
                </div>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={isSaving} className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-colors disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isSaving} className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                  {isSaving ? "Saving..." : "Add Part"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
