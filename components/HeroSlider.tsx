"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const SLIDES = [
  {
    id: 1,
    subtitle: "HONDA SCOOTER",
    title: "DIO 125",
    tagline: "Born To Express. Built To Impress.",
    price: "NPR 3,29,900",
    image: "/inventory/honda-dio-125.png",
    link: "/vehicles/84",
    accent: "from-blue-500/20 to-cyan-500/20"
  },
  {
    id: 2,
    subtitle: "HONDA SCOOTER",
    title: "DIO BS6",
    tagline: "Keep Dio'ing It",
    price: "NPR 2,84,900",
    image: "/inventory/honda-dio-bs6.png",
    link: "/vehicles/87",
    accent: "from-red-500/20 to-orange-500/20"
  },
  {
    id: 3,
    subtitle: "HONDA MOTORCYCLE",
    title: "HORNET 2.0",
    tagline: "Fly Against The Wind",
    price: "NPR 4,69,900",
    image: "/inventory/cb-hornet-2-0.png",
    link: "/vehicles/75",
    accent: "from-emerald-500/20 to-teal-500/20"
  }
];

export default function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, axis: 'x' }, [Autoplay({ delay: 6000 })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full h-[100vh] bg-gray-50 dark:bg-[#050505] overflow-hidden flex items-center pt-16">
      {/* Light Mode Dotted Background */}
      <div 
        className="absolute inset-0 dark:hidden opacity-50"
        style={{
          backgroundImage: "radial-gradient(#d1d5db 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        }}
      />

      {/* Dark Mode Grid Background */}
      <div 
        className="absolute inset-0 hidden dark:block opacity-20"
        style={{
          backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px"
        }}
      />

      {/* Embla viewport — must wrap ONLY the slides flex row */}
      <div className="w-full h-full" ref={emblaRef}>
      <div className="flex h-full touch-pan-y">
        {SLIDES.map((slide, index) => (
          <div key={slide.id} className="relative flex-[0_0_100%] min-w-0 h-full p-4 sm:p-6 lg:p-16 flex flex-col-reverse md:flex-row items-center justify-center md:justify-between pt-10 md:pt-0 pb-20 md:pb-0">
            
            {/* Giant Background Watermark Image */}
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.05] pointer-events-none overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={slide.image} 
                alt="watermark" 
                className="w-[100%] md:w-[80%] h-auto object-contain grayscale blur-[4px] transition-transform duration-[10000ms] ease-out" 
                style={{ transform: selectedIndex === index ? "scale(1.1) rotate(2deg)" : "scale(0.95) rotate(0deg)" }} 
              />
            </div>

            {/* Glowing Background Radial */}
            <div 
              className={`absolute top-1/2 right-0 md:right-1/4 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-gradient-to-tr ${slide.accent} rounded-full blur-[80px] md:blur-[120px] pointer-events-none transition-opacity duration-1000`} 
              style={{ opacity: selectedIndex === index ? 1 : 0 }} 
            />

            {/* Left/Top Content (Text and Price) */}
            <div className="z-20 flex flex-col items-center md:items-start text-center md:text-left w-full md:w-1/2 md:pl-8 lg:pl-16">
               <motion.div
                  key={`content-${selectedIndex === index}`}
                  initial={{ opacity: 0, x: -30, filter: "blur(10px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="w-full flex flex-col items-center md:items-start"
               >
                 <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-md mb-4 md:mb-6">
                   <p className="text-gray-600 dark:text-gray-300 font-bold tracking-[0.2em] text-[10px] md:text-xs uppercase">
                     {slide.subtitle}
                   </p>
                 </div>
                 
                 <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[90px] xl:text-[110px] font-black text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-500 dark:from-white dark:to-gray-500 tracking-tighter uppercase leading-[0.9] mb-4 md:mb-6 font-sans py-2">
                   {slide.title}
                 </h1>
                 
                 <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base md:text-xl font-medium mb-8 md:mb-10 sm:max-w-none px-4 md:px-0">
                   {slide.tagline}
                 </p>
                 
                 <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6 md:mb-12">
                   <Link href={slide.link} className="relative group bg-primary text-white px-8 py-3.5 md:px-10 md:py-4 text-xs md:text-sm font-bold uppercase tracking-[0.2em] rounded-full shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] hover:bg-primary-hover transition-all duration-300 overflow-hidden">
                      <span className="relative z-10">Book Now</span>
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                   </Link>
                   <Link href={slide.link} className="bg-transparent border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white px-8 py-3.5 md:px-10 md:py-4 text-xs md:text-sm font-bold uppercase tracking-[0.2em] rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                      Test Ride
                   </Link>
                 </div>
               </motion.div>

               <motion.div
                  key={`price-${selectedIndex === index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  className="mt-auto md:mt-0 flex items-baseline gap-4"
               >
                 <div className="flex flex-col">
                   <p className="text-gray-400 dark:text-gray-500 font-bold tracking-[0.2em] text-[10px] md:text-xs uppercase mb-1">
                     Starting At
                   </p>
                   <p className="text-gray-900 dark:text-white text-2xl md:text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-black font-sans tracking-tight">
                     {slide.price}
                   </p>
                 </div>
               </motion.div>
            </div>

            {/* Right/Bottom Vehicle Image */}
            <div className="z-30 w-full md:w-1/2 flex items-center justify-center pointer-events-none mb-6 md:mb-0 mt-8 md:mt-0 px-4">
               <AnimatePresence mode="wait">
                 {selectedIndex === index && (
                   <motion.div
                      key={`img-${slide.id}`}
                      initial={{ opacity: 0, scale: 0.8, x: 100, rotate: 5 }}
                      animate={{ opacity: 1, scale: 1, x: 0, rotate: 0 }}
                      exit={{ opacity: 0, scale: 1.1, x: -100, rotate: -5 }}
                      transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
                      className="w-full flex justify-center"
                   >
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img 
                       src={slide.image} 
                       alt={slide.title} 
                       className="w-full max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-xl xl:max-w-2xl h-auto object-contain max-h-[45vh] md:max-h-[70vh] filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)] pointer-events-auto"
                     />
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
            
          </div>
        ))}
      </div>
      </div>{/* end embla viewport */}

      {/* Navigation Controls Overlay */}
      <div className="absolute right-16 md:right-24 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-40">
        {SLIDES.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => emblaApi && emblaApi.scrollTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`relative flex items-center justify-center w-8 h-8 group`}
          >
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === selectedIndex ? "bg-primary scale-150 shadow-[0_0_10px_rgba(239,68,68,0.8)]" : "bg-gray-400 dark:bg-gray-600 group-hover:scale-125 group-hover:bg-gray-600 dark:group-hover:bg-gray-400"}`} />
            {idx === selectedIndex && (
              <motion.div 
                layoutId="active-indicator"
                className="absolute inset-0 border border-primary rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
