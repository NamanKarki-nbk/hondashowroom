"use client";

import React, { useState } from 'react';
import { MessageCircle, Save, Check } from 'lucide-react';

export default function WhatsAppConfigClient({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [formData, setFormData] = useState({
    wa_provider: initialSettings.wa_provider || 'Meta',
    wa_api_key: initialSettings.wa_api_key || '',
    wa_phone_number_id: initialSettings.wa_phone_number_id || '',
    wa_account_id: initialSettings.wa_account_id || '',
    wa_webhook_url: initialSettings.wa_webhook_url || ''
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
        alert("WhatsApp settings saved successfully!");
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
        <MessageCircle className="w-8 h-8 text-green-500" />
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">API Configuration</h2>
          <p className="text-sm text-gray-500">Connect your WhatsApp Business API to send automated messages.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Provider</label>
          <select 
            value={formData.wa_provider}
            onChange={(e) => setFormData({ ...formData, wa_provider: e.target.value })}
            className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="Meta">Meta (Official API)</option>
            <option value="Twilio">Twilio</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">API Key / Access Token</label>
          <input 
            type="password"
            value={formData.wa_api_key}
            onChange={(e) => setFormData({ ...formData, wa_api_key: e.target.value })}
            className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
            placeholder="E.g. EAAHxxxx..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Phone Number ID</label>
            <input 
              type="text"
              value={formData.wa_phone_number_id}
              onChange={(e) => setFormData({ ...formData, wa_phone_number_id: e.target.value })}
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
              placeholder="E.g. 103234..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">WhatsApp Business Account ID</label>
            <input 
              type="text"
              value={formData.wa_account_id}
              onChange={(e) => setFormData({ ...formData, wa_account_id: e.target.value })}
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
              placeholder="E.g. 110234..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Webhook URL</label>
          <input 
            type="url"
            value={formData.wa_webhook_url}
            onChange={(e) => setFormData({ ...formData, wa_webhook_url: e.target.value })}
            className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
            placeholder="https://your-domain.com/api/webhooks/whatsapp"
          />
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
          <button 
            type="submit" 
            disabled={isSaving}
            className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
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
