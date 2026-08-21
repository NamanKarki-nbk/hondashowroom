"use client";

import React, { useEffect, useState } from "react";
import { DOC_CATEGORIES, DocCategory } from "@/lib/letterTemplates";
import { getRecentPurchaseInvoices, getInvoicesByDateRange } from "@/app/actions/invoice";
import { getLatestRemainingBalance } from "@/app/actions/letter";
import { FileText, User, Hash, Calendar, Layers, Plus, Trash2, Banknote, Download, Building2, Settings, ListPlus, X } from "lucide-react";
import NepaliDate from 'nepali-date-converter';
import { format as formatEnglishDate, lastDayOfMonth } from 'date-fns';

interface DynamicFormProps {
  docType: DocCategory;
  recipient: string;
  metadata: any;
  setDocType: (type: DocCategory) => void;
  setRecipient: (val: string) => void;
  setMetadata: (meta: any) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const InputField = ({ label, id, placeholder, type = "text", icon: Icon, value, onChange }: { label: string, id: string, placeholder?: string, type?: string, icon?: any, value: string, onChange: (val: string) => void }) => (
  <div className="relative group mt-2">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      {Icon && <Icon className="h-4 w-4 text-gray-400 group-focus-within:text-[#B83227] transition-colors" />}
    </div>
    <input
      type={type}
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder=" "
      className={`block w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 text-gray-900 dark:text-white rounded-lg px-3 py-3 text-sm focus:outline-none focus:border-[#B83227] focus:ring-1 focus:ring-[#B83227] transition-all peer ${Icon ? 'pl-10' : 'pl-4'}`}
    />
    <label htmlFor={id} className={`absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-50 dark:bg-zinc-900 px-1 peer-focus:px-1 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 ${Icon ? 'left-9' : 'left-3'} peer-focus:text-[#B83227] pointer-events-none`}>
      {label}
    </label>
  </div>
);

export default function DynamicForm({
  docType,
  recipient,
  metadata,
  setDocType,
  setRecipient,
  setMetadata,
  onSubmit,
  isSubmitting
}: DynamicFormProps) {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isAutofilling, setIsAutofilling] = useState<boolean>(false);
  const [staffList, setStaffList] = useState<any[]>([]);

  // Fetch recent invoices
  useEffect(() => {
    getRecentPurchaseInvoices().then(setInvoices);
  }, []);

