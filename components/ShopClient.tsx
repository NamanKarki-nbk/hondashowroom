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
  engineType?: string;
  powerKw?: number;
  seatHeight?: number;
};

interface ShopClientProps {
  initialProducts: Product[];
}

// Helper to assign mock specs for advanced filtering
const enhanceProducts = (products: Product[]) => {
  return products.map(p => {
    let engineType = "1-cylinder, 4-stroke engine";
    let powerKw = 10;
    let seatHeight = 750;

    const lowerName = p.name.toLowerCase();
    if (lowerName.includes("nx")) {
      powerKw = 12.7; seatHeight = 810;
    } else if (lowerName.includes("hornet")) {
      powerKw = 12.7; seatHeight = 790;
    } else if (lowerName.includes("dio")) {
      engineType = "1-cylinder, 4-stroke engine (CVT transmission)";
      powerKw = 6.0; seatHeight = 765;
    } else if (lowerName.includes("shine") || lowerName.includes("sp 125")) {
      powerKw = 8.0; seatHeight = 790;
    } else if (p.category === "POWER_PRODUCTS") {
      engineType = "Power Equipment";
      powerKw = 2; seatHeight = 0;
    }

    return { ...p, engineType, powerKw, seatHeight };
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
  const [selectedEngines, setSelectedEngines] = useState<string[]>([]);
  const [powerRange, setPowerRange] = useState<[number, number]>([11, 152]); // kW
  const [seatRange, setSeatRange] = useState<[number, number]>([690, 910]); // mm
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3800000]); // NPR

  const products = useMemo(() => enhanceProducts(initialProducts), [initialProducts]);

  const ENGINE_TYPES = [
    "2-cylinder, 4-stroke boxer engine (external camshafts)",
    "4-cylinder, 4-stroke in-line engine (BMW ShiftCam)",
    "2-cylinder, 4-stroke engine",
    "1-cylinder, 4-stroke engine (manual transmission)",
    "4-cylinder, 4-stroke in-line engine",
    "6-cylinder, 4-stroke in-line engine",
    "1-cylinder, 4-stroke engine (CVT transmission)",
    "2-cylinder, 4-stroke boxer engine (balance gear wheels)",
    "Permanent-magnet liquid-cooled synchronous motor"
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
    if (selectedEngines.length > 0) {
      result = result.filter(p => p.engineType && selectedEngines.includes(p.engineType));
    }
    
    result = result.filter(p => (p.powerKw ?? 0) >= powerRange[0] && (p.powerKw ?? 0) <= powerRange[1]);
    
    // Ignore seat height for power products
    result = result.filter(p => {
      if (p.category === "POWER_PRODUCTS") return true;
      return (p.seatHeight ?? 0) >= seatRange[0] && (p.seatHeight ?? 0) <= seatRange[1];
    });

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, searchQuery, selectedEngines, powerRange, seatRange, priceRange, sortBy]);

  const toggleEngine = (eng: string) => {
    setSelectedEngines(prev => prev.includes(eng) ? prev.filter(e => e !== eng) : [...prev, eng]);
  };

  return (
    <div className="flex flex-col bg-[#f3ebdd] dark:bg-[#0B0B0C] min-h-screen">
      
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
                
                {/* Engine Column */}
                <div>
                  <h3 className="font-bold mb-4 border-b border-black dark:border-white pb-3 text-sm">Engine</h3>
                  <div className="flex flex-col gap-5 pt-2">
                    {ENGINE_TYPES.map(eng => (
                      <label key={eng} className="flex items-start gap-3 cursor-pointer group">
                        <div className={`w-[22px] h-[22px] flex-shrink-0 border-[1.5px] mt-0.5 transition-colors flex items-center justify-center ${selectedEngines.includes(eng) ? "border-black bg-white dark:border-white dark:bg-black" : "border-black dark:border-white"}`}>
                          {selectedEngines.includes(eng) && <Check className="w-4 h-4 text-black dark:text-white" />}
                        </div>
                        <span className="text-[13px] leading-[1.3] opacity-90">{eng}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Performance Column */}
                <div>
                  <h3 className="font-bold mb-4 border-b border-black dark:border-white pb-3 text-sm">Performance</h3>
                  <DualRangeSlider 
                    min={11} max={152} value={powerRange} onChange={setPowerRange} 
                    format={(v) => `${v} kW`}
                    formatSecondary={(v) => `${Math.round(v * 1.35962)} PS`}
                  />
                  <div className="mt-14">
                    <p className="text-[13px] mb-4 opacity-90 leading-snug">Your driving licence affects how much power your motorcycle can have:</p>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <button onClick={() => setPowerRange([11, 15])} className="border border-black dark:border-white py-2 text-[13px] font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">A1</button>
                      <button onClick={() => setPowerRange([11, 35])} className="border border-black dark:border-white py-2 text-[13px] font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">A2</button>
                    </div>
                    <button onClick={() => setPowerRange([11, 152])} className="w-full border border-black dark:border-white py-2 text-[13px] font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">A</button>
                  </div>
                </div>

                {/* Seat Height Column */}
                <div>
                  <h3 className="font-bold mb-4 border-b border-black dark:border-white pb-3 text-sm">Seat height, unladen</h3>
                  <DualRangeSlider 
                    min={690} max={910} value={seatRange} onChange={setSeatRange} 
                    format={(v) => `${v} mm`}
                  />
                  <div className="mt-14">
                    <p className="text-[13px] mb-4 opacity-90 leading-snug">Use your jeans length to help you find your seat height:</p>
                    <div className="grid grid-cols-4 gap-3 mb-3">
                      {[26, 28, 30, 32].map(len => (
                        <button key={len} onClick={() => setSeatRange([Math.max(690, 700 + (len-26)*20), Math.min(910, 800 + (len-26)*20)])} className="border border-black dark:border-white py-2 text-[13px] font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">{len}</button>
                      ))}
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                       <button onClick={() => setSeatRange([860, 910])} className="border border-black dark:border-white py-2 text-[13px] font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">34</button>
                    </div>
                  </div>
                </div>

                {/* Price Column */}
                <div>
                  <h3 className="font-bold mb-4 border-b border-black dark:border-white pb-3 text-sm">Price</h3>
                  <DualRangeSlider 
                    min={0} max={3800000} value={priceRange} onChange={setPriceRange} 
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
             <button onClick={() => { setSelectedEngines([]); setPowerRange([11,152]); setSeatRange([690,910]); setPriceRange([0,3800000]); setSearchQuery(""); }} className="mt-4 text-[#c1291A] font-bold underline">Reset Filters</button>
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
