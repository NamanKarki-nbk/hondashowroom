"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background dark:bg-[#0B0B0C] flex flex-col items-center justify-center p-6 selection:bg-primary selection:text-primary-foreground relative overflow-hidden text-center">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center">
         <div className="bg-black/50 border border-primary/20 p-6 rounded-full mb-8 shadow-[0_0_50px_rgba(230,0,18,0.2)]" suppressHydrationWarning>
            <AlertTriangle className="w-16 h-16 text-primary" suppressHydrationWarning />
         </div>
         
         <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 mb-4 tracking-tighter">
            404
         </h1>
         <h2 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold font-extrabold text-primary-foreground mb-4 uppercase italic">Engine Stalled</h2>
         
         <p className="text-gray-400 max-w-md mx-auto mb-10 leading-relaxed text-lg">
            This page could not be found. It looks like you've navigated off the track. Let's get you back on the road.
         </p>

         <Link href="/" className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-background hover:text-black transition-all flex items-center gap-3 group shadow-[0_0_20px_rgba(230,0,18,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]" suppressHydrationWarning>
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" suppressHydrationWarning />
            Return to Showroom
         </Link>
      </div>
    </div>
  );
}
