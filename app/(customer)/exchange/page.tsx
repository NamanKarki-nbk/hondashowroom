"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { BIKE_DATA } from './data';
import { 
  Calculator, 
  ChevronRight, 
  Car, 
  Gauge, 
  Calendar, 
  User, 
  Star,
  CheckCircle,
  HelpCircle,
  TrendingDown,
  Activity,
  Share2
} from 'lucide-react';

export default function ExchangePage() {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 14 }, (_, i) => currentYear - i); // From 2012 to current year

  // Form State
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [variant, setVariant] = useState("");
  const [year, setYear] = useState<number>(currentYear - 2);
  const [kms, setKms] = useState<number>(10000);
  const [condition, setCondition] = useState("Good");
  const [owner, setOwner] = useState("1st Owner");

  // Options State
  const [modelsList, setModelsList] = useState<string[]>([]);
  const [variantsList, setVariantsList] = useState<string[]>([]);

  // Result State
  const [showResult, setShowResult] = useState(false);
  const [valuation, setValuation] = useState<{ min: number, max: number, fair: number, best: number, calculated: number } | null>(null);

  // Update dependent dropdowns
  useEffect(() => {
    if (brand && BIKE_DATA[brand]) {
      setModelsList(Object.keys(BIKE_DATA[brand]));
      setModel("");
      setVariant("");
    } else {
      setModelsList([]);
      setVariantsList([]);
    }
  }, [brand]);

  useEffect(() => {
    if (brand && model && BIKE_DATA[brand][model]) {
      setVariantsList(Object.keys(BIKE_DATA[brand][model]));
      setVariant("");
    } else {
      setVariantsList([]);
    }
  }, [model, brand]);

  const calculateValuation = () => {
    if (!brand || !model || !variant || !year || !kms) return;
    
    const basePrice = BIKE_DATA[brand][model][variant];
    const age = Math.max(0, currentYear - year);
    
    // Depreciation logic
    let depreciation = 0;
    if (age >= 1) depreciation += 0.15;
    if (age >= 2) depreciation += 0.10;
    if (age >= 3) depreciation += 0.10;
    if (age > 3) depreciation += (age - 3) * 0.07;
    
    // Cap depreciation at 80% max
    depreciation = Math.min(0.80, depreciation);
    
    let value = basePrice * (1 - depreciation);

    // Kms Driven Factor
    const expectedKms = age * 8000;
    if (kms > expectedKms) {
      const extraKms = kms - expectedKms;
      const penaltyBlocks = Math.floor(extraKms / 5000);
      value = value * (1 - (penaltyBlocks * 0.02));
    }

    // Ownership Adjustment
    if (owner === "2nd Owner") value *= 0.92;
    else if (owner === "3rd+ Owner") value *= 0.82;

    const bestValue = value * 1.0;
    const fairValue = value * 0.80;

    // Condition Multiplier
    let finalValue = value;
    if (condition === "Excellent") finalValue *= 1.0;
    else if (condition === "Good") finalValue *= 0.90;
    else if (condition === "Fair") finalValue *= 0.80;

    setValuation({
      calculated: finalValue,
      min: finalValue * 0.95,
      max: finalValue * 1.05,
      fair: fairValue,
      best: bestValue
    });
    
    setShowResult(true);
    setTimeout(() => {
      document.getElementById('valuation-result')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const inputClass = 'bg-background dark:bg-[#111] border border-gray-200 dark:border-background/10 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-[#B83227] outline-none text-gray-900 dark:text-primary-foreground w-full text-sm font-semibold transition-all duration-200';
  const labelClass = 'text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2 block';

  // Schema Markup
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Used Bike Valuation Calculator",
    "description": "Calculate accurate resale value for your used bike instantly.",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "NPR"
    }
  };

  return (
    <main className="min-h-screen bg-background dark:bg-[#0B0B0C] pt-28 pb-20 font-sans transition-colors duration-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }} />
      
      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-6 mb-16">
        <nav className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm mb-8 font-medium">
          <Link href="/" className="hover:text-[#B83227] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900 dark:text-primary-foreground">Valuation Calculator</span>
        </nav>

        <div className="text-center lg:text-left flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-[#B83227]/10 text-[#B83227] px-4 py-2 rounded-full text-sm font-bold tracking-wider uppercase mb-6">
              <Calculator className="w-4 h-4" /> 100% Free • AI Market Data
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold md:text-4xl font-bold md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-6 leading-tight">
              Get Accurate <span className="text-[#B83227]">Used Bike</span><br />Valuation in Seconds.
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto lg:mx-0">
              Check the best resale value of your old bike instantly before selling or exchanging.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Calculator Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#B83227]/5 rounded-full blur-3xl -z-10"></div>
          
          <h2 className="text-2xl md:text-3xl font-semibold font-black text-gray-900 dark:text-white uppercase tracking-tight mb-8 flex items-center gap-3">
            <Car className="text-[#B83227]" /> Enter Vehicle Details
          </h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Brand</label>
                <select value={brand} onChange={e => setBrand(e.target.value)} className={inputClass}>
                  <option value="">Select Brand</option>
                  {Object.keys(BIKE_DATA).map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Model</label>
                <select value={model} onChange={e => setModel(e.target.value)} disabled={!brand} className={inputClass + ' disabled:opacity-50'}>
                  <option value="">Select Model</option>
                  {modelsList.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Variant / Version</label>
                <select value={variant} onChange={e => setVariant(e.target.value)} disabled={!model} className={inputClass + ' disabled:opacity-50'}>
                  <option value="">Select Variant</option>
                  {variantsList.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Manufacturing Year</label>
                <select value={year} onChange={e => setYear(Number(e.target.value))} className={inputClass}>
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Total Kilometers Driven: <span className="text-[#B83227]">{kms.toLocaleString()} km</span>
              </label>
              <input 
                type="range" 
                min="0" 
                max="150000" 
                step="1000"
                value={kms} 
                onChange={e => setKms(Number(e.target.value))}
                className="w-full accent-[#B83227] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                <span>0 km</span>
                <span>150,000+ km</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div>
                <label className={labelClass}>Ownership</label>
                <div className="flex gap-2">
                  {["1st Owner", "2nd Owner", "3rd+ Owner"].map(o => (
                    <button 
                      key={o}
                      onClick={() => setOwner(o)}
                      className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors border ${owner === o ? 'bg-[#B83227] text-white border-[#B83227]' : 'bg-transparent text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-gray-400'}`}
                    >
                      {o.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelClass}>Condition</label>
                <div className="flex gap-2">
                  {["Excellent", "Good", "Fair"].map(c => (
                    <button 
                      key={c}
                      onClick={() => setCondition(c)}
                      className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors border ${condition === c ? 'bg-[#B83227] text-white border-[#B83227]' : 'bg-transparent text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-gray-400'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={calculateValuation}
              disabled={!brand || !model || !variant}
              className="w-full bg-[#B83227] hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl uppercase tracking-wider transition-all duration-300 shadow-xl shadow-[#B83227]/20 flex items-center justify-center gap-2 mt-4"
            >
              <Calculator className="w-5 h-5" /> Calculate Valuation
            </button>
          </div>
        </div>

        {/* Right Column / Results & Info */}
        <div className="lg:col-span-5 space-y-8" id="valuation-result">
          {showResult && valuation ? (
            <div className="bg-white dark:bg-slate-900 border-2 border-[#B83227] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-[#B83227]/10 animate-fade-in-up">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Your Bike</div>
                  <h3 className="text-xl md:text-2xl font-semibold font-black text-gray-900 dark:text-white uppercase tracking-tight">{brand} {model}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{variant} • {year} • {owner}</p>
                </div>
                <div className="bg-background dark:bg-[#111] px-4 py-2 rounded-xl text-center">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Condition</div>
                  <div className="text-sm font-black text-[#B83227] uppercase">{condition}</div>
                </div>
              </div>

              <div className="text-center mb-8">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Estimated Market Value</p>
                <div className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold md:text-4xl font-bold sm:text-5xl font-black text-gray-900 dark:text-white tracking-tighter">
                  NPR {Math.round(valuation.min).toLocaleString()} <span className="text-[#B83227]">-</span> NPR {Math.round(valuation.max).toLocaleString()}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-background dark:bg-[#111] p-4 rounded-2xl text-center">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Fair Value</div>
                  <div className="text-lg font-black text-gray-900 dark:text-white">NPR {Math.round(valuation.fair).toLocaleString()}</div>
                </div>
                <div className="bg-background dark:bg-[#111] p-4 rounded-2xl text-center">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Best Value</div>
                  <div className="text-lg font-black text-gray-900 dark:text-white">NPR {Math.round(valuation.best).toLocaleString()}</div>
                </div>
              </div>

              <div className="space-y-3">
                <Link href="/contact" className="w-full flex items-center justify-center gap-2 bg-[#B83227] hover:bg-primary-hover text-white font-bold py-3.5 rounded-xl uppercase tracking-wider transition-colors shadow-lg shadow-[#B83227]/20">
                  <Car className="w-5 h-5" /> Sell / Exchange Your Bike
                </Link>
                <button className="w-full flex items-center justify-center gap-2 bg-background hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-900 dark:text-white font-bold py-3.5 rounded-xl uppercase tracking-wider transition-colors">
                  <Share2 className="w-5 h-5" /> Share Valuation
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#B83227] rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden h-full flex flex-col justify-center min-h-[400px]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -z-10"></div>
              <Activity className="w-16 h-16 text-white/50 mb-6" />
              <h3 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold font-black uppercase tracking-tight mb-4">Ready to find out?</h3>
              <p className="text-white/80 font-medium text-lg">
                Fill in the details of your vehicle on the left to get an instant, AI-driven market valuation range based on real-world depreciation data.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Reference Matrix & FAQ */}
      <div className="max-w-7xl mx-auto px-6 mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Matrix */}
        <div>
          <h3 className="text-2xl md:text-3xl font-semibold font-black text-gray-900 dark:text-white uppercase tracking-tight mb-6 flex items-center gap-2">
            <TrendingDown className="text-[#B83227]" /> Reference Prices
          </h3>
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background dark:bg-[#111]">
                  <th className="py-4 px-6 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest border-b border-gray-200 dark:border-slate-800">Model</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest border-b border-gray-200 dark:border-slate-800">Age</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest border-b border-gray-200 dark:border-slate-800">Avg Value</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 dark:border-slate-800">
                  <td className="py-4 px-6 text-sm font-bold text-gray-900 dark:text-white">Honda Shine BS6</td>
                  <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">3 Years</td>
                  <td className="py-4 px-6 text-sm font-black text-[#B83227]">~ NPR 182,000</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-slate-800">
                  <td className="py-4 px-6 text-sm font-bold text-gray-900 dark:text-white">Royal Enfield Classic 350</td>
                  <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">4 Years</td>
                  <td className="py-4 px-6 text-sm font-black text-[#B83227]">~ NPR 350,000</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-slate-800">
                  <td className="py-4 px-6 text-sm font-bold text-gray-900 dark:text-white">Yamaha FZ-S V3</td>
                  <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">2 Years</td>
                  <td className="py-4 px-6 text-sm font-black text-[#B83227]">~ NPR 305,000</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-sm font-bold text-gray-900 dark:text-white">Bajaj Pulsar 150</td>
                  <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">5 Years</td>
                  <td className="py-4 px-6 text-sm font-black text-[#B83227]">~ NPR 150,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h3 className="text-2xl md:text-3xl font-semibold font-black text-gray-900 dark:text-white uppercase tracking-tight mb-6 flex items-center gap-2">
            <HelpCircle className="text-[#B83227]" /> Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-md">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">How accurate is this valuation?</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed">Our AI-driven formula uses standard market depreciation rates, condition penalties, and average kilometers to provide a highly realistic price range. However, physical inspection dictates the final price.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-md">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">How does ownership affect the price?</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed">A vehicle with a single owner maintains a higher resale value. A 2nd owner typically deducts 8% from the value, and 3rd+ owners can reduce the value by up to 18%.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-md">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Can I sell my bike instantly?</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed">Yes! If you are satisfied with the valuation range, click "Sell / Exchange Your Bike" to schedule an inspection at our Honda showroom.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
