"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Headset, ShieldCheck } from "lucide-react";
import Logo from "@/components/Logo";

export default function Footer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <footer className="w-full bg-gray-50/50 dark:bg-slate-950 transition-colors duration-300 border-t border-gray-200/60 dark:border-white/5 pb-[84px] md:pb-0">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-12 md:py-20">
        
        {/* Main Footer Row */}
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-10">
          
          {/* Left Side: Branding */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <Link href="/" className="group flex flex-col md:flex-row items-center gap-3 sm:gap-4 mb-4 max-w-full">
              <div className="bg-white/80 dark:bg-white/10 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-sm border border-gray-200/50 dark:border-white/10 group-hover:shadow-md transition-all shrink-0">
                <Logo className="h-5 sm:h-6 md:h-7 text-primary" />
              </div>
              <div className="flex flex-col items-center md:items-start min-w-0">
                <span className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight text-center md:text-left">Society Enterprises</span>
                <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest text-center md:text-left">Pvt. Ltd.</span>
              </div>
            </Link>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 max-w-sm">
              Your trusted partner for premium Honda two-wheelers, genuine spare parts, and expert servicing in Nepal.
            </p>
          </div>

          {/* Right Side: Contact Pills */}
          <div className="flex flex-col items-center lg:items-end gap-3 w-full lg:w-auto">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Quick Dial</p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* Standard Line */}
              <a 
                href="tel:01-5367368" 
                className="group flex items-center justify-center gap-3 bg-white/70 dark:bg-white/5 backdrop-blur-md border border-gray-200/80 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 px-6 py-3.5 rounded-full shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="bg-gray-100 dark:bg-white/10 p-2 rounded-full text-gray-600 dark:text-gray-300 group-hover:text-primary group-hover:bg-red-50 dark:group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200 tracking-wide">01-5367368</span>
              </a>

              {/* Toll Free */}
              <a 
                href="tel:16600146632" 
                className="group flex items-center justify-center gap-3 bg-red-50 dark:bg-primary/10 border border-red-100 dark:border-primary/20 hover:border-red-200 dark:hover:border-primary/30 px-6 py-3.5 rounded-full shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="bg-primary text-white p-2 rounded-full shadow-[0_2px_10px_rgba(239,68,68,0.4)] group-hover:scale-110 transition-transform duration-300">
                  <Headset className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-black text-primary tracking-wide leading-tight">166 00 1 46632</span>
                  <span className="text-[9px] font-bold text-red-700/60 dark:text-red-400/80 uppercase tracking-widest leading-tight">Toll Free</span>
                </div>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Row */}
        <div className="mt-16 pt-8 border-t border-gray-200/80 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-widest uppercase text-center md:text-left">
            &copy; {new Date().getFullYear()} Society Enterprises Pvt. Ltd.
          </p>
          
          <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300 tracking-widest uppercase bg-gray-200/50 dark:bg-white/5 px-4 py-2 rounded-full">
            <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-500" />
            <span>Authorized Dealer for Honda Nepal</span>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
