"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CalendarClock, ChevronRight, X, ShieldCheck } from "lucide-react";
import Logo from "@/components/Logo";
import DioHeroSection from "@/components/scooter/DioHeroSection";
import DioColorSwitcher, { ColorOption } from "@/components/scooter/DioColorSwitcher";
import Dio125VariantComparison from "@/components/scooter/Dio125VariantComparison";
import DioFeaturesGrid from "@/components/scooter/DioFeaturesGrid";
import VehicleSpecs from "@/components/VehicleSpecs";
import AccessoriesPage from "@/components/AccessoriesPage";
import DioActionBanner from "@/components/scooter/DioActionBanner";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection";
import EmiCalculator from "@/components/EmiCalculator";
import { Sparkles, Zap, Fuel, Monitor, KeyRound, Navigation, Disc } from "lucide-react";
// Features and Specs are now pulled from the DB

interface HondaDio125PageProps {
  vehicle?: any;
  stdPrice?: string;
  dlxPrice?: string;
}

export default function HondaDio125Page({ vehicle, stdPrice, dlxPrice }: HondaDio125PageProps = {}) {
  const [activeNav, setActiveNav] = useState("overview");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingType, setBookingType] = useState<"book" | "testride">("book");
  const [selectedVariant, setSelectedVariant] = useState<string>("Honda Dio 125 H-SMART");
  const [currentColor, setCurrentColor] = useState({
    name: "Sports Red",
    image: "/inventory/honda-dio-bs6-125.png",
  });

  // Form State
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "Damak",
    preferredBranch: "Damak, Jhapa",
  });
  const [submitted, setSubmitted] = useState(false);
  const [user, setUser] = useState<any>(null);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/profile")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user) {
          setUser(data.user);
          setForm(prev => ({
            ...prev,
            name: data.user.fullName || prev.name,
            phone: data.user.phone || prev.phone,
          }));
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let maxVisibleRatio = 0;
        let mostVisibleSection = "";

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxVisibleRatio) {
            maxVisibleRatio = entry.intersectionRatio;
            mostVisibleSection = entry.target.id;
          }
        });

        if (mostVisibleSection) {
          setActiveNav(mostVisibleSection);
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.2, 0.5, 0.8, 1],
      }
    );

    const sections = ["overview", "variants", "specs", "colors", "features", "accessories", "emi-calculator"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    setActiveNav(id);
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleOpenBooking = (type: "book" | "testride", variantName?: string) => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!user.isVerified) {
      alert("Please verify your contact number in your profile before proceeding.");
      router.push("/profile");
      return;
    }
    
    if (variantName) setSelectedVariant(variantName);
    setBookingType(type);
    setIsBookingOpen(true);
    setSubmitted(false);
  };

  const handleColorChange = (color: ColorOption) => {
    setCurrentColor({
      name: color.name,
      image: color.image,
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          interestedIn: selectedVariant,
          source: bookingType === "book" ? "Dio 125 - Booking" : "Dio 125 - Test Ride",
          remarks: `Preferred location: ${form.preferredBranch}, City: ${form.city}`,
        }),
      });

      if (res.ok) {
        // If user didn't have a full name in profile, save it to profile now
        if (user && !user.fullName && form.name) {
          fetch("/api/profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fullName: form.name })
          }).catch(console.error);
        }

        setSubmitted(true);
        setTimeout(() => {
          setIsBookingOpen(false);
          setSubmitted(false);
        }, 2500);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const dio125Hotspots = [
    {
      id: "mat-floor",
      x: 70,
      y: 75,
      accessory: {
        name: "Mat Floor Premium",
        description: "Premium floor mat for Dio 125, designed for maximum grip and aesthetic appeal.",
        price: "NPR 950",
        imageUrl: "/inventory/honda-dio-bs6-125.png"
      }
    },
    {
      id: "seat-cover",
      x: 45,
      y: 45,
      accessory: {
        name: "Seat Cover Pro",
        description: "Ergonomically designed seat cover for the Dio 125.",
        price: "NPR 1,400",
        imageUrl: "/inventory/honda-dio-bs6-125.png"
      }
    }
  ];

  return (
    // -mt-[90px] cancels the parent customer layout pt-[90px] padding, pulling page to top:0
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      
      {/* Sticky Top Header Bar */}
      <header className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95 fixed top-0 z-40 shadow-sm border-b border-gray-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center space-x-2 group">
              <Logo className="w-8 h-8 group-hover:scale-105 transition-transform text-primary" />
            </Link>
            <div className="h-5 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block" />
            <span className="font-black text-xs sm:text-sm uppercase tracking-tight text-foreground hidden sm:block">
              DIO 125
            </span>
          </div>

          {/* Local Scroll Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {[
              { id: "overview", label: "Overview" },
              { id: "variants", label: "STD vs H-SMART" },
              { id: "specs", label: "Specs" },
              { id: "colors", label: "Colors & 360°" },
              { id: "features", label: "Highlights" },
              { id: "accessories", label: "Accessories" },
              { id: "emi-calculator", label: "EMI Calculator" },
            ].map((nav) => (
              <button
                key={nav.id}
                onClick={() => scrollTo(nav.id)}
                className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                  activeNav === nav.id
                    ? "text-primary bg-red-50 dark:bg-red-950/40"
                    : "text-gray-600 dark:text-gray-400 hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {nav.label}
              </button>
            ))}
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenBooking("testride")}
              className="hidden sm:inline-flex bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-foreground font-bold px-3.5 py-1.5 rounded-xl text-xs uppercase tracking-wider transition-colors"
            >
              Test Ride
            </button>
            <button
              onClick={() => handleOpenBooking("book")}
              className="bg-primary hover:bg-primary-hover text-primary-foreground px-4 py-1.5 sm:py-2 rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5"
            >
              <CalendarClock className="w-4 h-4" /> Book Now
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Sections - pt-16 places breadcrumbs 16px below sticky header */}
      <main className="pt-16 sm:pt-20">
        <DioHeroSection
          vehicle={vehicle}
          currentColorImage={currentColor.image}
          currentColorName={currentColor.name}
          basePrice={stdPrice || "NPR 3,11,900"}
          stdPrice={stdPrice}
          dlxPrice={dlxPrice}
          onBookNow={() => handleOpenBooking("book")}
          onTestRide={() => handleOpenBooking("testride")}
        />

        {/* 2. Model ko Different */}
        <Dio125VariantComparison
          stdPrice={stdPrice}
          hSmartPrice={dlxPrice}
          onBookVariant={(variantName) => handleOpenBooking("book", variantName)}
        />

        {/* 3. Specs */}
        <VehicleSpecs 
          specs={vehicle?.specifications} 
          vehicleSlug={vehicle?.id || "honda-dio-125"} 
          fallbackImageUrl={vehicle?.imageUrl || currentColor.image} 
          threeSixty={vehicle?.threeSixty} 
        />

        {/* 4. Colour Options */}
        <DioColorSwitcher onSelectColor={handleColorChange} />

        {/* 5. Highlight and Feature */}
        <DioFeaturesGrid 
          features={(vehicle?.features || []).map((f: any, i: number) => {
            let Icon = Sparkles;
            const titleLower = f.title.toLowerCase();
            if (titleLower.includes('meter')) Icon = Monitor;
            else if (titleLower.includes('engine') || titleLower.includes('pgm-fi') || titleLower.includes('acg')) Icon = Zap;
            else if (titleLower.includes('fuel')) Icon = Fuel;
            else if (titleLower.includes('stand') || titleLower.includes('key')) Icon = ShieldCheck;
            
            return {
              id: (f.id || i).toString(),
              title: f.title,
              subtitle: "",
              description: f.description,
              icon: Icon,
              image: f.image.startsWith("/") ? f.image : `/images/features/dio125/${f.image}`,
              fallbackImage: "/inventory/honda-dio-bs6-125.png"
            };
          })} 
        />

        {/* 6. Explore Accessories */}
        <AccessoriesPage 
          vehicleImageUrl={currentColor.image} 
          hotspots={dio125Hotspots} 
        />

        {/* 7. Selected Model Finance */}
        <div id="emi-calculator">
          <EmiCalculator 
            vehicleName={selectedVariant}
            vehicleImage={currentColor.image}
            initialPrice={selectedVariant.includes("H-SMART") ? parseInt((dlxPrice || "0").replace(/\D/g, '')) : parseInt((stdPrice || "0").replace(/\D/g, ''))}
          />
        </div>

        {/* 8. Booking Option */}
        <DioActionBanner
          onBookNow={() => handleOpenBooking("book")}
          onTestRide={() => handleOpenBooking("testride")}
        />

        {/* 9. Testimonials */}
        <TestimonialsSection />

        {/* 10. FAQ (End) */}
        <FaqSection />
      </main>

      {/* Booking / Test Ride Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsBookingOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-foreground rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 dark:bg-green-950/60 dark:text-green-400 rounded-full flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <h3 className="text-2xl md:text-3xl font-semibold font-black uppercase text-foreground">
                  {bookingType === "book" ? "Booking Requested!" : "Test Ride Scheduled!"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Thank you, <strong>{form.name}</strong>. Our Honda dealership representative will call you at <strong>{form.phone}</strong> shortly regarding your <strong>{selectedVariant}</strong>.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-primary block mb-1">
                    Honda Showroom Direct
                  </span>
                  <h3 className="text-2xl md:text-3xl font-semibold font-black uppercase text-foreground">
                    {bookingType === "book" ? `Book ${selectedVariant}` : `Test Ride ${selectedVariant}`}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Fill out your contact info to confirm availability and schedule your appointment.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 dark:text-gray-400 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Shrestha"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-[#1C1C20] border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 dark:text-gray-400 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9841234567"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-[#1C1C20] border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 dark:text-gray-400 mb-1">
                      Preferred Location
                    </label>
                    <select
                      value={form.preferredBranch}
                      onChange={(e) => setForm({ ...form, preferredBranch: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-[#1C1C20] border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value="Damak, Jhapa">Damak, Jhapa</option>
                      <option value="Urlabari, Morang">Urlabari, Morang</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-primary-foreground font-black py-4 rounded-xl uppercase tracking-wider text-sm shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    {isSubmitting ? "Processing..." : `Confirm ${bookingType === "book" ? "Booking" : "Test Ride"}`} 
                    {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
