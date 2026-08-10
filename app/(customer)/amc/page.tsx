"use client";

import React from "react";
import Link from "next/link";
import { Home, ChevronRight, Wrench, Settings, Users, Zap, Droplets, Truck, ShieldCheck, FileText, Banknote, Bike, CheckCircle, Shield } from "lucide-react";
import { motion } from "framer-motion";

const AMC_PLANS = [
  {
    id: "1-year",
    title: "1 Year",
    price: "1,500",
    savings: "2,635",
    color: "bg-[#e8dfd1] dark:bg-[#1A1A1A] border-gray-200 dark:border-[#f3ebdd]/10",
    headerColor: "text-gray-900 dark:text-[#f3ebdd]",
    popular: false,
    features: [
      { text: "4 Free Services", subtext: "(Value Rs. 1,600 equivalent)", icon: Wrench },
      { text: "5% Discount", subtext: "On Spare Parts & Engine Oil", icon: Settings },
      { text: "25% Discount", subtext: "On Labour Charges (other repairs)", icon: Users },
      { text: "Quick Service", subtext: "Lifetime Priority", icon: Zap },
      { text: "3 Free Washings", subtext: "Keep your vehicle shining", icon: Droplets },
      { text: "Free Towing & On-Road Service", subtext: "(50 km round trip, above 50 km Rs. 50/km)", icon: Truck },
    ]
  },
  {
    id: "3-year",
    title: "3 Years",
    price: "3,000",
    savings: "7,717",
    color: "bg-red-50 dark:bg-red-900/10 border-[#c1291A] shadow-xl shadow-red-100 dark:shadow-red-900/20",
    headerColor: "text-[#c1291A]",
    popular: true,
    features: [
      { text: "12 Free Services", subtext: "(Value Rs. 4,800 equivalent)", icon: Wrench },
      { text: "10% Discount", subtext: "On Spare Parts & Engine Oil", icon: Settings },
      { text: "40% Discount", subtext: "On Labour Charges (other repairs)", icon: Users },
      { text: "Quick Service", subtext: "Lifetime Priority", icon: Zap },
      { text: "6 Free Washings", subtext: "Keep your vehicle shining", icon: Droplets },
      { text: "6 Months Engine Warranty", subtext: "Extended peace of mind", icon: ShieldCheck },
      { text: "Tax/Insurance Renewal Service", subtext: "Hassle-free documentation", icon: FileText },
      { text: "Free Towing & On-Road Service", subtext: "(50 km round trip, above 50 km Rs. 50/km)", icon: Truck },
    ]
  },
  {
    id: "5-year",
    title: "5 Years",
    price: "5,000",
    savings: "13,850",
    color: "bg-[#e8dfd1] dark:bg-[#1A1A1A] border-gray-200 dark:border-[#f3ebdd]/10",
    headerColor: "text-gray-900 dark:text-[#f3ebdd]",
    popular: false,
    features: [
      { text: "20 Free Services", subtext: "(Value Rs. 12,000 equivalent)", icon: Wrench },
      { text: "10% Discount", subtext: "On Spare Parts & Engine Oil", icon: Settings },
      { text: "50% Discount", subtext: "On Labour Charges (other repairs)", icon: Users },
      { text: "Quick Service", subtext: "Lifetime Priority", icon: Zap },
      { text: "10 Free Washings", subtext: "Keep your vehicle shining", icon: Droplets },
      { text: "6 Months Engine Warranty", subtext: "Extended peace of mind", icon: ShieldCheck },
      { text: "Tax/Insurance Renewal Service", subtext: "Hassle-free documentation", icon: FileText },
      { text: "Cashback Scheme", subtext: "Rs. 5,000 cashback on upgrading to a new Honda", icon: Banknote },
      { text: "Free Towing & On-Road Service", subtext: "(50 km round trip, above 50 km Rs. 50/km)", icon: Truck },
      { text: "Free Driving Training", subtext: "Learn from the experts", icon: Bike },
    ]
  }
];

