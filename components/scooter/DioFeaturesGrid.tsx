"use client";

import React from "react";
import { Zap, KeyRound, Monitor, Fuel, ShieldAlert, Sparkles, Navigation, Disc } from "lucide-react";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

export interface FeatureCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  image: string;
  fallbackImage: string;
  tag?: string;
}

const DIO_FEATURES: FeatureCard[] = [
  {
    id: "esp",
    title: "eSP Technology",
    subtitle: "Enhanced Smart Power",
    description: "Honda's advanced 110cc engine optimizes fuel combustion while reducing internal friction. Equipped with Silent ACG starter for jolt-free engine starts.",
    icon: Zap,
    image: "/images/dio/esp-engine.jpg",
    fallbackImage: "/inventory/honda-dio-bs6.png",
    tag: "Engine Tech",
  },
  {
    id: "hsmart",
    title: "Honda Smart Key",
    subtitle: "Smart Find, Unlock & Start",
    description: "Revolutionary H-Smart key system provides Answer Back (blinks lights to locate vehicle), Smart Unlock, Keyless Push Start, and Anti-Theft Smart Safe.",
    icon: KeyRound,
    image: "/images/dio/smart-key.jpg",
    fallbackImage: "/inventory/honda-dio-bs6.png",
    tag: "Segment First",
  },
  {
    id: "digital-meter",
    title: "Full Digital Meter",
    subtitle: "Smart Information Console",
    description: "Intelligent digital display featuring Real-Time Mileage, Average Mileage, Distance-to-Empty (DTE), Service Due Indicator, 3-step ECO Indicator, and Clock.",
    icon: Monitor,
    image: "/images/dio/digital-meter.jpg",
    fallbackImage: "/inventory/honda-dio-bs6.png",
  },
  {
    id: "fuel-lid",
    title: "External Fuel Fill",
    subtitle: "Convenient Refueling",
    description: "Refuel without getting off the scooter or lifting the seat. One-touch integrated switch unlocks both the underseat compartment and external fuel cap.",
    icon: Fuel,
    image: "/images/dio/external-fuel.jpg",
    fallbackImage: "/inventory/honda-dio-bs6.png",
  },
  {
    id: "suspension",
    title: "Telescopic Suspension & 12\" Wheel",
    subtitle: "Superior Ride Comfort",
    description: "Telescopic front suspension paired with a larger 12-inch front alloy wheel absorbs road bumps effortlessly, providing unmatched high-speed stability.",
    icon: Navigation,
    image: "/images/dio/telescopic.jpg",
    fallbackImage: "/inventory/honda-dio-bs6.png",
  },
  {
    id: "side-stand",
    title: "Side Stand Engine Cut-Off",
    subtitle: "Rider Safety System",
    description: "Prevents rider from starting or accelerating the scooter while the side stand is engaged, avoiding accidental tip-overs and mishaps.",
    icon: ShieldAlert,
    image: "/images/dio/side-stand.jpg",
    fallbackImage: "/inventory/honda-dio-bs6.png",
  },
  {
    id: "cbs",
    title: "Combi Brake System (CBS)",
    subtitle: "Equalizer Braking",
    description: "Honda's proprietary CBS with equalizer distributes braking force proportionally to both front and rear wheels for shorter stopping distances.",
    icon: Disc,
    image: "/images/dio/cbs-brakes.jpg",
    fallbackImage: "/inventory/honda-dio-bs6.png",
  },
  {
    id: "led-lamp",
    title: "Signature LED Position Lamp",
    subtitle: "Aggressive Stance",
    description: "Striking front LED position lamp integrated into the handlebar cowl combined with dual-tone body graphics for a distinctive, edgy road presence.",
    icon: Sparkles,
    image: "/images/dio/led-headlamp.jpg",
    fallbackImage: "/inventory/honda-dio-bs6.png",
  },
];

export default function DioFeaturesGrid({ features }: { features?: FeatureCard[] }) {
  const displayFeatures = features && features.length > 0 ? features : DIO_FEATURES;

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-primary text-xs font-black tracking-widest uppercase mb-3">
            <Sparkles className="w-4 h-4" /> Cutting-Edge Innovations
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold sm:text-5xl font-black text-foreground uppercase tracking-tight">
            Key Highlights & Features
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-3">
            Explore the advanced engineering, rider convenience, and safety tech built into the Honda Dio 110.
          </p>
        </div>

        {/* Features Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {displayFeatures.map((feat, index) => {
            const Icon = feat.icon || Sparkles;
            return (
              <div
                key={feat.id}
                className="group relative bg-white dark:bg-[#141416] rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-2xl hover:border-primary/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Feature Image Banner */}
                  <div className="relative h-44 w-full bg-gray-100 dark:bg-[#1C1C20] overflow-hidden">
                    <ImageWithFallback
                      src={feat.image}
                      fallbackSrc={feat.fallbackImage}
                      alt={feat.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {feat.tag && (
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-wider shadow-md">
                        {feat.tag}
                      </span>
                    )}

                    {/* Icon Badge */}
                    <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-white/95 dark:bg-black/90 text-primary flex items-center justify-center shadow-lg border border-gray-200 dark:border-gray-800">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="p-6">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary block mb-1">
                      {feat.subtitle}
                    </span>
                    <h3 className="text-lg font-black text-foreground uppercase tracking-tight mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Border Accent */}
                <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-800 group-hover:bg-primary transition-colors" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
