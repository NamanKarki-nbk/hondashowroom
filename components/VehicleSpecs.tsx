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

export default function VehicleSpecs({ specs, vehicleSlug = "dio-125", fallbackImageUrl, threeSixty }: VehicleSpecsProps) {
  const specKeys = Object.keys(specs);
  const [activeSpecTab, setActiveSpecTab] = useState(specKeys[0]);

  if (!specKeys.length) return null;

  return (
    <section id="specs" className="py-24 px-6 bg-background  transition-colors duration-300 min-h-screen flex items-center">
      <div className="max-w-[1600px] w-full mx-auto">
        <div className="text-center mb-12 xl:mb-20">
          <h2 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold md:text-4xl font-bold md:text-5xl xl:text-6xl font-extrabold text-gray-900 dark:text-primary-foreground">Get to know your ride</h2>
        </div>

        {/* Top Controls Area */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 xl:mb-24 gap-6 px-4 lg:px-12">
          {/* Pill Tabs */}
          <div className="bg-background dark:bg-[#111112] p-2 rounded-full flex overflow-x-auto hide-scrollbar border border-gray-100 dark:border-gray-800 w-full lg:w-auto">
            {specKeys.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveSpecTab(tab)}
                className={`px-8 xl:px-10 py-3 xl:py-4 rounded-full text-base xl:text-lg font-bold whitespace-nowrap transition-all duration-300 ${
                  activeSpecTab === tab 
                    ? "bg-background  text-primary shadow-sm" 
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-primary-foreground hover:bg-background/50 dark:hover:bg-gray-800/50"
                }`}
              >
                {tab.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center px-4 lg:px-12">
          <div className="w-full relative h-[400px] lg:h-full min-h-[400px]">
          <ThreeSixtyViewer vehicleSlug={vehicleSlug} fallbackImageUrl={fallbackImageUrl} threeSixty={threeSixty} />
        </div>

          {/* Right: Specs List */}
          <div className="w-full">
             <div className="pr-6 max-h-[500px] xl:max-h-[600px] overflow-y-auto custom-scrollbar relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSpecTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6 xl:space-y-8"
                  >
                    {specs[activeSpecTab]?.map((spec, idx) => (
                       <div key={idx} className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-4 xl:pb-6">
                          <span className="text-gray-500 dark:text-gray-400 font-medium text-lg xl:text-2xl">{spec.label}:</span>
                          <span className="text-gray-800 dark:text-gray-200 font-bold text-lg xl:text-2xl">{spec.value}</span>
                       </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
