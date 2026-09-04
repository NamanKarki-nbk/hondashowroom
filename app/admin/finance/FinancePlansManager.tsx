"use client";

import React, { useState, useMemo } from "react";
import { Plus, Edit2, Trash2, X, Search, Wallet, CalendarClock, Percent } from "lucide-react";
import type { FinancePlan } from "@/app/generated/prisma";

interface FinancePlansManagerProps {
  initialPlans: FinancePlan[];
}

export default function FinancePlansManager({ initialPlans }: FinancePlansManagerProps) {
  const [plans, setPlans] = useState<any[]>(initialPlans);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [activeDpTab, setActiveDpTab] = useState<"All" | number>("All");

  const availableDownPayments = useMemo(() => {
    const dps = plans.map((p) => p.downPaymentPct).filter((dp) => dp != null);
    return Array.from(new Set(dps)).sort((a, b) => a - b);
  }, [plans]);

  const filteredPlans = useMemo(() => {
    const q = String(searchQuery || "").toLowerCase();
    const filtered = (plans || []).filter((p) => {
      if (!p) return false;
      if (activeDpTab !== "All" && p.downPaymentPct !== activeDpTab) return false;
      const nameStr = String(p.name || "").toLowerCase();
      const catStr = String(p.category || "").toLowerCase();
      return nameStr.includes(q) || catStr.includes(q);
    });

    return filtered.sort((a, b) => {
      // 1. Category sort: SCOOTER first
      const catA = String(a.category || "").toUpperCase();
      const catB = String(b.category || "").toUpperCase();
      if (catA === "SCOOTER" && catB !== "SCOOTER") return -1;
      if (catB === "SCOOTER" && catA !== "SCOOTER") return 1;

      // 2. Variant sort: STD first, DLX second
      // The variantName is stored in `cc` in our mapping
      const varA = String(a.cc || "").toUpperCase();
      const varB = String(b.cc || "").toUpperCase();
      
      const getVariantRank = (v: string) => {
        if (v.includes("STD") || v.includes("STANDARD")) return 1;
        if (v.includes("DLX") || v.includes("DELUXE")) return 2;
        return 3;
      };

      const rankA = getVariantRank(varA);
      const rankB = getVariantRank(varB);

      if (rankA !== rankB) return rankA - rankB;
      
      // 3. Alphabetical fallback
      const nameA = String(a.name || "");
      const nameB = String(b.name || "");
      if (nameA !== nameB) return nameA.localeCompare(nameB);

      return (a.tenureMonths || 0) - (b.tenureMonths || 0);
    });
  }, [plans, searchQuery, activeDpTab]);

  const groupedPlans = useMemo(() => {
    const groups: Record<number, typeof filteredPlans> = {};
    filteredPlans.forEach((plan) => {
      const t = plan.tenureMonths || 0;
      if (!groups[t]) groups[t] = [];
      groups[t].push(plan);
    });
    return groups;
  }, [filteredPlans]);

  const handleOpenModal = (plan?: any) => {
    if (plan) {
      setCurrentPlan({ ...plan });
    } else {
      setCurrentPlan({
        name: "",
        cc: 110,
        category: "SCOOTER",
        vehicleVariant: 0,
        tenureMonths: 12,
        downPaymentPct: 60,
        interestRate: 10,
        downPayment: 0,
        loanAmount: 0,
        emi: 0,
        totalInterest: 0,
        registration: 2000,
        serviceCharge: 0,
        insurance: 0,
        totalCost: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPlan(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPlan) return;

    setIsSaving(true);
    try {
      const method = currentPlan.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/finance", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentPlan),
      });

      if (!res.ok) throw new Error("Failed to save finance plan");

      const savedPlan = await res.json();

      if (method === "PUT") {
        setPlans(plans.map((p) => (p.id === savedPlan.id ? savedPlan : p)));
      } else {
        setPlans([savedPlan, ...plans]);
      }
      
      handleCloseModal();
    } catch (error) {
      console.error(error);
      alert("Error saving finance plan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this finance plan?")) return;

    try {
      const res = await fetch(`/api/admin/finance?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete finance plan");

      setPlans(plans.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
      alert("Error deleting finance plan");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by model or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] focus:ring-2 focus:ring-red-600 outline-none"
          />
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition-colors w-full sm:w-auto font-medium"
        >
          <Plus className="w-5 h-5" /> Add Finance Plan
        </button>
      </div>


      <div className="flex border-b border-gray-200 dark:border-slate-800 mb-6 gap-6 overflow-x-auto no-scrollbar">
        {[
          { label: "All Down Payments", value: "All" as const, icon: Wallet },
          ...availableDownPayments.map((dp) => ({ label: `${dp}% Down`, value: dp, icon: Percent }))
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveDpTab(tab.value)}
              className={`pb-3 text-sm font-semibold transition-colors relative whitespace-nowrap flex items-center gap-2 ${
                activeDpTab === tab.value
                  ? "text-red-600 dark:text-red-500"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            {activeDpTab === tab.value && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 dark:bg-red-500" />
            )}
          </button>
          );
        })}
      </div>

      {Object.keys(groupedPlans)
        .sort((a, b) => Number(a) - Number(b))
        .map((tenureStr) => {
          const tenure = Number(tenureStr);
          const groupPlans = groupedPlans[tenure];
          return (
            <div key={tenure} className="mb-10">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-red-600" />
                {tenure / 12} Year Plan ({tenure}M)
              </h3>
              <div className="bg-white dark:bg-[#1a1a1a] shadow rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-[#2a2a2a] border-b border-gray-200 dark:border-gray-700 text-sm whitespace-nowrap">
                        <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Model</th>
                        <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Category</th>
                        <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Vehicle Price</th>
                        <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Tenure (Months)</th>
                        <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Down Payment %</th>
                        <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Interest %</th>
                        <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">EMI</th>
                        <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Total Cost</th>
                        <th className="p-4 font-semibold text-slate-700 dark:text-slate-300 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupPlans.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="p-8 text-center text-gray-500 dark:text-gray-400">
                            No finance plans found.
                          </td>
                        </tr>
                      ) : (
                        groupPlans.map((plan) => (
                          <tr key={plan.id} className="border-b border-gray-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-[#222] transition-colors whitespace-nowrap">
                            <td className="p-4 font-medium text-slate-900 dark:text-white">{plan.name} ({plan.cc}cc)</td>
                            <td className="p-4 text-slate-600 dark:text-slate-400">{plan.category}</td>
                            <td className="p-4 font-medium text-slate-900 dark:text-white">₹{plan.vehicleVariant.toLocaleString()}</td>
                            <td className="p-4 text-slate-600 dark:text-slate-400">{plan.tenureMonths}</td>
                            <td className="p-4 text-slate-600 dark:text-slate-400">{plan.downPaymentPct}%</td>
                            <td className="p-4 text-slate-600 dark:text-slate-400">{plan.interestRate}%</td>
                            <td className="p-4 font-medium text-red-600 dark:text-red-400">₹{plan.emi.toLocaleString()}</td>
                            <td className="p-4 font-medium text-slate-900 dark:text-white">₹{plan.totalCost.toLocaleString()}</td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => handleOpenModal(plan)}
                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors mr-2 inline-flex"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(plan.id)}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors inline-flex"
                                title="Delete"
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
              </div>
            </div>
          );
        })}

      {isModalOpen && currentPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {currentPlan.id ? "Edit Finance Plan" : "Add Finance Plan"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Model Name *</label>
                  <input
                    type="text"
                    required
                    value={currentPlan.name || ""}
                    onChange={(e) => setCurrentPlan({ ...currentPlan, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] focus:ring-2 focus:ring-red-600 outline-none"
                    placeholder="e.g. DIO BS6 STD"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Engine CC *</label>
                  <input
                    type="number"
                    required
                    value={currentPlan.cc || ""}
                    onChange={(e) => setCurrentPlan({ ...currentPlan, cc: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] focus:ring-2 focus:ring-red-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category *</label>
                  <select
                    required
                    value={currentPlan.category || ""}
                    onChange={(e) => setCurrentPlan({ ...currentPlan, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] focus:ring-2 focus:ring-red-600 outline-none"
                  >
                    <option value="SCOOTER">Scooter</option>
                    <option value="MOTORCYCLE">Motorcycle</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Vehicle Price *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={currentPlan.vehicleVariant || ""}
                    onChange={(e) => setCurrentPlan({ ...currentPlan, vehicleVariant: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] focus:ring-2 focus:ring-red-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tenure (Months) *</label>
                  <input
                    type="number"
                    required
                    value={currentPlan.tenureMonths || ""}
                    onChange={(e) => setCurrentPlan({ ...currentPlan, tenureMonths: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] focus:ring-2 focus:ring-red-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Down Payment % *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={currentPlan.downPaymentPct || ""}
                    onChange={(e) => setCurrentPlan({ ...currentPlan, downPaymentPct: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] focus:ring-2 focus:ring-red-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Interest Rate % *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={currentPlan.interestRate || ""}
                    onChange={(e) => setCurrentPlan({ ...currentPlan, interestRate: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] focus:ring-2 focus:ring-red-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Down Payment Amt *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={currentPlan.downPayment || ""}
                    onChange={(e) => setCurrentPlan({ ...currentPlan, downPayment: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] focus:ring-2 focus:ring-red-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Loan Amount *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={currentPlan.loanAmount || ""}
                    onChange={(e) => setCurrentPlan({ ...currentPlan, loanAmount: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] focus:ring-2 focus:ring-red-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">EMI *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={currentPlan.emi || ""}
                    onChange={(e) => setCurrentPlan({ ...currentPlan, emi: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] focus:ring-2 focus:ring-red-600 outline-none font-bold text-red-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Total Interest *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={currentPlan.totalInterest || ""}
                    onChange={(e) => setCurrentPlan({ ...currentPlan, totalInterest: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] focus:ring-2 focus:ring-red-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Registration *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={currentPlan.registration || ""}
                    onChange={(e) => setCurrentPlan({ ...currentPlan, registration: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] focus:ring-2 focus:ring-red-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Service Charge *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={currentPlan.serviceCharge || ""}
                    onChange={(e) => setCurrentPlan({ ...currentPlan, serviceCharge: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] focus:ring-2 focus:ring-red-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Insurance *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={currentPlan.insurance || ""}
                    onChange={(e) => setCurrentPlan({ ...currentPlan, insurance: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] focus:ring-2 focus:ring-red-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Total Cost *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={currentPlan.totalCost || ""}
                    onChange={(e) => setCurrentPlan({ ...currentPlan, totalCost: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] focus:ring-2 focus:ring-red-600 outline-none font-bold"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 font-medium"
                >
                  {isSaving ? "Saving..." : "Save Finance Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
