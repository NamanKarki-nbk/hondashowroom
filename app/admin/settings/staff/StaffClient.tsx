"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Phone, User, X, Briefcase, CreditCard, DollarSign, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

type Staff = {
  id: string;
  name: string;
  phone: string | null;
  role: string;
  accountNo: string;
  panNo: string;
  lastSalary: number | null;
  order: number;
  createdAt: string;
};

export default function StaffClient() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Side panel state
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    role: 'STAFF',
    accountNo: '',
    panNo: '',
    lastSalary: '',
    order: '0'
  });

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const url = new URL("/api/admin/settings/staff", window.location.origin);
      if (search) url.searchParams.append("search", search);

      const res = await fetch(url.toString(), { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setStaff(data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStaff();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleOpenPanel = (member?: Staff) => {
    if (member) {
      setEditingId(member.id);
      setFormData({
        name: member.name,
        phone: member.phone || '',
        role: member.role,
        accountNo: member.accountNo,
        panNo: member.panNo,
        lastSalary: member.lastSalary ? member.lastSalary.toString() : '',
        order: member.order.toString()
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        phone: '',
        role: 'STAFF',
        accountNo: '',
        panNo: '',
        lastSalary: '',
        order: '0'
      });
    }
    setIsPanelOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = '/api/admin/settings/staff';
      const method = editingId ? 'PATCH' : 'POST';
      const body = { ...formData, id: editingId };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        toast.success(`Staff member ${editingId ? 'updated' : 'created'} successfully`);
        setIsPanelOpen(false);
        fetchStaff();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to save staff member");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error saving staff member");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return;
    
    try {
      const res = await fetch(`/api/admin/settings/staff?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        toast.success("Staff member deleted");
        fetchStaff();
      } else {
        toast.error("Failed to delete staff member");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting staff member");
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between shrink-0">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search staff by name, phone or PAN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all dark:text-white"
          />
        </div>
        <button 
          onClick={() => handleOpenPanel()}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-bold transition-colors w-full sm:w-auto shadow-md shadow-primary/20"
        >
          <Plus className="w-4 h-4" /> Add Staff
        </button>
      </div>

      {/* Data Table */}
      <div className="flex-1 min-h-0 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col overflow-hidden">
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-gray-50/95 dark:bg-slate-900/95 backdrop-blur z-10">
              <tr className="border-b border-gray-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <th className="py-4 px-6 whitespace-nowrap">Staff Name</th>
                <th className="py-4 px-6 whitespace-nowrap">Contact & Role</th>
                <th className="py-4 px-6 whitespace-nowrap">Bank Details</th>
                <th className="py-4 px-6 whitespace-nowrap">Last Salary</th>
                <th className="py-4 px-6 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y divide-gray-50 dark:divide-gray-800/50 transition-opacity duration-200 ${loading && staff.length > 0 ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              {loading && staff.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 text-sm font-medium">Loading staff...</td>
                </tr>
              ) : staff.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 text-sm font-medium">No staff members found.</td>
                </tr>
              ) : (
                staff.map((member) => (
                  <tr 
                    key={member.id} 
                    className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{member.name}</p>
                          <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-0.5">Order: {member.order}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-gray-400" /> {member.role}
                      </p>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                        <Phone className="w-3 h-3" /> {member.phone || 'N/A'}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-gray-400" /> {member.accountNo}
                      </p>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">PAN: {member.panNo}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-green-500" />
                        {member.lastSalary ? `Rs. ${member.lastSalary.toLocaleString()}` : '-'}
                      </p>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenPanel(member)}
                          className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(member.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side Panel for Form */}
      <AnimatePresence>
        {isPanelOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPanelOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 border-l border-gray-200 dark:border-slate-800 flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gray-50 dark:bg-slate-900/50 shrink-0">
                <h2 className="text-lg font-black text-gray-900 dark:text-white">
                  {editingId ? 'Edit Staff Member' : 'Add New Staff'}
                </h2>
                <button 
                  onClick={() => setIsPanelOpen(false)}
                  className="p-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full hover:bg-gray-50 transition-colors text-gray-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <form id="staff-form" onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block mb-1.5">Full Name *</label>
                    <input 
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 dark:text-white"
                      placeholder="e.g. Ram Bahadur"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block mb-1.5">Phone Number</label>
                      <input 
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 dark:text-white"
                        placeholder="98XXXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block mb-1.5">Role *</label>
                      <input 
                        required
                        type="text"
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 dark:text-white uppercase"
                        placeholder="e.g. SALES, MECHANIC"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Payroll Details</h3>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block mb-1.5">Account Number *</label>
                    <input 
                      required
                      type="text"
                      value={formData.accountNo}
                      onChange={(e) => setFormData({...formData, accountNo: e.target.value})}
                      className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 dark:text-white font-mono"
                      placeholder="Bank A/C No"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block mb-1.5">PAN Number *</label>
                      <input 
                        required
                        type="text"
                        value={formData.panNo}
                        onChange={(e) => setFormData({...formData, panNo: e.target.value})}
                        className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 dark:text-white font-mono"
                        placeholder="e.g. 123456789"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block mb-1.5">Last Salary (Rs)</label>
                      <input 
                        type="number"
                        value={formData.lastSalary}
                        onChange={(e) => setFormData({...formData, lastSalary: e.target.value})}
                        className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 dark:text-white"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block mb-1.5">Display Order</label>
                    <input 
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({...formData, order: e.target.value})}
                      className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 dark:text-white"
                      placeholder="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Lower numbers appear first in the list.</p>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsPanelOpen(false)}
                  className="px-4 py-2.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  form="staff-form"
                  className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-primary/20"
                >
                  {editingId ? 'Save Changes' : 'Create Staff'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
