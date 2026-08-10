"use client";

import React, { useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

const TWO_WHEELERS = [
  { model: "Honda NX 200", cc: "184.4cc", category: "Motorcycle", price: 489900 },
  { model: "Honda CB Hornet 2.0", cc: "184.4cc", category: "Motorcycle", price: 445900 },
  { model: "Honda Dio 125", cc: "123.9cc", category: "Scooter", price: 331900 },
  { model: "Honda SP 125", cc: "123.9cc", category: "Motorcycle", price: 306900 },
  { model: "Honda CB Shine BS6", cc: "124cc", category: "Motorcycle", price: 305900 },
  { model: "Honda Dio BS6 110", cc: "109.5cc", category: "Scooter", price: 235900 },
];

const POWER_PRODUCTS = [
  { model: "EU10i Portable Generator", type: "Generator", output: "1000W", price: 145000 },
  { model: "EU22i Inverter Generator", type: "Generator", output: "2200W", price: 215000 },
  { model: "EU30is Inverter Generator", type: "Generator", output: "3000W", price: 310000 },
  { model: "UMK 435T Brush Cutter", type: "Brush Cutter", output: "1.3 HP", price: 48000 },
  { model: "WB30XD Water Pump", type: "Water Pump", output: "4 HP", price: 55000 },
];

export default function PriceListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expanded, setExpanded] = useState<"2wheelers" | "power">("2wheelers");

  const filteredTwoWheelers = TWO_WHEELERS.filter((v) =>
    v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPowerProducts = POWER_PRODUCTS.filter((p) =>
    p.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Hero Banner */}
      <div className="bg-[#111111] py-20 px-8 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
           <img src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-20" alt="Motorcycles" />
           <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <p className="text-primary font-bold tracking-widest uppercase text-sm mb-4">Official Price List</p>
          <h1 className="text-4xl md:text-5xl font-black text-[#f3ebdd] mb-6 uppercase">
            Honda Nepal Pricing
          </h1>
          <p className="text-gray-400 max-w-xl text-lg">
            Stay updated with the latest Ex-Showroom prices for all Honda Motorcycles, Scooters, and Power Products in Nepal. Prices are indicative and subject to change without prior notice.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-12">
        {/* Search Bar */}
        <div className="relative mb-12 max-w-md">
          <input
            type="text"
            placeholder="Search by model or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#e8dfd1] dark:bg-[#1A1A1A] border-none text-foreground px-5 py-4 pl-12 rounded-full focus:ring-2 focus:ring-primary outline-none transition-shadow shadow-sm"
          />
          <Search className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>

        {/* 2 Wheelers Section */}
        <div className="mb-8">
          <button
            onClick={() => setExpanded(expanded === "2wheelers" ? (null as any) : "2wheelers")}
            className="w-full bg-[#111111] text-[#f3ebdd] px-6 py-5 rounded-t-xl font-bold flex items-center justify-between transition-colors hover:bg-black"
          >
            <span className="text-xl">Honda 2 Wheelers (Motorcycles & Scooters)</span>
            {expanded === "2wheelers" ? <ChevronUp /> : <ChevronDown />}
          </button>
          
          {expanded === "2wheelers" && (
            <div className="bg-[#f3ebdd] dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-b-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-[#252525] border-b border-gray-200 dark:border-gray-800">
                      <th className="py-4 px-6 font-bold text-gray-600 dark:text-gray-300">Model Name</th>
                      <th className="py-4 px-6 font-bold text-gray-600 dark:text-gray-300">Category</th>
                      <th className="py-4 px-6 font-bold text-gray-600 dark:text-gray-300">Engine</th>
                      <th className="py-4 px-6 font-bold text-gray-600 dark:text-gray-300 text-right">Ex-Showroom Price (NPR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTwoWheelers.length > 0 ? (
                      filteredTwoWheelers.map((vehicle, index) => (
                        <tr key={index} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#222] transition-colors">
                          <td className="py-4 px-6 font-bold text-foreground">{vehicle.model}</td>
                          <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{vehicle.category}</td>
                          <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{vehicle.cc}</td>
                          <td className="py-4 px-6 font-black text-primary text-right text-lg">
                            ₹ {vehicle.price.toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-gray-500">No vehicles found matching your search.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Power Products Section */}
        <div>
          <button
            onClick={() => setExpanded(expanded === "power" ? (null as any) : "power")}
            className="w-full bg-[#111111] text-[#f3ebdd] px-6 py-5 rounded-t-xl font-bold flex items-center justify-between transition-colors hover:bg-black"
          >
            <span className="text-xl">Honda Power Products (Generators, Water Pumps...)</span>
            {expanded === "power" ? <ChevronUp /> : <ChevronDown />}
          </button>
          
          {expanded === "power" && (
            <div className="bg-[#f3ebdd] dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-b-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-[#252525] border-b border-gray-200 dark:border-gray-800">
                      <th className="py-4 px-6 font-bold text-gray-600 dark:text-gray-300">Model Name</th>
                      <th className="py-4 px-6 font-bold text-gray-600 dark:text-gray-300">Product Type</th>
                      <th className="py-4 px-6 font-bold text-gray-600 dark:text-gray-300">Output</th>
                      <th className="py-4 px-6 font-bold text-gray-600 dark:text-gray-300 text-right">MRP (NPR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPowerProducts.length > 0 ? (
                      filteredPowerProducts.map((product, index) => (
                        <tr key={index} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#222] transition-colors">
                          <td className="py-4 px-6 font-bold text-foreground">{product.model}</td>
                          <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{product.type}</td>
                          <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{product.output}</td>
                          <td className="py-4 px-6 font-black text-primary text-right text-lg">
                            ₹ {product.price.toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-gray-500">No power products found matching your search.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
