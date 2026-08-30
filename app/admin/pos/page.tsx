"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Search, UserPlus, CreditCard, FileText, CheckCircle, Calculator, ChevronRight, Zap, ArrowRight, ShieldCheck, Tag } from "lucide-react";
import { useSearchParams } from "next/navigation";

function POSContent() {
  const [vinSearch, setVinSearch] = useState("");
  const [activeVehicle, setActiveVehicle] = useState<any>(null);
  const [customer, setCustomer] = useState({ name: "", phone: "", id: "", customerId: "" });
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [customerSearchResults, setCustomerSearchResults] = useState<any[]>([]);
  const [isSearchingCustomer, setIsSearchingCustomer] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");

  // Read URL params to auto-search VIN if provided
  const searchParams = useSearchParams();
  const vinParam = searchParams?.get("vin");

  useEffect(() => {
    if (vinParam) {
      setVinSearch(vinParam);
      // Automatically trigger mock search if vin is provided
      setActiveVehicle({
        vin: vinParam.toUpperCase(),
        model: "CBR 250RR (Grand Prix Red)",
        price: 1350000,
        status: "In Stock - Damak Warehouse"
      });
    }
  }, [vinParam]);

  const searchCustomers = async (query: string) => {
    setCustomerSearchQuery(query);
    if (query.length < 2) {
      setCustomerSearchResults([]);
      return;
    }
    setIsSearchingCustomer(true);
    try {
      const res = await fetch(`/api/admin/customers/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setCustomerSearchResults(data.customers || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearchingCustomer(false);
    }
  };

  const handleSearch = () => {
    // Mock VIN Search
    if (vinSearch.length > 5) {
      setActiveVehicle({
        vin: vinSearch.toUpperCase(),
        model: "CBR 250RR (Grand Prix Red)",
        price: 1350000,
        status: "In Stock - Damak Warehouse"
      });
    }
  };

  const commission = activeVehicle ? Math.round(activeVehicle.price * 0.015) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 p-4 md:p-8 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-red-900/20 blur-[150px] mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }}></div>
      </div>

      <div className="max-w-[1600px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3">
              <Zap className="w-8 h-8 md:w-10 md:h-10 text-primary animate-pulse" />
              POS Terminal
            </h1>
            <p className="text-gray-400 mt-2 font-medium tracking-wide">Honda Rapid Checkout System</p>
          </div>
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-xl">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-semibold text-gray-300">System Online</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Search & Customer */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* VIN Search Card */}
            <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden group transition-all hover:bg-slate-900/60 hover:border-primary/30">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
              
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3 uppercase tracking-wider">
                <Search className="w-5 h-5 text-primary" /> 
                1. Scan Vehicle
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 group/input">
                  <input 
                    type="text" 
                    value={vinSearch}
                    onChange={e => setVinSearch(e.target.value)}
                    placeholder="Enter VIN / Chassis No..."
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-gray-500 uppercase tracking-widest focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                  <div className="absolute inset-0 border border-primary rounded-2xl opacity-0 group-focus-within/input:opacity-100 group-focus-within/input:scale-105 transition-all duration-300 pointer-events-none"></div>
                </div>
                <button onClick={handleSearch} className="bg-primary hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] active:scale-95 flex items-center justify-center gap-2">
                  Lookup <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {activeVehicle && (
                <div className="mt-8 p-6 bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-500/20 p-3 rounded-full shrink-0">
                      <ShieldCheck className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{activeVehicle.model}</h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="px-2.5 py-1 bg-black/50 rounded-lg text-xs font-mono text-gray-400 border border-white/5">{activeVehicle.vin}</span>
                        <span className="text-sm text-green-400 font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3"/> {activeVehicle.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">MSRP</p>
                    <div className="text-2xl font-black text-white tracking-tight">
                      Rs. {activeVehicle.price.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Customer Linkage Card */}
            <div className={`bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden transition-all duration-500 ${!activeVehicle ? 'opacity-50 grayscale pointer-events-none' : 'opacity-100 hover:border-blue-500/30'}`}>
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-transparent opacity-50"></div>
              
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3 uppercase tracking-wider">
                <UserPlus className="w-5 h-5 text-blue-400" /> 
                2. Link Customer
              </h2>
              
              <div className="space-y-5 relative">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search directory by Name, Phone, or KYC ID..." 
                    value={customerSearchQuery}
                    onChange={(e) => searchCustomers(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                  {customerSearchResults.length > 0 && (
                    <div className="absolute z-20 w-full mt-3 bg-slate-800/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl max-h-72 overflow-y-auto overflow-hidden animate-in fade-in slide-in-from-top-2">
                      {customerSearchResults.map((c, i) => (
                        <div 
                          key={c.id} 
                          onClick={() => {
                            setCustomer({
                              name: c.fullName || "",
                              phone: c.phone || "",
                              id: c.citizenshipNumber || c.licenseNumber || "",
                              customerId: c.id
                            });
                            setCustomerSearchQuery("");
                            setCustomerSearchResults([]);
                          }}
                          className="p-4 hover:bg-blue-500/20 cursor-pointer border-b border-slate-700/50 last:border-0 transition-colors flex items-center justify-between group"
                        >
                          <div>
                            <div className="font-bold text-white text-lg">{c.fullName}</div>
                            <div className="text-sm text-gray-400 mt-1 flex items-center gap-3">
                              <span>{c.phone}</span>
                              {c.citizenshipNumber && (
                                <span className="px-2 py-0.5 bg-slate-900 rounded text-xs border border-slate-700">ID: {c.citizenshipNumber}</span>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                    <input type="text" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
                    <input type="tel" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Citizenship / License Number</label>
                    <input type="text" value={customer.id} onChange={e => setCustomer({...customer, id: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all" />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className={`bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden transition-all duration-500 delay-100 ${(!activeVehicle || !customer.name) ? 'opacity-50 grayscale pointer-events-none' : 'opacity-100 hover:border-purple-500/30'}`}>
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-transparent opacity-50"></div>
              
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3 uppercase tracking-wider">
                <CreditCard className="w-5 h-5 text-purple-400" /> 
                3. Payment Method
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["Bank Transfer", "Cheque", "eSewa", "Cash"].map(method => (
                  <button 
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`relative p-4 rounded-2xl border transition-all duration-300 overflow-hidden group ${
                      paymentMethod === method 
                        ? "bg-purple-500/10 border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]" 
                        : "bg-black/50 border-white/10 text-gray-400 hover:border-white/30 hover:bg-white/5"
                    }`}
                  >
                    {paymentMethod === method && (
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent opacity-50"></div>
                    )}
                    <span className="relative z-10 font-semibold">{method}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Checkout & Invoice */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl sticky top-8 flex flex-col transition-all hover:border-white/20">
              
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                  <Calculator className="w-6 h-6 text-primary" /> 
                  Invoice Summary
                </h2>
                <div className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-gray-300 tracking-widest uppercase">
                  Draft
                </div>
              </div>
              
              <div className="space-y-6 flex-1">
                <div className="group flex justify-between items-center text-base p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <span className="text-gray-400 flex items-center gap-2"><Tag className="w-4 h-4 text-gray-500" /> Base Price</span>
                  <span className="text-white font-semibold">Rs. {activeVehicle ? activeVehicle.price.toLocaleString() : "0"}</span>
                </div>
                <div className="group flex justify-between items-center text-base p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <span className="text-gray-400 flex items-center gap-2"><Tag className="w-4 h-4 text-gray-500" /> VAT (13%)</span>
                  <span className="text-white font-semibold">Inclusive</span>
                </div>
                <div className="group flex justify-between items-center text-base p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <span className="text-gray-400 flex items-center gap-2"><Tag className="w-4 h-4 text-gray-500" /> Registration & Tax</span>
                  <span className="text-gray-500 font-medium italic">At Actuals</span>
                </div>
                
                <div className="pt-8 mt-4">
                   <div className="bg-gradient-to-br from-black/80 to-slate-900/80 p-6 rounded-2xl border border-white/10 relative overflow-hidden shadow-inner">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-orange-500 to-primary opacity-80"></div>
                      <span className="text-gray-400 text-sm font-bold uppercase tracking-widest block mb-2">Total Receivable</span>
                      <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tighter">
                        Rs. {activeVehicle ? activeVehicle.price.toLocaleString() : "0"}
                      </div>
                   </div>
                </div>
              </div>

              {/* Commission (Internal Only) */}
              <div className="mt-8 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 flex items-center justify-between group hover:bg-emerald-500/10 transition-colors">
                <div>
                  <p className="text-xs text-emerald-500/70 uppercase tracking-widest font-bold mb-1">Internal: Sales Commission</p>
                  <p className="text-xl font-black text-emerald-400">Rs. {commission.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <span className="text-emerald-400 font-bold text-sm">1.5%</span>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <button 
                  disabled={!activeVehicle || !customer.name}
                  className="w-full bg-white text-black hover:bg-gray-200 py-5 rounded-2xl font-black text-lg uppercase tracking-wider transition-all flex justify-center items-center gap-3 disabled:opacity-50 disabled:hover:bg-white shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  <FileText className="w-6 h-6" /> Generate Tax Invoice
                </button>
                <p className="text-center text-xs text-gray-500 mt-4 font-medium uppercase tracking-widest">By generating, you confirm customer verification.</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function AdminPOS() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white"><div className="animate-pulse flex items-center gap-3"><Zap className="w-6 h-6 text-primary" /> Loading POS Terminal...</div></div>}>
      <POSContent />
    </Suspense>
  );
}
