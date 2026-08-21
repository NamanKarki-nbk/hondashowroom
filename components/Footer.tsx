"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import Logo from "@/components/Logo";

/**
 * Global footer component for the customer portal.
 * 
 * Contains copyright information, basic contact links, and the Honda logo.
 * Automatically adapts to the current theme (light/dark mode).
 * 
 * @returns {JSX.Element} The rendered footer component.
 */
export default function Footer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <footer className="border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-[#0B0B0C] py-16 transition-colors duration-300 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center space-x-3">
           <Link href="/">
             <Logo className="w-8 h-8 text-primary" />
           </Link>
           <span className="text-gray-800 dark:text-gray-200 font-bold text-xl md:text-2xl font-semibold text-center md:text-left">Society Enterprises</span>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-gray-600 dark:text-gray-400 font-medium w-full md:w-auto">
           <a href="tel:01-5367368" className="flex items-center justify-center md:justify-start gap-2 hover:text-primary"><Phone className="w-4 h-4" /> 01-5367368</a>
           <a href="tel:16600146632" className="flex items-center justify-center md:justify-start gap-2 text-primary"><Phone className="w-4 h-4" /> 166 00 1 46632 (Toll Free)</a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left w-full">
          <p>&copy; {new Date().getFullYear()} Society Enterprises Pvt. Ltd. All rights reserved.</p>
          <p>Authorized Dealer for Honda Nepal</p>
      </div>
    </footer>
  );
}
