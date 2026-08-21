"use client";

import React from "react";
import { Armchair, Sparkles, Navigation, Package, Layers, ShieldCheck } from "lucide-react";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

export interface DesignCard {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: any;
  image: string;
  fallbackImage: string;
}

const DESIGN_COMFORT_ITEMS: DesignCard[] = [
  {
    id: "floorboard",
    title: "Extended Floorboard",
    category: "Rider Ergonomics",
    description: "Generously sized spacious floorboard offers comfortable legroom and ample space for carrying day-to-day shopping bags and luggage.",
    icon: Layers,
    image: "/images/dio/floorboard.jpg",
    fallbackImage: "/inventory/honda-dio-bs6.png",
  },
  {
    id: "seat",
    title: "Contoured Dual-Tone Seat",
    category: "Plush Comfort",
    description: "Ergonomically sculpted split seat provides optimal lumbar support for the rider and relaxed seating posture for the pillion passenger.",
    icon: Armchair,
    image: "/images/dio/seat.jpg",
    fallbackImage: "/inventory/honda-dio-bs6.png",
  },
  {
    id: "graphics",
    title: "Sporty Body Decals",
    category: "Aggressive Stance",
    description: "Eye-catching dual-tone body graphics, sharp front apron, and bold tail light design express an athletic and youth-oriented personality.",
    icon: Sparkles,
    image: "/images/dio/graphics.jpg",
    fallbackImage: "/inventory/honda-dio-bs6.png",
  },
  {
    id: "telescopic-suspension",
    title: "Telescopic Front Suspension",
    category: "Smooth Handling",
    description: "Telescopic front hydraulic fork combined with a larger 12-inch front wheel delivers supreme stability and effortless bump absorption.",
    icon: Navigation,
    image: "/images/dio/telescopic-susp.jpg",
    fallbackImage: "/inventory/honda-dio-bs6.png",
  },
  {
    id: "underseat-storage",
    title: "18L Underseat Boot Space",
    category: "Utility & Cargo",
    description: "Deep 18-litre underseat storage unit easily accommodates a full-size helmet, documents, and personal belongings safely.",
    icon: Package,
    image: "/images/dio/storage.jpg",
    fallbackImage: "/inventory/honda-dio-bs6.png",
  },
  {
    id: "pillion-comfort",
    title: "Retractable Pillion Footpegs",
    category: "Pillion Safety",
    description: "Neatly integrated aluminum footpegs open smoothly when needed and fold flush into the bodywork for a clean, aerodynamic look.",
    icon: ShieldCheck,
    image: "/images/dio/footpegs.jpg",
    fallbackImage: "/inventory/honda-dio-bs6.png",
  },
];

export default function DioDesignComfort() {
  return (
    <section id="design-comfort" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-primary text-xs font-black tracking-widest uppercase mb-3">
            <Armchair className="w-4 h-4" /> Crafted For Ride Quality
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold sm:text-4xl font-black text-foreground uppercase tracking-tight">
            Design & Comfort Features
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
            Engineered for daily urban commuting with superior rider ergonomics, premium finishes, and generous utility.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {DESIGN_COMFORT_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black uppercase tracking-wider text-primary bg-red-50 dark:bg-red-950/40 px-3 py-1 rounded-lg">
                      {item.category}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#1C1C20] text-primary flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl md:text-2xl font-semibold font-black text-foreground uppercase tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Card Visual Banner */}
                <div className="relative h-44 w-full bg-gray-100 dark:bg-slate-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800">
                  <ImageWithFallback
                    src={item.image}
                    fallbackSrc={item.fallbackImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
