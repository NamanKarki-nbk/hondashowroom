"use client";

import React, { useState } from "react";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

export interface VariantData {
  id: string;
  name: string;
  badge: string;
  price: string;
  image: string;
  startingMethod: string;
  keyType: string;
  bluetooth: string;
  colors: string[]; // hex codes
}

const VARIANTS: VariantData[] = [
  {
    id: "std",
    name: "Dio 125 STD",
    badge: "Base Variant",
    price: "₹88,509",
    image: "/inventory/honda-dio-125.png",
    startingMethod: "Self/Kick",
    keyType: "Standard Key",
    bluetooth: "No",
    colors: ["#C1291A", "#2563EB", "#4A4E53", "#94A3B8", "#EAB308", "#111827"],
  },
  {
    id: "hsmart",
    name: "Dio 125 H-SMART",
    badge: "Top Spec",
    price: "₹93,459",
    image: "/inventory/honda-dio-125.png",
    startingMethod: "Self",
    keyType: "Remote (Smart) Key",
    bluetooth: "Yes",
    colors: ["#C1291A", "#2563EB", "#4A4E53", "#94A3B8", "#EAB308", "#111827"],
  },
];

interface Dio125VariantComparisonProps {
  stdPrice?: string;
  hSmartPrice?: string;
  onSelectVariant?: (variantId: string) => void;
  onBookVariant?: (variantName: string) => void;
}

export default function Dio125VariantComparison({ 
  stdPrice = "NPR 3,11,900",
  hSmartPrice = "NPR 3,31,900",
  onSelectVariant, 
  onBookVariant 
}: Dio125VariantComparisonProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>("h-smart");

  const dynamicVariants = VARIANTS.map(v => {
    if (v.id === "std") return { ...v, price: stdPrice };
    if (v.id === "h-smart") return { ...v, price: hSmartPrice };
    return v;
  });

  return (
    <section id="variants" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-primary text-xs font-black tracking-widest uppercase mb-3">
            <Sparkles className="w-4 h-4" /> Compare Model Trims
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold sm:text-4xl font-black text-foreground uppercase tracking-tight">
            Choose Your Bold Look
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
            Compare key differences between the STD and H-SMART variants to choose the ideal setup for your ride.
          </p>
        </div>

        {/* Variant Summary Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {dynamicVariants.map((variant) => {
            const isSelected = selectedVariantId === variant.id;
            return (
              <div
                key={variant.id}
                onClick={() => {
                  setSelectedVariantId(variant.id);
                  if (onSelectVariant) onSelectVariant(variant.id);
                }}
                className={`cursor-pointer p-6 sm:p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? "bg-red-50/40 dark:bg-red-950/20 border-primary shadow-xl scale-[1.01]"
                    : "bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-800 hover:border-gray-400 dark:hover:border-gray-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                      isSelected ? "bg-primary text-primary-foreground" : "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                    }`}>
                      {variant.badge}
                    </span>
                    {isSelected && (
                      <span className="text-xs font-extrabold text-primary flex items-center gap-1 uppercase">
                        <Check className="w-4 h-4" /> Selected
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl md:text-3xl font-semibold font-black text-foreground uppercase tracking-tight">
                    {variant.name}
                  </h3>
                  <div className="text-2xl md:text-3xl font-semibold font-black text-primary mt-1 mb-4">
                    {variant.price}
                    <span className="text-xs font-normal text-gray-500 block">Ex-Showroom Price</span>
                  </div>

                  {/* Preview Image */}
                  <div className="relative h-48 w-full flex items-center justify-center my-4 bg-white/60 dark:bg-[#1C1C20]/60 rounded-2xl p-2 border border-gray-200/60 dark:border-slate-800/60">
                    <ImageWithFallback
                      src={variant.image}
                      fallbackSrc="/inventory/honda-dio-125.png"
                      alt={variant.name}
                      className="max-h-40 w-auto object-contain drop-shadow-md"
                    />
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onBookVariant) onBookVariant(variant.name);
                  }}
                  className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 mt-4 ${
                    isSelected
                      ? "bg-primary hover:bg-primary-hover text-primary-foreground shadow-md"
                      : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-foreground"
                  }`}
                >
                  Book {variant.name} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* High-Fidelity Comparison Table */}
        <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 bg-gray-100 dark:bg-[#18181B] border-b border-gray-200 dark:border-slate-800 grid grid-cols-12 items-center text-xs sm:text-sm font-black uppercase tracking-wider">
            <div className="col-span-4 text-gray-500">Specification</div>
            <div className="col-span-4 text-foreground text-center">STD</div>
            <div className="col-span-4 text-primary text-center">H-SMART</div>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-800 text-xs sm:text-sm">
            {/* Price Row */}
            <div className="grid grid-cols-12 p-4 sm:p-5 items-center hover:bg-white dark:hover:bg-[#1A1A1E] transition-colors">
              <div className="col-span-4 font-bold text-gray-600 dark:text-gray-400">Ex. Showroom Price (NPR)</div>
              <div className="col-span-4 font-black text-center text-foreground">{stdPrice}</div>
              <div className="col-span-4 font-black text-center text-primary">{hSmartPrice}</div>
            </div>

            {/* Starting Method */}
            <div className="grid grid-cols-12 p-4 sm:p-5 items-center hover:bg-white dark:hover:bg-[#1A1A1E] transition-colors">
              <div className="col-span-4 font-bold text-gray-600 dark:text-gray-400">Starting Method:</div>
              <div className="col-span-4 text-center text-gray-700 dark:text-gray-300 font-semibold">Self/Kick</div>
              <div className="col-span-4 text-center font-bold text-primary">Self</div>
            </div>

            {/* Key Type */}
            <div className="grid grid-cols-12 p-4 sm:p-5 items-center hover:bg-white dark:hover:bg-[#1A1A1E] transition-colors">
              <div className="col-span-4 font-bold text-gray-600 dark:text-gray-400">Key Type:</div>
              <div className="col-span-4 text-center text-gray-700 dark:text-gray-300 font-semibold">Standard Key</div>
              <div className="col-span-4 text-center font-bold text-primary">Remote (Smart) Key</div>
            </div>

            {/* Bluetooth & Navigation */}
            <div className="grid grid-cols-12 p-4 sm:p-5 items-center hover:bg-white dark:hover:bg-[#1A1A1E] transition-colors">
              <div className="col-span-4 font-bold text-gray-600 dark:text-gray-400">Bluetooth & Navigation:</div>
              <div className="col-span-4 text-center text-gray-700 dark:text-gray-300 font-semibold">No</div>
              <div className="col-span-4 text-center font-bold text-primary">Yes</div>
            </div>

            {/* Color Swatch Dots */}
            <div className="grid grid-cols-12 p-4 sm:p-5 items-center hover:bg-white dark:hover:bg-[#1A1A1E] transition-colors">
              <div className="col-span-4 font-bold text-gray-600 dark:text-gray-400">Colors</div>
              <div className="col-span-4 flex justify-center items-center gap-1.5">
                {VARIANTS[0].colors.map((hex, idx) => (
                  <span key={idx} className="w-4 h-4 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: hex }} />
                ))}
              </div>
              <div className="col-span-4 flex justify-center items-center gap-1.5">
                {VARIANTS[1].colors.map((hex, idx) => (
                  <span key={idx} className="w-4 h-4 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: hex }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
