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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <button 
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 backdrop-blur-md transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        <Link href="/offers" onClick={handleClose} className="block w-full">
          {offer.imageUrl ? (
            <div className="relative w-full bg-transparent flex items-center justify-center">
              <Image 
                src={offer.imageUrl} 
                alt={offer.title} 
                width={1200}
                height={1200}
                className="w-full h-auto max-h-[90vh] object-contain" 
                priority
              />
            </div>
          ) : (
            <div className="p-12 text-center bg-primary/10">
              <h2 className="text-3xl font-bold text-primary mb-3">{offer.title}</h2>
              <p className="text-lg font-medium">Click to view our active promotions</p>
            </div>
          )}
        </Link>
      </div>
    </div>
  );
}
