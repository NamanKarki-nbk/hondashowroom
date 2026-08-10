"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Mock Data ---

type VehicleType = "scooter" | "motorcycle";

interface Accessory {
  id: string;
  title: string;
  partNo: string;
  price: number;
  image: string;
  compatibility: string[];
  vehicleType: VehicleType;
}

const VEHICLE_MODELS = {
  scooter: ["Activa 6G", "Activa 125", "Dio 125", "Dio"],
  motorcycle: ["Shine 100", "SP 125", "Unicorn", "Hornet 2.0", "CB350", "NX500"]
};

// Expanded to match screenshot style
const ACCESSORIES_DATA: Accessory[] = [
  {
    id: "a1",
    title: "KIT,COWL SINGLE SEAT, LEMON ICE YELLOW",
    partNo: "08R01K4FD00ZA",
    price: 1107,
    image: "/accessories/yellow_seat_cowl.jpg", 
    compatibility: ["CB350", "Hornet 2.0"],
    vehicleType: "motorcycle"
  },
  {
    id: "a2",
    title: "License Plate Case (100*200)",
    partNo: "08304COMM10",
    price: 100,
    image: "/accessories/license_plate_case.jpg",
    compatibility: ["Activa 6G", "Dio 125", "SP 125", "CB350"],
    vehicleType: "scooter"
  },
  {
    id: "a3",
    title: "FRONT PIPE",
    partNo: "08302K1PA00",
    price: 902,
    image: "/accessories/front_pipe.jpg",
    compatibility: ["Hornet 2.0", "SP 125"],
    vehicleType: "motorcycle"
  },
  {
    id: "a4",
    title: "KIT,COWL SINGLE SEAT, ATHLETIC BLUE METALLIC",
    partNo: "08R01K4FD00ZC",
    price: 1107,
    image: "/accessories/blue_seat_cowl.jpg",
    compatibility: ["CB350", "Hornet 2.0"],
    vehicleType: "motorcycle"
  },
  {
    id: "a5",
    title: "BODY COVER SILVER MOTORCYCLE",
    partNo: "08303COMM10ZA",
    price: 401,
    image: "/accessories/silver_body_cover.jpg",
    compatibility: ["SP 125", "Unicorn", "Shine 100"],
    vehicleType: "motorcycle"
  },
  {
    id: "a6",
    title: "FRONT PIPE - BLACK",
    partNo: "08302K4FA00ZA",
    price: 1454,
    image: "/accessories/black_front_pipe.jpg",
    compatibility: ["Hornet 2.0", "NX500"],
    vehicleType: "motorcycle"
  },
  // Add copies so it looks full
  ...Array.from({ length: 10 }).map((_, i) => ({
    id: `a${i+7}`,
    title: i % 2 === 0 ? "ENGINE GUARD BLACK" : "SEAT COVER PREMIUM",
    partNo: `0830${i}K${i}FA00`,
    price: 400 + (i * 150),
    image: i % 2 === 0 ? "/components/engine.png" : "/components/battery-icon.png",
    compatibility: ["Activa 6G", "Dio", "CB350", "SP 125"],
    vehicleType: i % 2 === 0 ? "motorcycle" as VehicleType : "scooter" as VehicleType
  }))
];

