"use client";

import React, { useState } from "react";
import { Search, UserPlus, CreditCard, FileText, CheckCircle, Calculator } from "lucide-react";

export default function AdminPOS() {
  const [vinSearch, setVinSearch] = useState("");
  const [activeVehicle, setActiveVehicle] = useState<any>(null);
  const [customer, setCustomer] = useState({ name: "", phone: "", id: "", customerId: "" });
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [customerSearchResults, setCustomerSearchResults] = useState<any[]>([]);
  const [isSearchingCustomer, setIsSearchingCustomer] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");

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
    <div className="min-h-screen bg-background dark:bg-slate-950 text-gray-100 p-8">
      <div className="max-w-[1600px] mx-auto">
        <h1 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold font-extrabold text-primary-foreground mb-8">Point of Sale (POS) Terminal</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Search & Customer */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* VIN Search */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl md:text-2xl font-semibold font-bold text-primary-foreground mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" /> Scan or Enter VIN/Chassis
              </h2>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={vinSearch}
                  onChange={e => setVinSearch(e.target.value)}
                  placeholder="e.g. ME4HXXXXXX..."
                  className="flex-1 bg-black border border-slate-700 rounded-xl px-4 py-3 text-primary-foreground uppercase focus:border-primary outline-none"
                />
                <button onClick={handleSearch} className="bg-primary hover:bg-primary-hover text-primary-foreground px-6 py-3 rounded-xl font-bold transition-colors">
                  Search
                </button>
              </div>

              {activeVehicle && (
                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-500 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-green-400">{activeVehicle.model}</h3>
                    <p className="text-sm text-gray-400 mt-1">VIN: {activeVehicle.vin}</p>
                    <p className="text-sm text-gray-400">Status: {activeVehicle.status}</p>
                    <div className="text-xl md:text-2xl font-semibold font-black text-primary-foreground mt-2">Rs. {activeVehicle.price.toLocaleString()}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Customer Linkage */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl md:text-2xl font-semibold font-bold text-primary-foreground mb-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" /> Link Customer Profile
              </h2>
              <div className="space-y-4 relative">
                <div>
                  <input 
                    type="text" 
                    placeholder="Search existing customer by Name, Phone, or ID..." 
                    value={customerSearchQuery}
                    onChange={(e) => searchCustomers(e.target.value)}
                    className="w-full bg-black border border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none text-white"
                  />
                  {customerSearchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                      {customerSearchResults.map(c => (
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
                          className="p-3 hover:bg-slate-700 cursor-pointer border-b border-slate-700 last:border-0"
                        >
                          <div className="font-bold text-white">{c.fullName}</div>
                          <div className="text-sm text-gray-400">{c.phone} {c.citizenshipNumber ? `• ID: ${c.citizenshipNumber}` : ''}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Full Name" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} className="bg-black border border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none" />
                  <input type="tel" placeholder="Phone Number" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} className="bg-black border border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none" />
                </div>
                <input type="text" placeholder="Citizenship / License Number" value={customer.id} onChange={e => setCustomer({...customer, id: e.target.value})} className="w-full bg-black border border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none" />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl md:text-2xl font-semibold font-bold text-primary-foreground mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" /> Payment Method
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {["Bank Transfer", "Cheque", "eSewa", "Cash"].map(method => (
                  <button 
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                      paymentMethod === method 
                        ? "bg-primary/10 border-primary text-primary" 
                        : "bg-black border-slate-700 text-gray-400 hover:border-slate-500"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Checkout & Invoice */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg sticky top-8">
              <h2 className="text-xl md:text-2xl font-semibold font-bold text-primary-foreground mb-6 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" /> Transaction Summary
              </h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Vehicle Base Price</span>
                  <span className="text-primary-foreground font-medium">Rs. {activeVehicle ? activeVehicle.price.toLocaleString() : "0"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">VAT (13%)</span>
                  <span className="text-primary-foreground font-medium">Inclusive</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Registration & Tax</span>
                  <span className="text-primary-foreground font-medium">At Actuals</span>
                </div>
                
                <div className="border-t border-slate-700 pt-4 mt-4">
                   <div className="flex justify-between items-end">
                      <span className="text-gray-400 text-sm">Total Receivable</span>
                      <span className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold font-black text-primary">
                        Rs. {activeVehicle ? activeVehicle.price.toLocaleString() : "0"}
                      </span>
                   </div>
                </div>
              </div>

              {/* Commission (Internal Only) */}
              <div className="bg-black/50 border border-dashed border-slate-700 rounded-xl p-4 mb-8">
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Internal: Sales Commission</p>
                <p className="text-lg font-bold text-emerald-400">Rs. {commission.toLocaleString()} <span className="text-xs text-gray-500 font-normal">(1.5%)</span></p>
              </div>

              <button 
                disabled={!activeVehicle || !customer.name}
                className="w-full bg-background text-black hover:bg-gray-200 py-4 rounded-xl font-bold text-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
              >
                <FileText className="w-5 h-5" /> Generate Tax Invoice
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
