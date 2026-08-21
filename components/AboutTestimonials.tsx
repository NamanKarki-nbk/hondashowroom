"use client";

import React from "react";
import { Star, ShieldCheck, Award, Clock } from "lucide-react";
import { motion } from "framer-motion";

const STATS = [
  { label: "Happy Customers", value: "10,000+", icon: Star },
  { label: "Years of Trust", value: "25+", icon: Clock },
  { label: "Certified Mechanics", value: "50+", icon: Award },
  { label: "Genuine Parts", value: "100%", icon: ShieldCheck },
];

export default function AboutTestimonials() {
  return (
    <section className="py-12 md:py-16 lg:py-24 px-4 sm:px-6 md:px-12 lg:px-16 mx-auto w-full max-w-[1600px] bg-background">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-primary-foreground tracking-tight uppercase mb-4 sm:mb-6">
              A Legacy of <span className="text-primary">Trust</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8">
              Society Enterprises Pvt. Ltd. has been the premier Honda dealership in the region for over two decades. We believe in delivering not just vehicles, but experiences that last a lifetime. Our commitment to excellence, transparent pricing, and unparalleled after-sales support makes us the first choice for Honda enthusiasts.
            </p>
            
            <div className="grid grid-cols-2 gap-8">
              {STATS.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="flex flex-col">
                    <Icon className="w-8 h-8 text-primary mb-3" />
                    <span className="text-2xl md:text-3xl font-semibold sm:text-3xl font-black text-gray-900 dark:text-white mb-1">{stat.value}</span>
                    <span className="text-sm text-gray-500 font-bold uppercase tracking-wider">{stat.label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Image/Graphic */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-white shadow-2xl group"
          >
             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/images/finance-hero.jpg" 
              alt="Honda Dealership Showroom" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="bg-primary/90 backdrop-blur text-white p-6 rounded-2xl">
                <div className="flex text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="italic font-medium leading-relaxed mb-4">
                  "The best buying experience I've ever had. The staff was incredibly knowledgeable, and the after-sales service is just phenomenal."
                </p>
                <p className="text-sm font-bold uppercase tracking-wider">— Rajesh K., Honda Dio Owner</p>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
