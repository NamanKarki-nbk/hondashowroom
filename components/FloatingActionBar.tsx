"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CalendarCheck, CreditCard, Bike, ArrowLeftRight, Tag, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ACTIONS = [
  { id: "book", label: "Book Now", href: "/book-now", icon: CalendarCheck, color: "bg-[#1a73e8] hover:bg-[#1558b0]" },
  { id: "finance", label: "Finance", href: "/finance", icon: CreditCard, color: "bg-[#cc0000] hover:bg-[#aa0000]" },
  { id: "test-ride", label: "Test Ride", href: "/test-ride", icon: Bike, color: "bg-[#2d6a4f] hover:bg-[#1b4332]" },
  { id: "exchange", label: "Exchange", href: "/exchange", icon: ArrowLeftRight, color: "bg-[#5c4033] hover:bg-[#3e2723]" },
  { id: "offers", label: "Apply for Offer", href: "/offers", icon: Tag, color: "bg-[#cc0000] hover:bg-[#aa0000]" },
];

export default function FloatingActionBar() {
  const [open, setOpen] = useState(true);

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end gap-0">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: 180, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 180, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="flex flex-col shadow-2xl overflow-hidden rounded-l-xl border border-[#f3ebdd]/10"
          >
            {ACTIONS.map(({ id, label, href, icon: Icon, color }) => (
              <Link
                key={id}
                href={href}
                className={`${color} text-[#f3ebdd] flex items-center gap-2.5 px-4 py-3 text-sm font-bold transition-all duration-150 group min-w-[148px]`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{label}</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle tab */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="bg-gray-900 dark:bg-gray-800 text-[#f3ebdd] w-7 h-16 flex items-center justify-center rounded-l-lg border border-[#f3ebdd]/10 shadow-lg hover:bg-gray-700 transition-colors mt-0.5"
        aria-label={open ? "Hide quick actions" : "Show quick actions"}
      >
        <motion.div animate={{ rotate: open ? 0 : 180 }} transition={{ duration: 0.25 }}>
          <ChevronRight className="w-4 h-4" />
        </motion.div>
      </button>
    </div>
  );
}
