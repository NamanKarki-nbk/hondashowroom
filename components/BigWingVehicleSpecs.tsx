import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import ThreeSixtyViewer from "./ThreeSixtyViewer";

interface VehicleSpecsProps {
  specs: Record<string, { label: string; value: string }[]>;
  vehicleSlug?: string;
  fallbackImageUrl?: string;
  threeSixty?: { localPath: string; totalFrames: number } | null;
}

export default function BigWingVehicleSpecs({ specs, vehicleSlug = "nx-200", fallbackImageUrl, threeSixty }: VehicleSpecsProps) {
  const specKeys = Object.keys(specs);
  const [activeCategory, setActiveCategory] = useState<string>(specKeys[0]);

  if (!specKeys.length) return null;

  return (
    <section id="specs" className="py-24 px-6 bg-[#050505] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-primary-foreground uppercase tracking-tight mb-4">
            Technical <span className="text-primary">Specifications</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: 360 Viewer */}
          <div className="relative h-[400px] md:h-[600px] w-full rounded-3xl bg-[#0A0A0A] overflow-hidden flex items-center justify-center p-4 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] border border-gray-900">
            <ThreeSixtyViewer vehicleSlug={vehicleSlug} fallbackImageUrl={fallbackImageUrl} threeSixty={threeSixty} />
          </div>

          {/* Right: Accordion Specs */}
          <div className="w-full space-y-4">
            {specKeys.map((category) => {
              const isActive = activeCategory === category;
              return (
                <div key={category} className="overflow-hidden rounded-xl border border-gray-800 bg-[#121212]">
                  <button
                    onClick={() => setActiveCategory(activeCategory === category ? "" : category)}
                    className={`w-full flex items-center justify-between p-5 md:p-6 transition-all ${
                      isActive 
                        ? 'bg-red-950/20 text-primary' 
                        : 'bg-[#121212] hover:bg-gray-900 text-gray-300 hover:text-primary-foreground'
                    }`}
                  >
                    <span className="font-bold text-lg md:text-xl uppercase tracking-wider">{category.replace(/_/g, ' ')}</span>
                    <div className={`p-2 rounded-full transition-colors ${
                      isActive ? 'bg-primary/20 text-primary' : 'bg-[#1A1A1A] text-gray-400'
                    }`}>
                      <ChevronDown className={`w-5 h-5 transition-transform ${isActive ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 md:p-6 bg-[#0A0A0A] border-t border-gray-900">
                          <ul className="space-y-4">
                            {specs[category].map((item, idx) => (
                              <li key={idx} className="flex justify-between items-start gap-4 border-b border-gray-800 pb-3 last:border-0 last:pb-0">
                                <span className="text-gray-400 font-medium">{item.label}</span>
                                <span className="text-primary-foreground font-bold text-right">{item.value}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
