"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function FinanceClient({ products }: { products: any[] }) {
  const [category, setCategory] = useState("All");
  const [emiRange, setEmiRange] = useState("All");

  const filteredProducts = products.filter(p => {
    if (category !== "All" && p.category !== category) return false;
    
    const approxEmi = Math.round(p.price / 36);
    if (emiRange === "< 5000" && approxEmi >= 5000) return false;
    if (emiRange === "5000 - 10000" && (approxEmi < 5000 || approxEmi > 10000)) return false;
    if (emiRange === "> 10000" && approxEmi <= 10000) return false;

    return true;
  });

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <div className="relative w-full sm:w-64">
          <select 
            value={category} 
            onChange={e => setCategory(e.target.value)}
            className="w-full bg-[#f3ebdd] dark:bg-[#1A1A1A] border border-gray-300 dark:border-gray-800 text-foreground px-4 py-3 rounded-none appearance-none outline-none font-medium shadow-sm"
          >
            <option value="All">Categories - All</option>
            <option value="MOTORCYCLES">Motorcycles</option>
            <option value="SCOOTERS">Scooters</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>

        <div className="relative w-full sm:w-64">
          <select 
            value={emiRange} 
            onChange={e => setEmiRange(e.target.value)}
            className="w-full bg-[#f3ebdd] dark:bg-[#1A1A1A] border border-gray-300 dark:border-gray-800 text-foreground px-4 py-3 rounded-none appearance-none outline-none font-medium shadow-sm"
          >
            <option value="All">EMI Range - All</option>
            <option value="< 5000">Under NPR 5,000</option>
            <option value="5000 - 10000">NPR 5,000 - 10,000</option>
            <option value="> 10000">Above NPR 10,000</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => {
          // Rough EMI calculation for display purposes
          const emi = Math.round(product.price / 36);

          return (
            <div key={product.id} className="bg-background border border-gray-200 dark:border-gray-800 p-6 flex flex-col group hover:shadow-xl transition-shadow relative overflow-hidden">
              <h3 className="font-bold text-lg mb-1">{product.name.toUpperCase()}</h3>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-6">
                EMI starting from <span className="text-foreground text-sm font-bold">₹ {emi.toLocaleString("en-IN")}</span> Per Month
              </p>
              
              <div className="flex-1 flex items-center justify-center mb-6">
                <img 
                  src={product.imageUrl || "/inventory/honda-dio-125.png"} 
                  alt={product.name}
                  className="w-full h-auto object-contain transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="mt-auto">
                <p className="text-xs text-gray-500 mb-4">
                  Ex-showroom price starts at <span className="font-bold text-foreground">₹{product.price.toLocaleString("en-IN")}/-</span>
                </p>
                <Link 
                  href={`/finance/${product.id}`}
                  className="block w-full text-center border border-foreground text-foreground text-xs font-bold py-3 hover:bg-foreground hover:text-background transition-colors"
                >
                  EXPLORE THIS OFFER
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
