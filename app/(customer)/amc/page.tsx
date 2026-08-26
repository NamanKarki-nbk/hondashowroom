"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Home, ChevronRight, Shield } from "lucide-react";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";

interface Feature {
  text: string;
  subtext?: string;
}

interface AmcPlan {
  id: string;
  title: string;
  price: number;
  savings: number;
  features: Feature[];
  isPopular: boolean;
  isActive: boolean;
  order: number;
}

export default function AmcPage() {
  const [plans, setPlans] = useState<AmcPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/cms/amc/plans')
      .then(res => res.json())
      .then(data => {
        setPlans(data.filter((p: AmcPlan) => p.isActive));
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

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
            <span className="text-gray-900 dark:text-primary-foreground font-medium">Honda Service Contract</span>
          </nav>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-3">
                <span className="w-6 h-0.5 bg-primary rounded-full" />
                Annual Maintenance Contract
              </div>
              <h1 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold md:text-4xl font-bold lg:text-5xl font-black text-gray-900 dark:text-primary-foreground tracking-tight leading-tight">
                Honda Service Contract
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-4 text-lg">
                Purchase a Honda Service Contract Book and get exclusive benefits, discounts, and peace of mind for your vehicle beyond the standard warranty.
              </p>
            </div>
            
            <div className="hidden md:flex w-32 h-32 bg-red-50 dark:bg-red-900/10 rounded-full items-center justify-center flex-shrink-0">
              <Shield className="w-16 h-16 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold font-black text-gray-900 dark:text-primary-foreground mb-4">Choose Your Protection Plan</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Select the contract duration that best fits your riding needs. The longer the contract, the higher your overall savings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {isLoading ? (
            <div className="col-span-1 lg:col-span-3 text-center py-20 text-gray-500">
              Loading plans...
            </div>
          ) : plans.map((plan, idx) => {
            const color = plan.isPopular ? "bg-red-50 dark:bg-red-900/10 border-primary shadow-xl shadow-red-100 dark:shadow-red-900/20" : "bg-[#e8dfd1] dark:bg-slate-900 border-gray-200 dark:border-background/10";
            const headerColor = plan.isPopular ? "text-primary" : "text-gray-900 dark:text-primary-foreground";

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative rounded-3xl border p-8 flex flex-col h-full transition-transform hover:-translate-y-2 ${color}`}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                    Most Popular
                  </div>
                )}
                
                <div className="text-center mb-8 border-b border-gray-200 dark:border-background/10 pb-8">
                  <h3 className={`text-2xl md:text-3xl font-semibold font-black mb-2 ${headerColor}`}>
                    Honda Service Contract ({plan.title})
                  </h3>
                  <div className="text-gray-500 text-sm mb-4">Purchase Amount</div>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-xl md:text-2xl font-semibold font-bold text-gray-400">Rs.</span>
                    <span className={`text-2xl md:text-3xl font-semibold md:text-4xl font-bold md:text-4xl font-bold md:text-6xl font-bold tracking-tight font-black ${headerColor}`}>{plan.price}</span>
                    <span className="text-gray-400 font-medium">/-</span>
                  </div>
                </div>

                <div className="flex-1">
                  <ul className="space-y-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${plan.isPopular ? 'bg-red-100 dark:bg-red-900/30' : 'bg-background dark:bg-[#2A2A2A]'} shadow-sm`}>
                          <LucideIcons.CheckCircle className={`w-4 h-4 ${plan.isPopular ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`} />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-primary-foreground text-sm">
                            {feature.text}
                          </div>
                          {feature.subtext && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {feature.subtext}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-background/10">
                  <div className={`rounded-xl p-4 text-center ${plan.isPopular ? 'bg-primary text-primary-foreground' : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'}`}>
                    <div className="text-sm font-bold opacity-90 mb-1">Total Customer Saving</div>
                    <div className="text-2xl md:text-3xl font-semibold font-black">Rs. {plan.savings}/-</div>
                  </div>
                  <Link href={`/amc/book?plan=${encodeURIComponent(plan.title)}`} className={`w-full block text-center py-4 rounded-xl font-bold transition-colors mt-4 ${
                    plan.isPopular 
                      ? 'bg-gray-900 hover:bg-black  dark:text-black dark:hover:bg-gray-200 text-primary-foreground' 
                      : 'bg-background hover:bg-background dark:bg-[#2A2A2A] dark:hover:bg-[#333] text-gray-900 dark:text-primary-foreground border border-gray-200 dark:border-background/10'
                  }`}>
                    Purchase Plan
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 pb-12">
         <div className="bg-primary rounded-3xl p-8 md:p-12 text-primary-foreground flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute -right-20 -top-20 opacity-10">
               <Shield className="w-96 h-96" />
            </div>
            
            <div className="relative z-10 max-w-2xl">
               <h3 className="text-2xl md:text-3xl font-semibold md:text-3xl font-black mb-3">Ready to protect your Honda?</h3>
               <p className="text-primary-foreground/80">
                  Visit our showroom today to purchase your Honda Service Contract book and start enjoying lifetime priority service and incredible discounts immediately.
               </p>
            </div>
            <div className="relative z-10 flex-shrink-0">
               <Link href="/book-now" className="bg-background text-primary px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all inline-block">
                  Book Appointment
               </Link>
            </div>
         </div>
      </div>

    </div>
  );
}
