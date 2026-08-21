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

/**
 * A reusable card component for displaying a vehicle in a grid.
 * 
 * Features:
 * - Hover animations (lift effect and image scale).
 * - Displays category badge, vehicle title, starting price, and engine capacity (cc).
 * - Links dynamically to the individual vehicle details page via the `slug`.
 * - Shows color swatches if available.
 * 
 * @param {VehicleCardProps} props - The properties of the vehicle.
 * @returns {JSX.Element} The rendered vehicle card component.
 */
export default function VehicleCard({ title, priceNpr, cc, slug, category, imageUrl, colors, onQuoteClick, onBookClick }: VehicleCardProps) {
  return (
    <Link href={`/vehicles/${slug}`} className="block group">
      <div className="bg-background border border-gray-200 dark:border-zinc-800 rounded-3xl overflow-hidden hover:shadow-2xl dark:hover:shadow-zinc-900/50 transition-all duration-300 relative group-hover:-translate-y-1">
        
        {/* Top Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {category}
          </span>
        </div>

        {/* Image Container */}
        <div className="h-64 relative bg-background flex items-center justify-center p-6 overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-t from-gray-100 dark:from-zinc-900/50 to-transparent opacity-50"></div>
           {imageUrl ? (
             // eslint-disable-next-line @next/next/no-img-element
             <img 
               src={imageUrl} 
               alt={title} 
               onError={(e) => { e.currentTarget.src = category.toLowerCase().includes('scooter') ? '/images/scooter-placeholder.jpg' : '/images/bike-placeholder.jpg'; }}
               className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
             />
           ) : (
             <div className="w-40 h-24 bg-gray-300 rounded-xl rotate-[-10deg] shadow-lg group-hover:scale-110 transition-transform duration-500"></div>
           )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl md:text-2xl font-semibold font-bold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary transition-colors line-clamp-1">{title}</h3>
            {cc && <span className="text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded-md border border-gray-200 dark:border-zinc-700">{cc} cc</span>}
          </div>
          
          {/* Color Picker / Swatches */}
          {colors && colors.length > 0 && (
            <div className="flex items-center gap-1.5 mb-4">
              {colors.slice(0, 4).map((color, idx) => {
                // Determine a hex color based on name keywords
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
                    className="w-4 h-4 rounded-full border border-gray-300 shadow-sm transition-transform hover:scale-125 cursor-pointer"
                    style={{ backgroundColor: hex }}
                  />
                );
              })}
              {colors.length > 4 && <span className="text-[10px] text-gray-500 font-bold">+{colors.length - 4}</span>}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
             <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Starting at</p>
                <p className="text-lg font-black text-gray-900 dark:text-white">
                  Rs. {priceNpr.toLocaleString('en-IN')}
                </p>
             </div>
             <div className="w-10 h-10 rounded-full bg-background group-hover:bg-primary flex items-center justify-center transition-colors">
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-foreground transition-colors" />
             </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuoteClick && onQuoteClick(); }}
              className="flex-1 bg-white border border-gray-300 hover:border-[#B83227] text-gray-800 hover:text-[#B83227] py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors"
            >
              Get Quote
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onBookClick && onBookClick(); }}
              className="flex-1 bg-[#B83227] hover:bg-primary-hover text-white py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors shadow-sm"
            >
              Pre-Book
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
