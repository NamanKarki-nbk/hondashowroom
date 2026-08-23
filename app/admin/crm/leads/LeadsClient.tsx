"use client";

import React, { useState, useEffect } from 'react';
import { Search, Edit, CheckCircle, Clock, XCircle, Phone, User, Info } from 'lucide-react';
import { toast } from 'sonner';

type Lead = {
  id: string;
  name: string;
  phone: string;
  source: string;
  status: string;
  interestedIn: string | null;
  remarks: string | null;
  createdAt: string;
};

export default function LeadsClient({ type }: { type?: string }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editRemarks, setEditRemarks] = useState("");

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const url = new URL("/api/admin/crm/leads", window.location.origin);
      if (search) url.searchParams.append("search", search);
      if (type) url.searchParams.append("type", type);

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchLeads();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleUpdate = async (id: string) => {
    try {
      const res = await fetch('/api/admin/crm/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: editStatus, remarks: editRemarks })
      });
      if (res.ok) {
        toast.success("Lead updated successfully");
        setEditingId(null);
        fetchLeads();
      } else {
        toast.error("Failed to update lead");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating lead");
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status.toUpperCase()) {
      case 'NEW': return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"><Info className="w-3 h-3"/> NEW</span>;
      case 'CONTACTED': return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400"><Clock className="w-3 h-3"/> CONTACTED</span>;
      case 'CONVERTED': return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"><CheckCircle className="w-3 h-3"/> CONVERTED</span>;
      case 'LOST': return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"><XCircle className="w-3 h-3"/> LOST</span>;
      default: return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 flex flex-col sm:flex-row gap-3 shadow-sm border border-gray-100 dark:border-slate-800">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-gray-900 dark:text-white outline-none pl-11 pr-4 py-2 placeholder:text-gray-400 text-sm font-medium"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <th className="py-5 px-6 whitespace-nowrap">Lead Details</th>
                <th className="py-5 px-6 whitespace-nowrap">Source / Interest</th>
                <th className="py-5 px-6 whitespace-nowrap">Status</th>
                <th className="py-5 px-6 whitespace-nowrap">Remarks</th>
                <th className="py-5 px-6 whitespace-nowrap text-right sticky right-0 bg-white dark:bg-slate-900 border-l border-gray-100 dark:border-slate-800 z-10">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 text-sm font-medium">
                    Loading leads...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 text-sm font-medium">
                    No leads found.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 dark:text-white">{lead.name}</p>
                          <p className="text-xs font-medium text-gray-500 flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3" /> {lead.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">{lead.source}</p>
                      <p className="text-xs font-medium text-gray-500 mt-1">{lead.interestedIn || 'N/A'}</p>
                    </td>
                    <td className="py-4 px-6">
                      {editingId === lead.id ? (
                        <select 
                          value={editStatus} 
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs font-bold outline-none dark:bg-black dark:border-gray-700 dark:text-white"
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="CONVERTED">CONVERTED</option>
                          <option value="LOST">LOST</option>
                        </select>
                      ) : (
                        getStatusBadge(lead.status)
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {editingId === lead.id ? (
                        <input 
                          type="text" 
                          value={editRemarks} 
                          onChange={(e) => setEditRemarks(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-1.5 text-xs font-medium outline-none dark:bg-black dark:border-gray-700 dark:text-white"
                          placeholder="Add remarks..."
                        />
                      ) : (
                        <p className="text-xs text-gray-500 line-clamp-2 max-w-xs">{lead.remarks || '-'}</p>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right sticky right-0 bg-white dark:bg-slate-900 border-l border-gray-100 dark:border-slate-800 z-10">
                      {editingId === lead.id ? (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => handleUpdate(lead.id)}
                            className="bg-primary hover:bg-primary-hover text-white px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => {
                            setEditingId(lead.id);
                            setEditStatus(lead.status);
                            setEditRemarks(lead.remarks || '');
                          }}
                          className="text-primary hover:text-primary-hover p-2 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
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
