"use client";

import React, { useState } from 'react';
import { Palette, Save, Check } from 'lucide-react';

export default function BrandingClient({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [formData, setFormData] = useState({
    showroom_logo: initialSettings.showroom_logo || '',
    business_name: initialSettings.business_name || '',
    address: initialSettings.address || '',
    phone: initialSettings.phone || '',
    invoice_header: initialSettings.invoice_header || ''
  });
  
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert("Branding settings saved successfully!");
      } else {
        alert("Failed to save settings.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Palette className="w-8 h-8 text-primary" />
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Branding Configuration</h2>
          <p className="text-sm text-gray-500">Manage your business identity and invoicing details.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Business Name</label>
          <input 
            type="text"
            value={formData.business_name}
            onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
            className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
            placeholder="E.g. Honda Showroom"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Logo URL</label>
          <input 
            type="url"
            value={formData.showroom_logo}
            onChange={(e) => setFormData({ ...formData, showroom_logo: e.target.value })}
            className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
            placeholder="https://..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Primary Phone</label>
            <input 
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
              placeholder="+977..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Address</label>
            <input 
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
              placeholder="Showroom Address..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Invoice Header</label>
          <textarea 
            value={formData.invoice_header}
            onChange={(e) => setFormData({ ...formData, invoice_header: e.target.value })}
            className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none min-h-[100px]"
            placeholder="Additional text to appear at the top of invoices..."
          />
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
          <button 
            type="submit" 
            disabled={isSaving}
            className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <span className="animate-pulse flex items-center gap-2"><Save className="w-4 h-4" /> Saving...</span>
            ) : (
              <><Check className="w-4 h-4" /> Save Configuration</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
