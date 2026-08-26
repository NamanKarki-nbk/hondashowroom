"use client";

import React, { useState, useEffect } from "react";
import { ArrowUpRight, Download } from "lucide-react";

export default function EmiCalculator({
  vehicleName = "NX200",
  vehicleImage,
  initialPrice = 160595,
}: {
  vehicleName?: string;
  vehicleImage?: string;
  initialPrice?: number;
}) {
  const [downPayment, setDownPayment] = useState(16060);
  const [interestRate, setInterestRate] = useState(9);
  const [tenure, setTenure] = useState(24);
  const [tenureType, setTenureType] = useState<"Mo" | "Yr">("Mo");

  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);

  useEffect(() => {
    const p = initialPrice - downPayment;
    if (p <= 0) { setEmi(0); setTotalInterest(0); setLoanAmount(0); return; }
    const r = interestRate / 12 / 100;
    const n = tenureType === "Yr" ? tenure * 12 : tenure;
    const emiAmount = r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setLoanAmount(Math.round(p));
    setEmi(Math.round(emiAmount));
    setTotalInterest(Math.round(emiAmount * n - p));
  }, [initialPrice, downPayment, interestRate, tenure, tenureType]);

  const dpPct = Math.min(100, (downPayment / initialPrice) * 100);
  const irPct = Math.min(100, ((interestRate - 5) / 15) * 100);
  const tenurePct = tenureType === "Mo"
    ? Math.min(100, ((tenure - 12) / 48) * 100)
    : Math.min(100, ((tenure - 1) / 4) * 100);

  const sliderBg = (pct: number) =>
    `linear-gradient(to right, #cc0000 0%, #cc0000 ${pct}%, #3a3a3a ${pct}%, #3a3a3a 100%)`;

  return (
    <section className="bg-black text-primary-foreground w-full">
      <style>{`
        .emi-sl { -webkit-appearance:none; appearance:none; height:2px; width:100%; display:block; outline:none; cursor:pointer; }
        .emi-sl::-webkit-slider-thumb { -webkit-appearance:none; width:13px; height:13px; border-radius:50%; background:#cc0000; cursor:pointer; }
        .emi-sl::-moz-range-thumb { width:13px; height:13px; border-radius:50%; background:#cc0000; border:none; cursor:pointer; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance:none; margin:0; }
        input[type=number] { -moz-appearance:textfield; }
      `}</style>

      <div className="flex flex-col lg:flex-row w-full min-h-[520px]">

        {/* ── LEFT COLUMN ── */}
        <div className="flex-1 lg:max-w-[46%] px-8 md:px-14 xl:px-20 py-14 flex flex-col justify-center">

          {/* Dropdowns */}
          <div className="grid grid-cols-2 gap-8 mb-5">
            {[
              { label: "VARIANTS", opts: [vehicleName] },
              { label: "STATE", opts: ["Delhi", "Maharashtra", "Karnataka"] },
            ].map(({ label, opts }) => (
              <div key={label} className="border-b border-gray-300 dark:border-gray-600 pb-1.5 relative">
                <p className="text-gray-500 dark:text-gray-400 text-[10px] tracking-[0.15em] uppercase mb-1">{label}</p>
                <select className="w-full bg-transparent font-semibold text-sm outline-none appearance-none cursor-pointer pr-5">
                  {opts.map((o) => <option key={o} className="text-black">{o}</option>)}
                </select>
                <div className="absolute right-0 bottom-2 pointer-events-none">
                  <svg width="9" height="5" viewBox="0 0 9 5" fill="none">
                    <path d="M1 1L4.5 4L8 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Enquire / Brochure */}
          <div className="flex items-center gap-5 mb-7">
            <button className="bg-primary hover:bg-primary-hover text-primary-foreground px-5 py-2 rounded-full font-bold text-sm transition-colors flex items-center gap-1.5">
              Enquire now <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button className="text-primary-foreground hover:text-gray-300 text-sm font-semibold flex items-center gap-1.5">
              Get brochure <Download className="w-3.5 h-3.5 text-primary" />
            </button>
          </div>

          <hr className="border-gray-700 mb-5" />

          <h2 className="text-lg font-bold mb-5">EMI Calculator with Model Selection</h2>

          {/* Down Payment */}
          <div className="mb-7">
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-400 dark:text-gray-600 text-sm">Down Payment</label>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="bg-transparent border border-gray-500 text-primary-foreground text-sm px-3 py-1.5 w-36 text-right outline-none focus:border-red-600"
              />
            </div>
            <input type="range" min="0" max={initialPrice} step="1000"
              value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))}
              className="emi-sl" style={{ background: sliderBg(dpPct) }} />
          </div>

          {/* Interest Rate + Mo/Yr + Tenure — all one row */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <label className="text-gray-400 dark:text-gray-600 text-sm shrink-0">Interest Rate (%)</label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="bg-transparent border border-gray-500 text-primary-foreground text-sm px-3 py-1.5 w-14 text-center outline-none focus:border-red-600"
            />
            <div className="flex border border-gray-600 ml-4 shrink-0">
              <button onClick={() => setTenureType("Mo")}
                className={`px-3 py-1.5 text-xs font-bold transition-colors ${tenureType === "Mo" ? "bg-primary text-primary-foreground" : "text-gray-400 dark:text-gray-600 hover:text-primary-foreground"}`}>
                Mo
              </button>
              <button onClick={() => setTenureType("Yr")}
                className={`px-3 py-1.5 text-xs font-bold border-l border-gray-600 transition-colors ${tenureType === "Yr" ? "bg-primary text-primary-foreground" : "text-gray-400 dark:text-gray-600 hover:text-primary-foreground"}`}>
                Yr
              </button>
            </div>
            <input
              type="number"
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="bg-transparent border border-gray-500 text-primary-foreground text-sm px-3 py-1.5 w-16 text-center outline-none focus:border-red-600"
            />
          </div>

          {/* Two sliders side by side */}
          <div className="grid grid-cols-2 gap-4 mb-7">
            <input type="range" min="5" max="20" step="0.5"
              value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))}
              className="emi-sl" style={{ background: sliderBg(irPct) }} />
            <input type="range"
              min={tenureType === "Mo" ? "12" : "1"}
              max={tenureType === "Mo" ? "60" : "5"}
              step="1"
              value={tenure} onChange={(e) => setTenure(Number(e.target.value))}
              className="emi-sl" style={{ background: sliderBg(tenurePct) }} />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4 mb-8">
            <button className="bg-primary hover:bg-primary-hover text-primary-foreground px-6 py-2.5 rounded-full font-bold text-sm transition-colors">
              Calculate EMI
            </button>
            <button className="bg-primary hover:bg-primary-hover text-primary-foreground px-6 py-2.5 rounded-full font-bold text-sm transition-colors">
              Avail Finance
            </button>
          </div>

          {/* Disclaimer */}
          <p className="text-[10px] text-gray-500 dark:text-gray-500 leading-relaxed">
            Disclaimer: *Interest rate/ Finance disbursal will depend on financial institution / banks
            discretion. The calculation performed by EMI Calculator is based on the information you
            entered on reducing rate of interest and is for illustrative purposes only. This calculation
            reflects amounts in Indian Rupee rounded to the nearest whole figure. Estimated monthly
            payments DO NOT include any processing or other possible fees which may depend on the
            financial institution / banks.
          </p>
        </div>

        {/* ── RIGHT COLUMN — Results Card ── */}
        <div
          className="flex-1 relative overflow-hidden flex flex-col lg:rounded-l-2xl"
          style={{
            background: "linear-gradient(155deg, #6b0000 0%, #3d0000 35%, #1c0000 100%)",
            minHeight: "520px",
          }}
        >
          {/* Noise texture */}
          <div className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

          {/* Text — top left of card */}
          <div className="relative z-10 p-8 lg:p-10">
            <h2 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold lg:text-4xl font-extrabold text-primary-foreground mb-1">{vehicleName}</h2>
            <p className="text-gray-400 dark:text-gray-600 text-xs mb-7">*Ex-Showroom Delhi ₹ {initialPrice.toLocaleString("en-IN")}</p>

            {/* Loan Amount & Total Interest — right aligned values */}
            <div className="space-y-2 max-w-[320px]">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Loan Amount</span>
                <span className="font-semibold text-sm tabular-nums">₹ {loanAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Total Interest</span>
                <span className="font-semibold text-sm tabular-nums">₹ {totalInterest.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* EMI — very large display */}
            <div className="mt-6">
              <p className="text-primary-foreground font-bold text-base mb-1">
                EMI for {tenureType === "Yr" ? tenure * 12 : tenure} months
              </p>
              <p className="text-primary-foreground font-black tabular-nums" style={{ fontSize: "clamp(2.5rem, 5vw, 3.75rem)", lineHeight: 1 }}>
                ₹ {emi.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* Bike image — large, bottom right */}
          {vehicleImage && (
            <div className="absolute bottom-0 right-0 z-20 pointer-events-none w-[70%] lg:w-[62%]">
              <img
                src={vehicleImage}
                alt={vehicleName}
                className="w-full h-auto object-contain"
                style={{ filter: "drop-shadow(0 0 60px rgba(0,0,0,0.9))" }}
              />
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
