"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check, Search, MapPin } from 'lucide-react';

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  mapUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  isActive: boolean;
}

export default function BranchManager() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    mapUrl: "",
    latitude: "",
    longitude: "",
    isActive: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/cms/branches');
      if (res.ok) {
        const data = await res.json();
        setBranches(data);
      }
    } catch (error) {
      console.error("Failed to fetch branches:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (branch?: Branch) => {
    if (branch) {
      setEditingId(branch.id);
      setFormData({
        name: branch.name,
        address: branch.address,
        phone: branch.phone,
        mapUrl: branch.mapUrl || "",
        latitude: branch.latitude?.toString() || "",
        longitude: branch.longitude?.toString() || "",
        isActive: branch.isActive,
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        address: "",
        phone: "",
        mapUrl: "",
        latitude: "",
        longitude: "",
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const isEditing = !!editingId;
    const url = '/api/admin/cms/branches';
    const method = isEditing ? 'PUT' : 'POST';

    const payload: any = {
      name: formData.name,
      address: formData.address,
      phone: formData.phone,
      mapUrl: formData.mapUrl,
      isActive: formData.isActive,
    };

    if (formData.latitude) payload.latitude = parseFloat(formData.latitude);
    if (formData.longitude) payload.longitude = parseFloat(formData.longitude);
    if (editingId) payload.id = editingId;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchBranches();
      } else {
        const data = await res.json();
        alert(`Operation failed: ${JSON.stringify(data.error || 'Unknown error')}`);
      }
    } catch (error) {
      console.error(error);
      alert("Network error. See console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this branch? Warning: This action cannot be undone and will fail if the branch has associated vehicles or test rides.")) return;
    try {
      const res = await fetch(`/api/admin/cms/branches?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchBranches();
      } else {
        const data = await res.json();
        alert(`Delete failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredBranches = branches.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-primary" /> Branches
          </h2>
          <p className="text-sm text-gray-500 mt-1">Manage showroom locations.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search branches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-hover transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Branch
          </button>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="text-gray-500 bg-gray-50 dark:bg-slate-950/50 border-y border-gray-100 dark:border-slate-800">
            <tr>
              <th className="px-4 py-3 font-medium">Branch Name</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">Loading branches...</td>
              </tr>
            ) : filteredBranches.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">No branches found.</td>
              </tr>
            ) : (
              filteredBranches.map(branch => (
                <tr key={branch.id} className="hover:bg-gray-50 dark:hover:bg-[#141416] transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900 dark:text-white">{branch.name}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[300px]">{branch.address}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {branch.phone}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      branch.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {branch.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleOpenModal(branch)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors mr-1"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(branch.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
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
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                {editingId ? 'Edit Branch' : 'Add New Branch'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Branch Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Main Showroom"
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Full Address</label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    placeholder="Complete physical address..."
                    rows={2}
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder="e.g. +91 9876543210"
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Google Maps URL (Optional)</label>
                  <input
                    type="url"
                    value={formData.mapUrl}
                    onChange={e => setFormData({...formData, mapUrl: e.target.value})}
                    placeholder="https://maps.google.com/..."
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Latitude (Optional)</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={e => setFormData({...formData, latitude: e.target.value})}
                    placeholder="e.g. 28.7041"
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Longitude (Optional)</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={e => setFormData({...formData, longitude: e.target.value})}
                    placeholder="e.g. 77.1025"
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <div className="flex items-center pt-2 col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={e => setFormData({...formData, isActive: e.target.checked})}
                      className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                    />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Is Active</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <span className="animate-pulse">Saving...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" /> {editingId ? 'Save Changes' : 'Create Branch'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
