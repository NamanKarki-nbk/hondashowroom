"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Search, UserPlus, CreditCard, FileText, CheckCircle, Calculator, ChevronRight, Zap, ArrowRight, ShieldCheck, Tag, Briefcase, Percent, PackagePlus, Repeat, Landmark, X, Plus, AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

function POSContent() {
  const [vinSearch, setVinSearch] = useState("");
  const [activeVehicle, setActiveVehicle] = useState<any>(null);
  const [customer, setCustomer] = useState({ name: "", phone: "", id: "", customerId: "", isVerified: false });
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [customerSearchResults, setCustomerSearchResults] = useState<any[]>([]);
  const [isSearchingCustomer, setIsSearchingCustomer] = useState(false);
  const [purchaseMethod, setPurchaseMethod] = useState("CASH");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [discountType, setDiscountType] = useState<"Normal" | "Scheme">("Normal");
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [accessories, setAccessories] = useState<string>("");
  const [accessoriesAmount, setAccessoriesAmount] = useState<number>(0);
  
  // Exchange fields
  const [oldVehicleModel, setOldVehicleModel] = useState("");
  const [oldVehicleNumber, setOldVehicleNumber] = useState("");
  const [valuationAmount, setValuationAmount] = useState<number>(0);
  const [valuationBy, setValuationBy] = useState("");

  // Finance fields
  const [downPayment, setDownPayment] = useState<number>(0);
  const [financeCompany, setFinanceCompany] = useState("");
  const [financeDuration, setFinanceDuration] = useState("");

  // Payment Method fields
  const [pmCashAmount, setPmCashAmount] = useState<number>(0);
  const [bankTransfers, setBankTransfers] = useState([{ bankName: "", transactionId: "", amount: 0 }]);
  const [pmChequeBankName, setPmChequeBankName] = useState("");
  const [pmChequeNumber, setPmChequeNumber] = useState("");
  const [pmChequeDate, setPmChequeDate] = useState("");
  const [pmChequeAmount, setPmChequeAmount] = useState<number>(0);
  
  // Due Amount fields
  const [dueLoanDays, setDueLoanDays] = useState("");
  const [dueTerms, setDueTerms] = useState("");
  
  // Warranty & Insurance
  const [serviceBookNo, setServiceBookNo] = useState("");
  const [wantsInsurance, setWantsInsurance] = useState(false);
  const [insuranceCompany, setInsuranceCompany] = useState("Protective Micro Insurance");
  const [insuranceType, setInsuranceType] = useState("3rd Party");
  const [insuranceAmount, setInsuranceAmount] = useState<number>(0);

  // Read URL params to auto-search VIN if provided
  const searchParams = useSearchParams();
  const vinParam = searchParams?.get("vin");

  useEffect(() => {
    if (vinParam) {
      setVinSearch(vinParam);
      // We don't auto-search here anymore to avoid race conditions with state.
      // The user can just click Lookup.
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
        // Prevent race condition: only update if the query matches the current input state
        // We use a functional state update to access the absolute latest state
        setCustomerSearchQuery((latestQuery) => {
          if (latestQuery === query) {
            setCustomerSearchResults(data.customers || []);
          }
          return latestQuery;
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearchingCustomer(false);
    }
  };

  const [isSearchingVin, setIsSearchingVin] = useState(false);
  const [vinError, setVinError] = useState("");

  const handleSearch = async () => {
    if (vinSearch.length < 5) {
      setVinError("Please enter at least 5 characters of the VIN");
      return;
    }
    
    setIsSearchingVin(true);
    setVinError("");
    setActiveVehicle(null);
    
    try {
      const res = await fetch(`/api/admin/inventory/search-vin?vin=${encodeURIComponent(vinSearch)}`);
      if (res.ok) {
        const data = await res.json();
        setActiveVehicle(data.vehicle);
      } else {
        const data = await res.json();
        setVinError(data.error || "Vehicle not found");
      }
    } catch (error) {
      setVinError("Failed to search vehicle");
    } finally {
      setIsSearchingVin(false);
    }
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const [successTransactionId, setSuccessTransactionId] = useState<string | null>(null);

  const handleGenerateInvoice = async () => {
    if (!customer.isVerified) {
      alert("Cannot generate invoice. This customer is not verified. Please verify their KYC first.");
      return;
    }

    setIsGenerating(true);
    try {
      const payload = {
        vehicleId: activeVehicle?.id,
        customerId: customer.customerId,
        purchaseMethod,
        paymentMethod,
        discountType,
        discountAmount,
        accessories,
        accessoriesAmount,
        exchangeModel: oldVehicleModel,
        exchangeNumber: oldVehicleNumber,
        exchangeValue: valuationAmount,
        valuationBy,
        downpayment: downPayment,
        financerName: financeCompany,
        financeDuration,
        pmCashAmount,
        bankTransfers,
        pmChequeBankName,
        pmChequeNumber,
        pmChequeDate,
        pmChequeAmount,
        dueLoanDays,
        dueTerms,
        serviceBookNo,
        wantsInsurance,
        insuranceCompany,
        insuranceType,
        insuranceAmount,
        totalReceivable,
        totalReceived,
        dueAmount
      };

      const res = await fetch("/api/admin/pos/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to generate invoice");
      }

      const data = await res.json();
      setSuccessTransactionId(data.transaction.id);
    } catch (error: any) {
      alert(error.message || "Failed to generate invoice");
    } finally {
      setIsGenerating(false);
    }
  };

  const commission = activeVehicle ? Math.round(activeVehicle.price * 0.015) : 0;
  const showExchange = purchaseMethod.includes("EXCHANGE");
  const showFinance = purchaseMethod.includes("FINANCE");
  
  const totalReceivable = activeVehicle ? Math.max(0, activeVehicle.price - (discountAmount || 0) - (showExchange ? (valuationAmount || 0) : 0) + (accessoriesAmount || 0)) : 0;
  
  let totalReceived = 0;
  const totalBankAmount = bankTransfers.reduce((sum, bt) => sum + (bt.amount || 0), 0);
  
  if (paymentMethod === "Cash") totalReceived = pmCashAmount || 0;
  else if (paymentMethod === "Bank Transfer") totalReceived = totalBankAmount;
  else if (paymentMethod === "Cash + Bank Transfer") totalReceived = (pmCashAmount || 0) + totalBankAmount;
  else if (paymentMethod === "Cheque") totalReceived = 0; // Cheque is for security only

  
  const dueAmount = Math.max(0, totalReceivable - totalReceived);
  
  let currentStep = 3;
  const exchangeStep = showExchange ? ++currentStep : -1;
  const financeStep = showFinance ? ++currentStep : -1;
  const offersStep = ++currentStep;
  const paymentStep = ++currentStep;

  if (successTransactionId) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-slate-950 text-zinc-900 dark:text-gray-100 p-4 md:p-8 relative overflow-hidden transition-colors duration-300 flex items-center justify-center">
        {/* Dynamic Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 dark:bg-primary/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-green-900/10 dark:bg-green-900/20 blur-[150px] mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }}></div>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-3xl border border-zinc-200 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl max-w-3xl w-full text-center animate-in zoom-in-95 duration-500 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-600"></div>
          
          <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-500/20 dark:to-green-900/20 border border-green-200 dark:border-green-500/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle className="w-12 h-12" />
          </div>
          
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white mb-3 tracking-tight">Transaction Complete!</h1>
          <p className="text-zinc-500 dark:text-gray-400 mb-10 text-lg">The vehicle has been successfully sold. You can now download the necessary documents below.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <a href={`/print/receipt/${successTransactionId}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/5 hover:border-primary/50 hover:bg-zinc-100 dark:hover:bg-white/5 transition-all group shadow-sm hover:shadow-md hover:-translate-y-1">
              <FileText className="w-10 h-10 text-zinc-400 group-hover:text-primary transition-colors" />
              <span className="font-bold text-sm text-zinc-700 dark:text-gray-300 group-hover:text-primary transition-colors uppercase tracking-widest">Cash Receipt</span>
            </a>
            <a href={`/print/undertaking/${successTransactionId}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/5 hover:border-blue-500/50 hover:bg-zinc-100 dark:hover:bg-white/5 transition-all group shadow-sm hover:shadow-md hover:-translate-y-1">
              <ShieldCheck className="w-10 h-10 text-zinc-400 group-hover:text-blue-500 transition-colors" />
              <span className="font-bold text-sm text-zinc-700 dark:text-gray-300 group-hover:text-blue-500 transition-colors uppercase tracking-widest">Undertaking</span>
            </a>
            <a href={`/print/pdi/${successTransactionId}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/5 hover:border-orange-500/50 hover:bg-zinc-100 dark:hover:bg-white/5 transition-all group shadow-sm hover:shadow-md hover:-translate-y-1">
              <CheckCircle className="w-10 h-10 text-zinc-400 group-hover:text-orange-500 transition-colors" />
              <span className="font-bold text-sm text-zinc-700 dark:text-gray-300 group-hover:text-orange-500 transition-colors uppercase tracking-widest">PDI Check Sheet</span>
            </a>
          </div>

          <button onClick={() => window.location.reload()} className="bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-gray-200 px-8 py-5 rounded-2xl font-black uppercase tracking-widest transition-all w-full flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(0,0,0,0.2)] hover:scale-[1.02] active:scale-[0.98]">
            <Repeat className="w-6 h-6" /> Start New Transaction
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-slate-950 text-zinc-900 dark:text-gray-100 p-4 md:p-8 relative overflow-hidden transition-colors duration-300">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 dark:bg-primary/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-red-900/10 dark:bg-red-900/20 blur-[150px] mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }}></div>
      </div>

      <div className="max-w-[1600px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-3">
              <Zap className="w-8 h-8 md:w-10 md:h-10 text-primary animate-pulse" />
              POS Terminal
            </h1>
            <p className="text-zinc-600 dark:text-gray-400 mt-2 font-medium tracking-wide">Honda Rapid Checkout System</p>
          </div>
          <div className="flex items-center gap-3 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-zinc-200 dark:border-white/10 px-4 py-2 rounded-full shadow-lg dark:shadow-xl">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-semibold text-zinc-800 dark:text-gray-300">System Online</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Search & Customer */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* VIN Search Card */}
            <div className="bg-white/80 dark:bg-slate-900/40 backdrop-blur-2xl border border-zinc-200 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-xl dark:shadow-2xl relative overflow-hidden group transition-all hover:bg-white/90 dark:hover:bg-slate-900/60 hover:border-primary/30">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
              
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-3 uppercase tracking-wider">
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
                    className="w-full bg-zinc-100 dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-2xl px-6 py-4 text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-gray-500 uppercase tracking-widest focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                  <div className="absolute inset-0 border border-primary rounded-2xl opacity-0 group-focus-within/input:opacity-100 group-focus-within/input:scale-105 transition-all duration-300 pointer-events-none"></div>
                </div>
                <button disabled={isSearchingVin} onClick={handleSearch} className="bg-primary hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(220,38,38,0.2)] dark:shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] dark:hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50">
                  {isSearchingVin ? "Searching..." : <>Lookup <ArrowRight className="w-5 h-5" /></>}
                </button>
              </div>
              
              {vinError && <p className="text-red-500 font-semibold mt-3 text-sm">{vinError}</p>}

              {activeVehicle && (
                <div className="mt-8 p-6 bg-gradient-to-br from-green-100 dark:from-green-500/10 to-transparent border border-green-200 dark:border-green-500/20 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 dark:bg-green-500/20 p-3 rounded-full shrink-0">
                      <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{activeVehicle.model}</h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="px-2.5 py-1 bg-white dark:bg-black/50 rounded-lg text-xs font-mono text-zinc-600 dark:text-gray-400 border border-zinc-200 dark:border-white/5">{activeVehicle.vin}</span>
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3"/> {activeVehicle.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-zinc-500 dark:text-gray-500 uppercase tracking-wider font-bold mb-1">MSRP</p>
                    <div className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                      Rs. {activeVehicle.price.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Customer Linkage Card */}
            <div className={`bg-white/80 dark:bg-slate-900/40 backdrop-blur-2xl border border-zinc-200 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-xl dark:shadow-2xl relative overflow-hidden transition-all duration-500 ${!activeVehicle ? 'opacity-50 grayscale pointer-events-none' : 'opacity-100 hover:border-blue-500/30'}`}>
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-transparent opacity-50"></div>
              
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-3 uppercase tracking-wider">
                <UserPlus className="w-5 h-5 text-blue-500 dark:text-blue-400" /> 
                2. Link Customer
              </h2>
              
              <div className="space-y-5 relative">
                <div className="relative">
                  <Search className="w-5 h-5 text-zinc-500 dark:text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search directory by Name, Phone, or KYC ID..." 
                    value={customerSearchQuery}
                    onChange={(e) => searchCustomers(e.target.value)}
                    className="w-full bg-zinc-100 dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-2xl pl-12 pr-4 py-4 text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                  {customerSearchResults.length > 0 && (
                    <div className="absolute z-20 w-full mt-3 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-zinc-200 dark:border-slate-700 rounded-2xl shadow-2xl max-h-72 overflow-y-auto overflow-hidden animate-in fade-in slide-in-from-top-2">
                      {customerSearchResults.map((c, i) => (
                        <div 
                          key={c.id} 
                          onClick={() => {
                            if (!c.isVerified) {
                              alert("This customer is not verified. Please verify the customer's KYC details before proceeding.");
                            }
                            setCustomer({
                              name: c.fullName || "",
                              phone: c.phone || "",
                              id: c.citizenshipNumber || c.licenseNumber || "",
                              customerId: c.id,
                              isVerified: c.isVerified || false
                            });
                            setCustomerSearchQuery("");
                            setCustomerSearchResults([]);
                          }}
                          className="p-4 hover:bg-blue-50 dark:hover:bg-blue-500/20 cursor-pointer border-b border-zinc-100 dark:border-slate-700/50 last:border-0 transition-colors flex items-center justify-between group"
                        >
                          <div>
                            <div className="font-bold text-zinc-900 dark:text-white text-lg">{c.fullName}</div>
                            <div className="text-sm text-zinc-600 dark:text-gray-400 mt-1 flex items-center gap-3">
                              <span>{c.phone}</span>
                              {c.citizenshipNumber && (
                                <span className="px-2 py-0.5 bg-zinc-100 dark:bg-slate-900 rounded text-xs border border-zinc-200 dark:border-slate-700">ID: {c.citizenshipNumber}</span>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {customer.name && !customer.isVerified && (
                  <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-semibold flex items-center gap-3 border border-red-200 dark:border-red-900/50">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>This customer is not verified. Please verify their KYC documents to proceed.</span>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                    <input type="text" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} className="w-full bg-zinc-100 dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:border-blue-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
                    <input type="tel" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} className="w-full bg-zinc-100 dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:border-blue-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase tracking-wider ml-1">Citizenship / License Number</label>
                    <input type="text" value={customer.id} onChange={e => setCustomer({...customer, id: e.target.value})} className="w-full bg-zinc-100 dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:border-blue-500 outline-none transition-all" />
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase Method Card */}
            <div className={`bg-white/80 dark:bg-slate-900/40 backdrop-blur-2xl border border-zinc-200 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-xl dark:shadow-2xl relative overflow-hidden transition-all duration-500 delay-75 ${(!activeVehicle || !customer.name) ? 'opacity-50 grayscale pointer-events-none' : 'opacity-100 hover:border-orange-500/30'}`}>
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-500 to-transparent opacity-50"></div>
              
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-3 uppercase tracking-wider">
                <Briefcase className="w-5 h-5 text-orange-500 dark:text-orange-400" /> 
                3. Purchase Method
              </h2>
              <div className="flex flex-wrap gap-3">
                {["CASH", "EXCHANGE", "FINANCE", "FINANCE & EXCHANGE"].map(method => (
                  <button 
                    key={method}
                    onClick={() => setPurchaseMethod(method)}
                    className={`relative px-5 py-3 rounded-xl border text-sm transition-all duration-300 overflow-hidden group flex-grow sm:flex-grow-0 ${
                      purchaseMethod === method 
                        ? "bg-orange-50 dark:bg-orange-500/10 border-orange-400 dark:border-orange-500 text-orange-700 dark:text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.15)]" 
                        : "bg-zinc-50 dark:bg-black/50 border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-gray-400 hover:border-zinc-400 dark:hover:border-white/30 hover:bg-zinc-100 dark:hover:bg-white/5"
                    }`}
                  >
                    {purchaseMethod === method && (
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 dark:from-orange-500/20 to-transparent opacity-50"></div>
                    )}
                    <span className="relative z-10 font-bold tracking-wide">{method}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Exchange Details Card (Conditional) */}
            {showExchange && (
              <div className={`bg-white/80 dark:bg-slate-900/40 backdrop-blur-2xl border border-zinc-200 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-xl dark:shadow-2xl relative overflow-hidden transition-all duration-500 delay-75 ${(!activeVehicle || !customer.name) ? 'opacity-50 grayscale pointer-events-none' : 'opacity-100 hover:border-blue-500/30'}`}>
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-transparent opacity-50"></div>
                
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-3 uppercase tracking-wider">
                  <Repeat className="w-5 h-5 text-blue-500 dark:text-blue-400" /> 
                  {exchangeStep}. Exchange Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase tracking-wider ml-1">Old Vehicle Model</label>
                    <input type="text" value={oldVehicleModel} onChange={e => setOldVehicleModel(e.target.value)} placeholder="E.g., Shine 125 2018" className="w-full bg-zinc-100 dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:border-blue-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase tracking-wider ml-1">Old Vehicle Number</label>
                    <input type="text" value={oldVehicleNumber} onChange={e => setOldVehicleNumber(e.target.value)} placeholder="E.g., Ba 22 Pa 1234" className="w-full bg-zinc-100 dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:border-blue-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase tracking-wider ml-1">Valuation Amount (Rs.)</label>
                    <input type="number" value={valuationAmount || ""} onChange={e => setValuationAmount(Number(e.target.value))} placeholder="0" className="w-full bg-zinc-100 dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:border-blue-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase tracking-wider ml-1">Valuation By</label>
                    <input type="text" value={valuationBy} onChange={e => setValuationBy(e.target.value)} placeholder="Evaluator Name" className="w-full bg-zinc-100 dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:border-blue-500 outline-none transition-all" />
                  </div>
                </div>
              </div>
            )}

            {/* Finance Details Card (Conditional) */}
            {showFinance && (
              <div className={`bg-white/80 dark:bg-slate-900/40 backdrop-blur-2xl border border-zinc-200 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-xl dark:shadow-2xl relative overflow-hidden transition-all duration-500 delay-100 ${(!activeVehicle || !customer.name) ? 'opacity-50 grayscale pointer-events-none' : 'opacity-100 hover:border-emerald-500/30'}`}>
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-transparent opacity-50"></div>
                
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-3 uppercase tracking-wider">
                  <Landmark className="w-5 h-5 text-emerald-500 dark:text-emerald-400" /> 
                  {financeStep}. Finance Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase tracking-wider ml-1">Finance Company / Bank Name</label>
                    <input type="text" value={financeCompany} onChange={e => setFinanceCompany(e.target.value)} placeholder="E.g., Syakar Finance, Nabil Bank" className="w-full bg-zinc-100 dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:border-emerald-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase tracking-wider ml-1">Down Payment (Rs.)</label>
                    <input type="number" value={downPayment || ""} onChange={e => setDownPayment(Number(e.target.value))} placeholder="0" className="w-full bg-zinc-100 dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:border-emerald-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase tracking-wider ml-1">Duration (Months)</label>
                    <input type="number" value={financeDuration || ""} onChange={e => setFinanceDuration(e.target.value)} placeholder="E.g., 24, 36" className="w-full bg-zinc-100 dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:border-emerald-500 outline-none transition-all" />
                  </div>
                </div>
              </div>
            )}

            {/* Offers & Accessories Card (Always shown now) */}
            <div className={`bg-white/80 dark:bg-slate-900/40 backdrop-blur-2xl border border-zinc-200 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-xl dark:shadow-2xl relative overflow-hidden transition-all duration-500 delay-100 ${(!activeVehicle || !customer.name) ? 'opacity-50 grayscale pointer-events-none' : 'opacity-100 hover:border-pink-500/30'}`}>
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-pink-500 to-transparent opacity-50"></div>
                
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-3 uppercase tracking-wider">
                  <Percent className="w-5 h-5 text-pink-500 dark:text-pink-400" /> 
                  {offersStep}. Offers & Accessories
                </h2>
                
                <div className="space-y-6">
                  {/* Discount Type */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase tracking-wider">Discount Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      {["Normal", "Scheme"].map(type => (
                        <button 
                          key={type}
                          onClick={() => setDiscountType(type as "Normal" | "Scheme")}
                          className={`relative p-3 rounded-xl border text-sm transition-all duration-300 overflow-hidden group ${
                            discountType === type 
                              ? "bg-pink-50 dark:bg-pink-500/10 border-pink-400 dark:border-pink-500 text-pink-700 dark:text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.15)]" 
                              : "bg-zinc-50 dark:bg-black/50 border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-gray-400 hover:border-zinc-400 dark:hover:border-white/30"
                          }`}
                        >
                          <span className="relative z-10 font-bold">{type} Discount</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Discount Amount */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase tracking-wider">Discount Amount (Rs.)</label>
                    <input 
                      type="number" 
                      value={discountAmount || ""}
                      onChange={e => setDiscountAmount(Number(e.target.value))}
                      placeholder="0"
                      className="w-full bg-zinc-100 dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:border-pink-500 outline-none transition-all" 
                    />
                  </div>

                  {/* Accessories */}
                  <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-slate-800/50">
                    <label className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <PackagePlus className="w-4 h-4" /> Accessories Given
                    </label>
                    <div className="p-3 bg-zinc-50 dark:bg-black/30 border border-zinc-200 dark:border-white/10 rounded-xl">
                      <div className="flex items-center gap-2 text-sm text-zinc-700 dark:text-gray-300 font-medium">
                        <CheckCircle className="w-4 h-4 text-green-500" /> Helmet (Free)
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-700 dark:text-gray-300 font-medium mt-2">
                        <CheckCircle className="w-4 h-4 text-green-500" /> Seat Cover (Free)
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase tracking-wider">Extra Accessories</label>
                        <select 
                          value={accessories}
                          onChange={e => setAccessories(e.target.value)}
                          className="w-full bg-zinc-100 dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:border-pink-500 outline-none transition-all appearance-none" 
                        >
                          <option value="">-- Blank --</option>
                          <option value="Bike Cover">Bike Cover</option>
                          {activeVehicle?.category !== 'SCOOTER' && (
                            <>
                              <option value="Legguard">Legguard</option>
                              <option value="Bike Cover & Legguard">Bike Cover & Legguard</option>
                            </>
                          )}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase tracking-wider">Accessories Amount (Rs.)</label>
                        <input 
                          type="number" 
                          value={accessoriesAmount || ""}
                          onChange={e => setAccessoriesAmount(Number(e.target.value))}
                          placeholder="0"
                          className="w-full bg-zinc-100 dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:border-pink-500 outline-none transition-all" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            {/* Payment Method Card */}
            <div className={`bg-white/80 dark:bg-slate-900/40 backdrop-blur-2xl border border-zinc-200 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-xl dark:shadow-2xl relative overflow-hidden transition-all duration-500 delay-100 ${(!activeVehicle || !customer.name) ? 'opacity-50 grayscale pointer-events-none' : 'opacity-100 hover:border-purple-500/30'}`}>
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-transparent opacity-50"></div>
              
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-3 uppercase tracking-wider">
                <CreditCard className="w-5 h-5 text-purple-500 dark:text-purple-400" /> 
                {paymentStep}. Payment Method
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {["Cash", "Bank Transfer", "Cash + Bank Transfer", "Cheque"].map(method => (
                  <button 
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`relative p-4 rounded-2xl border transition-all duration-300 overflow-hidden group ${
                      paymentMethod === method 
                        ? "bg-purple-50 dark:bg-purple-500/10 border-purple-400 dark:border-purple-500 text-purple-700 dark:text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]" 
                        : "bg-zinc-50 dark:bg-black/50 border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-gray-400 hover:border-zinc-400 dark:hover:border-white/30 hover:bg-zinc-100 dark:hover:bg-white/5"
                    }`}
                  >
                    {paymentMethod === method && (
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 dark:from-purple-500/20 to-transparent opacity-50"></div>
                    )}
                    <span className="relative z-10 font-semibold text-sm sm:text-base">{method}</span>
                  </button>
                ))}
              </div>

              {/* Dynamic Payment Input Forms */}
              <div className="bg-zinc-50 dark:bg-black/20 p-5 rounded-2xl border border-zinc-200 dark:border-white/5">
                {paymentMethod === "Cash" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase tracking-wider">Cash Received Amount (Rs.)</label>
                      <input type="number" value={pmCashAmount || ""} onChange={e => setPmCashAmount(Number(e.target.value))} placeholder="0" className="w-full bg-white dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:border-purple-500 outline-none transition-all" />
                    </div>
                  </div>
                )}

                {paymentMethod === "Bank Transfer" && (
                  <div className="space-y-4">
                    {bankTransfers.map((bt, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 relative bg-white dark:bg-black/20 p-4 rounded-xl border border-zinc-200 dark:border-white/5">
                        {bankTransfers.length > 1 && (
                          <button 
                            onClick={() => setBankTransfers(bankTransfers.filter((_, i) => i !== idx))}
                            className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg z-10"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase tracking-wider">Bank Name / Wallet</label>
                          <input type="text" value={bt.bankName} onChange={e => {
                            const newArr = [...bankTransfers];
                            newArr[idx].bankName = e.target.value;
                            setBankTransfers(newArr);
                          }} placeholder="e.g. Nabil Bank, eSewa" className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:border-purple-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase tracking-wider">Transaction ID / Ref</label>
                          <input type="text" value={bt.transactionId} onChange={e => {
                            const newArr = [...bankTransfers];
                            newArr[idx].transactionId = e.target.value;
                            setBankTransfers(newArr);
                          }} placeholder="e.g. 123456789" className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:border-purple-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase tracking-wider">Transferred Amount (Rs.)</label>
                          <input type="number" value={bt.amount || ""} onChange={e => {
                            const newArr = [...bankTransfers];
                            newArr[idx].amount = Number(e.target.value);
                            setBankTransfers(newArr);
                          }} placeholder="0" className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:border-purple-500 outline-none transition-all" />
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={() => setBankTransfers([...bankTransfers, { bankName: "", transactionId: "", amount: 0 }])}
                      className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-2 px-2"
                    >
                      <Plus className="w-4 h-4" /> Add Another Transfer
                    </button>
                  </div>
                )}

                {paymentMethod === "Cash + Bank Transfer" && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-6">
                    <div className="space-y-4 lg:border-r border-zinc-200 dark:border-white/10 lg:pr-6">
                      <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span> Cash Portion
                      </h3>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase tracking-wider">Cash Received (Rs.)</label>
                        <input type="number" value={pmCashAmount || ""} onChange={e => setPmCashAmount(Number(e.target.value))} placeholder="0" className="w-full bg-white dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:border-purple-500 outline-none transition-all" />
                      </div>
                    </div>
                    <div className="space-y-4 lg:pl-2">
                      <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span> Bank Transfer Portion
                      </h3>
                      <div className="space-y-4">
                        {bankTransfers.map((bt, idx) => (
                          <div key={idx} className="grid grid-cols-1 gap-4 relative bg-white dark:bg-black/20 p-4 rounded-xl border border-zinc-200 dark:border-white/5">
                            {bankTransfers.length > 1 && (
                              <button 
                                onClick={() => setBankTransfers(bankTransfers.filter((_, i) => i !== idx))}
                                className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg z-10"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase tracking-wider">Bank / Wallet</label>
                              <input type="text" value={bt.bankName} onChange={e => {
                                const newArr = [...bankTransfers];
                                newArr[idx].bankName = e.target.value;
                                setBankTransfers(newArr);
                              }} placeholder="e.g. Nabil Bank" className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:border-purple-500 outline-none transition-all" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase tracking-wider">Transaction ID</label>
                                <input type="text" value={bt.transactionId} onChange={e => {
                                  const newArr = [...bankTransfers];
                                  newArr[idx].transactionId = e.target.value;
                                  setBankTransfers(newArr);
                                }} placeholder="e.g. 123456" className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:border-purple-500 outline-none transition-all" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase tracking-wider">Bank Amt (Rs.)</label>
                                <input type="number" value={bt.amount || ""} onChange={e => {
                                  const newArr = [...bankTransfers];
                                  newArr[idx].amount = Number(e.target.value);
                                  setBankTransfers(newArr);
                                }} placeholder="0" className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:border-purple-500 outline-none transition-all" />
                              </div>
                            </div>
                          </div>
                        ))}
                        <button 
                          onClick={() => setBankTransfers([...bankTransfers, { bankName: "", transactionId: "", amount: 0 }])}
                          className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-2 px-2"
                        >
                          <Plus className="w-4 h-4" /> Add Another Transfer
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "Cheque" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase tracking-wider">Bank Name</label>
                      <input type="text" value={pmChequeBankName} onChange={e => setPmChequeBankName(e.target.value)} placeholder="e.g. Nabil Bank" className="w-full bg-white dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:border-purple-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase tracking-wider">Cheque Number</label>
                      <input type="text" value={pmChequeNumber} onChange={e => setPmChequeNumber(e.target.value)} placeholder="e.g. 98765432" className="w-full bg-white dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:border-purple-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase tracking-wider">Cheque Date</label>
                      <input type="date" value={pmChequeDate} onChange={e => setPmChequeDate(e.target.value)} className="w-full bg-white dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:border-purple-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase tracking-wider">Cheque Amount (Rs.)</label>
                      <input type="number" value={pmChequeAmount || ""} onChange={e => setPmChequeAmount(Number(e.target.value))} placeholder="0" className="w-full bg-white dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:border-purple-500 outline-none transition-all" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 6: Warranty & Insurance */}
            <div className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-3xl border border-zinc-200 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-xl dark:shadow-2xl transition-all hover:border-zinc-300 dark:hover:border-white/20">
              <h2 className="text-xl font-black text-zinc-900 dark:text-white mb-6 tracking-tight flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-primary" />
                6. WARRANTY & INSURANCE
              </h2>
              
              <div className="space-y-8">
                {/* Service Book */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase tracking-wider">Service Book No. (Required for Warranty) <span className="text-red-500">*</span></label>
                  <input type="text" value={serviceBookNo} onChange={e => setServiceBookNo(e.target.value)} placeholder="Enter Service Book Number" className="w-full md:w-1/2 bg-white dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:border-primary outline-none transition-all" />
                </div>

                {/* Insurance Toggle */}
                <div className="pt-4 border-t border-zinc-100 dark:border-white/5 space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer group w-fit">
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center border transition-all ${wantsInsurance ? 'bg-primary border-primary' : 'bg-white dark:bg-black/50 border-zinc-300 dark:border-white/20 group-hover:border-primary'}`}>
                      {wantsInsurance && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                    <span className="text-sm font-bold text-zinc-700 dark:text-gray-300">Customer wants help buying Insurance (Optional)</span>
                    <input type="checkbox" className="hidden" checked={wantsInsurance} onChange={e => setWantsInsurance(e.target.checked)} />
                  </label>

                  {wantsInsurance && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 bg-zinc-50 dark:bg-black/20 p-5 rounded-2xl border border-zinc-200 dark:border-white/5">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase tracking-wider">Insurance Company</label>
                        <select value={insuranceCompany} onChange={e => setInsuranceCompany(e.target.value)} className="w-full bg-white dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                          <option value="Protective Micro Insurance">Protective Micro Insurance</option>
                          <option value="Other">Other Company</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase tracking-wider">Insurance Type</label>
                        <select value={insuranceType} onChange={e => setInsuranceType(e.target.value)} className="w-full bg-white dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                          <option value="3rd Party">3rd Party</option>
                          <option value="Full Party">Full Party</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 dark:text-gray-500 uppercase tracking-wider">Premium Amount (Rs.)</label>
                        <input type="number" value={insuranceAmount || ""} onChange={e => setInsuranceAmount(Number(e.target.value))} placeholder="0" className="w-full bg-white dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:border-primary outline-none transition-all" />
                        <p className="text-[10px] text-zinc-400 dark:text-gray-500 italic mt-1">*Paid separately, not added to POS invoice</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Checkout & Invoice */}
          <div className="lg:col-span-5">
            <div className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-3xl border border-zinc-200 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-xl dark:shadow-2xl sticky top-8 flex flex-col transition-all hover:border-zinc-300 dark:hover:border-white/20">
              
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-200 dark:border-white/10">
                <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-3">
                  <Calculator className="w-6 h-6 text-primary" /> 
                  Invoice Summary
                </h2>
                <div className="px-3 py-1 bg-zinc-200 dark:bg-white/10 rounded-full text-xs font-bold text-zinc-700 dark:text-gray-300 tracking-widest uppercase">
                  Draft
                </div>
              </div>
              
              <div className="space-y-6 flex-1">
                <div className="group flex justify-between items-center text-base p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                  <span className="text-zinc-600 dark:text-gray-400 flex items-center gap-2"><Tag className="w-4 h-4 text-zinc-500 dark:text-gray-500" /> Vehicle Price</span>
                  <span className="text-zinc-900 dark:text-white font-semibold">Rs. {activeVehicle ? activeVehicle.price.toLocaleString() : "0"}</span>
                </div>
                <div className="group flex justify-between items-center text-base p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                  <span className="text-zinc-600 dark:text-gray-400 flex items-center gap-2"><Tag className="w-4 h-4 text-zinc-500 dark:text-gray-500" /> VAT (13%)</span>
                  <span className="text-zinc-900 dark:text-white font-semibold">Inclusive</span>
                </div>
                <div className="group flex justify-between items-center text-base p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                  <span className="text-zinc-600 dark:text-gray-400 flex items-center gap-2"><Tag className="w-4 h-4 text-zinc-500 dark:text-gray-500" /> Registration & Tax</span>
                  <span className="text-zinc-500 dark:text-gray-500 font-medium italic">At Actuals</span>
                </div>

                {showExchange && valuationAmount > 0 && (
                  <div className="group flex justify-between items-center text-base p-2 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors border border-blue-100 dark:border-blue-500/20">
                    <span className="text-blue-600 dark:text-blue-400 flex items-center gap-2 font-bold"><Repeat className="w-4 h-4" /> Exchange Valuation</span>
                    <span className="text-blue-600 dark:text-blue-400 font-black">- Rs. {valuationAmount.toLocaleString()}</span>
                  </div>
                )}

                {discountAmount > 0 && (
                  <div className="group flex justify-between items-center text-base p-2 hover:bg-pink-50 dark:hover:bg-pink-500/10 rounded-lg transition-colors border border-pink-100 dark:border-pink-500/20">
                    <span className="text-pink-600 dark:text-pink-400 flex items-center gap-2 font-bold"><Percent className="w-4 h-4" /> {discountType} Discount</span>
                    <span className="text-pink-600 dark:text-pink-400 font-black">- Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                
                {accessoriesAmount > 0 && (
                  <div className="group flex justify-between items-center text-base p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                    <span className="text-zinc-600 dark:text-gray-400 flex items-center gap-2"><PackagePlus className="w-4 h-4 text-zinc-500 dark:text-gray-500" /> Extra Accessories</span>
                    <span className="text-zinc-900 dark:text-white font-semibold">+ Rs. {accessoriesAmount.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="pt-8 mt-4 space-y-4">
                   <div className="bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-black/80 dark:to-slate-900/80 p-6 rounded-2xl border border-zinc-200 dark:border-white/10 relative overflow-hidden shadow-inner">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-orange-500 to-primary opacity-80"></div>
                      <span className="text-zinc-600 dark:text-gray-400 text-sm font-bold uppercase tracking-widest block mb-2">Total Receivable</span>
                      <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-gray-400 tracking-tighter">
                        Rs. {totalReceivable.toLocaleString()}
                      </div>
                   </div>
                   
                   <div className="flex flex-col sm:flex-row gap-4">
                     <div className="flex-1 bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-black/80 dark:to-slate-900/80 p-5 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-inner">
                       <span className="text-zinc-600 dark:text-gray-400 text-xs font-bold uppercase tracking-widest block mb-1">Total Received</span>
                       <div className="text-2xl font-black text-zinc-900 dark:text-white">
                         Rs. {totalReceived.toLocaleString()}
                       </div>
                     </div>
                     {dueAmount > 0 && (
                       <div className="flex-1 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/40 dark:to-red-900/40 p-5 rounded-2xl border border-red-200 dark:border-red-500/20 shadow-inner">
                         <span className="text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-widest block mb-1">Amount Due</span>
                         <div className="text-2xl font-black text-red-600 dark:text-red-400">
                           Rs. {dueAmount.toLocaleString()}
                         </div>
                       </div>
                     )}
                   </div>
                   {dueAmount > 0 && (
                     <div className="mt-4 p-5 rounded-2xl border border-red-200 dark:border-red-500/20 bg-red-50/50 dark:bg-red-950/20 space-y-4">
                       <h4 className="text-sm font-bold text-red-700 dark:text-red-400 flex items-center gap-2">
                         <AlertCircle className="w-4 h-4" /> Due Amount Details
                       </h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-2">
                           <label className="text-xs font-bold text-zinc-600 dark:text-gray-400 uppercase tracking-wider">Loan Duration (Days)</label>
                           <input type="number" value={dueLoanDays} onChange={e => setDueLoanDays(e.target.value)} placeholder="e.g. 15" className="w-full bg-white dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:border-red-500 outline-none transition-all" />
                         </div>
                         <div className="space-y-2">
                           <label className="text-xs font-bold text-zinc-600 dark:text-gray-400 uppercase tracking-wider">Terms & Conditions / Deposit Date</label>
                           <input type="text" value={dueTerms} onChange={e => setDueTerms(e.target.value)} placeholder="e.g. Will deposit on 15th Aug" className="w-full bg-white dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:border-red-500 outline-none transition-all" />
                         </div>
                       </div>
                     </div>
                   )}
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-white/10">
                <button 
                  disabled={!activeVehicle || !customer.name || isGenerating}
                  onClick={handleGenerateInvoice}
                  className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-gray-200 py-5 rounded-2xl font-black text-lg uppercase tracking-wider transition-all flex justify-center items-center gap-3 disabled:opacity-50 disabled:hover:bg-zinc-900 dark:disabled:hover:bg-white shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  <FileText className="w-6 h-6" /> {isGenerating ? "Processing..." : "Generate Tax Invoice"}
                </button>
                <p className="text-center text-xs text-zinc-500 dark:text-gray-500 mt-4 font-medium uppercase tracking-widest">By generating, you confirm customer verification.</p>
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
    <Suspense fallback={<div className="min-h-screen bg-zinc-50 dark:bg-slate-950 flex items-center justify-center text-zinc-900 dark:text-white"><div className="animate-pulse flex items-center gap-3"><Zap className="w-6 h-6 text-primary" /> Loading POS Terminal...</div></div>}>
      <POSContent />
    </Suspense>
  );
}
