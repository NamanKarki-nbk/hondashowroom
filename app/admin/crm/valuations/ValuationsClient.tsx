"use client";

import React, { useState, useEffect } from 'react';
import { RefreshCw, Search, ChevronDown, Save, Edit2, XCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function ValuationsClient() {
  const [valuations, setValuations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ finalOffered: '', remarks: '' });

  useEffect(() => {
    fetchValuations();
  }, [statusFilter]);

  const fetchValuations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/crm/valuations?status=${statusFilter}`);
      if (res.ok) {
        const data = await res.json();
        setValuations(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/crm/valuations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        fetchValuations();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveEdit = async (id: string) => {
    try {
      const res = await fetch('/api/admin/crm/valuations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, finalOffered: editData.finalOffered, remarks: editData.remarks })
      });
      if (res.ok) {
        setEditingId(null);
        fetchValuations();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const startEdit = (val: any) => {
    setEditingId(val.id);
    setEditData({ finalOffered: val.finalOffered?.toString() || '', remarks: val.remarks || '' });
  };

  const filteredValuations = valuations.filter(v => 
    v.customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.oldModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.oldBrand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <RefreshCw className="w-6 h-6 text-primary" /> Vehicle Valuations
          </h2>
          <p className="text-sm text-gray-500 mt-1">Manage exchange trade-in valuations and offers.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="EVALUATED">Evaluated</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search customer or vehicle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="text-gray-500 bg-gray-50 dark:bg-slate-950/50 border-y border-gray-100 dark:border-slate-800">
            <tr>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Old Vehicle</th>
              <th className="px-4 py-3 font-medium">Est. Value (Rs.)</th>
              <th className="px-4 py-3 font-medium">Final Offer (Rs.)</th>
              <th className="px-4 py-3 font-medium">Remarks</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">Loading valuations...</td>
              </tr>
            ) : filteredValuations.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">No valuations found.</td>
              </tr>
            ) : (
              filteredValuations.map(val => {
                const isEditing = editingId === val.id;
                return (
                  <tr key={val.id} className="hover:bg-gray-50 dark:hover:bg-[#141416] transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900 dark:text-white">{val.customer.fullName}</p>
                      <p className="text-xs text-gray-500">{val.customer.phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-900 dark:text-white">{val.oldBrand} {val.oldModel}</p>
                      <p className="text-xs text-gray-500">Year: {val.manufactureYear} | {val.condition}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">
                      {val.estimatedValue.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input 
                          type="number" 
                          value={editData.finalOffered}
                          onChange={e => setEditData({...editData, finalOffered: e.target.value})}
                          className="w-24 px-2 py-1 text-xs border rounded-md outline-none bg-white border-gray-300"
                        />
                      ) : (
                        <span className="font-medium text-gray-900 dark:text-white">{val.finalOffered ? val.finalOffered.toLocaleString() : 'N/A'}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={editData.remarks}
                          onChange={e => setEditData({...editData, remarks: e.target.value})}
                          className="w-full px-2 py-1 text-xs border rounded-md outline-none bg-white border-gray-300"
                        />
                      ) : (
                        <span className="text-gray-600 dark:text-gray-400 truncate block">{val.remarks || '-'}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative group inline-block">
                        <select
                          value={val.status}
                          onChange={(e) => handleStatusChange(val.id, e.target.value)}
                          className={`appearance-none pr-8 pl-3 py-1 text-xs font-semibold rounded-full outline-none cursor-pointer border ${
                            val.status === 'ACCEPTED' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' :
                            val.status === 'EVALUATED' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' :
                            'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                          }`}
                        >
                          <option value="EVALUATED">EVALUATED</option>
                          <option value="ACCEPTED">ACCEPTED</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>
                        <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600"><XCircle className="w-4 h-4" /></button>
                          <button onClick={() => handleSaveEdit(val.id)} className="text-primary hover:text-primary-hover"><Save className="w-4 h-4" /></button>
                        </div>
                      ) : (
                        <button onClick={() => startEdit(val)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
