"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export interface AccessoryHotspot {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  accessory: {
    name: string;
    description: string;
    price: string;
    imageUrl: string;
  };
}

interface VehicleAccessoriesHotspotsProps {
  vehicleImageUrl: string;
  hotspots: AccessoryHotspot[];
}

export default function VehicleAccessoriesHotspots({ vehicleImageUrl, hotspots }: VehicleAccessoriesHotspotsProps) {
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);

  const activeHotspot = hotspots.find(h => h.id === activeHotspotId);

  return (
    <section id="accessories" className="py-24 px-6 bg-gray-50 dark:bg-[#111112]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
            Explore Accessories
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Customize your ride with genuine Honda accessories built for style and durability.
          </p>
        </div>

        <div className="relative w-full max-w-4xl mx-auto aspect-[4/3] md:aspect-[16/9] rounded-3xl p-4 md:p-8 flex items-center justify-center">
          {/* Vehicle Image */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={vehicleImageUrl} 
              alt="Vehicle" 
              className="w-[90%] md:w-[80%] h-auto object-contain drop-shadow-2xl"
            />

            {/* Hotspots */}
            <div className="absolute inset-0 w-[90%] md:w-[80%] mx-auto h-full pointer-events-none">
              {hotspots.map((hotspot) => (
                <div 
                  key={hotspot.id}
                  className="absolute z-10 pointer-events-auto"
                  style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, transform: 'translate(-50%, -50%)' }}
                >
                  <button
                    onClick={() => setActiveHotspotId(activeHotspotId === hotspot.id ? null : hotspot.id)}
                    className={`relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-xl border-2 backdrop-blur-sm transition-all ${
                      activeHotspotId === hotspot.id 
                        ? "border-primary scale-110" 
                        : "border-transparent hover:scale-110"
                    }`}
                  >
                    <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${activeHotspotId === hotspot.id ? 'bg-primary' : 'bg-gray-400'}`} />
                    
                    {/* Ping animation when inactive */}
                    {activeHotspotId !== hotspot.id && (
                      <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-40 animate-ping"></span>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Active Accessory Card Overlay */}
          <AnimatePresence>
            {activeHotspot && (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute z-20 bottom-0 md:bottom-auto md:right-0 bg-white dark:bg-[#1A1A1E] rounded-2xl shadow-2xl overflow-hidden w-full md:w-80 border border-gray-100 dark:border-gray-800 pointer-events-auto"
              >
                <div className="relative h-48 bg-gray-100 dark:bg-gray-900 p-4">
                  <button 
                    onClick={() => setActiveHotspotId(null)}
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black text-white p-1.5 rounded-full backdrop-blur-sm transition-colors z-10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={activeHotspot.accessory.imageUrl} 
                    alt={activeHotspot.accessory.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black text-foreground mb-2">{activeHotspot.accessory.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-3">
                    {activeHotspot.accessory.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-primary">{activeHotspot.accessory.price}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
