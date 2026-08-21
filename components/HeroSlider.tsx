"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const SLIDES = [
  {
    id: 1,
    subtitle: "HONDA SCOOTER",
    title: "DIO 125",
    tagline: "Born To Express. Built To Impress.",
    price: "NPR 3,29,900",
    image: "/inventory/honda-dio-125.png",
    link: "/vehicles/84"
  },
  {
    id: 2,
    subtitle: "HONDA SCOOTER",
    title: "DIO BS6",
    tagline: "Keep Dio'ing It",
    price: "NPR 2,84,900",
    image: "/inventory/honda-dio-bs6.png",
    link: "/vehicles/87"
  },
  {
    id: 3,
    subtitle: "HONDA MOTORCYCLE",
    title: "HORNET 2.0",
    tagline: "Fly Against The Wind",
    price: "NPR 4,69,900",
    image: "/inventory/cb-hornet-2-0.png",
    link: "/vehicles/75"
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
    <div className="relative w-full h-[calc(100vh-116px)] bg-background dark:bg-[#0B0B0C] overflow-hidden">
      {/* Light Mode Dotted Background */}
      <div 
        className="absolute inset-0 dark:hidden"
        style={{
          backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}
      />

      {/* Embla viewport — must wrap ONLY the slides flex row */}
      <div className="h-full" ref={emblaRef}>
      <div className="flex h-full touch-pan-y">
        {SLIDES.map((slide, index) => (
          <div key={slide.id} className="relative flex-[0_0_100%] min-w-0 h-full p-4 sm:p-6 lg:p-16 flex flex-col-reverse md:flex-row items-center justify-center md:justify-between pt-10 md:pt-0 pb-20 md:pb-0">
            
            {/* Giant Background Watermark Image */}
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-5 dark:opacity-10 pointer-events-none overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={slide.image} 
                alt="watermark" 
                className="w-[80%] md:w-[60%] h-auto object-contain grayscale blur-[2px] transition-transform duration-[10000ms] ease-out" 
                style={{ transform: selectedIndex === index ? "scale(1.1)" : "scale(0.95)" }} 
              />
            </div>

            {/* Left/Top Content (Text and Price) */}
            <div className="z-20 flex flex-col items-center md:items-start text-center md:text-left w-full md:w-1/2 md:pl-8 lg:pl-16">
               <motion.div
                  key={`content-${selectedIndex === index}`}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="w-full flex flex-col items-center md:items-start"
               >
                 <p className="text-primary font-bold tracking-[0.3em] text-[10px] sm:text-xs md:text-sm uppercase mb-2 md:mb-3">
                   {slide.subtitle}
                 </p>
                 <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-[110px] xl:text-[130px] font-black text-gray-900 dark:text-primary-foreground tracking-tighter uppercase leading-none mb-3 sm:mb-4 md:mb-6 font-sans">
                   {slide.title}
                 </h2>
                 <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base md:text-lg font-medium mb-4 md:mb-8 sm:max-w-none px-4 md:px-0">
                   {slide.tagline}
                 </p>
                 
                 <div className="flex items-center justify-center md:justify-start gap-3 md:gap-4 mb-6 md:mb-12">
                   <Link href={slide.link} className="bg-primary text-primary-foreground px-6 py-2.5 md:px-10 md:py-4 text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider transition-colors hover:bg-primary-hover">
                      Book Now
                   </Link>
                   <Link href={slide.link} className="bg-transparent border border-gray-900 dark:border-background text-gray-900 dark:text-primary-foreground px-6 py-2.5 md:px-10 md:py-4 text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider transition-colors hover:bg-gray-900 hover:text-primary-foreground dark:hover:bg-background dark:hover:text-black">
                      Test Ride
                   </Link>
                 </div>
               </motion.div>

               <motion.div
                  key={`price-${selectedIndex === index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                  className="mt-auto md:mt-0"
               >
                 <p className="text-gray-500 font-bold tracking-[0.2em] text-[10px] sm:text-xs md:text-sm uppercase mb-1 md:mb-2">
                   Starting At
                 </p>
                 <p className="text-gray-900 dark:text-primary-foreground text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black font-sans">
                   {slide.price}
                 </p>
               </motion.div>
            </div>

            {/* Right/Bottom Vehicle Image */}
            <div className="z-30 w-full md:w-1/2 flex items-center justify-center pointer-events-none mb-6 md:mb-0 mt-4 md:mt-0 px-4">
               <motion.div
                  key={`img-${selectedIndex === index}`}
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 1, type: "spring", bounce: 0.2, delay: 0.1 }}
                  className="w-full flex justify-center"
               >
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img 
                   src={slide.image} 
                   alt={slide.title} 
                   className="w-full max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-lg h-auto object-contain max-h-[40vh] md:max-h-[65vh] filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] pointer-events-auto"
                 />
               </motion.div>
            </div>
            
          </div>
        ))}
      </div>
      </div>{/* end embla viewport */}

      {/* Right Side Vertical Pagination Dots */}
      <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-40">
        {SLIDES.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => emblaApi && emblaApi.scrollTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 ${idx === selectedIndex ? "bg-gray-900 border-gray-900  dark:border-background scale-125 shadow-[0_0_10px_rgba(0,0,0,0.2)] dark:shadow-[0_0_10px_rgba(255,255,255,0.5)]" : "bg-transparent border-gray-400 hover:border-gray-900 dark:border-gray-600 dark:hover:border-gray-400"}`}
          />
        ))}
      </div>
    </div>
  );
}
