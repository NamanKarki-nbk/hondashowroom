"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Settings2, ArrowRightLeft, Key, Smartphone, MapPin, Calculator, Gift } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ACTIONS = [
  { 
    id: "compare", 
    label: "Compare Vehicle", 
    href: "/compare", 
    icon: ArrowRightLeft,
    badgeColor: "bg-indigo-100 text-indigo-600" 
  },
  {
    id: "offers",
    label: "Special Offers",
    href: "/offers",
    icon: Gift,
    badgeColor: "bg-red-100 text-red-600"
  },
  { 
    id: "test-drive", 
    label: "Book a Test Drive", 
    href: "/test-ride", 
    icon: Key,
    badgeColor: "bg-amber-100 text-amber-600" 
  },
  { 
    id: "location", 
    label: "Location", 
    href: "/branches", 
    icon: MapPin,
    badgeColor: "bg-emerald-100 text-emerald-600" 
  }
];

export default function FloatingActionBar() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Desktop Floating Action Bar (Expandable on hover) */}
      <div 
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col bg-[#003040] shadow-2xl transition-all duration-300 ease-in-out group overflow-hidden border-y border-l border-white/10"
        style={{ width: '56px' }}
        onMouseEnter={(e) => e.currentTarget.style.width = '260px'}
        onMouseLeave={(e) => e.currentTarget.style.width = '56px'}
      >
        <div className="flex flex-col w-[260px]">
          {ACTIONS.map(({ id, label, href, icon: Icon }, index) => (
            <Link
              key={id}
              href={href}
              className={`flex items-center h-14 hover:bg-white/10 transition-colors ${
                index !== ACTIONS.length - 1 ? 'border-b border-white/10' : ''
              }`}
            >
              <div className="w-[56px] flex-shrink-0 flex items-center justify-center">
                <Icon className="w-6 h-6 text-white stroke-[1.5]" />
              </div>
              <span className="text-white text-[15px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Bottom Bar (Refined) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] border-t border-gray-200/50 dark:border-white/10 pb-[env(safe-area-inset-bottom)]">
        <div className="flex w-full overflow-x-auto snap-x snap-mandatory no-scrollbar hide-scrollbar px-2 py-1">
          {ACTIONS.map(({ id, label, href, icon: Icon, badgeColor }) => (
            <Link
              key={id}
              href={href}
              className="flex-1 flex flex-col items-center justify-center gap-1.5 p-3 min-w-[76px] snap-center group"
            >
              <div className={`p-2.5 rounded-full ${badgeColor} transition-transform duration-300 group-active:scale-95`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold tracking-tight text-gray-600 dark:text-gray-300 text-center whitespace-nowrap">
                {label.replace('Apply for ', '')}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
