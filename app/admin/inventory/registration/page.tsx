"use client";

import React, { useState, useEffect } from "react";
import { Search, Save, Loader2, CheckCircle2 } from "lucide-react";

interface Vehicle {
  id: string;
  indexNo: string | null;
  vin: string;
  engineNo: string;
  tempRegistrationNo: string | null;
  mechiRegistrationNo: string | null;
  variant: {
    variantName: string;
  };
  status: string;
}

export default function UpdateRegistrationPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    const filtered = vehicles.filter(v => 
      (v.indexNo && v.indexNo.toLowerCase().includes(q)) ||
      (v.vin && v.vin.toLowerCase().includes(q)) ||
      (v.engineNo && v.engineNo.toLowerCase().includes(q)) ||
      (v.tempRegistrationNo && v.tempRegistrationNo.toLowerCase().includes(q)) ||
      (v.mechiRegistrationNo && v.mechiRegistrationNo.toLowerCase().includes(q))
    );
    setFilteredVehicles(filtered);
  }, [searchQuery, vehicles]);

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/inventory");
      const data = await res.json();
      if (data.vehicles) {
        setVehicles(data.vehicles);
      }
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (vehicleId: string, tempReg: string | null, mechiReg: string | null) => {
    setSavingId(vehicleId);
    try {
      const res = await fetch("/api/admin/inventory/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleId, tempRegistrationNo: tempReg, mechiRegistrationNo: mechiReg })
      });
      if (res.ok) {
        // Success
      }
    } catch (error) {
      console.error("Failed to update:", error);
    } finally {
      setSavingId(null);
    }
  };

  const handleFieldChange = (vehicleId: string, field: "tempRegistrationNo" | "mechiRegistrationNo", value: string) => {
    setVehicles(vehicles.map(v => 
      v.id === vehicleId ? { ...v, [field]: value } : v
    ));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Update Vehicle Registration</h1>
        <p className="text-slate-600 dark:text-slate-400">Manage Temporary and Mechi Registration Numbers for your vehicles.</p>
      </div>

      <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-slate-200 dark:border-white/10">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Index, VIN, Engine, or Reg No..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                <th className="px-6 py-3 font-semibold text-slate-700 dark:text-slate-300">Vehicle Info</th>
                <th className="px-6 py-3 font-semibold text-slate-700 dark:text-slate-300">Temp Reg No.</th>
                <th className="px-6 py-3 font-semibold text-slate-700 dark:text-slate-300">Mechi Reg No.</th>
                <th className="px-6 py-3 font-semibold text-slate-700 dark:text-slate-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading vehicles...
                  </td>
                </tr>
              ) : filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No vehicles found matching your search.
                  </td>
                </tr>
              ) : (
                filteredVehicles.map(v => (
                  <tr key={v.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">{v.variant?.variantName}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        Index: {v.indexNo || 'N/A'} • VIN: {v.vin}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <input 
                        type="text" 
                        value={v.tempRegistrationNo || ""}
                        onChange={(e) => handleFieldChange(v.id, "tempRegistrationNo", e.target.value)}
                        placeholder="e.g. PRADESH-1..."
                        className="w-full px-3 py-1.5 bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-md text-sm outline-none focus:border-red-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input 
                        type="text" 
                        value={v.mechiRegistrationNo || ""}
                        onChange={(e) => handleFieldChange(v.id, "mechiRegistrationNo", e.target.value)}
                        placeholder="e.g. ME 1 PA..."
                        className="w-full px-3 py-1.5 bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-md text-sm outline-none focus:border-red-500"
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleUpdate(v.id, v.tempRegistrationNo, v.mechiRegistrationNo)}
                        disabled={savingId === v.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
                      >
                        {savingId === v.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save
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
}
