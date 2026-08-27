"use client";

import React, { useState } from "react";
import { MapPin, Phone, Clock, Mail, Navigation, RefreshCcw } from "lucide-react";
import MapWrapper from "@/components/MapWrapper";
import type { LocationData } from "@/components/InteractiveMap";

export default function LocationsClient({ initialLocations }: { initialLocations: LocationData[] }) {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);

  return (
    <main className="min-h-screen bg-background dark:bg-slate-950 py-24 text-gray-900 dark:text-primary-foreground transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#CC0000]/10 text-[#CC0000] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(184,50,39,0.3)]">
            <MapPin className="w-8 h-8" />
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold md:text-4xl font-bold md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4">
            Our <span className="text-[#CC0000]">Locations</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find an authorized Society Enterprises Honda Showroom or Service Center near you.
          </p>
        </div>

        <div className="flex justify-center mb-10">
           <button 
             onClick={() => setSelectedLocation(null)}
             className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-900 dark:text-white rounded-full font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95"
           >
             <RefreshCcw className="w-5 h-5" /> View All Nepal / Reset View
           </button>
        </div>

        <div className="flex flex-col-reverse lg:grid lg:grid-cols-3 gap-8">
          {/* Location Cards Area */}
          <div className="lg:col-span-1 flex lg:flex-col gap-6 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 snap-x snap-mandatory hide-scrollbar">
            {initialLocations.map((loc, idx) => {
              const isSelected = selectedLocation?.name === loc.name;
              return (
                <div 
                  key={idx} 
                  onClick={() => setSelectedLocation(loc)}
                  className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer min-w-[85vw] sm:min-w-[400px] lg:min-w-0 snap-center flex-shrink-0 flex flex-col ${
                    isSelected
                      ? "bg-[#CC0000] border-[#CC0000] text-white shadow-xl shadow-[#B83227]/30 transform lg:-translate-y-2 scale-[1.02]" 
                      : loc.isMain 
                        ? "bg-white dark:bg-slate-900 border-[#CC0000]/50 hover:border-[#CC0000] shadow-lg hover:shadow-xl transform hover:-translate-y-1" 
                        : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 hover:shadow-xl dark:hover:border-slate-700 transform hover:-translate-y-1"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className={`text-xl md:text-2xl font-bold uppercase tracking-tight ${!isSelected && !loc.isMain && "text-gray-900 dark:text-white"}`}>{loc.name}</h3>
                      <p className={`text-sm font-semibold uppercase tracking-wider mt-1 ${isSelected ? "text-red-200" : loc.isMain ? "text-[#CC0000]" : "text-[#CC0000]"}`}>{loc.type}</p>
                    </div>
                    {loc.isMain && <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${isSelected ? "bg-white/20 text-white" : "bg-red-100 dark:bg-red-900/30 text-[#CC0000]"}`}>HQ</span>}
                  </div>
                  
                  <div className="space-y-4 mb-8 flex-grow">
                    <div className={`flex items-start gap-3 ${!isSelected && "text-gray-600 dark:text-gray-400"}`}>
                      <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span>{loc.address}</span>
                    </div>
                    <div className={`flex items-center gap-3 ${!isSelected && "text-gray-600 dark:text-gray-400"}`}>
                      <Phone className="w-5 h-5 flex-shrink-0" />
                      <span>{loc.phone}</span>
                    </div>
                    <div className={`flex items-center gap-3 ${!isSelected && "text-gray-600 dark:text-gray-400"}`}>
                      <Mail className="w-5 h-5 flex-shrink-0" />
                      <span>{loc.email}</span>
                    </div>
                    <div className={`flex items-center gap-3 ${!isSelected && "text-gray-600 dark:text-gray-400"}`}>
                      <Clock className="w-5 h-5 flex-shrink-0" />
                      <span>{loc.hours}</span>
                    </div>
                  </div>

                  <a 
                    href={loc.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`w-full py-3 mt-auto rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
                      isSelected 
                        ? "bg-white text-[#CC0000] hover:bg-gray-100" 
                        : "bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    <Navigation className="w-4 h-4" /> Get Directions
                  </a>
                </div>
              );
            })}
          </div>

          {/* Map Area */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-2 overflow-hidden shadow-2xl h-[450px] lg:h-[700px] min-h-[500px] flex">
             <MapWrapper 
               locations={initialLocations} 
               selectedLocation={selectedLocation} 
               onSelectLocation={setSelectedLocation} 
             />
          </div>
        </div>

      </div>
    </main>
  );
}
