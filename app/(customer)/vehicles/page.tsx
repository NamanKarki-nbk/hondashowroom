"use client";

import React, { useState } from "react";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import VehicleCard from "@/components/VehicleCard";

const INVENTORY = [
  { slug: "cbr-250rr", title: "CBR 250RR", priceNpr: 1350000, cc: "250", category: "Motorcycle" },
  { slug: "xr-190l", title: "XR 190L", priceNpr: 715000, cc: "184", category: "Motorcycle" },
  { slug: "dio-125", title: "Dio 125", priceNpr: 315000, cc: "124", category: "Scooter" },
  { slug: "eu70is", title: "EU70is Generator", priceNpr: 450000, cc: "389", category: "Power Product" },
  { slug: "cb-shine", title: "CB Shine", priceNpr: 250000, cc: "125", category: "Motorcycle" },
  { slug: "aviator", title: "Aviator", priceNpr: 240000, cc: "110", category: "Scooter" },
];

export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const filteredInventory = INVENTORY.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || v.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#f3ebdd] dark:bg-[#0B0B0C] text-gray-100 pt-24 pb-20 px-6 selection:bg-[#c1291A] selection:text-[#f3ebdd]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#f3ebdd] tracking-tight mb-2">Vehicle Catalog</h1>
            <p className="text-gray-400">Explore our premium selection of Honda machines.</p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search models..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 bg-slate-900/60 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f3ebdd] focus:ring-1 focus:ring-[#c1291A] focus:border-[#c1291A] outline-none backdrop-blur-sm"
              />
            </div>
            <button className="bg-[#f3ebdd]/5 border border-slate-700 hover:bg-[#f3ebdd]/10 px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors">
              <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium">Filters</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["All", "Motorcycle", "Scooter", "Power Product"].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedCategory === cat 
                  ? "bg-[#c1291A] text-[#f3ebdd] shadow-lg shadow-[#c1291A]/20 border border-[#c1291A]" 
                  : "bg-slate-900/40 text-gray-400 border border-slate-800 hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredInventory.map((vehicle, idx) => (
            <VehicleCard key={idx} {...vehicle} />
          ))}
          
          {filteredInventory.length === 0 && (
             <div className="col-span-full py-20 text-center">
                <p className="text-gray-500 text-lg">No vehicles found matching your criteria.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
