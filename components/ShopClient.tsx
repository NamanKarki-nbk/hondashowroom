"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import VehicleCard from "./VehicleCard";
import { Search, SlidersHorizontal, X, ArrowUpAZ, ArrowDownAZ } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  description: string | null;
  // Mock properties for advanced filtering
  cc?: number;
};

interface ShopClientProps {
  initialProducts: Product[];
}

// Helper to assign mock specs for advanced filtering
const enhanceProducts = (products: Product[]) => {
  return products.map(p => {
    let cc = 125;
    const lowerName = p.name.toLowerCase();
    
    if (lowerName.includes("350")) cc = 350;
    else if (lowerName.includes("250")) cc = 250;
    else if (lowerName.includes("190")) cc = 184;
    else if (lowerName.includes("160")) cc = 162;
    else if (lowerName.includes("125")) cc = 124;
    else if (lowerName.includes("110") || lowerName.includes("aviator") || lowerName.includes("dio")) cc = 109;
    
    // For power products, set cc to 0
    if (p.category === "POWER_PRODUCTS") cc = 0;

    return { ...p, cc };
  });
};

const DualRangeSlider = ({ 
  min, max, value, onChange, format = (v: number) => v.toString(), formatSecondary 
}: { 
  min: number, max: number, value: [number, number], onChange: (val: [number, number]) => void, format?: (v: number) => React.ReactNode, formatSecondary?: (v: number) => React.ReactNode 
}) => {
  const [minVal, maxVal] = value;
  
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Math.min(Number(e.target.value), maxVal - 1);
    onChange([v, maxVal]);
  };
  
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Math.max(Number(e.target.value), minVal + 1);
    onChange([minVal, v]);
  };

  const getPercent = (value: number) => Math.round(((value - min) / (max - min)) * 100);

  return (
    <div className="pt-6 pb-2">
      <div className="flex justify-between items-end mb-6">
        <div className="flex flex-col">
           <span className="font-bold text-[15px] leading-tight text-foreground">{format(minVal)}</span>
           {formatSecondary && <span className="text-[13px] text-gray-500 mt-1">{formatSecondary(minVal)}</span>}
        </div>
        <div className="flex flex-col text-right">
           <span className="font-bold text-[15px] leading-tight text-foreground">{format(maxVal)}</span>
           {formatSecondary && <span className="text-[13px] text-gray-500 mt-1">{formatSecondary(maxVal)}</span>}
        </div>
      </div>
      <div className="relative h-1 w-full bg-gray-300 dark:bg-gray-700 rounded">
        <div 
          className="absolute h-1 bg-foreground rounded" 
          style={{ left: `${getPercent(minVal)}%`, width: `${getPercent(maxVal) - getPercent(minVal)}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={handleMinChange}
          className="absolute w-full -top-1.5 h-4 opacity-0 cursor-pointer pointer-events-auto"
          style={{ zIndex: minVal > max - 100 ? 5 : 3 }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={handleMaxChange}
          className="absolute w-full -top-1.5 h-4 opacity-0 cursor-pointer pointer-events-auto"
          style={{ zIndex: 4 }}
        />
        {/* Custom thumbs */}
        <div 
          className="absolute h-4 w-4 bg-background border-2 border-foreground rounded-full -top-1.5 pointer-events-none" 
          style={{ left: `calc(${getPercent(minVal)}% - 8px)` }}
        />
        <div 
          className="absolute h-4 w-4 bg-background border-2 border-foreground rounded-full -top-1.5 pointer-events-none" 
          style={{ left: `calc(${getPercent(maxVal)}% - 8px)` }}
        />
      </div>
    </div>
  );
};

export default function ShopClient({ initialProducts }: ShopClientProps) {
  const searchParams = useSearchParams();
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("search") || "");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");

  // Advanced Filters State
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [ccRange, setCcRange] = useState<[number, number]>([100, 350]); // CC
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]); // NPR

  const products = useMemo(() => enhanceProducts(initialProducts), [initialProducts]);

  const CATEGORY_TYPES = [
    { id: "MOTORCYCLES", label: "Motorcycles" },
    { id: "SCOOTERS", label: "Scooters" },
    { id: "POWER_PRODUCTS", label: "Power Products" }
  ];

  useEffect(() => {
    const q = searchParams?.get("search");
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Advanced Filters
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }
    
    result = result.filter(p => {
      if (p.category === "POWER_PRODUCTS") return true;
      return (p.cc ?? 0) >= ccRange[0] && (p.cc ?? 0) <= ccRange[1];
    });

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else {
      // Default sort order
      const orderMap: Record<string, number> = {
        "SCOOTERS": 1,
        "MOTORCYCLES": 2,
        "POWER_PRODUCTS": 3
      };
      result = [...result].sort((a, b) => {
        const orderA = orderMap[a.category] || 99;
        const orderB = orderMap[b.category] || 99;
        return orderA - orderB;
      });
    }

    return result;
  }, [products, searchQuery, selectedCategories, ccRange, priceRange, sortBy]);

  return (
    <div className="flex flex-col bg-background dark:bg-[#0B0B0C] min-h-screen">
      
      {/* Expandable Filter Bar */}
      <div className="bg-[#1c1c1c] text-white">
        <div 
          className="flex justify-between items-center px-6 lg:px-12 py-5 cursor-pointer select-none border-b-2 border-transparent"
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}
        >
          <h2 className="text-[17px] font-normal tracking-wide">Filter according to your requirements</h2>
          <div className="flex items-center gap-6">
            <div className="bg-white text-black px-4 py-1.5 text-xs font-extrabold rounded-sm">
              Matching models {filteredProducts.length}
            </div>
            {isFilterExpanded ? <span className="text-3xl font-light leading-none mb-1">&minus;</span> : <span className="text-3xl font-light leading-none mb-1">+</span>}
          </div>
        </div>

        <AnimatePresence>
          {isFilterExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-white text-black dark:bg-[#1a1a1a] dark:text-white"
            >
              <div className="p-6 lg:p-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 xl:gap-12 border-t-2 border-[#1c1c1c]">
                
                {/* Category Column */}
                <div>
                  <h3 className="font-bold mb-4 border-b border-black dark:border-white pb-3 text-sm">Category</h3>
                  <div className="flex flex-col gap-5 pt-2">
                    {CATEGORY_TYPES.map(cat => (
                      <label 
                        key={cat.id} 
                        className="flex items-start gap-3 cursor-pointer group"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedCategories(prev => prev.includes(cat.id) ? prev.filter(c => c !== cat.id) : [...prev, cat.id]);
                        }}
                      >
                        <div className={`w-[22px] h-[22px] flex-shrink-0 border-[1.5px] mt-0.5 transition-colors flex items-center justify-center ${selectedCategories.includes(cat.id) ? "border-black bg-white dark:border-white dark:bg-black" : "border-black dark:border-white"}`}>
                          {selectedCategories.includes(cat.id) && <Check className="w-4 h-4 text-black dark:text-white" />}
                        </div>
                        <span className="text-[13px] leading-[1.3] opacity-90">{cat.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Engine CC Column */}
                <div>
                  <h3 className="font-bold mb-4 border-b border-black dark:border-white pb-3 text-sm">Engine Size (cc)</h3>
                  <DualRangeSlider 
                    min={100} max={350} value={ccRange} onChange={setCcRange} 
                    format={(v) => `${v} cc`}
                  />
                  <div className="mt-14">
                    <p className="text-[13px] mb-4 opacity-90 leading-snug">Quickly filter by popular engine capacities:</p>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <button onClick={() => setCcRange([100, 110])} className="border border-black dark:border-white py-2 text-[13px] font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">110 cc</button>
                      <button onClick={() => setCcRange([120, 130])} className="border border-black dark:border-white py-2 text-[13px] font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">125 cc</button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => setCcRange([150, 170])} className="border border-black dark:border-white py-2 text-[13px] font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">160 cc</button>
                      <button onClick={() => setCcRange([340, 360])} className="border border-black dark:border-white py-2 text-[13px] font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">350 cc</button>
                    </div>
                  </div>
                </div>

                {/* Sort By Column */}
                <div>
                  <h3 className="font-bold mb-4 border-b border-black dark:border-white pb-3 text-sm">Sort By</h3>
                  <div className="mt-4">
                    <select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full bg-transparent border border-black dark:border-white rounded-none px-3 py-3 text-sm font-bold outline-none cursor-pointer"
                    >
                        <option className="bg-background text-foreground" value="default">Recommended</option>
                        <option className="bg-background text-foreground" value="price-asc">Price: Low to High</option>
                        <option className="bg-background text-foreground" value="price-desc">Price: High to Low</option>
                    </select>
                  </div>
                </div>

                {/* Price Column */}
                <div>
                  <h3 className="font-bold mb-4 border-b border-black dark:border-white pb-3 text-sm">Price (NPR)</h3>
                  <DualRangeSlider 
                    min={0} max={5000000} value={priceRange} onChange={setPriceRange} 
                    format={(v) => `₹${v.toLocaleString('en-IN')}`}
                  />
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Grid Area */}
      <div className="flex-1 mt-12 relative">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] opacity-60">
             <Search className="w-10 h-10 mb-4" />
             <h3 className="text-xl font-normal mb-2">No models found</h3>
             <p className="text-sm">Try adjusting your filters.</p>
             <button onClick={() => { setSelectedCategories([]); setCcRange([100,350]); setPriceRange([0,5000000]); setSearchQuery(""); }} className="mt-4 text-primary font-bold underline">Reset Filters</button>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map(vehicle => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={vehicle.id}
                  className="bg-white dark:bg-[#1a1a1a] rounded-xl overflow-hidden shadow-sm"
                >
                  <VehicleCard
                    title={vehicle.name}
                    priceNpr={vehicle.price}
                    category={
                      vehicle.category === "POWER_PRODUCTS" ? "Power Product" : 
                      vehicle.category === "AUTOMOBILES" ? "Automobile" : 
                      vehicle.category === "SCOOTERS" ? "Scooter" : "Motorcycle"
                    }
                    slug={vehicle.id}
                    imageUrl={vehicle.imageUrl}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Simple Check icon component for checkboxes
function Check(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}
