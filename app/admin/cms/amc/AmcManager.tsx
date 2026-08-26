"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check, Search, Tag, Settings, Phone, Calendar } from 'lucide-react';

interface Feature {
  text: string;
  subtext?: string;
}

interface AmcPlan {
  id: string;
  title: string;
  price: number;
  savings: number;
  features: Feature[];
  isPopular: boolean;
  isActive: boolean;
  order: number;
}

interface AmcBooking {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  vehicleModel: string | null;
  vehicleRegNo: string | null;
  planTitle: string;
  status: string;
  remarks: string | null;
  createdAt: string;
}

export default function AmcManager() {
  const [activeTab, setActiveTab] = useState<'plans' | 'bookings'>('plans');
  
  // Plans State
  const [plans, setPlans] = useState<AmcPlan[]>([]);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [planForm, setPlanForm] = useState<{
    title: string; price: string; savings: string; isPopular: boolean; isActive: boolean; order: string; features: Feature[]
  }>({
    title: "", price: "", savings: "", isPopular: false, isActive: true, order: "0", features: [{ text: "", subtext: "" }]
  });

  // Bookings State
  const [bookings, setBookings] = useState<AmcBooking[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [bookingForm, setBookingForm] = useState<{ status: string; remarks: string }>({ status: "", remarks: "" });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'plans') {
        const res = await fetch('/api/admin/cms/amc/plans');
        if (res.ok) setPlans(await res.json());
      } else {
        const res = await fetch('/api/admin/cms/amc/bookings');
        if (res.ok) setBookings(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Plans Handlers ---
  const handleOpenPlanModal = (plan?: AmcPlan) => {
    if (plan) {
      setEditingPlanId(plan.id);
      setPlanForm({
        title: plan.title,
        price: plan.price.toString(),
        savings: plan.savings.toString(),
        isPopular: plan.isPopular,
        isActive: plan.isActive,
        order: plan.order.toString(),
        features: plan.features.length ? [...plan.features] : [{ text: "", subtext: "" }]
      });
    } else {
      setEditingPlanId(null);
      setPlanForm({ title: "", price: "", savings: "", isPopular: false, isActive: true, order: "0", features: [{ text: "", subtext: "" }] });
    }
    setIsPlanModalOpen(true);
  };

  const handleFeatureChange = (index: number, field: 'text' | 'subtext', value: string) => {
    const newFeatures = [...planForm.features];
    newFeatures[index][field] = value;
    setPlanForm(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => setPlanForm(prev => ({ ...prev, features: [...prev.features, { text: "", subtext: "" }] }));
  const removeFeature = (index: number) => {
    if (planForm.features.length > 1) {
      const newFeatures = [...planForm.features];
      newFeatures.splice(index, 1);
      setPlanForm(prev => ({ ...prev, features: newFeatures }));
    }
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        id: editingPlanId,
        title: planForm.title,
        price: Number(planForm.price),
        savings: Number(planForm.savings),
        isPopular: planForm.isPopular,
        isActive: planForm.isActive,
        order: Number(planForm.order),
        features: planForm.features.filter(f => f.text.trim() !== "")
      };

      const method = editingPlanId ? "PUT" : "POST";
      const res = await fetch("/api/admin/cms/amc/plans", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsPlanModalOpen(false);
        fetchData();
      } else {
        alert("Failed to save plan");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving plan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (confirm("Are you sure you want to delete this plan?")) {
      await fetch(`/api/admin/cms/amc/plans?id=${id}`, { method: "DELETE" });
      fetchData();
    }
  };

  // --- Bookings Handlers ---
  const handleUpdateBookingStatus = async (id: string) => {
    try {
      const res = await fetch("/api/admin/cms/amc/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: bookingForm.status, remarks: bookingForm.remarks })
      });
      if (res.ok) {
        setEditingBookingId(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      await fetch(`/api/admin/cms/amc/bookings?id=${id}`, { method: "DELETE" });
      fetchData();
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.phone.includes(searchQuery)
  );

  return (
    <div className="w-full">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">AMC Management</h2>
          <p className="text-sm text-gray-500">Manage Annual Maintenance Contract plans and view bookings</p>
        </div>
        
        <div className="flex bg-gray-100 dark:bg-slate-900 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('plans')}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${activeTab === 'plans' ? 'bg-white dark:bg-slate-800 shadow text-primary' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
          >
            Manage Plans
          </button>
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${activeTab === 'bookings' ? 'bg-white dark:bg-slate-800 shadow text-primary' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
          >
            View Bookings
          </button>
        </div>
      </div>

      {activeTab === 'plans' ? (
        // --- PLANS TAB ---
        <div className="bg-white dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-4 md:p-6 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900/50">
            <h3 className="font-bold text-gray-800 dark:text-gray-200">Available Plans</h3>
            <button
              onClick={() => handleOpenPlanModal()}
              className="bg-primary hover:bg-[#c0151f] text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Plan
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-900/50 text-xs uppercase tracking-wider text-gray-500 font-semibold border-b border-gray-200 dark:border-slate-800">
                  <th className="p-4">Title</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Savings</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800/50 text-sm">
                {isLoading ? (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-400">Loading plans...</td></tr>
                ) : plans.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-400">No AMC plans found</td></tr>
                ) : (
                  plans.map((plan) => (
                    <tr key={plan.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-gray-900 dark:text-white">{plan.title}</div>
                        {plan.isPopular && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">Popular</span>}
                      </td>
                      <td className="p-4 font-semibold">Rs. {plan.price}</td>
                      <td className="p-4 text-green-600 font-medium">Rs. {plan.savings}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-[11px] font-bold rounded-full ${plan.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {plan.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleOpenPlanModal(plan)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg mr-2"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeletePlan(plan.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // --- BOOKINGS TAB ---
        <div className="bg-white dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-4 md:p-6 border-b border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50 dark:bg-slate-900/50">
            <h3 className="font-bold text-gray-800 dark:text-gray-200">Customer Bookings</h3>
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-900/50 text-xs uppercase tracking-wider text-gray-500 font-semibold border-b border-gray-200 dark:border-slate-800">
                  <th className="p-4">Customer</th>
                  <th className="p-4">Vehicle Info</th>
                  <th className="p-4">Plan Selected</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800/50 text-sm">
                {isLoading ? (
                  <tr><td colSpan={6} className="p-8 text-center text-gray-400">Loading bookings...</td></tr>
                ) : filteredBookings.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-gray-400">No bookings found</td></tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-gray-900 dark:text-white">{booking.fullName}</div>
                        <div className="text-xs text-gray-500">{booking.phone}</div>
                        {booking.email && <div className="text-xs text-gray-500">{booking.email}</div>}
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-700 dark:text-gray-300">{booking.vehicleModel || '-'}</div>
                        <div className="text-xs text-gray-500">{booking.vehicleRegNo || '-'}</div>
                      </td>
                      <td className="p-4 font-semibold text-primary">
                        {booking.planTitle}
                      </td>
                      <td className="p-4">
                        {editingBookingId === booking.id ? (
                          <div className="flex flex-col gap-2">
                            <select 
                              value={bookingForm.status} 
                              onChange={e => setBookingForm(prev => ({...prev, status: e.target.value}))}
                              className="text-xs border rounded p-1 dark:bg-slate-800"
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="CONTACTED">CONTACTED</option>
                              <option value="CONVERTED">CONVERTED</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                            <input 
                              type="text" 
                              placeholder="Remarks" 
                              value={bookingForm.remarks}
                              onChange={e => setBookingForm(prev => ({...prev, remarks: e.target.value}))}
                              className="text-xs border rounded p-1 dark:bg-slate-800"
                            />
                            <div className="flex gap-1">
                              <button onClick={() => handleUpdateBookingStatus(booking.id)} className="bg-green-500 text-white p-1 rounded text-xs">Save</button>
                              <button onClick={() => setEditingBookingId(null)} className="bg-gray-300 text-black p-1 rounded text-xs">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-start gap-1">
                            <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${
                              booking.status === 'CONVERTED' ? 'bg-green-100 text-green-700' :
                              booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                              booking.status === 'CONTACTED' ? 'bg-blue-100 text-blue-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {booking.status}
                            </span>
                            {booking.remarks && <span className="text-xs text-gray-500 italic max-w-[150px] truncate">{booking.remarks}</span>}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-xs text-gray-500">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        {editingBookingId !== booking.id && (
                          <>
                            <button onClick={() => {
                              setEditingBookingId(booking.id);
                              setBookingForm({ status: booking.status, remarks: booking.remarks || "" });
                            }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg mr-1"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteBooking(booking.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Plan Edit Modal */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900/50 shrink-0">
              <h3 className="font-bold text-lg">{editingPlanId ? 'Edit AMC Plan' : 'Add New AMC Plan'}</h3>
              <button onClick={() => setIsPlanModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="planForm" onSubmit={handleSavePlan} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Plan Title</label>
                    <input required type="text" value={planForm.title} onChange={e => setPlanForm({...planForm, title: e.target.value})} placeholder="e.g. 1 Year" className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-slate-950 dark:border-slate-800" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Display Order</label>
                    <input type="number" value={planForm.order} onChange={e => setPlanForm({...planForm, order: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-slate-950 dark:border-slate-800" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Price (Rs.)</label>
                    <input required type="number" value={planForm.price} onChange={e => setPlanForm({...planForm, price: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-slate-950 dark:border-slate-800" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Total Savings (Rs.)</label>
                    <input required type="number" value={planForm.savings} onChange={e => setPlanForm({...planForm, savings: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-slate-950 dark:border-slate-800" />
                  </div>
                </div>

                <div className="flex gap-6 border-y border-gray-100 py-4 my-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={planForm.isPopular} onChange={e => setPlanForm({...planForm, isPopular: e.target.checked})} className="w-4 h-4 text-primary rounded" />
                    <span className="text-sm font-medium">Mark as "Most Popular"</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={planForm.isActive} onChange={e => setPlanForm({...planForm, isActive: e.target.checked})} className="w-4 h-4 text-primary rounded" />
                    <span className="text-sm font-medium">Active (Visible on site)</span>
                  </label>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400">Plan Features</label>
                    <button type="button" onClick={addFeature} className="text-xs text-primary font-bold bg-red-50 px-2 py-1 rounded">Add Feature</button>
                  </div>
                  <div className="space-y-3">
                    {planForm.features.map((feature, idx) => (
                      <div key={idx} className="flex gap-2 items-start bg-gray-50 dark:bg-slate-800/30 p-2 rounded border border-gray-100 dark:border-slate-800">
                        <div className="flex-1 space-y-2">
                          <input required type="text" value={feature.text} onChange={e => handleFeatureChange(idx, 'text', e.target.value)} placeholder="Feature (e.g. 4 Free Services)" className="w-full border rounded px-2 py-1 text-sm dark:bg-slate-900 dark:border-slate-700" />
                          <input type="text" value={feature.subtext} onChange={e => handleFeatureChange(idx, 'subtext', e.target.value)} placeholder="Subtext (e.g. Value Rs. 1600)" className="w-full border rounded px-2 py-1 text-xs text-gray-500 dark:bg-slate-900 dark:border-slate-700" />
                        </div>
                        <button type="button" onClick={() => removeFeature(idx)} className="text-red-500 p-1 hover:bg-red-50 rounded"><X className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-3 shrink-0">
              <button type="button" onClick={() => setIsPlanModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-sm bg-gray-200 text-gray-800 hover:bg-gray-300">Cancel</button>
              <button form="planForm" type="submit" disabled={isSaving} className="px-5 py-2.5 rounded-xl font-bold text-sm bg-primary text-white hover:bg-[#c0151f] disabled:opacity-50">
                {isSaving ? 'Saving...' : 'Save Plan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
