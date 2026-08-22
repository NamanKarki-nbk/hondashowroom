"use client";

import React, { useCallback, useState, useEffect, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import VehicleCard from "./VehicleCard";
import { motion, AnimatePresence } from "framer-motion";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  description: string | null;
};

interface CategoryCarouselProps {
  products: Product[];
}

export default function CategoryCarousel({ products }: CategoryCarouselProps) {
  const scooterOrder = ["dio bs6 110", "dio bs6 125"];
  const motorcycleOrder = ["honda shine", "honda sp", "hornet", "nx 200"];

  const getSortIndex = (name: string, orderArray: string[]) => {
    const lowerName = name.toLowerCase();
    const index = orderArray.findIndex(order => lowerName.includes(order));
    return index === -1 ? 999 : index;
  };

  const scooters = products
    .filter((p) => p.category === "SCOOTERS")
    .sort((a, b) => getSortIndex(a.name, scooterOrder) - getSortIndex(b.name, scooterOrder));
    
  const motorcycles = products
    .filter((p) => p.category === "MOTORCYCLES")
    .sort((a, b) => getSortIndex(a.name, motorcycleOrder) - getSortIndex(b.name, motorcycleOrder));
    
  const power = products.filter((p) => p.category === "POWER_PRODUCTS");

  const TABS = useMemo(() => [
    { id: "SCOOTERS", label: "SCOOTERS", data: scooters },
    { id: "MOTORCYCLES", label: "MOTORCYCLES", data: motorcycles },
    { id: "POWER", label: "POWER PRODUCTS", data: power },
  ].filter((tab) => tab.data.length > 0), [products]);

  const [activeTab, setActiveTab] = useState("SCOOTERS");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam && TABS.find(t => t.id === tabParam)) {
        setActiveTab(tabParam);
      } else if (TABS.length > 0 && !TABS.find((t) => t.id === activeTab)) {
        setActiveTab(TABS[0].id);
      }
    }
  }, [TABS, activeTab]);

  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam && TABS.find(t => t.id === tabParam)) {
        setActiveTab(tabParam);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [TABS]);

  const activeData = TABS.find((t) => t.id === activeTab)?.data || [];

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
  });

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi],
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi],
  );

  if (TABS.length === 0) return null;

  return (
    <section className="py-16 md:py-24 lg:py-32 w-full bg-gray-50/50 dark:bg-slate-950 transition-colors duration-300">
      <div className="px-4 sm:px-6 md:px-12 lg:px-16 mx-auto w-full max-w-[1600px] relative overflow-hidden min-h-[500px]">
        <div className="text-left mb-16 px-6 max-w-7xl mx-auto w-full">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter uppercase mb-10">
            Explore Models
          </h2>

          {/* Premium Segmented Control Tabs */}
          <div className="flex justify-start w-full">
            <div className="inline-flex items-center p-1.5 bg-gray-200/50 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-gray-300/50 dark:border-white/10 shadow-inner max-w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-6 py-3 md:px-8 md:py-3.5 text-xs md:text-sm font-bold uppercase tracking-widest rounded-xl transition-colors duration-300 whitespace-nowrap shrink-0 ${isActive ? "text-gray-900 dark:text-gray-900" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute inset-0 bg-white dark:bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(255,255,255,0.2)]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative group max-w-7xl mx-auto">
          <div className="overflow-hidden" ref={emblaRef}>
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="flex touch-pan-y -ml-6 py-4"
              >
                {activeData.map((vehicle, index) => (
                  <motion.div
                    key={vehicle.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] xl:flex-[0_0_25%] min-w-0 pl-6 pb-8"
                  >
                    <VehicleCard
                      title={vehicle.name}
                      priceNpr={vehicle.price}
                      category={
                        vehicle.category === "POWER_PRODUCTS"
                          ? "Power Product"
                          : vehicle.category === "AUTOMOBILES"
                            ? "Automobile"
                            : vehicle.category === "SCOOTERS"
                              ? "Scooter"
                              : "Motorcycle"
                      }
                      slug={vehicle.id}
                      imageUrl={vehicle.imageUrl}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={scrollPrev}
            className="absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-full flex items-center justify-center text-gray-800 dark:text-white shadow-xl hover:scale-110 hover:bg-white dark:hover:bg-slate-700 transition-all z-10 hidden sm:flex opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-full flex items-center justify-center text-gray-800 dark:text-white shadow-xl hover:scale-110 hover:bg-white dark:hover:bg-slate-700 transition-all z-10 hidden sm:flex opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
