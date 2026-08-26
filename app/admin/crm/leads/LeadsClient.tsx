"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Phone, User, FileText, X, TrendingUp, Users, Calendar, Filter, ChevronLeft, ChevronRight, Info, Clock, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

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

const STATUSES = ['NEW', 'CONTACTED', 'CONVERTED', 'LOST'];
const TABS = ['ALL', ...STATUSES];
const ITEMS_PER_PAGE = 10;

export default function LeadsClient({ type }: { type?: string }) {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Side panel state
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
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
        setCurrentPage(1); // Reset page on new data
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

  // Handle Tab Change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const handleUpdate = async () => {
    if (!selectedLead) return;
    try {
      const res = await fetch('/api/admin/crm/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedLead.id, status: editStatus, remarks: editRemarks })
      });
      if (res.ok) {
        toast.success("Lead updated successfully");
        
        // Optimistic update
        setLeads(prev => prev.map(l => 
          l.id === selectedLead.id 
            ? { ...l, status: editStatus, remarks: editRemarks } 
            : l
        ));
        
        setSelectedLead(null);
      } else {
        toast.error("Failed to update lead");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating lead");
    }
  };

  // Analytics & Filtering
  const { total, newToday, conversionRate, filteredLeads, totalPages } = useMemo(() => {
    const total = leads.length;
    const todayStr = new Date().toISOString().split('T')[0];
    
    const newToday = leads.filter(l => l.createdAt.startsWith(todayStr)).length;
    const converted = leads.filter(l => l.status === 'CONVERTED').length;
    const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0;
    
    const filtered = activeTab === 'ALL' 
      ? leads 
      : leads.filter(l => l.status === activeTab);
      
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
    
    return { total, newToday, conversionRate, filteredLeads: filtered, totalPages };
  }, [leads, activeTab]);
  
  // Pagination
  const currentLeads = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLeads.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredLeads, currentPage]);

  const getStatusBadge = (status: string) => {
    switch(status.toUpperCase()) {
      case 'NEW': return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"><Info className="w-3 h-3"/> NEW</span>;
      case 'CONTACTED': return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400"><Clock className="w-3 h-3"/> CONTACTED</span>;
      case 'CONVERTED': return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"><CheckCircle className="w-3 h-3"/> CONVERTED</span>;
      case 'LOST': return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"><XCircle className="w-3 h-3"/> LOST</span>;
      default: return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Analytics Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-5">
          <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Total Leads</p>
            <p className="text-3xl font-black text-gray-900 dark:text-white">{total}</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-5">
          <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Conversion Rate</p>
            <p className="text-3xl font-black text-gray-900 dark:text-white">{conversionRate}%</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-5">
          <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">New Today</p>
            <p className="text-3xl font-black text-gray-900 dark:text-white">{newToday}</p>
          </div>
        </div>
      </div>

      {/* Toolbar & Tabs */}
      <div className="flex flex-col space-y-4 shrink-0">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all dark:text-white"
            />
          </div>
        </div>

        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-800'
              }`}
            >
              {tab} 
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-500'
              }`}>
                {tab === 'ALL' ? leads.length : leads.filter(l => l.status === tab).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 min-h-0 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col overflow-hidden">
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-gray-50/95 dark:bg-slate-900/95 backdrop-blur z-10">
              <tr className="border-b border-gray-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <th className="py-4 px-6 whitespace-nowrap">Lead Details</th>
                <th className="py-4 px-6 whitespace-nowrap">Interest & Source</th>
                <th className="py-4 px-6 whitespace-nowrap">Status</th>
                <th className="py-4 px-6 whitespace-nowrap">Remarks</th>
                <th className="py-4 px-6 whitespace-nowrap text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 text-sm font-medium">Loading leads...</td>
                </tr>
              ) : currentLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 text-sm font-medium">No leads found.</td>
                </tr>
              ) : (
                currentLeads.map((lead) => (
                  <tr 
                    key={lead.id} 
                    onClick={() => {
                      setSelectedLead(lead);
                      setEditStatus(lead.status);
                      setEditRemarks(lead.remarks || '');
                    }}
                    className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{lead.name}</p>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3" /> {lead.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{lead.interestedIn || 'General Inquiry'}</p>
                      <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-1">{lead.source}</p>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(lead.status)}
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 max-w-xs">{lead.remarks || '-'}</p>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">{new Date(lead.createdAt).toLocaleDateString()}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="border-t border-gray-100 dark:border-slate-800 p-4 bg-gray-50/50 dark:bg-slate-900/50 flex items-center justify-between shrink-0">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Showing <span className="font-bold text-gray-900 dark:text-white">{(currentPage - 1) * ITEMS_PER_PAGE + (currentLeads.length > 0 ? 1 : 0)}</span> to <span className="font-bold text-gray-900 dark:text-white">{(currentPage - 1) * ITEMS_PER_PAGE + currentLeads.length}</span> of <span className="font-bold text-gray-900 dark:text-white">{filteredLeads.length}</span> results
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 px-2">Page {currentPage} of {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Side Panel for Lead Details */}
      <AnimatePresence>
        {selectedLead && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLead(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 border-l border-gray-200 dark:border-slate-800 flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gray-50 dark:bg-slate-900/50">
                <h2 className="text-lg font-black text-gray-900 dark:text-white">Lead Details</h2>
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="p-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full hover:bg-gray-50 transition-colors text-gray-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Contact Info */}
                <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-gray-100 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{selectedLead.name}</h3>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                        <Phone className="w-3.5 h-3.5" /> {selectedLead.phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lead Meta */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800">
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Source</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{selectedLead.source}</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800">
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Date</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {new Date(selectedLead.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="col-span-2 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800">
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Interested In</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{selectedLead.interestedIn || 'General Inquiry'}</p>
                  </div>
                </div>

                {/* Edit Form */}
                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                  <div>
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block mb-2">Update Status</label>
                    <div className="grid grid-cols-2 gap-2">
                      {STATUSES.map(s => (
                        <button
                          key={s}
                          onClick={() => setEditStatus(s)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                            editStatus === s 
                              ? 'bg-primary border-primary text-white shadow-md' 
                              : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:border-primary/50'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block mb-2">Remarks / Notes</label>
                    <textarea 
                      value={editRemarks}
                      onChange={(e) => setEditRemarks(e.target.value)}
                      rows={5}
                      className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 dark:text-white resize-none"
                      placeholder="Add notes about your follow-up..."
                    />
                  </div>
                </div>

              </div>

              <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between gap-3">
                <button
                  onClick={() => {
                    const qs = new URLSearchParams({
                      docType: 'Quotation',
                      loaneeName: selectedLead.name,
                      loaneeContact: selectedLead.phone,
                      vehicleModel: selectedLead.interestedIn || ''
                    }).toString();
                    router.push(`/admin/letters/new?${qs}`);
                  }}
                  className="px-4 py-3 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm transition-colors flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" /> Quote
                </button>
                
                <button 
                  onClick={handleUpdate}
                  className="flex-1 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-primary/20"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
