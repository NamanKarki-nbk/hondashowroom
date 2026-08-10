"use client";

import React, { useState } from "react";
import { UploadCloud, FileText, AlertTriangle, CheckCircle, Database } from "lucide-react";

export default function InventoryImport() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        simulateParse();
      } else {
        alert("Please upload a valid PDF file.");
      }
    }
  };

  const simulateParse = () => {
    setIsParsing(true);
    setTimeout(() => {
      setIsParsing(false);
      setParsedData([
        { vin: "ME4HXXXX123", model: "CBR 250RR", color: "Red", age: 12, status: "New Arrival" },
        { vin: "ME4HXXXX124", model: "Dio 125", color: "Black", age: 35, status: "Aging (>30 days)" },
        { vin: "ME4HXXXX125", model: "XR 190L", color: "Red", age: 62, status: "Critical (>60 days)" },
        { vin: "ME4HXXXX126", model: "CB Shine", color: "Grey", age: 5, status: "New Arrival" },
      ]);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#f3ebdd] dark:bg-[#0B0B0C] text-gray-100 p-8 selection:bg-[#c1291A] selection:text-[#f3ebdd]">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <header>
          <h1 className="text-3xl font-extrabold text-[#f3ebdd] tracking-tight">Distributor PDF Import</h1>
          <p className="text-gray-400 mt-1">Upload Syakar Trading Co. invoices to automatically update inventory.</p>
        </header>

        {/* Drag and Drop Zone */}
        <div 
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-3xl p-16 text-center transition-all ${
            isDragging ? "border-[#c1291A] bg-[#c1291A]/5 scale-[1.02]" : "border-slate-700 bg-slate-900/40 hover:border-slate-500 hover:bg-slate-900/60"
          }`}
        >
          <div className="flex justify-center mb-4">
             {isParsing ? (
                <div className="animate-spin w-16 h-16 border-4 border-[#c1291A] border-t-transparent rounded-full"></div>
             ) : file ? (
                <FileText className="w-16 h-16 text-green-500" />
             ) : (
                <UploadCloud className="w-16 h-16 text-gray-500 group-hover:text-[#c1291A] transition-colors" />
             )}
          </div>
          
          <h3 className="text-xl font-bold text-[#f3ebdd] mb-2">
            {isParsing ? "Parsing Document..." : file ? file.name : "Drag & Drop PDF Invoice Here"}
          </h3>
          <p className="text-gray-400 text-sm">
            {isParsing ? "Extracting VINs, Engine Numbers, and Models..." : file ? "Ready to review" : "or click to browse from your computer"}
          </p>
        </div>

        {/* Parsed Data Preview */}
        {parsedData && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-[#c1291A]"></div>
            
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold text-[#f3ebdd] flex items-center gap-2">
                  <Database className="w-5 h-5 text-gray-400" /> Parsed Inventory Preview
               </h2>
               <button className="bg-[#c1291A] hover:bg-[#a02014] text-[#f3ebdd] px-6 py-2.5 rounded-xl font-bold transition-colors shadow-lg shadow-[#c1291A]/20 text-sm">
                  Commit to Database
               </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-gray-500">
                    <th className="pb-3 font-semibold">VIN</th>
                    <th className="pb-3 font-semibold">Model</th>
                    <th className="pb-3 font-semibold">Color</th>
                    <th className="pb-3 font-semibold">Stock Age (Days)</th>
                    <th className="pb-3 font-semibold">Status / Alerts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {parsedData.map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-[#f3ebdd]/5 transition-colors">
                      <td className="py-3 font-mono text-sm text-gray-300">{item.vin}</td>
                      <td className="py-3 text-[#f3ebdd] font-medium">{item.model}</td>
                      <td className="py-3 text-gray-400">{item.color}</td>
                      <td className="py-3 text-center">
                        <span className={`font-bold ${item.age > 60 ? 'text-red-500' : item.age > 30 ? 'text-yellow-500' : 'text-green-500'}`}>
                          {item.age}
                        </span>
                      </td>
                      <td className="py-3">
                        {item.age > 60 ? (
                          <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded w-max">
                            <AlertTriangle className="w-3 h-3" /> {item.status}
                          </span>
                        ) : item.age > 30 ? (
                          <span className="flex items-center gap-1 text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded w-max">
                            <AlertTriangle className="w-3 h-3" /> {item.status}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded w-max">
                            <CheckCircle className="w-3 h-3" /> {item.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
