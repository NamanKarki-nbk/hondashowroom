"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, ArrowRight } from "lucide-react";
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
    <footer className="border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-[#0B0B0C] py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center space-x-3">
           <Logo className="w-8 h-8 text-[#c1291A]" />
           <span className="text-gray-800 dark:text-gray-200 font-bold text-xl">Society Enterprises</span>
        </div>
        <div className="flex items-center gap-6 text-gray-600 dark:text-gray-400 font-medium">
           <a href="tel:01-5367368" className="flex items-center gap-2 hover:text-[#c1291A]"><Phone className="w-4 h-4" /> 01-5367368</a>
           <a href="tel:16600146632" className="flex items-center gap-2 text-[#c1291A]"><Phone className="w-4 h-4" /> 166 00 1 46632 (Toll Free)</a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-500 flex flex-col md:flex-row justify-between text-center md:text-left">
          <p>&copy; {new Date().getFullYear()} Society Enterprises Pvt. Ltd. All rights reserved.</p>
          <p>Authorized Dealer for Honda Nepal</p>
      </div>
    </footer>
  );
}
