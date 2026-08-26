"use client";

import React, { useState } from "react";
import { ChevronDown, Info } from "lucide-react";

type Product = {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
};

// Helper to resolve Owner's Manual filenames based on DB model names
const getOwnersManualFilename = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("hornet")) return "Owners Manual of Hornet 2.0";
  if (n.includes("nx 200")) return "Owners Manual of NX 200 ";
  if (n.includes("shine")) return "Owners Manual of CB Shine 125";
  if (n.includes("sp 125")) return "Owners Manual of SP Shine 125";
  if (n.includes("dio 125")) return "Owners Manual of Dio BS6 125";
  if (n.includes("dio bs6")) return "Owners Manual of Dio BS6 110";
  return "Owners Manual of Hornet 2.0";
};

// Helper to resolve Maintenance Schedule filenames based on DB model names
const getMaintenanceScheduleFilename = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("hornet")) return "Maintenance Schedule of Hornet 2.0";
  if (n.includes("nx 200")) return "Maintenance Schedule of NX 200";
  if (n.includes("shine")) return "Maintenance Schedule of CB Shine 125";
  if (n.includes("sp 125")) return "Maintenance Schedule of  SP Shine 125.pdf"; // handles double extension .pdf.pdf
  if (n.includes("dio 125")) return "Maintenance Schedule of Dio BS6 125";
  if (n.includes("dio bs6")) return "Maintenance Schedule of Dio BS6 110";
  return "Maintenance Schedule of Hornet 2.0";
};

