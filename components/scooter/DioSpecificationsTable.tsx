"use client";

import React, { useState } from "react";
import { Sliders, Wrench, Shield, Zap, Compass, CheckCircle2 } from "lucide-react";

export interface SpecCategory {
  id: string;
  name: string;
  icon: any;
  specs: { label: string; value: string }[];
}

interface DioSpecificationsTableProps {
  vehicle?: any;
}

const SPEC_CATEGORIES: SpecCategory[] = [
  {
    id: "engine",
    name: "Engine & Transmission",
    icon: Zap,
    specs: [
      { label: "Engine Type", value: "4 Stroke, SI Engine, PGM-FI eSP" },
      { label: "Displacement", value: "109.51 cc" },
      { label: "Max Net Power", value: "5.71 kW (7.76 PS) @ 8000 rpm" },
      { label: "Max Net Torque", value: "9.03 N.m @ 5250 rpm" },
      { label: "Bore x Stroke", value: "47.000 mm x 63.121 mm" },
      { label: "Compression Ratio", value: "10.0:1" },
      { label: "Fuel System", value: "PGM-FI (Programmed Fuel Injection)" },
      { label: "Starting Method", value: "Self Start / Smart Key Start & Kick Start" },
      { label: "Clutch Type", value: "Automatic Centrifugal Clutch (Dry)" },
      { label: "Transmission", value: "V-Matic (Automatic)" },
    ],
  },
  {
    id: "dimensions",
    name: "Body Dimensions",
    icon: Compass,
    specs: [
      { label: "Overall Length", value: "1808 mm" },
      { label: "Overall Width", value: "723 mm" },
      { label: "Overall Height", value: "1150 mm" },
      { label: "Wheelbase", value: "1260 mm" },
      { label: "Ground Clearance", value: "160 mm" },
      { label: "Seat Height / Length", value: "690 mm" },
      { label: "Kerb Weight", value: "103 kg (STD) / 105 kg (H-Smart)" },
      { label: "Fuel Tank Capacity", value: "5.3 Litres (External Fill)" },
    ],
  },
  {
    id: "suspension",
    name: "Frame & Suspension",
    icon: Wrench,
    specs: [
      { label: "Frame Type", value: "High Rigidity Underbone Type" },
      { label: "Front Suspension", value: "Telescopic Hydraulic Fork" },
      { label: "Rear Suspension", value: "3-Step Adjustable Spring Loaded Hydraulic" },
    ],
  },
  {
    id: "brakes",
    name: "Brakes & Tyres",
    icon: Shield,
    specs: [
      { label: "Front Tyre Size", value: "90/90-12 54J (Tubeless)" },
      { label: "Rear Tyre Size", value: "90/100-10 53J (Tubeless)" },
      { label: "Front Brake Type & Size", value: "Drum 130 mm / Disc 190 mm (Optional)" },
      { label: "Rear Brake Type & Size", value: "Drum 130 mm with Equalizer CBS" },
      { label: "Braking System", value: "Combi Brake System (CBS)" },
    ],
  },
  {
    id: "electricals",
    name: "Electricals",
    icon: Sliders,
    specs: [
      { label: "Battery Rating", value: "12V, 3.0 Ah (Maintenance Free)" },
      { label: "Headlamp", value: "LED Headlamp with DRL Position Lamp" },
      { label: "Tail Lamp", value: "Aggressive Multi-reflector Tail Lamp" },
      { label: "Console", value: "Full Digital Meter with DTE & Real-time Mileage" },
      { label: "Ignition System", value: "Full Transistorized ECU Controlled" },
    ],
  },
];

export default function DioSpecificationsTable({ vehicle }: DioSpecificationsTableProps = {}) {
  const [activeTab, setActiveTab] = useState<string>("engine");

  // Determine if we should use DB specs or fallback to defaults
  let displayCategories = SPEC_CATEGORIES;
  
  if (vehicle?.specs && Object.keys(vehicle.specs).length > 0) {
    displayCategories = Object.keys(vehicle.specs).map(key => {
      let icon = Sliders;
      if (key.includes("Engine")) icon = Zap;
      if (key.includes("Dimension")) icon = Compass;
      if (key.includes("Suspension")) icon = Wrench;
      if (key.includes("Brake") || key.includes("Tyre")) icon = Shield;
      
      return {
        id: key.toLowerCase(),
        name: key.replace(/_/g, " "),
        icon,
        specs: vehicle.specs[key]
      };
    });
  }

  // Fallback to first category if activeTab is not found
  const currentCategory = displayCategories.find((cat) => cat.id === activeTab) || displayCategories[0];
  
  // Set active tab to the first category if the current active tab doesn't exist in the new list
  React.useEffect(() => {
    if (!displayCategories.find(c => c.id === activeTab)) {
      setActiveTab(displayCategories[0].id);
    }
  }, [displayCategories, activeTab]);

  return (
    <section id="specs" className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0C0C0E] border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-primary text-xs font-black tracking-widest uppercase mb-3">
            <Sliders className="w-4 h-4" /> Technical Data
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold sm:text-4xl font-black text-foreground uppercase tracking-tight">
            Technical Specifications
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
            Detailed dimensions, engine specifications, electrical ratings, and braking technology of the {vehicle?.name || "scooter"}.
          </p>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center justify-start lg:justify-center overflow-x-auto gap-2 pb-4 mb-10 hide-scrollbar">
          {displayCategories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-5 py-3.5 rounded-2xl font-extrabold text-xs sm:text-sm uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2.5 border ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25 scale-[1.02]"
                    : "bg-gray-100 dark:bg-[#141416] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:text-foreground hover:bg-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Specs Table Container */}
        <div className="bg-gray-50 dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-6 sm:p-8 bg-gray-100 dark:bg-[#18181B] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h3 className="text-xl md:text-2xl font-semibold font-black uppercase text-foreground tracking-tight flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" /> {currentCategory.name}
            </h3>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              {Array.isArray(currentCategory?.specs) ? currentCategory.specs.length : 0} Parameters
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-800">
            {/* Left Column */}
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {Array.isArray(currentCategory?.specs) && currentCategory.specs.slice(0, Math.ceil(currentCategory.specs.length / 2)).map((spec, idx) => (
                <div key={idx} className="p-4 sm:p-5 flex justify-between items-center hover:bg-white dark:hover:bg-[#1A1A1E] transition-colors">
                  <span className="text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400">{spec.label}</span>
                  <span className="text-xs sm:text-sm font-black text-foreground text-right">{spec.value}</span>
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {Array.isArray(currentCategory?.specs) && currentCategory.specs.slice(Math.ceil(currentCategory.specs.length / 2)).map((spec, idx) => (
                <div key={idx} className="p-4 sm:p-5 flex justify-between items-center hover:bg-white dark:hover:bg-[#1A1A1E] transition-colors">
                  <span className="text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400">{spec.label}</span>
                  <span className="text-xs sm:text-sm font-black text-foreground text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
