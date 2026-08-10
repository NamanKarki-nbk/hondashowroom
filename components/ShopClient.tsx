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
  min, max, value, onChange, format = (v: number) => v.toString() 
}: { 
  min: number, max: number, value: [number, number], onChange: (val: [number, number]) => void, format?: (v: number) => string 
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
      <div className="flex justify-between items-center mb-6">
        <span className="font-bold text-sm text-foreground">{format(minVal)}</span>
        <span className="font-bold text-sm text-foreground">{format(maxVal)}</span>
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
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("search") || "");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");

  // Advanced Filters State
  const [selectedEngines, setSelectedEngines] = useState<string[]>([]);
  const [powerRange, setPowerRange] = useState<[number, number]>([0, 20]); // kW
  const [seatRange, setSeatRange] = useState<[number, number]>([700, 850]); // mm
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]); // NPR

  const products = useMemo(() => enhanceProducts(initialProducts), [initialProducts]);

  const ENGINE_TYPES = [
    "1-cylinder, 4-stroke engine",
    "1-cylinder, 4-stroke engine (CVT transmission)",
    "Power Equipment"
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
    <div className="flex flex-col lg:flex-row gap-0 bg-background text-foreground min-h-screen border-t border-gray-200 dark:border-gray-800">
      
      {/* BMW-Style Filter Sidebar */}
      <div className="w-full lg:w-[320px] flex-shrink-0 bg-background border-r border-gray-200 dark:border-gray-800 p-8 h-fit lg:sticky top-20">
        <h2 className="text-xl font-normal mb-8 tracking-wide">Filter according to your requirements</h2>
        
        {/* Search */}
        <div className="mb-10">
           <div className="relative border-b border-foreground pb-2">
            <input 
              type="text" 
              placeholder="Search Models..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none text-foreground text-sm focus:outline-none"
            />
            {searchQuery ? (
               <X className="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500" onClick={() => setSearchQuery("")} />
            ) : (
               <Search className="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 text-gray-500" />
            )}
          </div>
        </div>

        {/* Engine Checkboxes */}
        <div className="mb-10">
          <h3 className="font-bold mb-4 border-b border-foreground pb-2 text-sm">Engine</h3>
          <div className="flex flex-col gap-3">
            {ENGINE_TYPES.map(eng => (
              <label key={eng} className="flex items-start gap-3 cursor-pointer group">
                <div className={`w-5 h-5 flex-shrink-0 border mt-0.5 transition-colors flex items-center justify-center ${selectedEngines.includes(eng) ? "border-primary bg-primary" : "border-gray-400 group-hover:border-foreground"}`}>
                  {selectedEngines.includes(eng) && <Check className="w-3 h-3 text-[#f3ebdd]" />}
                </div>
                <span className="text-sm leading-tight text-gray-700 dark:text-gray-300">{eng}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Performance Slider */}
        <div className="mb-10">
          <h3 className="font-bold mb-2 border-b border-foreground pb-2 text-sm">Performance</h3>
          <DualRangeSlider 
            min={0} max={25} value={powerRange} onChange={setPowerRange} 
            format={(v) => `${v} kW`}
          />
        </div>

        {/* Seat Height Slider */}
        <div className="mb-10">
          <h3 className="font-bold mb-2 border-b border-foreground pb-2 text-sm">Seat height, unladen</h3>
          <DualRangeSlider 
            min={700} max={850} value={seatRange} onChange={setSeatRange} 
            format={(v) => `${v} mm`}
          />
        </div>

        {/* Price Slider */}
        <div className="mb-10">
          <h3 className="font-bold mb-2 border-b border-foreground pb-2 text-sm">Price</h3>
          <DualRangeSlider 
            min={0} max={1000000} value={priceRange} onChange={setPriceRange} 
            format={(v) => `₹${(v/100000).toFixed(1)}L`}
          />
        </div>

        {/* Sort */}
        <div className="mb-8">
           <h3 className="font-bold mb-4 border-b border-foreground pb-2 text-sm">Sort By</h3>
           <select 
             value={sortBy} 
             onChange={(e) => setSortBy(e.target.value as any)}
             className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm outline-none focus:border-foreground"
           >
              <option className="bg-background text-foreground" value="default">Recommended</option>
              <option className="bg-background text-foreground" value="price-asc">Price: Low to High</option>
              <option className="bg-background text-foreground" value="price-desc">Price: High to Low</option>
           </select>
        </div>

      </div>

      {/* Product Grid Area */}
      <div className="flex-1 bg-[#e8dfd1] dark:bg-[#111111] p-8 lg:p-12">
        <div className="flex justify-end mb-6">
          <div className="bg-background text-foreground text-xs font-bold py-2 px-4 rounded border border-gray-200 dark:border-gray-800 shadow-sm">
            Matching models {filteredProducts.length}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] opacity-60">
             <Search className="w-10 h-10 mb-4" />
             <h3 className="text-xl font-normal mb-2">No models found</h3>
             <p className="text-sm">Try adjusting your filters.</p>
             <button onClick={() => { setSelectedEngines([]); setPowerRange([0,25]); setSeatRange([700,850]); setPriceRange([0,1000000]); setSearchQuery(""); }} className="mt-4 text-primary font-bold underline">Reset Filters</button>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map(vehicle => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={vehicle.id}
                  className="bg-background"
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
