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
}

/**
 * A reusable card component for displaying a vehicle in a grid.
 * 
 * Features:
 * - Hover animations (lift effect and image scale).
 * - Displays category badge, vehicle title, starting price, and engine capacity (cc).
 * - Links dynamically to the individual vehicle details page via the `slug`.
 * 
 * @param {VehicleCardProps} props - The properties of the vehicle.
 * @returns {JSX.Element} The rendered vehicle card component.
 */
export default function VehicleCard({ title, priceNpr, cc, slug, category, imageUrl }: VehicleCardProps) {
  return (
    <Link href={`/vehicles/${slug}`} className="block group">
      <div className="bg-[#f3ebdd] border border-gray-200 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 relative group-hover:-translate-y-1">
        
        {/* Top Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-[#c1291A] text-[#f3ebdd] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {category}
          </span>
        </div>

        {/* Image Container */}
        <div className="h-64 relative bg-[#f3ebdd] flex items-center justify-center p-6 overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-t from-gray-100 to-transparent opacity-50"></div>
           {imageUrl ? (
             // eslint-disable-next-line @next/next/no-img-element
             <img src={imageUrl} alt={title} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
           ) : (
             <div className="w-40 h-24 bg-gray-300 rounded-xl rotate-[-10deg] shadow-lg group-hover:scale-110 transition-transform duration-500"></div>
           )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#c1291A] transition-colors line-clamp-1">{title}</h3>
            {cc && <span className="text-xs font-medium text-gray-500 bg-[#e8dfd1] px-2 py-1 rounded-md">{cc} cc</span>}
          </div>
          
          <div className="mt-4 flex items-center justify-between">
             <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Starting at</p>
                <p className="text-lg font-black text-gray-900">
                  Rs. {priceNpr.toLocaleString('en-IN')}
                </p>
             </div>
             <div className="w-10 h-10 rounded-full bg-[#f3ebdd] group-hover:bg-[#c1291A] flex items-center justify-center transition-colors">
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#f3ebdd] transition-colors" />
             </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
