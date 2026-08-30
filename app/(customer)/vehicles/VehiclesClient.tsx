"use client";

import React, { useState } from "react";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import VehicleCard from "@/components/VehicleCard";
import QuoteModal from "@/components/QuoteModal";

export default function VehiclesClient({ products }: { products: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Modal State
  const [modalType, setModalType] = useState<"quote" | "book" | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);

  const openModal = (type: "quote" | "book", vehicle: any) => {
    setModalType(type);
    setSelectedVehicle(vehicle);
  };
  
  const filteredInventory = products.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || v.category.toUpperCase() === selectedCategory.toUpperCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 text-gray-100 pt-24 pb-20 px-6 selection:bg-primary selection:text-primary-foreground relative">
      {/* Modals */}
      {modalType === "book" && selectedVehicle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-background dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-slate-800 relative">
            <button 
              onClick={() => { setModalType(null); setSelectedVehicle(null); }}
              className="absolute top-4 right-4 text-gray-500 hover:text-[#CC0000]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl md:text-3xl font-semibold font-black text-gray-900 dark:text-white uppercase tracking-tight mb-1">
              Pre-Book
            </h2>
            <p className="text-sm text-[#CC0000] font-bold mb-6">{selectedVehicle.name}</p>
            
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); setModalType(null); setSelectedVehicle(null); alert("Submitted successfully!"); }}>
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1">Full Name</label>
                <input type="text" required placeholder="Your Name" className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#CC0000]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1">Phone Number</label>
                <input type="tel" required placeholder="Mobile Number" className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#CC0000]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1">Preferred Dealer</label>
                <select className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#CC0000]">
                  <option>Select a branch</option>
                  <option>Damak</option>
                  <option>Birtamode</option>
                  <option>Urlabari</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-[#CC0000] hover:bg-primary-hover text-white py-3 rounded-xl font-bold uppercase tracking-wider mt-2 transition-colors">
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}
      
      <QuoteModal 
        isOpen={modalType === "quote" && selectedVehicle !== null} 
        onClose={() => { setModalType(null); setSelectedVehicle(null); }} 
        vehicleName={selectedVehicle?.name || ""} 
      />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold md:text-4xl font-bold md:text-5xl font-extrabold text-[#111111] dark:text-primary-foreground tracking-tight mb-2">Vehicle Catalog</h1>
            <p className="text-gray-600 dark:text-gray-400">Explore our premium selection of Honda machines.</p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search models..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 bg-white dark:bg-slate-900/60 border border-gray-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-primary-foreground focus:ring-1 focus:ring-[#CC0000] focus:border-[#CC0000] outline-none backdrop-blur-sm"
              />
            </div>
            <button className="bg-white /5 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-background/10 px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors text-gray-700 dark:text-primary-foreground">
              <SlidersHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium">Filters</span>
            </button>
          </div>
        </div>

        {/* Category Tabs (ALL, SCOOTER, MOTORCYCLE, etc.) */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 dark:border-slate-800 pb-4">
          {["All", "Motorcycle", "Scooter", "Power Product"].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${
                selectedCategory === cat 
                  ? "bg-[#CC0000] text-white shadow-lg shadow-[#B83227]/30 border border-[#CC0000]" 
                  : "bg-white dark:bg-slate-900/40 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredInventory.map((vehicle, idx) => (
            <VehicleCard 
              key={idx} 
              title={vehicle.name}
              priceNpr={vehicle.basePrice}
              cc={vehicle.specifications?.cc || undefined}
              slug={vehicle.id}
              category={vehicle.category}
              imageUrl={vehicle.imageUrl}
              colors={vehicle.specifications?.colors}
              onQuoteClick={() => openModal("quote", vehicle)}
              onBookClick={() => openModal("book", vehicle)}
            />
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
