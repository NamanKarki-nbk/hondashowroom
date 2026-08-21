"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Upload, Plus, FileCheck, Receipt, Calendar, Tag, Info, X, Database, RefreshCw } from "lucide-react";
import Link from "next/link";

type VehicleInventoryItem = {
  id: string;
  indexNo: string | null;
  vin: string;
  engineNo: string;
  category: string;
  modelName: string;
  cc: number;
  color: string;
  daysInStock: number;
  sellingPrice: number;
  status: string;
  hexCode: string;
};

export default function VehicleInventoryTable() {
  const [items, setItems] = useState<VehicleInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [uploading, setUploading] = useState(false);
  const [parsedVehicles, setParsedVehicles] = useState<any>(null);
  const [parsedInvoice, setParsedInvoice] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const url = new URL("/api/admin/vehicle-inventory", window.location.origin);
      if (search) url.searchParams.append("search", search);

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchInventory();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      showNotification('Please upload a valid PDF file.', 'error');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/inventory/upload-pdf', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok && data.vehicles) {
        setParsedVehicles(data.vehicles);
        setParsedInvoice(data.invoice || null);
      } else {
        showNotification(data.error || 'Upload failed', 'error');
      }
    } catch (err) {
      console.error(err);
      showNotification('An error occurred during upload.', 'error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const confirmAndSaveVehicles = async () => {
    if (!parsedVehicles) return;
    setSaving(true);
    
    try {
      const res = await fetch('/api/admin/inventory/save-parsed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoice: parsedInvoice, vehicles: parsedVehicles }),
      });
      const data = await res.json();
      
      if (res.ok) {
        showNotification(data.message, 'success');
        setParsedVehicles(null);
        setParsedInvoice(null);
        fetchInventory(); // Refresh main table
      } else {
        showNotification(data.error || 'Failed to save vehicles', 'error');
      }
    } catch (err) {
      console.error(err);
      showNotification('An error occurred while saving.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className={`fixed top-4 right-4 z-[100] px-6 py-3 rounded-lg shadow-lg text-white font-bold ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {notification.message}
        </div>
      )}
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Vehicle Inventory
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track vehicles, stock levels, and pricing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className={`flex items-center gap-2 bg-primary hover:bg-red-800 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md transition-all cursor-pointer ${uploading ? 'opacity-70 pointer-events-none' : ''}`}>
            <Upload className="w-4 h-4" /> 
            {uploading ? 'Processing PDF...' : 'Upload PDF'}
            <input 
              type="file" 
              accept=".pdf" 
              className="hidden" 
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
          <button className="flex items-center gap-2 bg-primary hover:bg-red-800 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md transition-all">
            <Plus className="w-4 h-4" /> Add Vehicle
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-3 flex flex-col sm:flex-row gap-3 shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Model, VIN, or Engine No..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-gray-900 dark:text-white outline-none pl-11 pr-4 py-2 placeholder:text-gray-400 text-sm font-medium"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <th className="py-5 px-6 whitespace-nowrap">Page No.</th>
                <th className="py-5 px-6 whitespace-nowrap">Model Details</th>
                <th className="py-5 px-6 whitespace-nowrap">VIN | Engine No</th>
                <th className="py-5 px-6 whitespace-nowrap">Color</th>
                <th className="py-5 px-6 whitespace-nowrap">Days In Stock</th>
                <th className="py-5 px-6 whitespace-nowrap">Price (Selling)</th>
                <th className="py-5 px-6 whitespace-nowrap">Status</th>
                <th className="py-5 px-6 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 text-sm font-medium">
                    Loading inventory...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 text-sm font-medium">
                    No vehicles found matching criteria.
                  </td>
                </tr>
              ) : (
                items.map((item, idx) => (
                  <tr key={item.id} className={`hover:bg-gray-50 dark:hover:bg-[#222] transition-colors ${idx % 2 === 0 ? 'bg-transparent' : 'bg-[#faf9f6] dark:bg-[#1f1f1f]'}`}>
                    <td className="py-4 px-6 text-xs font-bold text-gray-600 dark:text-gray-400">
                      {item.indexNo || "-"}
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-black text-gray-900 dark:text-white">{item.modelName}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.category} • {item.cc}cc</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-xs font-bold text-gray-700 dark:text-gray-300 font-mono tracking-wider">{item.vin}</p>
                      <p className="text-[10px] font-medium text-gray-400 font-mono">{item.engineNo}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full shadow-sm border border-gray-200"
                          style={{ backgroundColor: item.hexCode }}
                        />
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                          {item.color}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-black text-green-600 dark:text-green-500">
                        {item.daysInStock} Days
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-black text-gray-900 dark:text-white">
                        NPR {item.sellingPrice.toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400">
                        In Stock
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link href={`/admin/sales?vehicleId=${item.id}`}>
                        <button className="bg-primary hover:bg-red-800 text-white px-5 py-1.5 rounded text-xs font-bold uppercase tracking-wider shadow-sm transition-colors">
                          Sell
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Premium Preview Modal for Parsed Vehicles */}
      {parsedVehicles && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 transition-all duration-300 animate-in fade-in zoom-in-95">
          <div className="bg-white dark:bg-[#0B0B0C] rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden ring-1 ring-black/5 dark:ring-white/10">
            
            {/* Header Area with Subtle Gradient */}
            <div className="p-6 md:px-8 border-b border-gray-100 dark:border-white/10 bg-gradient-to-r from-gray-50 to-white dark:from-[#151515] dark:to-[#0B0B0C] relative">
              <button 
                onClick={() => {
                  setParsedVehicles(null);
                  setParsedInvoice(null);
                }}
                className="absolute top-6 right-6 md:right-8 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100/50 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-full transition-all"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-4 mb-2">
                <div className="h-12 w-12 rounded-2xl bg-red-100 dark:bg-red-500/20 flex items-center justify-center text-primary dark:text-red-400 shadow-inner">
                  <FileCheck size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 tracking-tight">Review Invoice Extraction</h2>
                  <p className="text-sm text-gray-500 font-medium">Verify the parsed records before committing to the database. Everything looks good!</p>
                </div>
              </div>

              {/* Invoice Meta Cards */}
              {parsedInvoice && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  <div className="flex flex-col bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md hover:border-red-100 dark:hover:border-red-500/30 transition-all group">
                    <div className="flex items-center gap-2 text-gray-400 mb-1 group-hover:text-primary dark:group-hover:text-red-400 transition-colors">
                      <Receipt size={14} />
                      <p className="text-[11px] uppercase font-bold tracking-wider">Invoice No</p>
                    </div>
                    <p className="font-mono text-base font-black text-gray-900 dark:text-white">{parsedInvoice.invoiceNo}</p>
                  </div>
                  
                  <div className="flex flex-col bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md hover:border-red-100 dark:hover:border-red-500/30 transition-all group">
                    <div className="flex items-center gap-2 text-gray-400 mb-1 group-hover:text-primary dark:group-hover:text-red-400 transition-colors">
                      <Tag size={14} />
                      <p className="text-[11px] uppercase font-bold tracking-wider">Total Amount</p>
                    </div>
                    <p className="font-mono text-base font-black text-primary dark:text-red-400">
                      Rs. {parsedInvoice.totalAmount?.toLocaleString("en-IN", {minimumFractionDigits: 2})}
                    </p>
                  </div>

                  <div className="flex flex-col bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md hover:border-red-100 dark:hover:border-red-500/30 transition-all group">
                    <div className="flex items-center gap-2 text-gray-400 mb-1 group-hover:text-primary dark:group-hover:text-red-400 transition-colors">
                      <Info size={14} />
                      <p className="text-[11px] uppercase font-bold tracking-wider">Purchase Type</p>
                    </div>
                    <p className="text-base font-black text-gray-900 dark:text-white">{parsedInvoice.purchaseType}</p>
                  </div>

                  <div className="flex flex-col bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md hover:border-red-100 dark:hover:border-red-500/30 transition-all group">
                    <div className="flex items-center gap-2 text-gray-400 mb-1 group-hover:text-primary dark:group-hover:text-red-400 transition-colors">
                      <Calendar size={14} />
                      <p className="text-[11px] uppercase font-bold tracking-wider">Invoice Date</p>
                    </div>
                    <p className="font-mono text-base font-black text-gray-900 dark:text-white">{parsedInvoice.invoiceDate}</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Table Area */}
            <div className="flex-1 overflow-y-auto bg-[#f8f9fa] dark:bg-[#0B0B0C] p-4 md:p-8">
              <div className="bg-white dark:bg-[#121212] rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-gray-50/90 dark:bg-white/5 backdrop-blur-md sticky top-0 z-10">
                    <tr>
                      <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-gray-500 border-b border-gray-200 dark:border-white/10">#</th>
                      <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-gray-500 border-b border-gray-200 dark:border-white/10">Category</th>
                      <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-gray-500 border-b border-gray-200 dark:border-white/10">Model Name</th>
                      <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-gray-500 border-b border-gray-200 dark:border-white/10">VIN / Chassis</th>
                      <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-gray-500 border-b border-gray-200 dark:border-white/10">Engine No</th>
                      <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-gray-500 border-b border-gray-200 dark:border-white/10">Colour</th>
                      <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-gray-500 border-b border-gray-200 dark:border-white/10">Purchase Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                    {parsedVehicles.map((v: any, index: number) => (
                      <tr key={index} className="hover:bg-red-50/50 dark:hover:bg-white/5 transition-colors group">
                        <td className="py-4 px-6 font-medium text-gray-400 group-hover:text-red-400">{index + 1}</td>
                        <td className="py-4 px-6 font-bold text-gray-900 dark:text-white">
                          <span className="bg-gray-100 dark:bg-white/10 px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wider">
                            {v.category}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-black text-gray-900 dark:text-white">{v.modelName}</td>
                        <td className="py-4 px-6 font-mono font-medium text-gray-900 dark:text-white tracking-tight">{v.vin}</td>
                        <td className="py-4 px-6 font-mono text-sm text-gray-500 dark:text-gray-400">{v.engineNo}</td>
                        <td className="py-4 px-6 font-medium text-gray-600 dark:text-gray-300">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600 border border-gray-400 dark:border-gray-500"></div>
                            {v.color}
                          </div>
                        </td>
                        <td className="py-4 px-6 font-mono font-bold text-primary dark:text-red-400">
                          NPR {v.purchasePrice.toLocaleString("en-IN", {minimumFractionDigits: 2})}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Area */}
            <div className="p-6 md:px-8 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-[#151515] flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm font-medium text-gray-500">
                You are about to securely index <span className="font-bold text-gray-900 dark:text-white">{parsedVehicles.length} vehicles</span>.
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button 
                  onClick={() => {
                    setParsedVehicles(null);
                    setParsedInvoice(null);
                  }}
                  className="flex-1 md:flex-none px-6 py-3 rounded-xl font-bold text-gray-600 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 transition-colors"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmAndSaveVehicles}
                  disabled={saving}
                  className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-primary to-[#a02215] hover:from-[#a02215] hover:to-[#821c11] shadow-lg shadow-red-600/20 hover:shadow-red-600/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 ${saving ? 'opacity-70 pointer-events-none' : ''}`}
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Indexing...
                    </>
                  ) : (
                    <>
                      <Database size={18} />
                      Commit {parsedVehicles.length} Records
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
