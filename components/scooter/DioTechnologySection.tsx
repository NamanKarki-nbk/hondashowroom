"use client";

import React, { useState } from "react";
import { Zap, Monitor, Disc, KeyRound, Radio, Cpu, ShieldCheck, CheckCircle2 } from "lucide-react";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

export interface TechModule {
  id: string;
  name: string;
  badge: string;
  icon: any;
  headline: string;
  description: string;
  points: string[];
  image: string;
  fallbackImage: string;
}

const TECH_MODULES: TechModule[] = [
  {
    id: "esp-power",
    name: "eSP Power Unit",
    badge: "Engine Tech",
    icon: Zap,
    headline: "Enhanced Smart Power (eSP) Engine",
    description: "Honda's revolutionary eSP technology maximizes energy efficiency by reducing friction at every moving part inside the 110cc PGM-FI engine.",
    points: [
      "Silent ACG Starter: Starts engine quietly without gear meshing noise.",
      "Programmed Fuel Injection (PGM-FI): 8 onboard sensors optimize air-fuel ratio.",
      "Offset Cylinder & Roller Rocker Arm: Minimizes piston friction for extended engine life.",
      "Tumble Flow Technology: Increases combustion speed for instant throttle response.",
    ],
    image: "/images/dio/esp-engine.jpg",
    fallbackImage: "/inventory/honda-dio-bs6.png",
  },
  {
    id: "digital-console",
    name: "Smart Digital Console",
    badge: "Smart Display",
    icon: Monitor,
    headline: "Full Digital Instrument Cluster",
    description: "State-of-the-art digital speedometer console provides critical ride metrics at a glance, keeping you informed on fuel consumption and trip data.",
    points: [
      "Real-Time Mileage & Average Fuel Economy Display.",
      "Distance-to-Empty (DTE) Indicator: Calculates remaining riding range.",
      "3-Step ECO Indicator: Guides rider to maintain maximum fuel efficiency.",
      "Bluetooth Connectivity Ready & Service Due Reminder.",
    ],
    image: "/images/dio/digital-meter.jpg",
    fallbackImage: "/inventory/honda-dio-bs6.png",
  },
  {
    id: "cbs-braking",
    name: "Equalizer CBS Brakes",
    badge: "Safety Braking",
    icon: Disc,
    headline: "Combi Brake System (CBS) with Equalizer",
    description: "Honda's patented Combi Brake System uses a mechanical equalizer to balance front and rear braking force automatically.",
    points: [
      "Activates both front and rear brakes proportionally when rear brake lever is pulled.",
      "Drastically reduces stopping distance during panic braking.",
      "Prevents rear wheel skidding on wet or slippery road surfaces.",
      "Option for 190mm Front Disc Brake for enhanced stopping power.",
    ],
    image: "/images/dio/cbs-brakes.jpg",
    fallbackImage: "/inventory/honda-dio-bs6.png",
  },
  {
    id: "hsmart-key",
    name: "Honda Smart Key",
    badge: "Keyless Tech",
    icon: KeyRound,
    headline: "H-Smart Keyless Security System",
    description: "Experience the convenience of keyless riding with Honda's intelligent Smart Key system offering 4 powerful smart features.",
    points: [
      "Smart Find (Answer Back): All 4 indicators blink to locate scooter in crowded parking.",
      "Smart Unlock: Unlocks handlebar, seat boot, and fuel lid when key is within 2 meters.",
      "Smart Start: Rotate multi-function knob and press start button keylessly.",
      "Smart Safe: Mapped ECU immobilizer prevents hotwiring and unauthorized starting.",
    ],
    image: "/images/dio/smart-key.jpg",
    fallbackImage: "/inventory/honda-dio-bs6.png",
  },
];

export default function DioTechnologySection() {
  const [activeTechId, setActiveTechId] = useState<string>("esp-power");
  const activeModule = TECH_MODULES.find((m) => m.id === activeTechId) || TECH_MODULES[0];

  return (
    <section id="technology" className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-primary text-xs font-black tracking-widest uppercase mb-3">
            <Cpu className="w-4 h-4" /> Next-Gen Innovations
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold sm:text-4xl font-black text-foreground uppercase tracking-tight">
            Advanced Technology Suite
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
            Discover the smart key system, eSP power engine, digital instrumentation, and CBS safety system powering the Dio 110.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {TECH_MODULES.map((mod) => {
            const Icon = mod.icon;
            const isActive = activeTechId === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveTechId(mod.id)}
                className={`p-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all border flex flex-col items-center justify-center gap-2 text-center ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25 scale-[1.02]"
                    : "bg-gray-50 dark:bg-slate-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{mod.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Module Showcase Card */}
        <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Text & Features List */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="inline-block px-3 py-1 rounded-lg bg-red-100 dark:bg-red-950/60 text-primary text-xs font-black uppercase tracking-wider mb-3">
                  {activeModule.badge}
                </span>
                <h3 className="text-2xl md:text-3xl font-semibold sm:text-3xl font-black text-foreground uppercase tracking-tight">
                  {activeModule.headline}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                  {activeModule.description}
                </p>
              </div>

              {/* Bullet Points */}
              <div className="space-y-3 pt-2">
                {activeModule.points.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-bold leading-relaxed">
                      {pt}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Technical Visual Banner */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800 bg-white dark:bg-[#1C1C20] shadow-md p-4 flex items-center justify-center">
                <ImageWithFallback
                  src={activeModule.image}
                  fallbackSrc={activeModule.fallbackImage}
                  alt={activeModule.headline}
                  className="max-h-full max-w-full object-contain filter drop-shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
