"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FinanceClient({ modelsData }: { modelsData: any[] }) {
  const [category, setCategory] = useState("All");
  const [emiRange, setEmiRange] = useState("All");
  
  // Modal State
  const [selectedModel, setSelectedModel] = useState<any | null>(null);
  
  // Selected options inside modal
  const [downPaymentPct, setDownPaymentPct] = useState(60); // percentage
  const [tenure, setTenure] = useState(12); // months

  const filteredModels = modelsData.filter(m => {
    if (category !== "All" && m.category !== category) return false;
    
    if (emiRange === "< 5000" && m.minEmi >= 5000) return false;
    if (emiRange === "5000 - 10000" && (m.minEmi < 5000 || m.minEmi > 10000)) return false;
    if (emiRange === "> 10000" && m.minEmi <= 10000) return false;

    return true;
  });

  // Derived selected plan based on user selection in modal
  let selectedPlan = null;
  if (selectedModel) {
    selectedPlan = selectedModel.plans.find(
      (p: any) => p.tenureMonths === tenure && p.downPaymentPct === downPaymentPct
    );
    // If not found (e.g. 36 months doesn't have 60% DP), fallback to first available for that tenure
    if (!selectedPlan) {
      selectedPlan = selectedModel.plans.find((p: any) => p.tenureMonths === tenure);
      if (selectedPlan && selectedPlan.downPaymentPct !== downPaymentPct) {
        // We defer state update to avoid React render loop issues by just using the plan, 
        // but ideally we'd update state. For now, it'll just show the plan.
      }
    }
  }

  // Get available downpayments for current tenure
  const availableDownPayments = selectedModel 
    ? Array.from(new Set(selectedModel.plans.filter((p: any) => p.tenureMonths === tenure).map((p: any) => p.downPaymentPct))).sort((a: any, b: any) => b - a)
    : [];

  return (
    <div>
      {/* Modals */}
      {selectedModel && selectedPlan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-background dark:bg-slate-950 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-slate-800 relative flex flex-col md:flex-row max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedModel(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-[#CC0000] z-10 bg-white/50 dark:bg-black/50 p-1 rounded-full backdrop-blur"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="md:w-1/2 bg-white dark:bg-slate-900 p-8 flex flex-col justify-center items-center relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#CC0000]/10 rounded-full blur-3xl"></div>
               <img 
                 src={selectedModel.imageUrl || "/inventory/honda-dio-125.png"} 
                 alt={selectedModel.modelName}
                 className="w-full h-auto object-contain relative z-10 drop-shadow-xl max-h-64"
               />
               <div className="mt-6 text-center relative z-10">
                 <h2 className="text-2xl md:text-3xl font-semibold font-black text-gray-900 dark:text-white uppercase tracking-tight">{selectedModel.modelName}</h2>
                 <p className="text-[#CC0000] font-bold text-lg mt-1">Ex-showroom NPR {selectedModel.minPrice.toLocaleString()}</p>
               </div>
            </div>

            <div className="md:w-1/2 p-8 bg-background dark:bg-[#151516] flex flex-col justify-center">
               <h3 className="text-xl md:text-2xl font-semibold font-bold uppercase tracking-tight mb-6 text-gray-900 dark:text-white">Finance Plan Breakdown</h3>
               
               <div className="space-y-6">
                 <div>
                    <label className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                      <span>Tenure</span>
                      <span className="text-[#CC0000]">{tenure} Months</span>
                    </label>
                    <div className="flex gap-2">
                      {[12, 24, 36].map(t => (
                        <button 
                          key={t}
                          onClick={() => {
                            setTenure(t);
                            // Auto-adjust down payment if 60% is not available for 36 months
                            if (t === 36 && downPaymentPct === 60) setDownPaymentPct(50);
                          }}
                          className={`flex-1 py-2 rounded-lg font-bold text-sm transition-colors border ${tenure === t ? 'bg-[#CC0000] text-white border-[#CC0000]' : 'bg-transparent text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700'}`}
                        >
                          {t} Months
                        </button>
                      ))}
                    </div>
                 </div>

                 <div>
                    <label className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                      <span>Down Payment %</span>
                      <span className="text-[#CC0000]">{selectedPlan.downPaymentPct}%</span>
                    </label>
                    <div className="flex gap-2">
                      {availableDownPayments.map((dp: any) => (
                        <button 
                          key={dp}
                          onClick={() => setDownPaymentPct(dp)}
                          className={`flex-1 py-2 rounded-lg font-bold text-sm transition-colors border ${selectedPlan.downPaymentPct === dp ? 'bg-[#CC0000] text-white border-[#CC0000]' : 'bg-transparent text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700'}`}
                        >
                          {dp}%
                        </button>
                      ))}
                    </div>
                 </div>

                 <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 text-sm">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Down Payment</span>
                      <span className="font-bold text-gray-900 dark:text-white">Rs. {selectedPlan.downPayment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Loan Amount</span>
                      <span className="font-bold text-gray-900 dark:text-white">Rs. {selectedPlan.loanAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Interest Rate</span>
                      <span className="font-bold text-gray-900 dark:text-white">{selectedPlan.interestRate.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Total Interest</span>
                      <span className="font-bold text-gray-900 dark:text-white">Rs. {selectedPlan.totalInterest.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-2 pt-2 border-t border-gray-100 dark:border-slate-800">
                      <span className="text-gray-500">Registration</span>
                      <span className="font-bold text-gray-900 dark:text-white">Rs. {selectedPlan.registration.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Insurance ({tenure >= 24 ? tenure/12 + 'Y' : '1Y'})</span>
                      <span className="font-bold text-gray-900 dark:text-white">Rs. {(selectedPlan.insuranceTotal || selectedPlan.insurance).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-gray-900 dark:text-white font-bold uppercase tracking-wider">EMI / Month</span>
                      <span className="text-2xl md:text-3xl font-semibold font-black text-[#CC0000]">Rs. {selectedPlan.emi.toLocaleString()}</span>
                    </div>
                 </div>

                 <button className="w-full bg-[#CC0000] hover:bg-primary-hover text-white py-3.5 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#B83227]/20">
                   Apply for Finance
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <div className="relative w-full sm:w-64">
          <select 
            value={category} 
            onChange={e => setCategory(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-800 text-gray-900 dark:text-primary-foreground px-6 py-4 rounded-2xl appearance-none outline-none font-bold shadow-sm focus:ring-2 focus:ring-[#CC0000] transition-all"
          >
            <option value="All">Categories - All</option>
            <option value="MOTORCYCLE">Motorcycles</option>
            <option value="SCOOTER">Scooters</option>
          </select>
          <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
        </div>

        <div className="relative w-full sm:w-64">
          <select 
            value={emiRange} 
            onChange={e => setEmiRange(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-800 text-gray-900 dark:text-primary-foreground px-6 py-4 rounded-2xl appearance-none outline-none font-bold shadow-sm focus:ring-2 focus:ring-[#CC0000] transition-all"
          >
            <option value="All">EMI Range - All</option>
            <option value="< 5000">Under NPR 5,000</option>
            <option value="5000 - 10000">NPR 5,000 - 10,000</option>
            <option value="> 10000">Above NPR 10,000</option>
          </select>
          <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredModels.map(model => (
            <div key={model.modelName} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-8 rounded-3xl flex flex-col group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
              <h3 className="font-black text-xl md:text-2xl font-semibold text-gray-900 dark:text-white uppercase tracking-tight mb-1">{model.modelName}</h3>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
                ({model.defaultDpPct}% DP / {model.defaultTenure} Months)
              </p>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-8 font-semibold mt-1">
                EMI from <span className="text-[#CC0000] font-bold">NPR {model.minEmi.toLocaleString()}</span> /mo
              </p>
              
              <div className="flex-1 flex items-center justify-center mb-8 relative">
                <div className="absolute inset-0 bg-[#CC0000]/5 rounded-full blur-2xl group-hover:bg-[#CC0000]/10 transition-colors"></div>
                <img 
                  src={model.imageUrl || "/inventory/honda-dio-125.png"} 
                  alt={model.modelName}
                  className="w-full h-auto object-contain relative z-10 transform group-hover:scale-110 transition-transform duration-700 drop-shadow-xl"
                />
              </div>

              <div className="mt-auto">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 font-medium uppercase tracking-wider">
                  Starts at <span className="font-black text-gray-900 dark:text-white text-sm">NPR {model.minPrice.toLocaleString()}/-</span>
                </p>
                <button 
                  onClick={() => {
                    setSelectedModel(model);
                    setTenure(model.defaultTenure);
                    setDownPaymentPct(model.defaultDpPct);
                  }}
                  className="w-full bg-background dark:bg-white/10 text-[#CC0000] dark:text-white group-hover:bg-[#CC0000] group-hover:text-white text-sm font-bold py-3.5 rounded-xl uppercase tracking-wider transition-colors"
                >
                  Explore Offer
                </button>
              </div>
            </div>
        ))}
      </div>
    </div>
  );
}
