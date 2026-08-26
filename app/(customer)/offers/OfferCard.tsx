"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Gift, ChevronRight, ChevronUp } from "lucide-react";

interface Offer {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  badgeText: string | null;
  createdAt: Date | string;
}

export default function OfferCard({ offer }: { offer: Offer }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-800">
        {offer.imageUrl ? (
          <Image 
            src={offer.imageUrl} 
            alt={offer.title} 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Gift className="w-12 h-12 text-gray-300" />
          </div>
        )}
        {offer.badgeText && (
          <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1 tracking-wider uppercase shadow-md">
            {offer.badgeText}
          </div>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-[17px] font-bold text-gray-900 dark:text-white mb-2 leading-snug">
          {offer.title}
        </h3>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-5 font-medium flex items-center gap-1.5">
          {offer.createdAt 
            ? new Date(offer.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
            : ''}
        </div>

        {offer.description && (
          <p className={`text-[15px] text-gray-600 dark:text-gray-400 mb-6 leading-relaxed ${expanded ? '' : 'line-clamp-3'}`}>
            {offer.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm font-bold text-[#1a56db] dark:text-[#3f83f8] hover:underline flex items-center gap-0.5 transition-colors"
          >
            {expanded ? (
              <>Show Less <ChevronUp className="w-4 h-4" /></>
            ) : (
              <>Read More <ChevronRight className="w-4 h-4" /></>
            )}
          </button>
          
          <a
            href="#apply-form"
            className="text-[11px] font-bold bg-primary/10 text-primary hover:bg-primary hover:text-white px-3 py-1.5 rounded-full transition-colors flex items-center"
          >
            Apply Now
          </a>
        </div>
      </div>
    </div>
  );
}