export default function AmcPage() {
  return (
    <div className="min-h-screen bg-[#f3ebdd] dark:bg-[#0B0B0C] pt-28 pb-24">

      {/* Hero */}
      <div className="bg-[#f3ebdd] dark:bg-[#111] border-b border-gray-100 dark:border-[#f3ebdd]/5">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-[#c1291A] flex items-center gap-1 transition-colors">
              <Home className="w-3.5 h-3.5" /> Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 dark:text-[#f3ebdd] font-medium">Honda Service Contract</span>
          </nav>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c1291A] mb-3">
                <span className="w-6 h-0.5 bg-[#c1291A] rounded-full" />
                Annual Maintenance Contract
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-[#f3ebdd] tracking-tight leading-tight">
                Honda Service Contract
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-4 text-lg">
                Purchase a Honda Service Contract Book and get exclusive benefits, discounts, and peace of mind for your vehicle beyond the standard warranty.
              </p>
            </div>
            
            <div className="hidden md:flex w-32 h-32 bg-red-50 dark:bg-red-900/10 rounded-full items-center justify-center flex-shrink-0">
              <Shield className="w-16 h-16 text-[#c1291A]" />
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-gray-900 dark:text-[#f3ebdd] mb-4">Choose Your Protection Plan</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Select the contract duration that best fits your riding needs. The longer the contract, the higher your overall savings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {AMC_PLANS.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative rounded-3xl border p-8 flex flex-col h-full transition-transform hover:-translate-y-2 ${plan.color}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#c1291A] text-[#f3ebdd] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                  Most Popular
                </div>
              )}
              
              <div className="text-center mb-8 border-b border-gray-200 dark:border-[#f3ebdd]/10 pb-8">
                <h3 className={`text-2xl font-black mb-2 ${plan.headerColor}`}>
                  Honda Service Contract ({plan.title})
                </h3>
                <div className="text-gray-500 text-sm mb-4">Purchase Amount</div>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-xl font-bold text-gray-400">Rs.</span>
                  <span className={`text-5xl font-black ${plan.headerColor}`}>{plan.price}</span>
                  <span className="text-gray-400 font-medium">/-</span>
                </div>
              </div>

              <div className="flex-1">
                <ul className="space-y-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${plan.popular ? 'bg-red-100 dark:bg-red-900/30' : 'bg-[#f3ebdd] dark:bg-[#2A2A2A]'} shadow-sm`}>
                        <feature.icon className={`w-4 h-4 ${plan.popular ? 'text-[#c1291A]' : 'text-gray-500 dark:text-gray-400'}`} />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-[#f3ebdd] text-sm">
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

              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-[#f3ebdd]/10">
                <div className={`rounded-xl p-4 text-center ${plan.popular ? 'bg-[#c1291A] text-[#f3ebdd]' : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'}`}>
                  <div className="text-sm font-bold opacity-90 mb-1">Total Customer Saving</div>
                  <div className="text-2xl font-black">Rs. {plan.savings}/-</div>
                </div>
                <Link href="/book-now?service=amc" className={`w-full block text-center py-4 rounded-xl font-bold transition-colors mt-4 ${
                  plan.popular 
                    ? 'bg-gray-900 hover:bg-black dark:bg-[#f3ebdd] dark:text-black dark:hover:bg-gray-200 text-[#f3ebdd]' 
                    : 'bg-[#f3ebdd] hover:bg-[#f3ebdd] dark:bg-[#2A2A2A] dark:hover:bg-[#333] text-gray-900 dark:text-[#f3ebdd] border border-gray-200 dark:border-[#f3ebdd]/10'
                }`}>
                  Purchase Plan
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
         <div className="bg-[#c1291A] rounded-3xl p-8 md:p-12 text-[#f3ebdd] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute -right-20 -top-20 opacity-10">
               <Shield className="w-96 h-96" />
            </div>
            
            <div className="relative z-10 max-w-2xl">
               <h3 className="text-2xl md:text-3xl font-black mb-3">Ready to protect your Honda?</h3>
               <p className="text-[#f3ebdd]/80">
                  Visit our showroom today to purchase your Honda Service Contract book and start enjoying lifetime priority service and incredible discounts immediately.
               </p>
            </div>
            <div className="relative z-10 flex-shrink-0">
               <Link href="/book-now" className="bg-[#f3ebdd] text-[#c1291A] px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all inline-block">
                  Book Appointment
               </Link>
            </div>
         </div>
      </div>

    </div>
  );
}
