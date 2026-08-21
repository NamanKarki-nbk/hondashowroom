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
  // Generators
  { model: "EZ3000CX", type: "Generator", output: "2.3 kVA / Petrol Generator", price: 115900 },
  { model: "EZ6500CXS", type: "Generator", output: "5.5 kVA / Self Start Generator", price: 246900 },
  { model: "EU70is", type: "Generator", output: "7.0 kVA / Silent Inverter Generator", price: 409900 },
  { model: "EG 1000", type: "Generator", output: "0.85 kVA / Compact Generator", price: 69900 },
  { model: "EP 1000", type: "Generator", output: "0.75 kVA / Portable Generator", price: 75900 },
  { model: "EP 1800CX", type: "Generator", output: "1.5 kVA / Petrol Generator", price: 90000 },
  { model: "EU10I", type: "Generator", output: "1.0 kVA / Portable Inverter", price: 186900 },
  { model: "EU22i", type: "Generator", output: "2.2 kVA / Inverter Generator", price: 209900 },
  { model: "EU30IS", type: "Generator", output: "3.0 kVA / Silent Inverter", price: 246900 },

  // Trimmer
  { model: "HHH25D75UT", type: "Trimmer", output: "25cc 4-Stroke Hedge Trimmer", price: 94900 },

  // Lawn Mowers
  { model: "HRU216M3TBUH", type: "Lawn Mower", output: "21 Inch Deck / 163cc Engine", price: 176900 },
  { model: "HRU 196", type: "Lawn Mower", output: "19 Inch Deck / 163cc Engine", price: 141900 },

  // Water Pumps
  { model: "WV30D", type: "Water Pump", output: "3 Inch Heavy Duty Petrol Pump", price: 74900 },
  { model: "WB30XD", type: "Water Pump", output: "3 Inch High Discharge Water Pump", price: 51900 },

  // Brush Cutters
  { model: "UMK 435T", type: "Brush Cutter", output: "35cc 4-Stroke Brush Cutter", price: 71900 },
  { model: "UMR 435T", type: "Brush Cutter", output: "35cc Backpack Type Brush Cutter", price: 86900 },

  // Tillers
  { model: "FQ650", type: "Tiller", output: "Power Weeder / Tiller", price: 156900 },
  { model: "F300", type: "Tiller", output: "Mini Power Tiller", price: 88900 },

  // Sprayers
  { model: "WJR2525T1", type: "Sprayer", output: "25L Backpack Power Sprayer", price: 76900 },
  { model: "WJR4025T", type: "Sprayer", output: "25L Heavy Duty Power Sprayer", price: 76900 },
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
    <main className="min-h-screen bg-background pt-28 pb-20">
      {/* Hero Banner */}
      <div className="bg-[#111111] py-20 px-8 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
           <img src="/images/price-list-bg.jpg" className="w-full h-full object-cover opacity-20" alt="Motorcycles" />
           <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        </div>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 relative z-10">
          <p className="text-primary font-bold tracking-widest uppercase text-sm mb-4">Official Price List</p>
          <h1 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold md:text-4xl font-bold md:text-5xl font-black text-primary-foreground mb-6 uppercase">
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
            className="w-full bg-[#e8dfd1] dark:bg-slate-900 border-none text-foreground px-5 py-4 pl-12 rounded-full focus:ring-2 focus:ring-primary outline-none transition-shadow shadow-sm"
          />
          <Search className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>

        {/* 2 Wheelers Section */}
        <div className="mb-8">
          <button
            onClick={() => setExpanded(expanded === "2wheelers" ? (null as any) : "2wheelers")}
            className="w-full bg-[#111111] text-primary-foreground px-6 py-5 rounded-t-xl font-bold flex items-center justify-between transition-colors hover:bg-black"
          >
            <span className="text-xl md:text-2xl font-semibold">Honda 2 Wheelers (Motorcycles & Scooters)</span>
            {expanded === "2wheelers" ? <ChevronUp /> : <ChevronDown />}
          </button>
          
          {expanded === "2wheelers" && (
            <div className="bg-background dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-b-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-[#252525] border-b border-gray-200 dark:border-slate-800">
                      <th className="py-4 px-6 font-bold text-gray-600 dark:text-gray-300">Model Name</th>
                      <th className="py-4 px-6 font-bold text-gray-600 dark:text-gray-300">Category</th>
                      <th className="py-4 px-6 font-bold text-gray-600 dark:text-gray-300">Engine</th>
                      <th className="py-4 px-6 font-bold text-gray-600 dark:text-gray-300 text-right">Ex-Showroom Price (NPR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTwoWheelers.length > 0 ? (
                      filteredTwoWheelers.map((vehicle, index) => (
                        <tr key={index} className="border-b border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-[#222] transition-colors">
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
            className="w-full bg-[#111111] text-primary-foreground px-6 py-5 rounded-t-xl font-bold flex items-center justify-between transition-colors hover:bg-black"
          >
            <span className="text-xl md:text-2xl font-semibold">Honda Power Products (Generators, Water Pumps...)</span>
            {expanded === "power" ? <ChevronUp /> : <ChevronDown />}
          </button>
          
          {expanded === "power" && (
            <div className="bg-background dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-b-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-[#252525] border-b border-gray-200 dark:border-slate-800">
                      <th className="py-4 px-6 font-bold text-gray-600 dark:text-gray-300">Model Name</th>
                      <th className="py-4 px-6 font-bold text-gray-600 dark:text-gray-300">Product Type</th>
                      <th className="py-4 px-6 font-bold text-gray-600 dark:text-gray-300">Output</th>
                      <th className="py-4 px-6 font-bold text-gray-600 dark:text-gray-300 text-right">MRP (NPR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPowerProducts.length > 0 ? (
                      filteredPowerProducts.map((product, index) => (
                        <tr key={index} className="border-b border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-[#222] transition-colors">
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