export default function AccessoriesClient() {
  const [selectedType, setSelectedType] = useState<VehicleType | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

  const typeDropdownRef = useRef<HTMLDivElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
        setIsTypeDropdownOpen(false);
      }
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter products based on selected model
  const filteredAccessories = useMemo(() => {
    if (!selectedModel) return [];
    return ACCESSORIES_DATA.filter(item => 
      item.compatibility.includes(selectedModel) || item.vehicleType === selectedType
    );
  }, [selectedModel, selectedType]);

  const hasSelectedBoth = selectedType !== null && selectedModel !== null;

  return (
    <div className="text-gray-900 dark:text-[#f3ebdd] font-sans selection:bg-primary selection:text-[#f3ebdd] pb-32 min-h-screen">
      
      {/* ─── CENTRED SELECTION SCREEN ───────────────────────────────────── */}
      <div className={`transition-all duration-700 ease-in-out flex flex-col items-center justify-center w-full max-w-3xl mx-auto px-6 ${hasSelectedBoth ? 'py-12 opacity-0 h-0 overflow-hidden absolute' : 'min-h-[80vh] py-20 opacity-100'}`}>
        <div className="flex flex-col items-center gap-6 text-xl md:text-2xl font-medium w-full relative z-20">
          
          {/* Question 1 */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span>What</span>
            <div className="relative" ref={typeDropdownRef}>
              <button 
                onClick={() => {
                  setIsTypeDropdownOpen(!isTypeDropdownOpen);
                  setIsModelDropdownOpen(false);
                }}
                className="text-primary hover:text-primary-hover transition-colors border-b border-transparent hover:border-primary border-dashed flex items-center gap-1 group"
              >
                {selectedType ? selectedType : "type of vehicle"}
                <ChevronDown className={`w-4 h-4 transition-transform ${isTypeDropdownOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} />
              </button>
              
              <AnimatePresence>
                {isTypeDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-[#f3ebdd] dark:bg-[#0B0B0C] border border-gray-200 dark:border-[#f3ebdd]/10 rounded-xl shadow-2xl py-2 w-48 z-50 text-base"
                  >
                    <button 
                      onClick={() => { setSelectedType("scooter"); setSelectedModel(null); setIsTypeDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-[#f3ebdd] dark:hover:bg-[#f3ebdd]/5 transition-colors text-gray-900 dark:text-[#f3ebdd]"
                    >
                      Scooter
                    </button>
                    <button 
                      onClick={() => { setSelectedType("motorcycle"); setSelectedModel(null); setIsTypeDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-[#f3ebdd] dark:hover:bg-[#f3ebdd]/5 transition-colors text-gray-900 dark:text-[#f3ebdd]"
                    >
                      Motorcycle
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <span>do you have?</span>
          </div>

          {/* Question 2 */}
          <div className={`flex flex-wrap items-center justify-center gap-2 transition-all duration-500 ${selectedType ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
            <span>Choose your Vehicle Model</span>
            <div className="relative" ref={modelDropdownRef}>
              <button 
                onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                className="text-primary hover:text-primary-hover transition-colors border-b border-transparent hover:border-primary border-dashed flex items-center gap-1 group"
              >
                {selectedModel ? selectedModel : "select model"}
                <ChevronDown className={`w-4 h-4 transition-transform ${isModelDropdownOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} />
              </button>
              
              <AnimatePresence>
                {isModelDropdownOpen && selectedType && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-[#f3ebdd] dark:bg-[#0B0B0C] border border-gray-200 dark:border-[#f3ebdd]/10 rounded-xl shadow-2xl py-2 w-56 z-50 text-base max-h-64 overflow-y-auto"
                  >
                    {VEHICLE_MODELS[selectedType].map(model => (
                      <button 
                        key={model}
                        onClick={() => { setSelectedModel(model); setIsModelDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-[#f3ebdd] dark:hover:bg-[#f3ebdd]/5 transition-colors text-gray-900 dark:text-[#f3ebdd]"
                      >
                        {model}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>

      {/* ─── RESULTS GRID SCREEN ────────────────────────────────────────── */}
      <div className={`transition-all duration-700 ease-in-out ${hasSelectedBoth ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none absolute'}`}>
        {hasSelectedBoth && (
          <div className="max-w-7xl mx-auto px-6 pt-12">
            
            {/* Header / Active Filters */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 dark:border-[#f3ebdd]/10 pb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-[#f3ebdd]">Vehicle Accessories</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Premium add-ons and protection solutions for your Honda vehicle.</p>
                <div className="flex items-center gap-4 mt-6">
                  <p className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-[#f3ebdd]">
                    Results <span className="text-gray-500 dark:text-gray-400 font-normal">{filteredAccessories.length}</span>
                  </p>
                </div>
              </div>
              
              {/* Quick change dropdowns in header so user can switch easily */}
              <div className="flex items-center gap-4 text-sm bg-[#f3ebdd] dark:bg-[#0B0B0C] p-4 rounded-2xl border border-gray-200 dark:border-[#f3ebdd]/10 shadow-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 dark:text-gray-400 text-xs">Vehicle Type</span>
                  <button onClick={() => { setSelectedType(null); setSelectedModel(null); }} className="text-primary font-medium flex items-center gap-1 hover:underline">
                    {selectedType} <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
                <div className="w-px h-8 bg-gray-200 dark:bg-[#f3ebdd]/10" />
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 dark:text-gray-400 text-xs">Model</span>
                  <button onClick={() => { setSelectedModel(null); }} className="text-primary font-medium flex items-center gap-1 hover:underline">
                    {selectedModel} <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredAccessories.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="bg-[#f3ebdd] dark:bg-[#0B0B0C] border border-gray-200 dark:border-[#f3ebdd]/10 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group"
                >
                  {/* Image Container */}
                  <div className="bg-[#f3ebdd] dark:bg-[#f3ebdd]/5 h-56 p-6 flex items-center justify-center relative border-b border-gray-200 dark:border-[#f3ebdd]/5">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={300}
                      height={200}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Card Body */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-[#f3ebdd] uppercase leading-snug mb-3 line-clamp-2 min-h-[3rem]">
                      {item.title}
                    </h3>
                    
                    <div className="flex items-center gap-1 text-xs mb-2">
                      <span className="text-gray-500 dark:text-gray-400">Part No:</span>
                      <span className="font-bold text-gray-900 dark:text-[#f3ebdd]">{item.partNo}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-[11px] flex-wrap">
                      <span className="text-gray-500 dark:text-gray-400">MRP(Inc. of all taxes):</span>
                      <span className="font-bold text-gray-900 dark:text-[#f3ebdd] text-xs">₹ {item.price}</span>
                      <span className="text-gray-500 dark:text-gray-400">Per unit cost</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
