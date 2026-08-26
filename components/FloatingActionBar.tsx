"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CalendarDays, Banknote, Bike, Repeat, TicketCheck, ChevronRight, X, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ACTIONS = [
  { 
    id: "finance", 
    label: "Finance", 
    href: "/finance", 
    icon: Banknote, 
    badgeColor: "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400" 
  },
  { 
    id: "exchange", 
    label: "Exchange", 
    href: "/exchange", 
    icon: Repeat, 
    badgeColor: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400" 
  },
  { 
    id: "offers", 
    label: "Apply for Offer", 
    href: "/offers", 
    icon: TicketCheck, 
    badgeColor: "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400" 
  },
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
      {/* Desktop Floating Action Bar (Vertical Right) */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-2 p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-[-4px_0_15px_rgba(0,0,0,0.1)] border-y border-l border-gray-200/50 dark:border-white/10 rounded-l-2xl">
        {ACTIONS.map(({ id, label, href, icon: Icon, badgeColor }) => (
          <Link
            key={id}
            href={href}
            className="group relative flex flex-col items-center justify-center p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors w-16 h-16"
          >
            <div className={`p-1.5 rounded-lg ${badgeColor} transition-transform duration-300 group-hover:scale-110 mb-1`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold tracking-tight text-gray-600 dark:text-gray-300 text-center leading-tight whitespace-pre-wrap">
              {label.replace('Apply for ', '')}
            </span>
          </Link>
        ))}
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
