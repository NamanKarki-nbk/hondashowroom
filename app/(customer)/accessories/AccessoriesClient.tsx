"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export type Accessory = {
  id: string;
  name: string;
  partNo: string;
  category: string;
  price: number;
  imageUrl: string;
  stockStatus: string;
  description: string | null;
  vehicleType: string;
  compatibility: string[];
};

interface AccessoriesClientProps {
  initialAccessories: Accessory[];
}

export default function AccessoriesClient({ initialAccessories }: AccessoriesClientProps) {
  const [vehicleType, setVehicleType] = useState<string | null>(null);
  const [vehicleModel, setVehicleModel] = useState<string | null>(null);

  // Extract unique models based on selected vehicle type
  const availableModels = useMemo(() => {
    if (!vehicleType) return [];
    const models = new Set<string>();
    initialAccessories.forEach(acc => {
      const type = acc.vehicleType || 'universal';
      if (type.toLowerCase() === vehicleType.toLowerCase() || type.toLowerCase() === 'universal') {
        if (acc.compatibility) {
          acc.compatibility.forEach(model => models.add(model));
        }
      }
    });
    return Array.from(models).sort();
  }, [vehicleType, initialAccessories]);

  // Filter accessories based on selection
  const filteredAccessories = useMemo(() => {
    if (!vehicleModel) return [];
    return initialAccessories.filter(acc => {
      const type = acc.vehicleType || 'universal';
      const compat = acc.compatibility || [];
      return compat.includes(vehicleModel) || type.toLowerCase() === 'universal';
    });
  }, [vehicleModel, initialAccessories]);

  const hasSelection = vehicleType && vehicleModel;

  return (
    <div className="min-h-screen text-foreground pt-24 pb-16 font-sans">
      <div className={`max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 transition-all duration-500 ${hasSelection ? 'pt-8' : 'pt-40 pb-40'}`}>
        
        {/* Filter Wizard */}
        <div className={`flex flex-col items-center justify-center space-y-6 transition-all duration-500 ${hasSelection ? 'mb-16' : ''}`}>
          
          <div className="flex items-center text-xl md:text-2xl font-semibold md:text-2xl font-medium">
            <span>What </span>
            <div className="relative mx-3 group">
              <select 
                className="appearance-none bg-transparent text-primary border-b border-transparent hover:border-primary border-dashed cursor-pointer outline-none pr-6 font-medium transition-colors"
                value={vehicleType || ""}
                onChange={(e) => {
                  setVehicleType(e.target.value);
                  setVehicleModel(null); // Reset model on type change
                }}
              >
                <option value="" className="bg-white dark:bg-gray-800 text-foreground">type of vehicle</option>
                <option value="scooter" className="bg-white dark:bg-gray-800 text-foreground">Scooter</option>
                <option value="motorcycle" className="bg-white dark:bg-gray-800 text-foreground">Motorcycle</option>
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
            </div>
            <span> do you have?</span>
          </div>

          <div className={`flex items-center text-xl md:text-2xl font-semibold md:text-2xl font-medium transition-opacity duration-300 ${vehicleType ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <span>Choose your Vehicle Model </span>
            <div className="relative mx-3 group">
              <select 
                className="appearance-none bg-transparent text-primary border-b border-transparent hover:border-primary border-dashed cursor-pointer outline-none pr-6 font-medium transition-colors"
                value={vehicleModel || ""}
                onChange={(e) => setVehicleModel(e.target.value)}
                disabled={!vehicleType}
              >
                <option value="" className="bg-white dark:bg-gray-800 text-foreground">select model</option>
                {availableModels.map(model => (
                  <option key={model} value={model} className="bg-white dark:bg-gray-800 text-foreground">{model}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Debug UI - To be removed later */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-center text-xs text-gray-500 mb-4">
            Debug: Total Items: {initialAccessories.length} | Vehicle Type: {vehicleType} | Available Models: {availableModels.length}
          </div>
        )}

        {/* Results Section */}
        {hasSelection && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="mb-10">
              <h1 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold font-bold mb-2">Vehicle Accessories</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Premium add-ons and protection solutions for your Honda vehicle.</p>
            </div>

            <div className="border-b border-gray-200 dark:border-slate-800 pb-3 mb-8">
              <h2 className="text-xl md:text-2xl font-semibold font-bold">
                Results <span className="text-blue-600 dark:text-blue-400">{filteredAccessories.length}</span>
              </h2>
            </div>

            {filteredAccessories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAccessories.map((item) => (
                  <div key={item.id} className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-white/10 group">
                    <div className="relative h-48 bg-white flex items-center justify-center p-4">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-contain p-4 mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg leading-tight mb-4 min-h-[3rem] line-clamp-2 uppercase">
                        {item.name}
                      </h3>
                      
                      <div className="space-y-2 text-[13px]">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600 dark:text-blue-400">Part No:</span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">{item.partNo}</span>
                        </div>
                        
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="text-blue-600 dark:text-blue-400">MRP(Inc. of all taxes):</span>
                          <span className="font-bold text-foreground">₹ {item.price.toLocaleString('en-IN')}</span>
                          <span className="text-blue-600 dark:text-blue-400">Per unit cost</span>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/10 flex justify-between items-center">
                        <span className={`text-xs font-bold ${item.stockStatus === "IN_STOCK" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                          {item.stockStatus === "IN_STOCK" ? "● IN STOCK" : "○ OUT OF STOCK"}
                        </span>
                        <Link 
                          href={`/contact?inquiry=${encodeURIComponent(`Accessory Inquiry: ${item.name} (Part No: ${item.partNo})`)}`}
                          className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2 rounded transition-colors"
                        >
                          ENQUIRE
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm">
                <p className="text-gray-500 dark:text-gray-400 text-lg">No accessories found for {vehicleModel}.</p>
                <button 
                  onClick={() => setVehicleModel(null)}
                  className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Try another model
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
