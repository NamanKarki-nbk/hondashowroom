"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

interface Offer {
  id: string;
  title: string;
  imageUrl: string | null;
}

export default function OfferPopupClient({ offer }: { offer: Offer }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the user has already seen this specific offer popup in this session
    const hasSeen = sessionStorage.getItem(`seen_offer_${offer.id}`);
    
    if (!hasSeen) {
      // Delay slightly for better UX
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [offer.id]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem(`seen_offer_${offer.id}`, "true");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-[500px] bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <button 
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <Link href="/offers" onClick={handleClose} className="block w-full">
          {offer.imageUrl ? (
            <div className="relative w-full h-[70vh] max-h-[600px] bg-gray-100 dark:bg-gray-800">
              <Image 
                src={offer.imageUrl} 
                alt={offer.title} 
                fill 
                sizes="(max-width: 640px) 100vw, 500px"
                className="object-contain" 
                priority
              />
            </div>
          ) : (
            <div className="p-8 text-center bg-primary/10">
              <h2 className="text-2xl font-bold text-primary mb-2">{offer.title}</h2>
              <p className="text-sm font-medium">Click to view our active promotions</p>
            </div>
          )}
        </Link>
      </div>
    </div>
  );
}
