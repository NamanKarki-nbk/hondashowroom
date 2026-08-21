"use client";

import React from "react";
import Link from "next/link";
import { Home, ChevronRight, Shield, ShieldCheck, CheckCircle, Clock, Zap, Settings } from "lucide-react";
import { motion } from "framer-motion";

const STANDARD_WARRANTY = [
  "Engine components coverage",
  "Transmission and gearbox",
  "Frame and chassis integrity",
  "Electrical system (standard components)",
  "Factory defects in materials or workmanship",
];

const EXTENDED_WARRANTY = [
  "Comprehensive engine coverage (up to 5 years)",
  "Extended electrical coverage",
  "Fuel injection system",
  "Suspension components",
  "No depreciation on replaced parts",
  "Transferable to the next owner",
];

export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 pt-28 pb-24">

      {/* Hero */}
      <div className="bg-background dark:bg-slate-950 border-b border-gray-100 dark:border-background/5">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-12">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-primary flex items-center gap-1 transition-colors">
              <Home className="w-3.5 h-3.5" /> Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 dark:text-primary-foreground font-medium">Warranty Options</span>
          </nav>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-3">
                <span className="w-6 h-0.5 bg-primary rounded-full" />
                Honda Shield
              </div>
              <h1 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold md:text-4xl font-bold lg:text-5xl font-black text-gray-900 dark:text-primary-foreground tracking-tight leading-tight">
                Ride with Complete Peace of Mind
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-4 text-lg">
                Your Honda comes with a robust standard warranty, but our Honda Shield Extended Warranty takes your protection even further, guarding against unexpected repair costs.
              </p>
            </div>
            
            <div className="hidden md:flex w-32 h-32 bg-red-50 dark:bg-primary/10 rounded-full items-center justify-center flex-shrink-0 border-4 border-background dark:border-[#111] shadow-xl">
              <Shield className="w-14 h-14 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Warranty Comparison */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Standard Warranty */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-background dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-background/10 p-8 shadow-lg flex flex-col h-full"
          >
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-background/10">
              <div className="w-12 h-12 rounded-xl bg-[#e8dfd1] dark:bg-[#2A2A2A] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold font-bold text-gray-900 dark:text-primary-foreground">Standard Warranty</h2>
                <p className="text-sm text-gray-500">Included with every new Honda</p>
              </div>
            </div>
            
            <ul className="space-y-4 flex-1">
              {STANDARD_WARRANTY.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Extended Warranty */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-red-50 to-white dark:from-red-900/10 dark:to-[#1A1A1A] rounded-3xl border border-primary/30 p-8 shadow-xl relative overflow-hidden flex flex-col h-full"
          >
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold uppercase px-4 py-1 rounded-bl-xl shadow-md">
              Highly Recommended
            </div>
            
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-primary/20">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-red-500/30">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold font-bold text-gray-900 dark:text-primary-foreground">Honda Shield</h2>
                <p className="text-sm text-primary font-semibold">Extended Warranty Program</p>
              </div>
            </div>
            
            <ul className="space-y-4 flex-1">
              {EXTENDED_WARRANTY.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-gray-900 dark:text-gray-100 font-bold">{item}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-8 pt-6 border-t border-primary/20">
              <Link href="/book-now" className="w-full block text-center bg-primary text-primary-foreground py-4 rounded-xl font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-red-500/20">
                Purchase Extended Warranty
              </Link>
            </div>
          </motion.div>
          
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="bg-background dark:bg-slate-950 py-20 border-y border-gray-100 dark:border-background/5">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold font-black text-gray-900 dark:text-primary-foreground mb-4">Why Choose Honda Shield?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Protect yourself against inflation in parts and labor costs while ensuring your vehicle is serviced exclusively by trained Honda technicians.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background dark:bg-slate-900 p-8 rounded-3xl text-center border border-gray-100 dark:border-background/5">
              <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 mx-auto flex items-center justify-center mb-6">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold font-bold text-gray-900 dark:text-primary-foreground mb-2">Long-Term Protection</h3>
              <p className="text-gray-500">Coverage extends well beyond the standard factory warranty, protecting you for years to come.</p>
            </div>

            <div className="bg-background dark:bg-slate-900 p-8 rounded-3xl text-center border border-gray-100 dark:border-background/5">
              <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 mx-auto flex items-center justify-center mb-6">
                <Settings className="w-8 h-8" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold font-bold text-gray-900 dark:text-primary-foreground mb-2">Genuine Parts</h3>
              <p className="text-gray-500">Any required replacements are guaranteed to be 100% Genuine Honda parts fitted by experts.</p>
            </div>

            <div className="bg-background dark:bg-slate-900 p-8 rounded-3xl text-center border border-gray-100 dark:border-background/5">
              <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 mx-auto flex items-center justify-center mb-6">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold font-bold text-gray-900 dark:text-primary-foreground mb-2">Higher Resale Value</h3>
              <p className="text-gray-500">The extended warranty is transferable, making your vehicle significantly more attractive to future buyers.</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
