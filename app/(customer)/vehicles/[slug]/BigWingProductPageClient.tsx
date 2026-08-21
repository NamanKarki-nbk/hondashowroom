"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, CalendarClock, Phone, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";
import BigWingTechnologySection from "@/components/BigWingTechnologySection";
import BigWingVehicleSpecs from "@/components/BigWingVehicleSpecs";
import VehicleColorSelector from "@/components/VehicleColorSelector";

import EmiCalculator from "@/components/EmiCalculator";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection";

interface ProductData {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  tagline: string;
  highlights: { label: string; value: string; icon: string }[];
  features: { title: string; description: string; image: string }[];
  sections?: { title: string; features: { title: string; description: string; image: string }[] }[];
  colors: { name: string; hex: string }[];
  specs: Record<string, { label: string; value: string }[]>;
  variants: { name: string; imageUrl: string }[];
  threeSixty?: { localPath: string; totalFrames: number } | null;
}

export default function BigWingProductPageClient({ vehicle }: { vehicle: ProductData }) {
  const [activeNav, setActiveNav] = useState("overview");

  // Smooth scroll helper
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Intersection observer for sticky nav highlighting
  useEffect(() => {
    const sections = ["overview", "features", "colors", "specs", "book"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveNav(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="dark">
      <div className="min-h-screen bg-[#0A0A0A] text-primary-foreground transition-colors duration-300">
      
      {/* Product Specific Header (Matching BigWing Style) */}
      <header className="w-full bg-[#121212]/95 backdrop-blur fixed top-0 z-50 border-b border-gray-800 transition-colors duration-300">
        
        {/* Top Red Bar */}
        <div className="w-full bg-primary text-primary-foreground text-sm py-2">
           <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 flex justify-between items-center">
              <div className="flex gap-4 font-semibold">
                 <Link href="/honda-finance-from-home" className="hover:underline">Honda Finance From Home</Link>
                 <span className="opacity-50">|</span>
                 <Link href="/takata-special-service-campaign" className="hover:underline">Honda Airbag Recall</Link>
                 <span className="opacity-50">|</span>
                 <Link href="/service-booking" className="hover:underline">Honda Service Booking</Link>
              </div>
              <div className="hidden md:flex gap-4">
                 <Link href="/admin/dashboard" className="hover:underline flex items-center gap-1">Admin Portal <ArrowRight className="w-3 h-3" /></Link>
                 <Link href="/login" className="hover:underline">Sign In</Link>
              </div>
           </div>
        </div>

        {/* Main Nav (Product Context) */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <Link href="/" className="flex items-center space-x-3 group">
               <Logo className="w-10 h-10 group-hover:scale-105 transition-transform text-primary" />
             </Link>
          </div>

          {/* Product Local Nav */}
          <nav className="hidden lg:flex items-center space-x-2">
            {["overview", "features", "colors", "specs"].map(nav => (
              <button
                key={nav}
                onClick={() => scrollTo(nav)}
                className={`px-4 py-2 text-sm font-bold uppercase tracking-wider rounded-lg transition-colors ${
                  activeNav === nav 
                    ? "text-primary bg-red-950/30" 
                    : "text-gray-400 hover:text-primary-foreground hover:bg-gray-800"
                }`}
              >
                {nav}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <span className="font-bold text-primary-foreground truncate uppercase tracking-wider hidden md:block mr-2">{vehicle.name} <span className="text-primary ml-1 text-xs">BIGWING</span></span>
            <button 
              onClick={() => scrollTo("book")}
              className="bg-primary hover:bg-primary-hover text-primary-foreground px-6 py-2 rounded-full font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <CalendarClock className="w-4 h-4" /> <span className="hidden sm:inline">Book Now</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="overview" className="relative min-h-screen flex items-center pt-32 md:pt-40 pb-24 px-6 overflow-hidden bg-[#0A0A0A] transition-colors duration-300">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          {/* Subtle background pattern or logo watermark */}
        </div>
        <div className="max-w-[1600px] mx-auto w-full relative z-10">
          {/* Breadcrumbs */}
          <div className="mb-8 flex items-center text-sm xl:text-lg text-gray-400 font-medium">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 xl:w-6 xl:h-6 mx-2" />
            <Link href="/" className="uppercase hover:text-primary transition-colors">{vehicle.category.replace('_', ' ')}</Link>
            <ChevronRight className="w-4 h-4 xl:w-6 xl:h-6 mx-2" />
            <span className="text-primary-foreground font-bold">{vehicle.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-24 items-center">
            {/* Text Content */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <h1 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold md:text-4xl font-bold md:text-6xl font-bold tracking-tight md:text-7xl xl:text-[7rem] font-black text-primary-foreground tracking-tighter mb-4 uppercase leading-none">
                  {vehicle.name}
                </h1>
                <p className="text-2xl md:text-3xl font-semibold xl:text-4xl text-primary font-bold italic mb-8 xl:mb-12 tracking-wide">
                  "{vehicle.tagline}"
                </p>
                <div className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold md:text-4xl font-bold xl:text-6xl font-black text-primary-foreground mb-10 xl:mb-16 font-sans">
                   Starting At Rs. {vehicle.price.toLocaleString('en-IN')}
                </div>
                
                <div className="flex gap-4">
                  <button onClick={() => scrollTo("book")} className="bg-primary hover:bg-primary-hover text-primary-foreground px-10 py-5 xl:px-14 xl:py-7 rounded-none font-bold uppercase tracking-wider transition-all shadow-lg shadow-primary/20 flex items-center gap-2 text-lg xl:text-2xl">
                    Book Test Ride <ChevronRight className="w-6 h-6 xl:w-8 xl:h-8" />
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Visuals */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, x: 50 }} 
                animate={{ opacity: 1, scale: 1, x: 0 }} 
                transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
                className="relative h-[450px] md:h-[650px] xl:h-[800px] w-full flex items-center justify-center"
              >
                {/* Background red slash typical of Honda styling */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary opacity-5 dark:opacity-10 -skew-x-12 -z-10 rounded-3xl"></div>
                
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={vehicle.imageUrl || '/models/hero-1.png'} 
                  alt={vehicle.name} 
                  className="w-full h-full object-contain relative z-10 filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology & Design Section (Scroll Linked Animation) */}
      <BigWingTechnologySection 
        sections={vehicle.sections || [{ title: "Technology & Design", features: vehicle.features }]} 
        threeSixty={vehicle.threeSixty} 
        vehicleSlug={vehicle.id} 
        vehicleName={vehicle.name} 
      />

      {/* Colors Section */}
      <VehicleColorSelector vehicleName={vehicle.name} imageUrl={vehicle.imageUrl} colors={vehicle.colors} />

      {/* Technical Specs Section */}
      <BigWingVehicleSpecs specs={vehicle.specs} vehicleSlug={vehicle.id} fallbackImageUrl={vehicle.imageUrl} threeSixty={vehicle.threeSixty} />

      {/* EMI Calculator */}
      <EmiCalculator vehicleName={vehicle.name} vehicleImage={vehicle.imageUrl} initialPrice={vehicle.price} />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <FaqSection />

      {/* Booking Form / Enquiry */}
      <section id="book" className="py-24 px-6 bg-[#050505] border-t border-gray-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#121212] border border-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden transition-colors duration-300">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full pointer-events-none"></div>
             
             <div className="text-center mb-10 relative z-10">
               <h3 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold font-extrabold text-primary-foreground mb-4 uppercase tracking-tight flex items-center justify-center gap-3">
                  <CalendarClock className="w-8 h-8 text-primary" />
                  Enquire Now
               </h3>
               <p className="text-gray-400">Experience the {vehicle.name} firsthand. Fill out the form below and our team will get back to you.</p>
             </div>
             
             <form className="space-y-6 relative z-10" onSubmit={e => e.preventDefault()}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-300 uppercase tracking-wider ml-1">Full Name</label>
                     <input type="text" placeholder="Your Name" className="w-full bg-[#1A1A1A] border border-gray-700 text-primary-foreground rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-300 uppercase tracking-wider ml-1">Phone Number</label>
                     <input type="tel" placeholder="Mobile Number" className="w-full bg-[#1A1A1A] border border-gray-700 text-primary-foreground rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow" />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-300 uppercase tracking-wider ml-1">Preferred Dealer Location</label>
                   <select className="w-full bg-[#1A1A1A] border border-gray-700 text-primary-foreground rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow">
                     <option value="">Select a Branch</option>
                     <option value="kathmandu">Kathmandu</option>
                     <option value="lalitpur">Lalitpur</option>
                     <option value="pokhara">Pokhara</option>
                   </select>
                </div>
                <div className="pt-4">
                  <button className="w-full bg-primary hover:bg-primary-hover text-primary-foreground py-4 rounded-xl font-bold uppercase tracking-wider text-lg transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                     Submit Enquiry <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
             </form>
          </div>
        </div>
      </section>

      </div>
    </div>
  );
}
