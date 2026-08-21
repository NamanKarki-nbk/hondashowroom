"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CalendarDays, Banknote, Bike, Repeat, TicketCheck, ChevronRight, X, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ACTIONS = [
  { 
    id: "book", 
    label: "Book Now", 
    href: "/book-now", 
    icon: CalendarDays, 
    badgeColor: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" 
  },
  { 
    id: "finance", 
    label: "Finance", 
    href: "/finance", 
    icon: Banknote, 
    badgeColor: "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400" 
  },
  { 
    id: "test-ride", 
    label: "Test Ride", 
    href: "/test-ride", 
    icon: Bike, 
    badgeColor: "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400" 
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
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Desktop Floating Action Menu */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end gap-3 pointer-events-none">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0, x: 20 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0.9, opacity: 0, x: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="flex flex-col bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 shadow-2xl rounded-2xl p-2 pointer-events-auto w-[220px]"
            >
              {ACTIONS.map(({ id, label, href, icon: Icon, badgeColor }) => (
                <Link
                  key={id}
                  href={href}
                  className="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all duration-300"
                >
                  <div className={`p-2 rounded-lg ${badgeColor} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="flex-1 text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-tight">
                    {label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Trigger Button */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-tr from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 text-white dark:text-gray-900 shadow-xl border border-gray-800 dark:border-white/20 hover:scale-105 active:scale-95 transition-all duration-300 pointer-events-auto"
          aria-label={open ? "Close quick actions" : "Open quick actions"}
        >
          <motion.div
            initial={false}
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex items-center justify-center"
          >
            {open ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </motion.div>
        </button>
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