export default function OwnersManualClient({ products }: { products: Product[] }) {
  const [segment, setSegment] = useState("");
  const [category, setCategory] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [manualType, setManualType] = useState("");
  const [vin, setVin] = useState("");
  const [submittedModels, setSubmittedModels] = useState<Product[]>([]);
  const [submittedType, setSubmittedType] = useState("");

  const handleSubmit = () => {
    if (model && manualType) {
      const selected = products.find(p => p.id === model);
      if (selected) {
        setSubmittedModels([selected]);
        setSubmittedType(manualType);
      }
    } else {
      alert("Please select a Segment, Model, and Manual Type before submitting.");
    }
  };

  const handleVinSubmit = () => {
    const cleanVin = vin.trim().toUpperCase();
    if (cleanVin.length !== 17) {
      alert("Please enter a valid 17-character VIN/Frame number.");
      return;
    }

    const prefix = cleanVin.substring(0, 6);
    let matchedNames: string[] = [];

    if (prefix === "ME4JK3") {
      matchedNames = ["Honda Dio BS6"];
    } else if (prefix === "ME4JK4") {
      matchedNames = ["Honda Dio 125"];
    } else if (prefix === "ME4JC8") {
      matchedNames = ["Honda Shine BS6"];
    } else if (prefix === "ME4JC9") {
      matchedNames = ["Honda SP 125 "];
    } else if (prefix === "ME4MC5") {
      matchedNames = ["CB Hornet 2.0", "Honda NX 200"];
    } else {
      alert("No matching model found for this VIN prefix. Supported prefixes: ME4JK3, ME4JK4, ME4JC8, ME4JC9, ME4MC5.");
      return;
    }

    const matchedProducts = products.filter(p => matchedNames.includes(p.name));
    if (matchedProducts.length > 0) {
      setSubmittedModels(matchedProducts);
      setSubmittedType("BOTH");
    } else {
      alert("No seeded models found in catalog matching the resolved names.");
    }
  };

    <div className="w-full text-gray-900 dark:text-white font-sans mt-8 bg-white dark:bg-slate-950 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 p-6 md:p-10">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl md:text-4xl font-black mb-3 text-gray-900 dark:text-white tracking-tight">Owner's Manual</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Access essential Honda two-wheeler owner's manuals and maintenance schedules</p>
      </div>

      {/* Top Row Dropdowns */}
      <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-white/5">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
          Search by Model
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="relative w-full">
            <select 
              className="w-full appearance-none bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-xl py-3.5 px-4 pr-10 text-gray-700 dark:text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer shadow-sm hover:border-gray-300 dark:hover:border-white/20"
              value={segment} onChange={e => setSegment(e.target.value)}
            >
              <option value="" disabled>Select Segment</option>
              <option value="MOTORCYCLES">Motorcycles</option>
              <option value="SCOOTERS">Scooters</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          
          <div className="relative w-full">
            <select 
              className="w-full appearance-none bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-xl py-3.5 px-4 pr-10 text-gray-700 dark:text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer shadow-sm hover:border-gray-300 dark:hover:border-white/20"
              value={model} onChange={e => { setModel(e.target.value); setSubmittedModels([]); }}
            >
              <option value="" disabled>Select Model</option>
              {products
                .filter(p => !segment || p.category === segment)
                .map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative w-full">
            <select 
              className="w-full appearance-none bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-xl py-3.5 px-4 pr-10 text-gray-700 dark:text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer shadow-sm hover:border-gray-300 dark:hover:border-white/20"
              value={manualType} onChange={e => setManualType(e.target.value)}
            >
              <option value="" disabled>Select Manual Type</option>
              <option value="OWNERS_MANUAL">Owner's Manual</option>
              <option value="MAINTENANCE_SCHEDULE">Maintenance Schedule</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <button 
            onClick={handleSubmit}
            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(239,68,68,0.39)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.23)] hover:-translate-y-0.5 text-sm uppercase tracking-wider flex items-center justify-center gap-2"
          >
            Search
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center my-8">
        <div className="flex-1 border-t border-gray-200 dark:border-white/10"></div>
        <span className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest bg-white dark:bg-slate-950">OR</span>
        <div className="flex-1 border-t border-gray-200 dark:border-white/10"></div>
      </div>

      {/* Bottom Row VIN */}
      <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-white/5">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
          Search by VIN
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          <div className="relative w-full lg:col-span-2">
            <input 
              type="text"
              placeholder="Enter 17-character VIN/Frame Number"
              value={vin}
              onChange={(e) => setVin(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-xl py-3.5 px-4 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder-gray-400 shadow-sm hover:border-gray-300 dark:hover:border-white/20"
            />
          </div>
          
          <div className="flex items-center gap-2 text-gray-500 text-sm pl-2">
            <Info className="w-4 h-4 text-primary shrink-0" />
            <span>Need help finding it?</span>
          </div>

          <button 
            onClick={handleVinSubmit}
            className="w-full bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 text-sm uppercase tracking-wider"
          >
            Search VIN
          </button>
        </div>
      </div>

      {submittedModels.length > 0 && (
        <div className="mt-12 flex flex-col gap-8">
          {submittedModels.map((item) => (
            <div key={item.id} className="flex flex-col gap-6">
              {submittedModels.length > 1 && (
                <h2 className="text-xl md:text-2xl font-semibold font-bold text-[#5b8cff] border-b border-background/5 pb-2">
                  {item.name}
                </h2>
              )}
              
              {(submittedType === "OWNERS_MANUAL" || submittedType === "BOTH") && (
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex flex-col gap-4 w-full md:w-[400px] shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-white/20 transition-all">
                    <div className="text-primary w-fit bg-red-50 dark:bg-primary/10 p-3 rounded-xl">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <text x="12" y="16" fontSize="5" fontWeight="bold" fill="currentColor" textAnchor="middle">PDF</text>
                      </svg>
                    </div>
                    <div className="flex justify-between items-end gap-4 mt-2">
                      <h3 className="text-gray-900 dark:text-white font-bold text-lg leading-snug">
                        {item.name} | Owners Manual <br/> | English
                      </h3>
                      <a 
                        href={`/manuals/${getOwnersManualFilename(item.name)}.pdf`}
                        download={`${item.name} Owners Manual.pdf`}
                        className="bg-primary hover:bg-primary-hover text-white p-3.5 rounded-full flex-shrink-0 transition-all shadow-[0_4px_14px_0_rgba(239,68,68,0.39)] hover:-translate-y-0.5"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 15V19C21 19.5304 20.5523 20 20 20H4C3.44772 20 3 19.5304 3 19V15M7 10L12 15M12 15L17 10M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {(submittedType === "MAINTENANCE_SCHEDULE" || submittedType === "BOTH") && (
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex flex-col gap-4 w-full md:w-[400px] shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-white/20 transition-all">
                    <div className="text-primary w-fit bg-red-50 dark:bg-primary/10 p-3 rounded-xl">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <text x="12" y="16" fontSize="5" fontWeight="bold" fill="currentColor" textAnchor="middle">PDF</text>
                      </svg>
                    </div>
                    <div className="flex justify-between items-end gap-4 mt-2">
                      <h3 className="text-gray-900 dark:text-white font-bold text-lg leading-snug">
                        {item.name} | Maintenance Schedule <br/> | English
                      </h3>
                      <a 
                        href={`/manuals/${getMaintenanceScheduleFilename(item.name)}.pdf`}
                        download={`${item.name} Maintenance Schedule.pdf`}
                        className="bg-primary hover:bg-primary-hover text-white p-3.5 rounded-full flex-shrink-0 transition-all shadow-[0_4px_14px_0_rgba(239,68,68,0.39)] hover:-translate-y-0.5"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 15V19C21 19.5304 20.5523 20 20 20H4C3.44772 20 3 19.5304 3 19V15M7 10L12 15M12 15L17 10M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
