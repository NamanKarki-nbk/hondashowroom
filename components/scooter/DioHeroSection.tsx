"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, CalendarCheck, ShieldCheck, Zap, Gauge, Flame, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

interface DioHeroSectionProps {
  currentColorImage: string;
  currentColorName: string;
  basePrice?: string;
  stdPrice?: string;
  dlxPrice?: string;
  vehicle?: any;
  onBookNow: () => void;
  onTestRide: () => void;
}

export default function DioHeroSection({
  currentColorImage,
  currentColorName,
  basePrice = "NPR 2,64,900",
  stdPrice,
  dlxPrice,
  vehicle,
  onBookNow,
  onTestRide,
}: DioHeroSectionProps) {
  // Extract specs from vehicle or use defaults for Dio 110
  const titleParts = vehicle?.name ? vehicle.name.split(" ") : ["HONDA", "DIO", "110"];
  const titleMain = titleParts.slice(0, titleParts.length - 1).join(" ") || "HONDA DIO";
  const titleSub = titleParts[titleParts.length - 1] || "110";
  
  const tagline = vehicle?.tagline || "\"Keep Dioing It\"";
  const description = vehicle?.description || "Experience the bold, aggressive posture of the new Honda Dio 110. Powered by revolutionary eSP technology, Honda Smart Key (H-Smart), full digital instrument cluster, and external fuel fill for maximum rider convenience.";
  
  const getSpecValue = (category: string, label: string, defaultVal: string) => {
    if (!vehicle?.specs || !vehicle.specs[category]) return defaultVal;
    const spec = vehicle.specs[category].find((s: any) => s.label.toLowerCase().includes(label.toLowerCase()));
    return spec ? spec.value : defaultVal;
  };

  const engineCc = getSpecValue("Engine_Performance", "Displacement", "109.51 cc");
  const maxPower = getSpecValue("Engine_Performance", "Maximum Power", "7.76 PS");
  const maxTorque = getSpecValue("Engine_Performance", "Max. Torque", "9.03 Nm");
  const mileage = getSpecValue("Engine_Performance", "Mileage", "55 kmpl"); // Mocked default

  return (
    <section id="overview" className="relative w-full min-h-screen flex flex-col justify-center pt-8 pb-12 px-4 sm:px-6 lg:px-12 bg-background transition-colors duration-300 overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 right-0 w-full lg:w-3/5 h-full bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-bl-[100px] -z-10 pointer-events-none" />

      <div className="max-w-[1600px] mx-auto w-full">
        {/* Breadcrumb Navigation - Sits directly 16px below subheader */}
        <nav className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-8 font-semibold">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/shop" className="hover:text-primary transition-colors uppercase">Scooters</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-bold">{vehicle?.name || "Honda Dio 110 BS6"}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left Column: Headlines, Specs & Price */}
          <div className="lg:col-span-6 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Category Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-primary text-xs font-black tracking-widest uppercase mb-4 border border-red-200 dark:border-red-900/50 shadow-sm">
                <ShieldCheck className="w-4 h-4" /> BS6 OBD-2 Compliant • PGM-FI eSP
              </div>

              {/* Main Display Headline */}
              <h1 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold md:text-4xl font-bold md:text-6xl font-bold tracking-tight sm:text-7xl md:text-[5.5rem] font-black tracking-tight text-foreground uppercase leading-none mb-2">
                {titleMain} <span className="text-primary">{titleSub}</span>
              </h1>
              <p className="text-2xl md:text-3xl font-semibold sm:text-4xl font-bold italic text-primary mt-4 mb-6 tracking-wide">
                {tagline}
              </p>

              {/* Description */}
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-xl">
                {description}
              </p>
            </motion.div>

            {/* Price Cards (Both Variants) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="flex flex-col gap-3 max-w-xl"
            >
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-lg flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-gray-500 uppercase font-extrabold tracking-wider block mb-1">
                    Standard Variant (STD)
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl md:text-3xl font-semibold sm:text-3xl font-black text-primary">
                      {stdPrice || basePrice}*
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const el = document.getElementById("emi-calculator");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:text-primary bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
                >
                  Calculate EMI →
                </button>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-lg flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-gray-500 uppercase font-extrabold tracking-wider block mb-1">
                    {titleSub === "125" ? "Smart Variant (H-SMART)" : "Deluxe Variant (DLX)"}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl md:text-3xl font-semibold sm:text-3xl font-black text-primary">
                      {dlxPrice || "NPR 2,84,900"}*
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-500 block mt-1 ml-2">
                *Taxes & Registration extra. Flexible EMI options available. Color selected: {currentColorName}.
              </span>
            </motion.div>

            {/* Quick Specs Grid */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-center shadow-sm">
                <Gauge className="w-5 h-5 mx-auto mb-1 text-primary" />
                <span className="block text-xs font-bold text-gray-500">Engine</span>
                <span className="text-sm font-black text-foreground">{engineCc}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-center shadow-sm">
                <Flame className="w-5 h-5 mx-auto mb-1 text-primary" />
                <span className="block text-xs font-bold text-gray-500">Max Power</span>
                <span className="text-sm font-black text-foreground">{maxPower}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-center shadow-sm">
                <Zap className="w-5 h-5 mx-auto mb-1 text-primary" />
                <span className="block text-xs font-bold text-gray-500">Max Torque</span>
                <span className="text-sm font-black text-foreground">{maxTorque}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-center shadow-sm">
                <ShieldCheck className="w-5 h-5 mx-auto mb-1 text-primary" />
                <span className="block text-xs font-bold text-gray-500">Mileage</span>
                <span className="text-sm font-black text-foreground">{mileage}</span>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="flex flex-col sm:flex-row gap-3 pt-2"
            >
              <button
                onClick={onBookNow}
                className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground font-black px-6 py-4 rounded-xl text-center uppercase tracking-wider text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2"
              >
                <CalendarCheck className="w-5 h-5" /> Book Online Now
              </button>
              <button
                onClick={onTestRide}
                className="flex-1 bg-white dark:bg-[#18181B] hover:bg-gray-100 dark:hover:bg-gray-800 text-foreground font-bold px-6 py-4 rounded-xl text-center uppercase tracking-wider text-sm border border-gray-300 dark:border-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                Request Test Ride
              </button>
            </motion.div>
          </div>

          {/* Right Column: Massive Unboxed 3D Scooter Showcase */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative w-full flex flex-col items-center justify-center py-4"
            >
              {/* Radial Backdrop Glow */}
              <div className="absolute inset-0 bg-radial from-red-500/15 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

              {/* Massive Unboxed Scooter PNG Image */}
              <div className="relative w-full h-[360px] sm:h-[460px] lg:h-[520px] flex items-center justify-center">
                <ImageWithFallback
                  src={currentColorImage || "/inventory/honda-dio-bs6-110.png"}
                  fallbackSrc="/inventory/honda-dio-bs6-110.png"
                  alt={vehicle?.name || `Honda Dio BS6 - ${currentColorName}`}
                  className="max-h-[440px] lg:max-h-[500px] w-auto object-contain z-10 filter drop-shadow-[0_30px_60px_rgba(0,0,0,0.35)] hover:scale-105 transition-transform duration-500"
                  priority
                />

                {/* Ground Wheel Shadow */}
                <div className="absolute bottom-2 w-4/5 h-8 bg-black/35 dark:bg-black/80 blur-2xl rounded-full pointer-events-none" />
              </div>

              {/* Segment-First Tech Badge Bar */}
              <div className="mt-2 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur border border-gray-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-black text-xs uppercase shadow-sm">
                    eSP
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase text-foreground block">
                      Honda Smart Key (H-Smart)
                    </span>
                    <span className="text-xs text-gray-500 block">
                      Smart Find • Smart Unlock • Smart Start • Smart Safe
                    </span>
                  </div>
                </div>
                <span className="hidden sm:inline-flex px-3 py-1 rounded-lg bg-red-50 dark:bg-red-950/40 text-primary text-xs font-black uppercase border border-red-200 dark:border-red-900/40">
                  <Sparkles className="w-3.5 h-3.5 mr-1" /> Seg-First
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
