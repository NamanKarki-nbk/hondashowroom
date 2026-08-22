"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface VehicleCardProps {
  title: string;
  priceNpr: number;
  cc?: string;
  slug: string;
  category: string;
  imageUrl?: string;
  colors?: string[];
  onQuoteClick?: () => void;
  onBookClick?: () => void;
}

export default function VehicleCard({ title, priceNpr, cc, slug, category, imageUrl, colors, onQuoteClick, onBookClick }: VehicleCardProps) {
  return (
    <Link href={`/vehicles/${slug}`} className="block group h-full">
      <div className="flex flex-col h-full bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-gray-200/60 dark:border-white/10 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.02)] dark:hover:shadow-[0_20px_40px_rgba(255,255,255,0.05)] transition-all duration-500 relative group-hover:-translate-y-2">
        
        {/* Top Badge */}
        <div className="absolute top-5 left-5 z-10">
          <span className="bg-white/90 dark:bg-black/50 backdrop-blur-md text-primary dark:text-primary-foreground border border-gray-100 dark:border-white/10 text-[10px] font-bold px-3 py-1.5 rounded-full tracking-widest shadow-sm">
            {category}
          </span>
        </div>

        {/* Image Container with Soft Radial Gradient */}
        <div className="relative h-48 md:h-56 w-full flex items-center justify-center p-4 overflow-hidden bg-gradient-to-b from-gray-50/50 to-transparent dark:from-white/[0.02] dark:to-transparent">
           {/* Glow Effect behind image */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
           
           {imageUrl ? (
             // eslint-disable-next-line @next/next/no-img-element
             <img 
               src={imageUrl.replace('/product-catalog/', '/inventory/')} 
               alt={title} 
               onError={(e) => { e.currentTarget.src = category.toLowerCase().includes('scooter') ? '/images/scooter-placeholder.jpg' : '/images/bike-placeholder.jpg'; }}
               className="w-full h-full object-contain relative z-10 group-hover:scale-110 group-hover:rotate-1 transition-all duration-700 drop-shadow-xl" 
             />
           ) : (
             <div className="w-full h-full max-w-[160px] max-h-[100px] bg-gray-200 dark:bg-gray-800 rounded-2xl rotate-[-5deg] shadow-lg group-hover:scale-110 group-hover:rotate-0 transition-all duration-500 relative z-10"></div>
           )}
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 flex flex-col flex-1 bg-white/40 dark:bg-black/20 border-t border-gray-100/50 dark:border-white/5">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors tracking-tight line-clamp-1">
              {title}
            </h3>
            {cc && (
              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-md border border-gray-200/50 dark:border-white/5 uppercase tracking-widest shrink-0 ml-3">
                {cc} cc
              </span>
            )}
          </div>
          
          {/* Color Picker / Swatches */}
          {colors && colors.length > 0 && (
            <div className="flex items-center gap-2 mb-6">
              {colors.slice(0, 4).map((color, idx) => {
                let hex = "#333333";
                const lower = color.toLowerCase();
                if (lower.includes("red")) hex = "#c1291A";
                else if (lower.includes("black")) hex = "#111111";
                else if (lower.includes("white")) hex = "#F5F5F5";
                else if (lower.includes("blue")) hex = "#1A365D";
                else if (lower.includes("grey") || lower.includes("gray") || lower.includes("silver")) hex = "#A0A0A0";
                else if (lower.includes("yellow")) hex = "#EAB308";
                else if (lower.includes("green")) hex = "#22C55E";

                return (
                  <div 
                    key={idx} 
                    title={color}
                    className="w-4 h-4 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm transition-transform hover:scale-125 cursor-pointer ring-2 ring-transparent hover:ring-gray-300 dark:hover:ring-gray-600"
                    style={{ backgroundColor: hex }}
                  />
                );
              })}
              {colors.length > 4 && <span className="text-[10px] text-gray-400 font-bold ml-1">+{colors.length - 4}</span>}
            </div>
          )}

          <div className="mt-auto pt-2">
             <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-widest mb-1">Starting at</p>
             <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
               Rs. {priceNpr.toLocaleString('en-IN')}
             </p>
          </div>

          <div className="mt-6 flex gap-3">
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuoteClick && onQuoteClick(); }}
              className="group/btn flex-1 flex items-center justify-center gap-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300"
            >
              Get Quote
              <ArrowRight className="w-3.5 h-3.5 opacity-50 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all duration-300" />
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onBookClick && onBookClick(); }}
              className="group/btn flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_4px_14px_0_rgba(239,68,68,0.39)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.23)] hover:-translate-y-0.5"
            >
              Pre-Book
              <ArrowRight className="w-3.5 h-3.5 opacity-80 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all duration-300" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
