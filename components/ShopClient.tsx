"use client";

import React, { useState, useMemo, useEffect } from "react";
import VehicleCard from "./VehicleCard";
import { Search, SlidersHorizontal, ArrowDownAZ, ArrowUpAZ, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  description: string | null;
};

interface ShopClientProps {
  initialProducts: Product[];
}

/**
 * The primary e-commerce product listing and filtering client component.
 * 
 * Features:
 * - Dynamic client-side filtering by category (Motorcycles, Scooters, Power Products).
 * - Real-time client-side search functionality.
 * - Price sorting (Low to High, High to Low).
 * - Auto-initializes search from URL query parameters (e.g. ?search=Dio).
 * - Animated grid transitions using Framer Motion.
 * 
 * @param {ShopClientProps} props - The initial server-fetched products to display.
 * @returns {JSX.Element} The rendered interactive shop interface.
 */
export default function ShopClient({ initialProducts }: ShopClientProps) {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("search") || "");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");

  const CATEGORIES = [
    { id: "ALL", label: "All Vehicles" },
    { id: "SCOOTERS", label: "Scooters" },
    { id: "MOTORCYCLES", label: "Motorcycles" },
    { id: "POWER_PRODUCTS", label: "Power Products" },
  ];

  useEffect(() => {
    const q = searchParams?.get("search");
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let result = initialProducts;

    // Filter by Category
    if (categoryFilter !== "ALL") {
      result = result.filter(p => p.category === categoryFilter);
    }

    // Filter by Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [initialProducts, categoryFilter, searchQuery, sortBy]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Sidebar / Filters */}
      <div className="w-full lg:w-64 flex-shrink-0 sticky top-28 bg-[#f3ebdd] dark:bg-[#111111] p-6 rounded-2xl border border-gray-200 dark:border-[#f3ebdd]/10 shadow-sm">
        
        {/* Search */}
        <div className="mb-8">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 block">Search</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search Honda..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#e8dfd1] dark:bg-[#1A1A1A] text-gray-900 dark:text-[#f3ebdd] border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#c1291A] outline-none"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-[#f3ebdd]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 block">Categories</label>
          <div className="flex flex-col gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`text-left px-4 py-2 rounded-xl text-sm font-medium transition-colors ${categoryFilter === cat.id ? "bg-[#c1291A] text-[#f3ebdd]" : "text-gray-600 dark:text-gray-400 hover:bg-[#e8dfd1] dark:hover:bg-[#1A1A1A] hover:text-gray-900 dark:hover:text-[#f3ebdd]"}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 block">Sort By Price</label>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setSortBy("default")}
              className={`text-left px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${sortBy === "default" ? "bg-[#e8dfd1] dark:bg-[#1A1A1A] text-[#c1291A]" : "text-gray-600 dark:text-gray-400 hover:bg-[#f3ebdd] dark:hover:bg-[#1A1A1A]"}`}
            >
              <SlidersHorizontal className="w-4 h-4" /> Default
            </button>
            <button
              onClick={() => setSortBy("price-asc")}
              className={`text-left px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${sortBy === "price-asc" ? "bg-[#e8dfd1] dark:bg-[#1A1A1A] text-[#c1291A]" : "text-gray-600 dark:text-gray-400 hover:bg-[#f3ebdd] dark:hover:bg-[#1A1A1A]"}`}
            >
              <ArrowDownAZ className="w-4 h-4" /> Low to High
            </button>
            <button
              onClick={() => setSortBy("price-desc")}
              className={`text-left px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${sortBy === "price-desc" ? "bg-[#e8dfd1] dark:bg-[#1A1A1A] text-[#c1291A]" : "text-gray-600 dark:text-gray-400 hover:bg-[#f3ebdd] dark:hover:bg-[#1A1A1A]"}`}
            >
              <ArrowUpAZ className="w-4 h-4" /> High to Low
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 text-sm">
            Showing <span className="font-bold text-gray-900 dark:text-[#f3ebdd]">{filteredProducts.length}</span> results
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-[#f3ebdd] dark:bg-[#111111] rounded-2xl border border-gray-200 dark:border-[#f3ebdd]/10 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
             <div className="w-16 h-16 bg-[#e8dfd1] dark:bg-[#1A1A1A] rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400" />
             </div>
             <h3 className="text-xl font-bold text-gray-900 dark:text-[#f3ebdd] mb-2">No products found</h3>
             <p className="text-gray-500">We couldn't find anything matching your search criteria.</p>
             <button 
               onClick={() => { setSearchQuery(""); setCategoryFilter("ALL"); setSortBy("default"); }}
               className="mt-6 text-[#c1291A] font-bold hover:underline"
             >
               Clear all filters
             </button>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map(vehicle => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  key={vehicle.id}
                >
                  <VehicleCard
                    title={vehicle.name}
                    priceNpr={vehicle.price}
                    category={
                      vehicle.category === "POWER_PRODUCTS"
                        ? "Power Product"
                        : vehicle.category === "AUTOMOBILES"
                        ? "Automobile"
                        : vehicle.category === "SCOOTERS"
                        ? "Scooter"
                        : "Motorcycle"
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
