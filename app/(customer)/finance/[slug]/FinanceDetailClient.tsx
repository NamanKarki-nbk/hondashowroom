"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";

export default function FinanceDetailClient({ product, specs }: { product: any, specs: any }) {
  const [plan, setPlan] = useState<"Bullet" | "Balloon" | "Standard">("Standard");
  
  const [downPayment, setDownPayment] = useState(product.price * 0.2); // 20% default
  const [tenure, setTenure] = useState(36); // months
  const [bulletPct, setBulletPct] = useState(30);
  
  const [emi, setEmi] = useState(0);

  useEffect(() => {
    const p = Math.max(0, product.price - downPayment);
    if (p <= 0) { setEmi(0); return; }
    
    // Very basic mockup calculations for the plans
    const r = 0.12 / 12; // 12% annual
    const n = tenure;
    
    let calcEmi = 0;
    if (plan === "Standard") {
      calcEmi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else if (plan === "Bullet") {
      // Just a mockup reduction for bullet
      calcEmi = ((p * (1 - (bulletPct/100))) * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else if (plan === "Balloon") {
      calcEmi = (p * 0.8 * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1); // 20% balloon
    }
    
    setEmi(Math.round(calcEmi));
  }, [downPayment, tenure, bulletPct, plan, product.price]);

  const dpPct = Math.min(100, Math.max(0, (downPayment / product.price) * 100));
  const tenurePct = ((tenure - 12) / 48) * 100;
  const bulletSliderPct = ((bulletPct - 5) / 25) * 100;

  const getSliderStyle = (pct: number) => ({
    background: `linear-gradient(to right, #0066ff ${pct}%, #e5e7eb ${pct}%)`
  });

  return (
    <main className="min-h-screen bg-background">
      
      {/* Hero Banner (Image 4) */}
      <div className="relative w-full h-[60vh] min-h-[400px] bg-[#111] overflow-hidden">
        <div className="absolute inset-0">
           <img 
             src={product.category === "SCOOTERS" ? "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=2070" : "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070"} 
             className="w-full h-full object-cover opacity-60" 
             alt="Hero Background" 
           />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-2 uppercase max-w-2xl">
              THE {product.name.toUpperCase()}.
            </h1>
            <p className="text-white text-lg font-bold">
              EX-SHOWROOM PRICE STARTS AT ₹{(product.price/100000).toFixed(2)} LAKHS*.
            </p>
          </div>
        </div>
        {/* Right side floating bike image */}
        <div className="absolute right-0 bottom-10 w-1/2 lg:w-1/3 flex justify-end pr-10">
           <img src={product.imageUrl} alt={product.name} className="w-full max-w-lg object-contain drop-shadow-2xl" />
        </div>
      </div>

      {/* Decorative separator */}
      <div className="py-8 flex justify-center items-center bg-background">
        <div className="flex items-center gap-4">
          <div className="h-[1px] w-32 bg-gray-400"></div>
          <div className="text-center">
            <span className="block font-bold text-foreground text-xl tracking-widest uppercase">
              ONE STEP CLOSER TO YOUR {product.name.toUpperCase()}
            </span>
          </div>
          <div className="h-[1px] w-32 bg-gray-400"></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Specs Header (Image 3) */}
        <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
           <div className="flex-1">
             <h2 className="text-3xl font-black uppercase text-foreground mb-1">{product.name}</h2>
             <p className="text-gray-500 uppercase text-sm mb-6">SUPERBIKE OF SUPERLATIVES</p>
             
             <div className="relative mb-6 max-w-sm">
                <select className="w-full border border-gray-300 dark:border-gray-700 bg-transparent text-foreground p-3 appearance-none outline-none">
                  <option>{product.name}</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
             </div>

             <div className="flex gap-6 border-t border-gray-200 dark:border-gray-800 pt-4 mb-6">
               <div>
                 <p className="font-black text-foreground text-lg">{specs.cc}</p>
                 <p className="text-[10px] text-gray-500 uppercase">Cubic Capacity</p>
               </div>
               <div className="w-[1px] bg-gray-200 dark:bg-gray-800"></div>
               <div>
                 <p className="font-black text-foreground text-lg">{specs.power}</p>
                 <p className="text-[10px] text-gray-500 uppercase">Rated Output</p>
               </div>
               <div className="w-[1px] bg-gray-200 dark:bg-gray-800"></div>
               <div>
                 <p className="font-black text-foreground text-lg">{specs.weight}</p>
                 <p className="text-[10px] text-gray-500 uppercase">Kerb Weight</p>
               </div>
             </div>

             <p className="font-bold text-foreground mb-4">Ex-showroom price starts at ₹ {product.price.toLocaleString("en-IN")}/-</p>
             
             <div className="bg-black text-white inline-block px-4 py-3">
               <span className="text-sm">EMI starting at </span>
               <span className="font-bold">₹ {emi.toLocaleString("en-IN")}*</span>
               <span className="text-sm"> Per Month</span>
             </div>
           </div>

           <div className="flex-1 flex justify-center">
             <img src={product.imageUrl} alt={product.name} className="max-w-full lg:max-w-md drop-shadow-xl" />
           </div>
        </div>

        {/* EMI Calculator (Image 5) */}
        <div className="mb-8">
          <h2 className="text-3xl font-black uppercase text-foreground mb-6">EMI CALCULATOR</h2>
          
          <div className="border border-gray-300 dark:border-gray-700 bg-background rounded-sm shadow-sm overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-300 dark:border-gray-700">
              {["Bullet", "Balloon", "Standard"].map(p => (
                <button 
                  key={p} 
                  onClick={() => setPlan(p as any)}
                  className={`flex-1 py-4 text-center font-medium transition-colors ${plan === p ? "border-b-4 border-blue-600 bg-gray-50 dark:bg-[#1A1A1A] text-foreground" : "text-gray-500 hover:text-foreground"}`}
                >
                  Honda {p} Plan
                </button>
              ))}
            </div>

            <style>{`
              .blue-slider {
                -webkit-appearance: none;
                width: 100%;
                height: 4px;
                background: #e5e7eb;
                outline: none;
                border-radius: 2px;
              }
              .blue-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #0066ff;
                cursor: pointer;
              }
            `}</style>

            {/* Sliders Container */}
            <div className="p-8 space-y-12">
              
              {/* Down Payment */}
              <div>
                 <h3 className="text-xl font-bold text-foreground mb-6">Down Payment</h3>
                 <div className="relative pt-6">
                   <div className="absolute right-0 top-0 font-bold text-foreground text-sm">
                     ₹ {downPayment.toLocaleString("en-IN")}/-
                   </div>
                   <input 
                     type="range" min={0} max={product.price} step={5000}
                     value={downPayment} onChange={e => setDownPayment(Number(e.target.value))}
                     className="blue-slider mb-2" style={getSliderStyle(dpPct)}
                   />
                   <div className="flex justify-between text-[10px] text-gray-500 font-bold">
                     <span>5%</span><span>10%</span><span>15%</span><span>20%</span><span>25%</span><span>30%</span><span>35%</span><span>40%</span><span>45%</span><span>50%</span>
                   </div>
                 </div>
              </div>

              {/* Tenure */}
              <div>
                 <h3 className="text-xl font-bold text-foreground mb-6">Tenure</h3>
                 <div className="relative pt-6">
                   <div className="absolute right-0 top-0 font-bold text-foreground text-sm">
                     {tenure} Months
                   </div>
                   <input 
                     type="range" min={12} max={60} step={12}
                     value={tenure} onChange={e => setTenure(Number(e.target.value))}
                     className="blue-slider mb-2" style={getSliderStyle(tenurePct)}
                   />
                   <div className="flex justify-between text-[10px] text-gray-500 font-bold">
                     <span>12</span><span>24</span><span>36</span><span>48</span><span>60</span>
                   </div>
                 </div>
              </div>

              {/* Bullet Percentage (Only if plan is Bullet) */}
              <div className={`transition-opacity duration-300 ${plan === "Bullet" ? "opacity-100" : "opacity-30 pointer-events-none"}`}>
                 <h3 className="text-xl font-bold text-foreground mb-6">Annual Bullet Percentage</h3>
                 <div className="relative pt-6">
                   <div className="absolute right-0 top-0 font-bold text-foreground text-sm">
                     {bulletPct} %
                   </div>
                   <input 
                     type="range" min={5} max={30} step={5}
                     value={bulletPct} onChange={e => setBulletPct(Number(e.target.value))}
                     className="blue-slider mb-2" style={getSliderStyle(bulletSliderPct)}
                   />
                   <div className="flex justify-between text-[10px] text-gray-500 font-bold">
                     <span>5%</span><span>10%</span><span>15%</span><span>20%</span><span>25%</span><span>30%</span>
                   </div>
                 </div>
              </div>

              {/* Get Results Button */}
              <div className="flex justify-center pt-4">
                 <button className="bg-black hover:bg-gray-800 text-white font-bold px-8 py-3 transition-colors">
                   Get Results
                 </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
