"use client";

import React, { useState, useEffect } from 'react';
import { Settings, Plus, CheckCircle2, Trash2, XCircle } from 'lucide-react';

export default function ServiceChargesClient() {
  const [charges, setCharges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    serviceType: '',
    modelName: '',
    baseCharge: '',
    taxPercent: '13'
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchCharges();
  }, []);

  const fetchCharges = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/settings/service-charges');
      if (res.ok) {
        const data = await res.json();
        setCharges(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/settings/service-charges', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !currentStatus })
      });
      if (res.ok) {
        fetchCharges();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service charge rule?')) return;
    try {
      const res = await fetch(`/api/admin/settings/service-charges?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchCharges();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/settings/service-charges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ serviceType: '', modelName: '', baseCharge: '', taxPercent: '13' });
        fetchCharges();
      } else {
        alert("Failed to add charge rule.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary" /> Service Charge Rules
          </h2>
          <p className="text-sm text-gray-500 mt-1">Configure automated labor and tax rules for servicing.</p>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-hover transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Rule
        </button>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="text-gray-500 bg-gray-50 dark:bg-slate-950/50 border-y border-gray-100 dark:border-slate-800">
            <tr>
              <th className="px-4 py-3 font-medium">Service Type</th>
              <th className="px-4 py-3 font-medium">Vehicle Model</th>
              <th className="px-4 py-3 font-medium">Base Charge (Rs.)</th>
              <th className="px-4 py-3 font-medium">Tax (%)</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">Loading rules...</td>
              </tr>
            ) : charges.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">No charge rules found.</td>
              </tr>
            ) : (
              charges.map(charge => (
                <tr key={charge.id} className="hover:bg-gray-50 dark:hover:bg-[#141416] transition-colors">
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                    {charge.serviceType}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {charge.modelName || 'Any / Default'}
                  </td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white">
                    {charge.baseCharge.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {charge.taxPercent}%
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(charge.id, charge.isActive)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        charge.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {charge.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(charge.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
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
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Add Charge Rule</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Service Type</label>
                <select required value={formData.serviceType} onChange={e => setFormData({...formData, serviceType: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none">
                  <option value="">Select Type</option>
                  <option value="FREE">Free Service</option>
                  <option value="PAID">Paid Service</option>
                  <option value="REPAIR">Accidental Repair</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Applicable Model (Optional)</label>
                <input type="text" value={formData.modelName} onChange={e => setFormData({...formData, modelName: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Leave blank for all models" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Base Charge (Rs.)</label>
                  <input required type="number" min="0" value={formData.baseCharge} onChange={e => setFormData({...formData, baseCharge: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Tax (%)</label>
                  <input required type="number" min="0" value={formData.taxPercent} onChange={e => setFormData({...formData, taxPercent: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="13" />
                </div>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={isSaving} className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-colors disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isSaving} className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                  {isSaving ? "Saving..." : "Save Rule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
