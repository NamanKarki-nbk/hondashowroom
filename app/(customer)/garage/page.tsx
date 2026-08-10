"use client";

import React, { useState } from "react";
import { User, ShieldCheck, Download, Calendar, Wrench, Settings } from "lucide-react";
import ThreeDViewer from "@/components/ThreeDViewer";

const MOCK_USER = {
  name: "Ram Bahadur Thapa",
  id: "1234-5678-9012",
  phone: "+977-9801234567",
  isVerified: true,
};

const OWNED_VEHICLES = [
  {
    vin: "ME4HXXXXXX123456",
    model: "CBR 250RR",
    color: "#222222",
    purchaseDate: "2024-01-15",
    history: [
      { date: "2024-04-10", type: "1st Free Service", km: 1050, notes: "Engine oil changed. Chain lubed.", bill: 0 },
      { date: "2024-08-22", type: "2nd Free Service", km: 4500, notes: "Air filter cleaned. Brakes adjusted.", bill: 450 },
      { date: "2025-02-15", type: "Paid Service", km: 9200, notes: "Brake pads replaced. Spark plug checked.", bill: 3200 }
    ]
  }
];

export default function GaragePage() {
  const [activeVehicle] = useState(OWNED_VEHICLES[0]);

  return (
    <div className="min-h-screen bg-[#f3ebdd] dark:bg-[#0B0B0C] text-gray-100 pt-24 pb-20 px-6 selection:bg-[#c1291A] selection:text-[#f3ebdd] overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Profile Header */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-md flex flex-col md:flex-row items-center gap-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#c1291A]/10 blur-[100px] rounded-full"></div>
          
          <div className="w-24 h-24 bg-black border-2 border-[#c1291A] rounded-full flex items-center justify-center relative z-10 shrink-0">
             <User className="w-10 h-10 text-[#f3ebdd]" />
          </div>
          <div className="relative z-10 flex-1 text-center md:text-left">
             <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <h1 className="text-3xl font-extrabold text-[#f3ebdd] tracking-tight">{MOCK_USER.name}</h1>
                {MOCK_USER.isVerified && (
                  <div className="flex items-center text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
                     <ShieldCheck className="w-3 h-3 mr-1" /> OCR VERIFIED
                  </div>
                )}
             </div>
             <p className="text-gray-400">Citizen ID: <span className="text-gray-300 font-medium">{MOCK_USER.id}</span> | {MOCK_USER.phone}</p>
          </div>
          
          <button className="relative z-10 bg-[#f3ebdd]/5 border border-slate-700 hover:bg-[#f3ebdd]/10 px-5 py-3 rounded-xl font-medium transition-colors">
            Edit Profile
          </button>
        </div>

        {/* Owned Vehicles & Service History */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 3D Vehicle Showcase */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-2xl font-bold text-[#f3ebdd] flex items-center gap-2">
               <Settings className="w-6 h-6 text-[#c1291A]" /> My Garage
            </h2>
            <div className="bg-gradient-to-br from-slate-900 to-black border border-slate-800 rounded-3xl p-6 relative overflow-hidden h-[450px]">
               <div className="absolute top-6 left-6 z-10">
                  <h3 className="text-2xl font-black text-[#f3ebdd]">{activeVehicle.model}</h3>
                  <p className="text-xs text-gray-500 font-mono mt-1">VIN: {activeVehicle.vin}</p>
                  <p className="text-xs text-gray-500 mt-1">Purchased: {activeVehicle.purchaseDate}</p>
               </div>
               
               <div className="w-full h-full absolute inset-0 pt-20">
                  <ThreeDViewer color={activeVehicle.color} autoRotate={true} />
               </div>
            </div>
          </div>

          {/* Service Timeline */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex justify-between items-end">
               <h2 className="text-2xl font-bold text-[#f3ebdd] flex items-center gap-2">
                  <Wrench className="w-6 h-6 text-[#c1291A]" /> Service History
               </h2>
               <button className="text-sm font-semibold text-[#c1291A] hover:text-[#f3ebdd] transition-colors">Book Next Service</button>
            </div>
            
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-md relative">
               <div className="absolute left-12 top-10 bottom-10 w-0.5 bg-slate-800"></div>
               
               <div className="space-y-10">
                  {activeVehicle.history.map((record, idx) => (
                     <div key={idx} className="relative pl-12">
                        {/* Timeline node */}
                        <div className="absolute left-0 top-1.5 w-3 h-3 bg-[#c1291A] rounded-full shadow-[0_0_10px_#c1291A] -ml-[5px]"></div>
                        
                        <div className="bg-black/50 border border-[#f3ebdd]/5 rounded-2xl p-5 hover:border-[#f3ebdd]/10 transition-colors group">
                           <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                              <div>
                                 <h4 className="text-lg font-bold text-[#f3ebdd] mb-1">{record.type}</h4>
                                 <div className="flex items-center text-xs text-gray-500 mb-3 space-x-3">
                                    <span className="flex items-center"><Calendar className="w-3 h-3 mr-1"/> {record.date}</span>
                                    <span className="flex items-center"><Settings className="w-3 h-3 mr-1"/> {record.km} KM</span>
                                 </div>
                                 <p className="text-sm text-gray-400 leading-relaxed">{record.notes}</p>
                              </div>
                              
                              <div className="text-left sm:text-right shrink-0">
                                 <div className="text-lg font-bold text-[#f3ebdd] mb-2">Rs. {record.bill}</div>
                                 <button className="bg-[#f3ebdd]/5 hover:bg-[#f3ebdd]/10 text-xs font-semibold px-3 py-2 rounded-lg border border-[#f3ebdd]/10 transition-colors flex items-center justify-center sm:justify-end gap-1 w-full sm:w-auto">
                                    <Download className="w-3 h-3" /> PDF Invoice
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
