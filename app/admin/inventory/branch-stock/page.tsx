"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, Loader2, Package } from "lucide-react";

interface ColorData {
  colorName: string;
  branches: Record<string, number>;
  total: number;
}

interface ModelData {
  modelName: string;
  colors: ColorData[];
  totals: Record<string, number>;
}

interface BranchStockResponse {
  branches: string[];
  models: ModelData[];
}

export default function BranchStockPage() {
  const [data, setData] = useState<BranchStockResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetchData();
  }, [category]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const url = new URL("/api/admin/inventory/branch-stock", window.location.origin);
      if (category) url.searchParams.append("category", category);
      
      const res = await fetch(url.toString());
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error("Failed to fetch branch stock:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredModels = data?.models.filter(m => 
    m.modelName.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" />
            Branch Stock Matrix
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Real-time vehicle inventory distributed across all branches.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
            />
          </div>
          
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="pl-9 pr-8 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
            >
              <option value="">All Categories</option>
              <option value="Motorcycle">Motorcycles</option>
              <option value="Scooter">Scooters</option>
              <option value="Power Product">Power Products</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : !data || filteredModels.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-12 text-center text-gray-500">
          No inventory found matching your criteria.
        </div>
      ) : (
        <div className="space-y-8">
          {filteredModels.map((model) => (
            <div key={model.modelName} className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm print:break-inside-avoid print:shadow-none print:border-gray-300">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-[#2a303c] text-white">
                    <tr>
                      <th className="px-6 py-3 font-semibold border-r border-white/10 w-[40%]">
                        {model.modelName}
                      </th>
                      {data.branches.map(branch => (
                        <th key={branch} className="px-6 py-3 font-semibold border-r border-white/10 text-center uppercase tracking-wider">
                          {branch}
                        </th>
                      ))}
                      <th className="px-6 py-3 font-semibold text-center uppercase tracking-wider">
                        STOCK
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                    {model.colors.map((color, idx) => (
                      <tr key={color.colorName} className={idx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-gray-50 dark:bg-slate-800/50'}>
                        <td className="px-6 py-3 font-medium text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-slate-800">
                          {color.colorName}
                        </td>
                        {data.branches.map(branch => (
                          <td key={branch} className="px-6 py-3 text-center border-r border-gray-200 dark:border-slate-800 text-gray-600 dark:text-gray-300">
                            {color.branches[branch] || 0}
                          </td>
                        ))}
                        <td className="px-6 py-3 text-center font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-800/50">
                          {color.total}
                        </td>
                      </tr>
                    ))}
                    {/* Total Row */}
                    <tr className="bg-gray-100 dark:bg-slate-800">
                      <td className="px-6 py-3 font-bold text-gray-900 dark:text-white border-r border-gray-300 dark:border-slate-700 uppercase">
                        TOTAL
                      </td>
                      {data.branches.map(branch => (
                        <td key={branch} className="px-6 py-3 text-center font-bold text-gray-900 dark:text-white border-r border-gray-300 dark:border-slate-700">
                          {model.totals[branch] || 0}
                        </td>
                      ))}
                      <td className="px-6 py-3 text-center font-black text-gray-900 dark:text-white">
                        {model.totals.total}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
