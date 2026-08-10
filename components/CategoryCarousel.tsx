"use client";

import React, { useCallback, useState, useEffect, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import VehicleCard from "./VehicleCard";
import { motion } from "framer-motion";

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
  // Group products by category
  const scooters = products.filter((p) => p.category === "SCOOTERS");
  const motorcycles = products.filter((p) => p.category === "MOTORCYCLES");
  const power = products.filter((p) => p.category === "POWER_PRODUCTS");

  const TABS = useMemo(() => [
    { id: "SCOOTERS", label: "SCOOTERS", data: scooters },
    { id: "MOTORCYCLES", label: "MOTORCYCLES", data: motorcycles },
    { id: "POWER", label: "POWER PRODUCTS", data: power },
  ].filter((tab) => tab.data.length > 0), [products]); // eslint-disable-line react-hooks/exhaustive-deps

  const [activeTab, setActiveTab] = useState("SCOOTERS");

  useEffect(() => {
    // Check if there's a tab parameter in the URL
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

  // Listen for hash/query changes without reloading
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
    <div className="py-24 px-6 bg-[#f3ebdd] relative overflow-hidden min-h-[500px]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight uppercase mb-8">
            Choose Your Product
          </h2>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-4 border-b border-gray-200 pb-4">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-lg font-bold px-4 py-2 transition-colors relative ${activeTab === tab.id ? "text-[#c1291A]" : "text-gray-500 hover:text-gray-900"}`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-0 bottom-[-17px] w-full h-1 bg-[#c1291A]"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Carousel — key forces full remount when tab changes so Embla picks up new slides */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef} key={activeTab}>
            <div className="flex touch-pan-y -ml-6 py-4">
              {activeData.map((vehicle) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] min-w-0 pl-6"
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
            </div>
          </div>

          <button
            onClick={scrollPrev}
            className="absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#f3ebdd] hover:bg-[#e8dfd1] border border-gray-200 rounded-full flex items-center justify-center text-gray-800 shadow-xl transition-colors z-10 hidden sm:flex"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#f3ebdd] hover:bg-[#e8dfd1] border border-gray-200 rounded-full flex items-center justify-center text-gray-800 shadow-xl transition-colors z-10 hidden sm:flex"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
