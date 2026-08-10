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

  return (
    <div className="w-full text-[#f3ebdd] font-sans">
      <h1 className="text-[28px] font-bold mb-1 text-[#f3ebdd]">Owners Manual</h1>
      <p className="text-[#5b8cff] text-[13px] mb-8 font-medium">Access your essential Honda two-wheeler owner's manuals</p>

      {/* Top Row Dropdowns */}
      <div className="flex flex-col lg:flex-row items-center gap-3">
        <div className="relative w-full lg:flex-1">
          <select 
            className="w-full appearance-none bg-[#2a3040] border border-[#f3ebdd]/5 rounded py-[14px] px-4 text-[#a0aabf] text-[13px] focus:outline-none focus:border-[#f3ebdd]/20 cursor-pointer"
            value={segment} onChange={e => setSegment(e.target.value)}
          >
            <option value="" disabled>Select Segment</option>
            <option value="MOTORCYCLES">Motorcycles</option>
            <option value="SCOOTERS">Scooters</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
        
        <div className="relative w-full lg:flex-1">
          <select 
            className="w-full appearance-none bg-[#2a3040] border border-[#f3ebdd]/5 rounded py-[14px] px-4 text-[#a0aabf] text-[13px] focus:outline-none focus:border-[#f3ebdd]/20 cursor-pointer"
            value={model} onChange={e => { setModel(e.target.value); setSubmittedModels([]); }}
          >
            <option value="" disabled>Select Model</option>
            {products
              .filter(p => !segment || p.category === segment)
              .map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>

        <div className="relative w-full lg:flex-1">
          <select 
            className="w-full appearance-none bg-[#2a3040] border border-[#f3ebdd]/5 rounded py-[14px] px-4 text-[#a0aabf] text-[13px] focus:outline-none focus:border-[#f3ebdd]/20 cursor-pointer"
            value={manualType} onChange={e => setManualType(e.target.value)}
          >
            <option value="" disabled>Select Manual Type</option>
            <option value="OWNERS_MANUAL">Owner's Manual</option>
            <option value="MAINTENANCE_SCHEDULE">Maintenance Schedule</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>

        <button 
          onClick={handleSubmit}
          className="w-full lg:w-auto bg-[#c40000] hover:bg-[#a00000] text-[#f3ebdd] font-bold py-[14px] px-[30px] rounded transition-colors text-[13px] min-w-[120px]"
        >
          Submit
        </button>
      </div>

      {/* Divider */}
      <div className="my-6">
        <span className="text-[10px] font-bold text-[#868ea3] uppercase tracking-wider">OR</span>
      </div>

      {/* Bottom Row VIN */}
      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="relative w-full lg:w-[320px]">
          <input 
            type="text"
            placeholder="Enter VIN/Frame Number"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            className="w-full bg-[#2a3040] border border-[#f3ebdd]/5 rounded py-[14px] px-4 text-gray-300 text-[13px] focus:outline-none focus:border-[#f3ebdd]/20 placeholder-[#6c7693]"
          />
        </div>
        
        <Info className="w-5 h-5 text-[#5b8cff] flex-shrink-0 hidden lg:block cursor-pointer opacity-80" />

        <button 
          onClick={handleVinSubmit}
          className="w-full lg:w-auto bg-[#c40000] hover:bg-[#a00000] text-[#f3ebdd] font-bold py-[14px] px-[30px] rounded transition-colors text-[13px] min-w-[120px]"
        >
          Submit
        </button>
      </div>

      {submittedModels.length > 0 && (
        <div className="mt-12 flex flex-col gap-8">
          {submittedModels.map((item) => (
            <div key={item.id} className="flex flex-col gap-6">
              {submittedModels.length > 1 && (
                <h2 className="text-xl font-bold text-[#5b8cff] border-b border-[#f3ebdd]/5 pb-2">
                  {item.name}
                </h2>
              )}
              
              {(submittedType === "OWNERS_MANUAL" || submittedType === "BOTH") && (
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="bg-[#1e2330] border border-[#f3ebdd]/5 rounded-xl p-6 flex flex-col gap-4 w-full md:w-[400px]">
                    <div className="text-[#c40000] w-fit">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <text x="12" y="16" fontSize="5" fontWeight="bold" fill="currentColor" textAnchor="middle">PDF</text>
                      </svg>
                    </div>
                    <div className="flex justify-between items-end gap-4 mt-2">
                      <h3 className="text-[#f3ebdd] font-bold text-lg leading-snug">
                        {item.name} | Owners Manual <br/> | English
                      </h3>
                      <a 
                        href={`/manuals/${getOwnersManualFilename(item.name)}.pdf`}
                        download={`${item.name} Owners Manual.pdf`}
                        className="bg-[#c40000] hover:bg-[#a00000] text-[#f3ebdd] p-3 rounded-full flex-shrink-0 transition-colors shadow-lg shadow-black/20"
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
                  <div className="bg-[#1e2330] border border-[#f3ebdd]/5 rounded-xl p-6 flex flex-col gap-4 w-full md:w-[400px]">
                    <div className="text-[#c40000] w-fit">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <text x="12" y="16" fontSize="5" fontWeight="bold" fill="currentColor" textAnchor="middle">PDF</text>
                      </svg>
                    </div>
                    <div className="flex justify-between items-end gap-4 mt-2">
                      <h3 className="text-[#f3ebdd] font-bold text-lg leading-snug">
                        {item.name} | Maintenance Schedule <br/> | English
                      </h3>
                      <a 
                        href={`/manuals/${getMaintenanceScheduleFilename(item.name)}.pdf`}
                        download={`${item.name} Maintenance Schedule.pdf`}
                        className="bg-[#c40000] hover:bg-[#a00000] text-[#f3ebdd] p-3 rounded-full flex-shrink-0 transition-colors shadow-lg shadow-black/20"
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
