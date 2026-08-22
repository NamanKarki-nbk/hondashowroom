"use client";

import React, { useState } from "react";
import { UploadCloud, FileText, AlertTriangle, CheckCircle, Database } from "lucide-react";

export default function InventoryImport() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

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
    <div className="min-h-screen bg-background dark:bg-slate-950 text-gray-100 p-8 selection:bg-primary selection:text-primary-foreground">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <header>
          <h1 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold font-extrabold text-primary-foreground tracking-tight">Distributor PDF Import</h1>
          <p className="text-gray-400 mt-1">Upload Syakar Trading Co. invoices to automatically update inventory.</p>
        </header>

        {/* Drag and Drop Zone */}
        <div 
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-3xl p-16 text-center transition-all ${
            isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-slate-700 bg-slate-900/40 hover:border-slate-500 hover:bg-slate-900/60"
          }`}
        >
          <div className="flex justify-center mb-4">
             {isParsing ? (
                <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full"></div>
             ) : file ? (
                <FileText className="w-16 h-16 text-green-500" />
             ) : (
                <UploadCloud className="w-16 h-16 text-gray-500 group-hover:text-primary transition-colors" />
             )}
          </div>
          
          <h3 className="text-xl md:text-2xl font-semibold font-bold text-primary-foreground mb-2">
            {isParsing ? "Parsing Document..." : file ? file.name : "Drag & Drop PDF Invoice Here"}
          </h3>
          <p className="text-gray-400 text-sm">
            {isParsing ? "Extracting VINs, Engine Numbers, and Models..." : file ? "Ready to review" : "or click to browse from your computer"}
          </p>
        </div>

        {/* Parsed Data Preview */}
        {parsedData && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-primary"></div>
            
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl md:text-2xl font-semibold font-bold text-primary-foreground flex items-center gap-2">
                  <Database className="w-5 h-5 text-gray-400" /> Parsed Inventory Preview
               </h2>
               <button 
                  onClick={async () => {
                    const btn = document.getElementById('commitBtn');
                    if (btn) btn.innerHTML = 'Committing...';
                    try {
                      const res = await fetch('/api/admin/inventory/import', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ vehicles: parsedData })
                      });
                      if (res.ok) {
                        showNotification('Inventory successfully updated!', 'success');
                        setParsedData(null);
                        setFile(null);
                      } else {
                        showNotification('Failed to commit to database.', 'error');
                      }
                    } catch (e) {
                      showNotification('Error communicating with server.', 'error');
                    }
                  }}
                  id="commitBtn"
                  className="bg-primary hover:bg-primary-hover text-primary-foreground px-6 py-2.5 rounded-xl font-bold transition-colors shadow-lg shadow-primary/20 text-sm"
               >
                  Commit to Database
               </button>
            </div>

            <div className="overflow-x-auto w-full">
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
                    <tr key={idx} className="hover:bg-background/5 transition-colors">
                      <td className="py-3 font-mono text-sm text-gray-300">{item.vin}</td>
                      <td className="py-3 text-primary-foreground font-medium">{item.model}</td>
                      <td className="py-3 text-gray-400">{item.color}</td>
                      <td className="py-3 text-center">
                        <span className={`font-bold ${item.age > 60 ? 'text-primary' : item.age > 30 ? 'text-yellow-500' : 'text-green-500'}`}>
                          {item.age}
                        </span>
                      </td>
                      <td className="py-3">
                        {item.age > 60 ? (
                          <span className="flex items-center gap-1 text-xs font-bold text-primary bg-red-500/10 px-2 py-1 rounded w-max">
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
