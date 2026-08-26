"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check, Search, Tag, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface Offer {
  id: string;
  title: string;
  description: string | null;
  offerType: string;
  imageUrl: string | null;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
}

export default function OfferManager() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentOfferId, setCurrentOfferId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    offerType: "Cash Discount",
    isActive: true,
    startDate: "",
    endDate: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/cms/offers');
      if (res.ok) {
        const data = await res.json();
        setOffers(data);
      }
    } catch (error) {
      console.error("Failed to fetch offers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (offer: Offer) => {
    setIsEditing(true);
    setCurrentOfferId(offer.id);
    setFormData({
      title: offer.title,
      description: offer.description || "",
      offerType: offer.offerType || "Cash Discount",
      isActive: offer.isActive,
      startDate: offer.startDate ? new Date(offer.startDate).toISOString().slice(0, 10) : "",
      endDate: offer.endDate ? new Date(offer.endDate).toISOString().slice(0, 10) : "",
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleOpenModal = (offer?: Offer) => {
    if (offer) {
      openEditModal(offer);
    } else {
      setEditingId(null);
      setIsEditing(false);
      setCurrentOfferId(null);
      setFormData({
        title: "",
        description: "",
        offerType: "Cash Discount",
        isActive: true,
        startDate: "",
        endDate: "",
      });
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const isEditing = !!editingId;
    const url = '/api/admin/cms/offers';
    const method = isEditing ? 'PUT' : 'POST';
    const payload = new FormData();
    if (isEditing && currentOfferId) {
      payload.append('id', currentOfferId);
    }
    
    if (selectedFile) {
      payload.append('image', selectedFile);
    }
    payload.append('title', formData.title);
    if (formData.description) {
      payload.append('description', formData.description);
    }
    payload.append('offerType', formData.offerType);
    payload.append('isActive', formData.isActive.toString());
    
    if (formData.startDate) {
      payload.append('startDate', formData.startDate);
    }
    if (formData.endDate) {
      payload.append('endDate', formData.endDate);
    }

    try {
      const res = await fetch(url, {
        method,
        body: payload,
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchOffers();
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
    if (!confirm("Are you sure you want to delete this offer?")) return;
    try {
      const res = await fetch(`/api/admin/cms/offers?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchOffers();
      } else {
        alert("Delete failed.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredOffers = offers.filter(o => 
    o.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Tag className="w-6 h-6 text-primary" /> Special Offers
          </h2>
          <p className="text-sm text-gray-500 mt-1">Manage ongoing offers and promotions.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search offers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-hover transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Offer
          </button>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="text-gray-500 bg-gray-50 dark:bg-slate-950/50 border-y border-gray-100 dark:border-slate-800">
            <tr>
              <th className="px-4 py-3 font-medium">Offer Name</th>
              <th className="px-4 py-3 font-medium">Valid Until</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">Loading offers...</td>
              </tr>
            ) : filteredOffers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">No offers found.</td>
              </tr>
            ) : (
              filteredOffers.map(offer => (
                <tr key={offer.id} className="hover:bg-gray-50 dark:hover:bg-[#141416] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {offer.imageUrl ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <Image src={offer.imageUrl} alt={offer.title} fill sizes="48px" className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <Tag className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{offer.title}</span>
                      {offer.description && <span className="text-xs text-gray-500 truncate max-w-[200px] mt-1">{offer.description}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {offer.offerType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex flex-col gap-1">
                      <div><span className="text-gray-400 mr-1 text-[10px]">Start:</span> {offer.startDate ? new Date(offer.startDate).toLocaleDateString() : 'N/A'}</div>
                      <div><span className="text-gray-400 mr-1 text-[10px]">End:</span> {offer.endDate ? new Date(offer.endDate).toLocaleDateString() : 'N/A'}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      offer.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {offer.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleOpenModal(offer)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors mr-1"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(offer.id)}
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
                {editingId ? 'Edit Offer' : 'Add New Offer'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Offer Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Navratri Special Offer"
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Description (Optional)</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Brief description of the offer"
                    rows={8}
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none resize-y"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Offer Type</label>
                  <select
                    value={formData.offerType}
                    onChange={e => setFormData({...formData, offerType: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="Cash Discount">Cash Discount</option>
                    <option value="Exchange Bonus">Exchange Bonus</option>
                    <option value="Low Finance">Low Finance</option>
                    <option value="Free Accessories">Free Accessories</option>
                    <option value="Combo">Combo</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4 col-span-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Start Date (Optional)</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={e => setFormData({...formData, startDate: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">End Date (Optional)</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={e => setFormData({...formData, endDate: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
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

                <div className="col-span-2 pt-2">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Offer Image (Optional) {editingId && '(Leave empty to keep existing image)'}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
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
                      <Check className="w-4 h-4" /> {editingId ? 'Save Changes' : 'Create Offer'}
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
