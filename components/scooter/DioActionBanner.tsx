"use client";

import React, { useState } from "react";
import { Calendar, Phone, MapPin, Calculator, Download, CheckCircle, ArrowRight } from "lucide-react";

interface DioActionBannerProps {
  onBookNow: () => void;
  onTestRide: () => void;
}

export default function DioActionBanner({ onBookNow, onTestRide }: DioActionBannerProps) {
  const [tenure, setTenure] = useState<number>(36);
  const [downPaymentPct, setDownPaymentPct] = useState<number>(30);

  const vehiclePrice = 235900;
  const downPaymentAmount = Math.round(vehiclePrice * (downPaymentPct / 100));
  const loanAmount = vehiclePrice - downPaymentAmount;
  const interestRate = 0.114; // 11.4% per annum
  const estimatedMonthlyEmi = Math.round((loanAmount * (1 + interestRate * (tenure / 12))) / tenure);

  return (
    <section id="emi-calculator" className="py-20 px-4 sm:px-6 lg:px-8 bg-background border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Interactive EMI Estimation Preview Box */}
        <div className="bg-white dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-bl-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left: Controls */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-primary text-xs font-black tracking-widest uppercase mb-2">
                  <Calculator className="w-4 h-4" /> Finance Estimator
                </div>
                <h3 className="text-2xl md:text-3xl font-semibold sm:text-3xl font-black text-foreground uppercase tracking-tight">
                  Honda Dio 110 EMI Calculator
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Adjust down payment and tenure to calculate your monthly installment.
                </p>
              </div>

              {/* Downpayment Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm font-bold">
                  <span className="text-gray-600 dark:text-gray-400 uppercase">Down Payment ({downPaymentPct}%)</span>
                  <span className="text-primary font-black">NPR {downPaymentAmount.toLocaleString("en-IN")}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="60"
                  step="5"
                  value={downPaymentPct}
                  onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Tenure Selection */}
              <div className="space-y-2">
                <span className="block text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400 uppercase">
                  Tenure Duration
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {[12, 24, 36, 48].map((m) => (
                    <button
                      key={m}
                      onClick={() => setTenure(m)}
                      className={`py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all border ${
                        tenure === m
                          ? "bg-primary text-primary-foreground border-primary shadow-md"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {m} Months
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: EMI Output Box */}
            <div className="lg:col-span-5 bg-gray-50 dark:bg-[#1C1C20] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 text-center space-y-4">
              <span className="text-xs font-black uppercase tracking-widest text-gray-500 block">
                Estimated Monthly EMI
              </span>
              <div className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold md:text-4xl font-bold sm:text-5xl font-black text-primary">
                NPR {estimatedMonthlyEmi.toLocaleString("en-IN")}
                <span className="text-xs font-normal text-gray-500 block mt-1">/ month for {tenure} months</span>
              </div>

              <div className="pt-2 border-t border-gray-200 dark:border-gray-800 text-xs space-y-1 text-gray-500">
                <div className="flex justify-between">
                  <span>Loan Principal:</span>
                  <span className="font-bold text-foreground">NPR {loanAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Interest Rate:</span>
                  <span className="font-bold text-foreground">11.4% p.a.</span>
                </div>
              </div>

              <button
                onClick={onBookNow}
                className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-black py-3.5 rounded-xl uppercase tracking-wider text-xs shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
              >
                Apply For Finance <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Call-To-Action Banner */}
        <div className="bg-gradient-to-r from-red-900 via-primary to-red-800 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <h3 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold sm:text-4xl font-black uppercase tracking-tight leading-tight">
              Ready to Ride The New Honda Dio?
            </h3>
            <p className="text-sm sm:text-base text-red-100 leading-relaxed">
              Visit your nearest Honda Dealership or book your Dio 110 online with instant confirmation and door-step delivery options.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <button
              onClick={onBookNow}
              className="bg-white text-primary hover:bg-gray-100 font-black px-8 py-4 rounded-xl uppercase tracking-wider text-sm shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" /> Book Online Now
            </button>
            <button
              onClick={onTestRide}
              className="bg-black/30 hover:bg-black/50 text-white border border-white/30 font-bold px-8 py-4 rounded-xl uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" /> Request Callback
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