  // Fetch staff list
  useEffect(() => {
    fetch('/api/admin/staff', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setStaffList(data);
      })
      .catch(console.error);
  }, []);

  // Fetch latest remaining balance when docType changes to Cash Incentive Claim
  useEffect(() => {
    if (docType === "Vehicle Purchase Cash Incentive Claim") {
      getLatestRemainingBalance().then(balance => {
        // Only set it if it's not already manually edited
        if (metadata.previousRemainingBalance === undefined) {
          setMetadata((prev: any) => ({ ...prev, previousRemainingBalance: balance }));
        }
      });
    }
  }, [docType]);

  // Compute finalRemainingBalance automatically whenever stcBills or previousRemainingBalance changes
  useEffect(() => {
    if (docType === "Vehicle Purchase Cash Incentive Claim" && metadata.stcBills) {
      const prevBal = Number(metadata.previousRemainingBalance) || 0;
      const computedFinal = metadata.stcBills.reduce((acc: number, bill: any) => {
        return acc + (Number(bill.amountDeposited) || 0) - (Number(bill.billAmount) || 0);
      }, prevBal);
      
      if (metadata.finalRemainingBalance !== computedFinal) {
        setMetadata((prev: any) => ({ ...prev, finalRemainingBalance: computedFinal }));
      }
    }
  }, [docType, metadata.stcBills, metadata.previousRemainingBalance]);

  // Pre-fill recipient based on category
  useEffect(() => {
    if (docType === 'Bank Salary Deposit Request') {
      if (!recipient || recipient === "Syakar Trading Company Pvt. Ltd.") {
        setRecipient("NMB Bank Ltd.\nDamak Branch");
      }
    } else {
      if (!recipient || recipient === "NMB Bank Ltd.\nDamak Branch" || recipient === "श्रीमान् कार्यालय प्रमुख ज्यु,\nस्याकार ट्रेडिङ्ग कम्पनी प्रा.ली.\nज्योतिभवन, कान्तिपथ\nकाठमाण्डौ") {
        setRecipient("Syakar Trading Company Pvt. Ltd.");
      }
    }
  }, [docType, recipient, setRecipient]);

  // Keep metadata in sync so the preview sees the initial default values for Salary Request
  useEffect(() => {
    if (docType === 'Bank Salary Deposit Request' && staffList.length > 0 && (!metadata.salaryClaims || metadata.salaryClaims.length === 0)) {
      const defaultClaims = staffList.map(s => {
        const baseSalary = s.lastSalary ? String(s.lastSalary) : '';
        const tds = baseSalary ? String(Math.floor(Number(baseSalary) * 0.01)) : '';
        const netAmount = baseSalary ? String(Number(baseSalary) - Number(tds)) : '';
        return { ...s, salary: baseSalary, tds, netAmount };
      });
      setMetadata((prev: any) => ({ ...prev, salaryClaims: defaultClaims }));
    }
  }, [docType, staffList, metadata.salaryClaims]);

  const handleMetaChange = (key: string, value: string) => {
    let newMeta = { ...metadata, [key]: value };

    if (docType === 'Free Service Coupon Claim' || docType === '6 Free Service With Engine Oil Claim' || docType === '2 Years Free Service With Engine Oil and Parts Claim') {
      try {
        if (key === 'month' && value.match(/[a-zA-Z]+\s+\d{4}/)) {
          const d = new Date(value);
          if (!isNaN(d.getTime())) {
            const start = new Date(d.getFullYear(), d.getMonth(), 1);
            const end = lastDayOfMonth(start);
            
            const ndStart = new NepaliDate(start);
            const ndEnd = new NepaliDate(end);

            newMeta.englishStartDate = formatEnglishDate(start, 'do MMM. yyyy');
            newMeta.nepaliStartDate = ndStart.format('MMMM D, YYYY', 'np') + ' गते';

            newMeta.englishEndDate = formatEnglishDate(end, 'do MMM. yyyy');
            newMeta.nepaliEndDate = ndEnd.format('MMMM D, YYYY', 'np') + ' गते';
          }
        } else if (key === 'nepaliStartDate' && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
          const nd = new NepaliDate(value);
          newMeta.englishStartDate = formatEnglishDate(nd.toJsDate(), 'do MMM. yyyy');
          newMeta.nepaliStartDate = nd.format('MMMM D, YYYY', 'np') + ' गते';
        } else if (key === 'englishStartDate' && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
          const nd = new NepaliDate(new Date(value));
          newMeta.nepaliStartDate = nd.format('MMMM D, YYYY', 'np') + ' गते';
          newMeta.englishStartDate = formatEnglishDate(new Date(value), 'do MMM. yyyy');
        } else if (key === 'nepaliEndDate' && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
          const nd = new NepaliDate(value);
          newMeta.englishEndDate = formatEnglishDate(nd.toJsDate(), 'do MMM. yyyy');
          newMeta.nepaliEndDate = nd.format('MMMM D, YYYY', 'np') + ' गते';
        } else if (key === 'englishEndDate' && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
          const nd = new NepaliDate(new Date(value));
          newMeta.nepaliEndDate = nd.format('MMMM D, YYYY', 'np') + ' गते';
          newMeta.englishEndDate = formatEnglishDate(new Date(value), 'do MMM. yyyy');
        }
      } catch (e) {
        // ignore parsing errors while typing
      }
    }

    setMetadata(newMeta);
  };

  const renderDynamicFields = () => {
    switch (docType) {
      case 'Vehicle Purchase Cash Incentive Claim': {
        const stcBills = metadata.stcBills || [];
        const handleAddBill = () => {
          setMetadata({
            ...metadata,
            stcBills: [...stcBills, { depositDate: '', amountDeposited: '', billDate: '', stcBillNo: '', billAmount: '' }]
          });
        };
        const handleBillChange = (index: number, field: string, value: string) => {
          const newBills = [...stcBills];
          newBills[index][field] = value;
          setMetadata({ ...metadata, stcBills: newBills });
        };
        const handleRemoveBill = (index: number) => {
          const newBills = stcBills.filter((_: any, i: number) => i !== index);
          setMetadata({ ...metadata, stcBills: newBills });
        };

        const handleAutofillByDate = async () => {
          if (!startDate || !endDate) {
            alert("Please select both a Start Date and an End Date.");
            return;
          }
          setIsAutofilling(true);
          try {
            const fetchedInvoices = await getInvoicesByDateRange(startDate, endDate);
            if (fetchedInvoices.length === 0) {
              alert("No STC Sales Bills found for the selected date range.");
              return;
            }

            const newBills = fetchedInvoices.map(inv => ({
              depositDate: '', 
              amountDeposited: '', 
              billDate: inv.date, 
              stcBillNo: inv.invoiceNo, 
              billAmount: inv.totalAmount 
            }));

            setMetadata({
              ...metadata,
              stcBills: [...stcBills, ...newBills]
            });
            
            // Show toast or alert
            alert(`Successfully added ${fetchedInvoices.length} invoices!`);
          } catch (err) {
            console.error("Error auto-filling:", err);
            alert("Failed to fetch invoices.");
          } finally {
            setIsAutofilling(false);
          }
        };

        return (
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Previous Remaining Balance" id="previousRemainingBalance" placeholder="0.00" type="number" icon={Banknote} value={metadata['previousRemainingBalance'] || ''} onChange={(val) => handleMetaChange('previousRemainingBalance', val)} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#B83227]" />
                    <span>Auto-fill Start Date</span>
                  </div>
                </label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                    onClick={(e) => { try { e.currentTarget.showPicker(); } catch(err) {} }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  />
                  <div className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 flex items-center">
                    {startDate || <span className="text-gray-400">YYYY-MM-DD</span>}
                  </div>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#B83227]" />
                    <span>Auto-fill End Date</span>
                  </div>
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <input 
                      type="date" 
                      value={endDate} 
                      onChange={(e) => setEndDate(e.target.value)} 
                      onClick={(e) => { try { e.currentTarget.showPicker(); } catch(err) {} }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    />
                    <div className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 flex items-center h-full">
                      {endDate || <span className="text-gray-400">YYYY-MM-DD</span>}
                    </div>
                  </div>
                  <button type="button" onClick={handleAutofillByDate} disabled={isAutofilling} className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black px-4 rounded-lg font-medium transition-colors disabled:opacity-50 whitespace-nowrap">
                    {isAutofilling ? 'Loading...' : 'Auto-fill Bills'}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-white/5 px-4 py-3 border-b border-gray-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">STC Sales Bills</h4>
                
                <div className="flex flex-wrap gap-2 items-center">
                  <button 
                    type="button" 
                    onClick={handleAddBill}
                    className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 hover:border-[#B83227] dark:hover:border-[#B83227] text-gray-700 dark:text-gray-300 hover:text-[#B83227] dark:hover:text-[#B83227] text-sm px-4 py-2 rounded-lg font-medium transition-all shadow-sm group"
                  >
                    <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" /> 
                    <span>Add Manual Row</span>
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-4">
                {stcBills.map((bill: any, index: number) => (
                  <div key={index} className={`grid grid-cols-1 md:grid-cols-5 gap-3 p-3 relative group transition-colors ${index % 2 === 0 ? 'bg-white dark:bg-[#111]' : 'bg-gray-50 dark:bg-zinc-900'} border-b border-gray-200 dark:border-white/5 last:border-0`}>
                    <button 
                      type="button"
                      onClick={() => handleRemoveBill(index)}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full p-1.5 flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-900/50"
                      title="Remove Row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Deposit Date</label>
                      <div className="relative">
                        <input 
                          type="date" 
                          value={bill.depositDate} 
                          onChange={(e) => handleBillChange(index, 'depositDate', e.target.value)} 
                          onClick={(e) => { try { e.currentTarget.showPicker(); } catch(err) {} }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                        />
                        <div className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm flex items-center h-[38px]">
                          {bill.depositDate || <span className="text-gray-400">YYYY-MM-DD</span>}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Amt Deposited</label>
                      <input type="number" value={bill.amountDeposited} onChange={(e) => handleBillChange(index, 'amountDeposited', e.target.value)} className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#B83227]/50 transition-colors shadow-sm" placeholder="0.00" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Bill Date</label>
                      <div className="text-sm text-gray-700 dark:text-gray-300">{bill.billDate || '-'}</div>
                    </div>
                    <div className="flex flex-col justify-center">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">STC Bill No.</label>
                      <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">{bill.stcBillNo || '-'}</div>
                    </div>
                    <div className="flex flex-col justify-center">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Bill Amount</label>
                      <div className="text-sm text-[#B83227] font-bold">{bill.billAmount ? Number(bill.billAmount).toLocaleString() : '0.00'}</div>
                    </div>
                  </div>
                ))}
                {stcBills.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No bills added. Click "Add Row" to start adding STC bills.</p>
                )}
              </div>
            </div>
          </div>
        );
      }

      case 'Free Service Coupon Claim': {
        const couponData = metadata.couponData || {
          BIKE: {}, SCOOTER: {}, BIGBIKE: {}, AMC: {}, ADDITIONAL: {}
        };
        
        const handleCouponChange = (category: string, service: string, value: string) => {
          const newData = { ...couponData };
          if (!newData[category]) newData[category] = {};
          newData[category][service] = value;
          setMetadata({ ...metadata, couponData: newData });
        };

        const servicesList = ["1ST", "2ND", "3RD", "4TH", "5TH", "6TH", "7TH", "8TH", "9TH", "10TH", "11TH", "12TH", "13TH", "14TH", "15TH", "16TH", "17TH", "18TH", "19TH", "20TH"];
        const addServicesList = [...servicesList, "BONUS"];

        const categories = [
          { key: "BIKE", label: "BIKE", services: servicesList },
          { key: "SCOOTER", label: "SCOOTER", services: servicesList },
          { key: "BIGBIKE", label: "BIGBIKE", services: servicesList },
          { key: "AMC", label: "AMC", services: servicesList },
          { key: "ADDITIONAL", label: "ADDITIONAL", services: addServicesList }
        ];

        return (
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Month (e.g. July 2026)" id="month" placeholder="July 2026" icon={Calendar} value={metadata['month'] || ''} onChange={(val) => handleMetaChange('month', val)} />
            </div>

            <div className="mt-6 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-white/5 px-4 py-3 border-b border-gray-200 dark:border-zinc-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Coupon Counts</h4>
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="w-full text-sm text-left min-w-[700px]">
                  <thead>
                    <tr>
                      <th className="font-bold pb-2 uppercase text-[10px] text-gray-500 tracking-wider">Service</th>
                      {categories.map(cat => <th key={cat.key} className="font-bold pb-2 uppercase text-[10px] text-gray-500 tracking-wider w-1/5">{cat.label}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {addServicesList.map(srv => (
                      <tr key={srv} className="border-t border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <td className="py-1.5 font-medium text-xs text-gray-600 dark:text-gray-300">{srv}</td>
                        {categories.map(cat => (
                          <td key={`${cat.key}-${srv}`} className="py-1.5 pr-3">
                            {cat.services.includes(srv) ? (
                              <input 
                                type="number" 
                                min="0"
                                value={couponData[cat.key]?.[srv] || ''} 
                                onChange={(e) => handleCouponChange(cat.key, srv, e.target.value)}
                                className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 focus:border-[#B83227] dark:focus:border-[#B83227] px-1 text-sm focus:outline-none transition-colors"
                                placeholder="0"
                              />
                            ) : null}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      }

      case '2 Years Free Service With Engine Oil and Parts Claim':
      case '6 Free Service With Engine Oil Claim': {
        const claims = metadata.engineOilClaims || [];
        const handleAddClaim = () => {
          setMetadata({
            ...metadata,
            engineOilClaims: [...claims, { customerName: '', bookNo: '', servicingNo: '', billNo: '', amount: '' }]
          });
        };
        const handleClaimChange = (index: number, field: string, value: string) => {
          const newClaims = [...claims];
          newClaims[index][field] = value;
          setMetadata({ ...metadata, engineOilClaims: newClaims });
        };
        const handleRemoveClaim = (index: number) => {
          const newClaims = claims.filter((_: any, i: number) => i !== index);
          setMetadata({ ...metadata, engineOilClaims: newClaims });
        };

        return (
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Month (e.g. July 2026)" id="month" placeholder="July 2026" icon={Calendar} value={metadata['month'] || ''} onChange={(val) => handleMetaChange('month', val)} />
            </div>

            <div className="flex justify-between items-center bg-gray-50 dark:bg-white/5 p-3 rounded-lg border border-gray-200 dark:border-zinc-800 mt-4">
              <h3 className="font-bold text-gray-900 dark:text-white">Service Claims List</h3>
              <button 
                type="button" 
                onClick={handleAddClaim}
                className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 hover:border-[#B83227] dark:hover:border-[#B83227] text-gray-700 dark:text-gray-300 hover:text-[#B83227] dark:hover:text-[#B83227] text-sm px-4 py-2 rounded-lg font-medium transition-all shadow-sm group"
              >
                <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" /> 
                <span>Add Row</span>
              </button>
            </div>
            
            <div className="space-y-3">
              {claims.length === 0 && (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                  No claims added yet. Click 'Add Row' to start.
                </div>
              )}
              {claims.map((claim: any, index: number) => (
                <div key={index} className="flex flex-col md:flex-row gap-3 items-start bg-white dark:bg-[#111] p-3 rounded-lg border border-gray-200 dark:border-zinc-800 relative">
                  <button 
                    type="button" 
                    onClick={() => handleRemoveClaim(index)}
                    className="absolute -top-2 -right-2 bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200 hover:text-red-700 p-1 rounded-full shadow-sm z-10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex-1 w-full">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Customer Name</label>
                    <input type="text" value={claim.customerName} onChange={(e) => handleClaimChange(index, 'customerName', e.target.value)} className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B83227]/50" />
                  </div>
                  <div className="w-full md:w-32">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Book No.</label>
                    <input type="text" value={claim.bookNo} onChange={(e) => handleClaimChange(index, 'bookNo', e.target.value)} className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B83227]/50" />
                  </div>
                  <div className="w-full md:w-32">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Servicing No.</label>
                    <input type="text" value={claim.servicingNo} onChange={(e) => handleClaimChange(index, 'servicingNo', e.target.value)} className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B83227]/50" placeholder="e.g. 2nd" />
                  </div>
                  <div className="w-full md:w-32">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Bill No.</label>
                    <input type="text" value={claim.billNo} onChange={(e) => handleClaimChange(index, 'billNo', e.target.value)} className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B83227]/50" />
                  </div>
                  <div className="w-full md:w-32">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Bill Amount</label>
                    <input type="number" value={claim.amount} onChange={(e) => handleClaimChange(index, 'amount', e.target.value)} className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#B83227]/50" placeholder="0.00" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }



      case 'Bank Salary Deposit Request': {
        const defaultClaims = staffList.map(s => {
          const baseSalary = s.lastSalary ? String(s.lastSalary) : '';
          const tds = baseSalary ? String(Math.floor(Number(baseSalary) * 0.01)) : '';
          const netAmount = baseSalary ? String(Number(baseSalary) - Number(tds)) : '';
          return { ...s, salary: baseSalary, tds, netAmount };
        });

        const salaryClaims = (metadata.salaryClaims && metadata.salaryClaims.length > 0) 
          ? metadata.salaryClaims 
          : defaultClaims;

        const handleSalaryChange = (index: number, newSalary: string) => {
          const updated = [...salaryClaims];
          const salaryVal = Number(newSalary) || 0;
          const tds = Math.round(salaryVal * 0.01);
          const net = salaryVal - tds;
          
          updated[index] = {
            ...updated[index],
            salary: newSalary,
            tds: newSalary ? tds.toString() : '',
            netAmount: newSalary ? net.toString() : ''
          };
          
          setMetadata({ ...metadata, salaryClaims: updated });
        };

        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Month (महिना)" id="month" placeholder="e.g. असार" icon={Calendar} value={metadata['month'] || ''} onChange={(val) => handleMetaChange('month', val)} />
              <InputField label="Check Number" id="checkNo" placeholder="e.g. 1041246271" icon={Hash} value={metadata['checkNo'] || ''} onChange={(val) => handleMetaChange('checkNo', val)} />
            </div>

            <div className="mt-4 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden">
              {staffList.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">Loading staff data... If this persists, please refresh the page.</div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      <th className="px-3 py-2 font-semibold">Name</th>
                      <th className="px-3 py-2 font-semibold">Salary</th>
                      <th className="px-3 py-2 font-semibold">TDS (1%)</th>
                      <th className="px-3 py-2 font-semibold">Net Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {salaryClaims.map((claim: any, index: number) => (
                      <tr key={index}>
                        <td className="px-3 py-2 font-medium whitespace-nowrap">{claim.name}</td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            value={claim.salary}
                            onChange={(e) => handleSalaryChange(index, e.target.value)}
                            className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:border-[#B83227] px-1 py-1"
                            placeholder="0"
                          />
                        </td>
                        <td className="px-3 py-2 text-gray-500">{claim.tds}</td>
                        <td className="px-3 py-2 font-semibold">{claim.netAmount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {staffList.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-zinc-800 p-3 flex justify-end">
                  <button
                    onClick={async () => {
                      const btn = document.getElementById('save-salaries-btn');
                      if (btn) {
                        btn.innerText = 'Saving...';
                        btn.setAttribute('disabled', 'true');
                      }
                      
                      try {
                        await fetch('/api/admin/staff/save-salaries', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ salaries: salaryClaims })
                        });
                        if (btn) btn.innerText = 'Saved Successfully!';
                      } catch (e) {
                        if (btn) btn.innerText = 'Error Saving';
                      } finally {
                        setTimeout(() => { 
                          if (btn) {
                            btn.innerText = 'Save Updated Salaries';
                            btn.removeAttribute('disabled');
                          }
                        }, 2000);
                      }
                    }}
                    id="save-salaries-btn"
                    type="button"
                    className="px-4 py-1.5 bg-[#B83227] text-white text-xs rounded hover:bg-[#962920] transition-colors disabled:opacity-50"
                  >
                    Save Updated Salaries
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      }

      case 'Salesman Incentive Claim':
        return (
          <>
            <InputField label="Month" id="month" placeholder="e.g. Jestha" icon={Calendar} value={metadata['month'] || ''} onChange={(val) => handleMetaChange('month', val)} />
            <InputField label="Incentive Amount (NPR)" id="claimAmount" placeholder="e.g. 5000" type="number" icon={Banknote} value={metadata['claimAmount'] || ''} onChange={(val) => handleMetaChange('claimAmount', val)} />
          </>
        );

      case 'Transfer Claim Amount to Cash or BG Ledger':
        return (
          <>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Destination Ledger
              </label>
              <select
                value={metadata['transferLedger'] || ''}
                onChange={(e) => handleMetaChange('transferLedger', e.target.value)}
                className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 text-gray-900 dark:text-white rounded-lg px-4 py-[11px] text-sm focus:outline-none focus:border-[#B83227] focus:ring-1 focus:ring-[#B83227] transition-all"
              >
                <option value="" disabled>Select Destination...</option>
                <option value="CASH LEDGER">Cash Ledger</option>
                <option value="BG SECTION">BG Section</option>
              </select>
            </div>
            <InputField label="Transfer Amount (NPR)" id="claimAmount" placeholder="e.g. 100000" type="number" icon={Banknote} value={metadata['claimAmount'] || ''} onChange={(val) => handleMetaChange('claimAmount', val)} />
          </>
        );

      case 'Payment Request Letter for Syakar Hire Purchase':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Delivery Order No." id="deliveryOrderNo" placeholder="e.g. 119/111/103/82/83" icon={Hash} value={metadata['deliveryOrderNo'] || ''} onChange={(val) => handleMetaChange('deliveryOrderNo', val)} />
            <InputField label="Date (Nepali)" id="dateNepali" placeholder="e.g. 2026-06-11" icon={Calendar} value={metadata['dateNepali'] || ''} onChange={(val) => handleMetaChange('dateNepali', val)} />
            <InputField label="Customer Name" id="customerName" placeholder="e.g. Veer Prasad Rajbanshi" icon={User} value={metadata['customerName'] || ''} onChange={(val) => handleMetaChange('customerName', val)} />
            <InputField label="Vehicle Model" id="vehicleModel" placeholder="e.g. DIO BS6 110 DLX" icon={FileText} value={metadata['vehicleModel'] || ''} onChange={(val) => handleMetaChange('vehicleModel', val)} />
            <InputField label="Investment Amount (NPR)" id="investmentAmount" placeholder="e.g. 111960" type="number" icon={Banknote} value={metadata['investmentAmount'] || ''} onChange={(val) => handleMetaChange('investmentAmount', val)} />
            <InputField label="Chassis No." id="chassisNo" placeholder="e.g. ME4JK381ATN004502" icon={Hash} value={metadata['chassisNo'] || ''} onChange={(val) => handleMetaChange('chassisNo', val)} />
            <InputField label="Engine No." id="engineNo" placeholder="e.g. JF98E 6025096" icon={Hash} value={metadata['engineNo'] || ''} onChange={(val) => handleMetaChange('engineNo', val)} />
            <InputField label="Registration No." id="registrationNo" placeholder="e.g. STATE1-01-019PA3211" icon={Hash} value={metadata['registrationNo'] || ''} onChange={(val) => handleMetaChange('registrationNo', val)} />
            <InputField label="VAT Bill No." id="vatBillNo" placeholder="e.g. SPI82/83-08191" icon={Hash} value={metadata['vatBillNo'] || ''} onChange={(val) => handleMetaChange('vatBillNo', val)} />
          </div>
        );

      case 'Warranty Claim Letter': {
        const isParts = metadata.warrantyType === 'Parts Warranty Claim';
        const claims = metadata.warrantyClaims || [];
        const handleAddClaim = () => {
          setMetadata({
            ...metadata,
            warrantyClaims: [...claims, { customerName: '', billNo: '', itemNo: '', amount: '' }]
          });
        };
        const handleRemoveClaim = (index: number) => {
          const newClaims = [...claims];
          newClaims.splice(index, 1);
          setMetadata({ ...metadata, warrantyClaims: newClaims });
        };
        const handleClaimChange = (index: number, field: string, value: string) => {
          const newClaims = [...claims];
          newClaims[index] = { ...newClaims[index], [field]: value };
          setMetadata({ ...metadata, warrantyClaims: newClaims });
        };

        return (
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Warranty Type</label>
                <select
                  value={metadata.warrantyType || 'Battery Warranty Claim'}
                  onChange={(e) => handleMetaChange('warrantyType', e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#B83227]/50"
                >
                  <option value="Battery Warranty Claim">Battery Warranty Claim</option>
                  <option value="Parts Warranty Claim">Parts Warranty Claim</option>
                </select>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden">
              <div className="bg-gray-50 dark:bg-zinc-900 px-4 py-3 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <ListPlus className="w-4 h-4 text-[#B83227]" />
                  Service Claims List
                </h3>
                <button type="button" onClick={handleAddClaim} className="flex items-center gap-1.5 text-sm bg-[#B83227] text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors">
                  <Plus className="w-4 h-4" /> Add Row
                </button>
              </div>
              <div className="p-4 space-y-4">
                {claims.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
                    No claims added yet. Click "Add Row" to start.
                  </div>
                ) : (
                  claims.map((claim: any, index: number) => (
                    <div key={index} className="relative p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] grid grid-cols-1 md:grid-cols-4 gap-4 group">
                      <button type="button" onClick={() => handleRemoveClaim(index)} className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-white dark:bg-zinc-800 text-red-500 rounded-full border border-gray-200 dark:border-zinc-800 flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-sm hover:bg-red-50 transition-all">
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <InputField label="Customer Name" id={`name-${index}`} placeholder="e.g. MAUSAMI MIBHAK" icon={User} value={claim.customerName} onChange={(val) => handleClaimChange(index, 'customerName', val)} />
                      <InputField label="Bill No." id={`bill-${index}`} placeholder="e.g. SPI 82/83-07996" icon={Hash} value={claim.billNo} onChange={(val) => handleClaimChange(index, 'billNo', val)} />
                      <InputField label={isParts ? 'Parts Number' : 'Battery Number'} id={`item-${index}`} placeholder="e.g. P12345" icon={Hash} value={claim.itemNo} onChange={(val) => handleClaimChange(index, 'itemNo', val)} />
                      <InputField label="Amount (NPR)" id={`amt-${index}`} placeholder="e.g. 7071.60" type="number" icon={Banknote} value={claim.amount} onChange={(val) => handleClaimChange(index, 'amount', val)} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col h-full">
      <h2 className="text-xl md:text-2xl font-semibold font-bold text-gray-900 dark:text-white mb-6">Letter Details</h2>
      
      <div className="space-y-5 flex-grow">
        {/* Document Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Document Category
          </label>
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value as DocCategory)}
            className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#B83227]/50"
          >
            {DOC_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Recipient */}
        {docType !== 'Vehicle Purchase Cash Incentive Claim' && docType !== 'Free Service Coupon Claim' && docType !== 'Warranty Claim Letter' && docType !== 'Bank Salary Deposit Request' && docType !== 'Salesman Incentive Claim' && docType !== 'Transfer Claim Amount to Cash or BG Ledger' && docType !== '6 Free Service With Engine Oil Claim' && docType !== '2 Years Free Service With Engine Oil and Parts Claim' && docType !== 'Payment Request Letter for Syakar Hire Purchase' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Recipient Organization / Name
            </label>
            <textarea
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. Syakar Trading Company Pvt. Ltd."
              rows={2}
              className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#B83227]/50 resize-none"
            />
          </div>
        )}

        {/* Dynamic Fields based on docType */}
        <div className="pt-4 border-t border-gray-200 dark:border-zinc-800 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Dynamic Fields</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderDynamicFields()}
          </div>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-gray-200 dark:border-zinc-800">
        <button
          onClick={onSubmit}
          disabled={isSubmitting || (!recipient && docType !== 'Vehicle Purchase Cash Incentive Claim' && docType !== 'Free Service Coupon Claim' && docType !== 'Warranty Claim Letter' && docType !== 'Bank Salary Deposit Request' && docType !== 'Salesman Incentive Claim' && docType !== 'Transfer Claim Amount to Cash or BG Ledger' && docType !== '6 Free Service With Engine Oil Claim' && docType !== '2 Years Free Service With Engine Oil and Parts Claim' && docType !== 'Payment Request Letter for Syakar Hire Purchase')}
          className="w-full bg-[#B83227] hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            "Generate & Save Official Letter"
          )}
        </button>
      </div>
    </div>
  );
}
