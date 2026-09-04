"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Search, Building, Receipt, FileText, Edit2, Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import NepaliDate from "nepali-date-converter";
import { calculateServiceCharge } from "@/lib/serviceCharges";

const formatNPR = (amount: number) => new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(amount);

export default function FinanceTrackerClient({ initialSales, initialBulkPayments = [], financePlans = [] }: { initialSales: any[], initialBulkPayments?: any[], financePlans?: any[] }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("FINANCED VEHICLE");

  const [editingClientIdTx, setEditingClientIdTx] = useState<string | null>(null);
  const [clientIdInput, setClientIdInput] = useState("");
  const [isSavingClientId, setIsSavingClientId] = useState(false);

  const handleSaveClientId = async (transactionId: string) => {
    try {
      setIsSavingClientId(true);
      const res = await fetch('/api/admin/accounts/finance-tracker/update-client-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, clientId: clientIdInput })
      });
      if (res.ok) {
        toast.success("Client ID saved!");
        setEditingClientIdTx(null);
        router.refresh();
      } else {
        toast.error("Failed to save Client ID");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsSavingClientId(false);
    }
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    clientId: '',
    indexNo: '',
    financeAmount: '',
    downpayment: '',
    installments: '',
    serviceCharge: '',
    registrationCharge: ''
  });
  const [isSavingDetails, setIsSavingDetails] = useState(false);

  const openEditModal = (tx: any) => {
    setEditingTx(tx);
    setEditForm({
      clientId: tx.clientId || '',
      indexNo: tx.vehicle?.indexNo || '',
      financeAmount: tx.financeAmount?.toString() || '',
      downpayment: tx.downpayment?.toString() || '',
      installments: tx.installments?.toString() || '',
      serviceCharge: tx.serviceCharge?.toString() || '',
      registrationCharge: tx.registrationCharge?.toString() || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTx) return;

    try {
      setIsSavingDetails(true);
      const res = await fetch('/api/admin/accounts/finance-tracker/update-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          transactionId: editingTx.id, 
          ...editForm
        })
      });
      if (res.ok) {
        toast.success("Finance details updated!");
        setIsEditModalOpen(false);
        setEditingTx(null);
        router.refresh();
      } else {
        toast.error("Failed to update details");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsSavingDetails(false);
    }
  };

  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    date: new Date().toISOString().split('T')[0],
    bankTransactionId: '',
    receivedBank: '',
    amount: '',
    sender: 'Syakar Hire Purchase Pvt. Ltd.'
  });

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsAddingPayment(true);
      const res = await fetch('/api/admin/accounts/finance-tracker/bulk-payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentForm)
      });
      if (res.ok) {
        toast.success("Payment added successfully!");
        setIsAddPaymentModalOpen(false);
        setPaymentForm({
          date: new Date().toISOString().split('T')[0],
          bankTransactionId: '',
          receivedBank: '',
          amount: '',
          sender: 'Syakar Hire Purchase Pvt. Ltd.'
        });
        router.refresh();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to add payment");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsAddingPayment(false);
    }
  };

  const TABS = [
    "FINANCED VEHICLE",
    "PAYMENT HISTORY",
    "SERVICE CHARGES & REGISTRATION",
    "PAYMENT REQUEST",
    "NAAMSARI REQUEST"
  ];

  const filteredSales = initialSales.filter(tx => 
    tx.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tx.financerName && tx.financerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    tx.vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalFinancedAmount = initialSales.reduce((sum, tx) => sum + (tx.financeAmount || 0), 0);
  const totalFinanceSales = initialSales.length;

  const totalPaidAmount = initialBulkPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-gray-100 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none rounded-3xl p-6 relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl text-indigo-500 transition-colors shadow-sm">
                 <Building className="w-6 h-6" />
              </div>
           </div>
           <div>
             <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2 group-hover:text-primary transition-colors">{formatNPR(totalFinancedAmount)}</h3>
             <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Total Financed Amount</p>
           </div>
        </div>

        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-gray-100 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none rounded-3xl p-6 relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-emerald-500 transition-colors shadow-sm">
                 <Receipt className="w-6 h-6" />
              </div>
           </div>
           <div>
             <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2 group-hover:text-primary transition-colors">{totalFinanceSales}</h3>
             <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Total Financed Vehicles</p>
           </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text"
          placeholder="Search by customer name, financer name, or VIN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800/80 rounded-2xl pl-12 pr-4 py-4 text-gray-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-all"
        />
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-200 dark:border-slate-800 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-6 py-4 text-sm font-bold transition-all border-b-2 ${
              activeTab === tab 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-slate-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "FINANCED VEHICLE" ? (
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-slate-800/80 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-800/80">
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500">Index No. & Client ID</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500">Customer</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500">Sales Date</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500">Model & VIN</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500">Financing Details</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/50">
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      No finance sales found.
                    </td>
                  </tr>
                ) : (
                  filteredSales.map((tx) => (
                    <tr key={tx.id} className="group hover:bg-gray-50/80 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between items-center gap-2">
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Index No:</span>
                            <span className="text-xs font-black text-gray-900 dark:text-white bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded">{tx.vehicle?.indexNo || 'N/A'}</span>
                          </div>

                          <div className="flex justify-between items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Client ID:</span>
                            {editingClientIdTx === tx.id ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="text"
                                  autoFocus
                                  value={clientIdInput}
                                  onChange={(e) => setClientIdInput(e.target.value)}
                                  className="w-20 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded px-1.5 py-0.5 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                />
                                <button
                                  onClick={() => handleSaveClientId(tx.id)}
                                  disabled={isSavingClientId}
                                  className="p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded transition-colors disabled:opacity-50"
                                >
                                  {isSavingClientId ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                  onClick={() => setEditingClientIdTx(null)}
                                  disabled={isSavingClientId}
                                  className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors disabled:opacity-50"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 group/edit">
                                <span className="text-xs font-black text-gray-900 dark:text-white bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 px-2 py-0.5 rounded">{tx.clientId || 'N/A'}</span>
                                <button 
                                  onClick={() => {
                                    setClientIdInput(tx.clientId || "");
                                    setEditingClientIdTx(tx.id);
                                  }}
                                  className="text-gray-400 hover:text-red-600 transition-colors p-1 opacity-0 group-hover/edit:opacity-100 group-hover:opacity-100"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-black text-gray-900 dark:text-white tracking-tight">{tx.customer.fullName}</p>
                        <p className="text-xs font-bold text-gray-500">{tx.customer.phone}</p>
                      </td>
                      <td className="py-4 px-6 text-sm font-bold text-gray-600 dark:text-gray-300">
                        <div className="flex flex-col gap-0.5">
                          <span>{format(new Date(tx.createdAt), 'MMM dd, yyyy')} <span className="text-[10px] font-normal text-gray-400">AD</span></span>
                          <span className="text-xs text-gray-500">{new NepaliDate(new Date(tx.createdAt)).format('YYYY-MM-DD')} <span className="text-[10px] font-normal">BS</span></span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          <span className="font-black text-gray-900 dark:text-white">{tx.vehicle.variant.vehicleMaster.name}</span>
                          <span className="text-xs text-gray-500 font-mono">{tx.vehicle.vin}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between items-center gap-4">
                            <span className="text-xs text-gray-500 uppercase tracking-wider">Loan Amount:</span>
                            <span className="font-black text-gray-900 dark:text-white">{formatNPR(tx.financeAmount || 0)}</span>
                          </div>
                          <div className="flex justify-between items-center gap-4 mt-1">
                            <span className="text-xs text-gray-500 uppercase tracking-wider">Downpayment:</span>
                            <span className="font-black text-gray-900 dark:text-white">{formatNPR(tx.downpayment || 0)}</span>
                          </div>

                          {tx.financePdfUrl && (
                            <div className="mt-2 flex justify-end">
                              <a href={tx.financePdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 px-2 py-1 rounded transition-colors">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                View Quotation
                              </a>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => openEditModal(tx)}
                          className="text-gray-500 hover:text-primary transition-colors p-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md shadow-sm hover:shadow"
                        >
                          <Edit2 className="w-4 h-4 inline-block mr-1" />
                          <span className="text-xs font-bold">Edit</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'PAYMENT HISTORY' ? (
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-gray-100 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none overflow-hidden animate-in fade-in duration-500">
          <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 dark:border-slate-800/80">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              Total Received: <span className="text-primary">{formatNPR(totalPaidAmount)}</span>
            </h2>
            <button
              onClick={() => setIsAddPaymentModalOpen(true)}
              className="bg-[#cc0000] hover:bg-[#b30000] text-white px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-red-500/30 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              ADD PAYMENT RECEIVED
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800/80">
                  <th className="py-4 px-8 text-xs font-bold uppercase tracking-widest text-gray-500 w-48">Date</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500">Transaction ID</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500">Bank</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500">Paid By</th>
                  <th className="py-4 px-8 text-xs font-bold uppercase tracking-widest text-gray-500 text-right w-64">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800/50">
                {initialBulkPayments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500 font-medium">No payments recorded yet.</td>
                  </tr>
                ) : (
                  initialBulkPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-8 font-bold text-gray-900 dark:text-gray-100">
                        {format(new Date(payment.date), 'MMM dd, yyyy')}
                      </td>
                      <td className="py-4 px-6 font-mono text-sm text-gray-600 dark:text-gray-400">
                        {payment.bankTransactionId}
                      </td>
                      <td className="py-4 px-6 font-medium text-gray-800 dark:text-gray-200">
                        {payment.receivedBank}
                      </td>
                      <td className="py-4 px-6 font-bold text-gray-800 dark:text-gray-200">
                        {payment.sender}
                      </td>
                      <td className="py-4 px-8 font-black text-right text-gray-900 dark:text-white">
                        {formatNPR(payment.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === "SERVICE CHARGES & REGISTRATION" ? (
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-slate-800/80 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800/80">
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-500">Client & Vehicle</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-500">Finance Details</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-500">Expected S.C.</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-500">Saved S.C.</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-500">Reg. Charge</th>
                  <th className="py-4 px-4 text-center text-[10px] font-bold uppercase tracking-widest text-gray-500 w-16">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800/50">
                {filteredSales.length === 0 ? (
                  <tr><td colSpan={6} className="py-12 text-center text-gray-500">No records found.</td></tr>
                ) : (
                  filteredSales.map((tx) => {
                    const dpPercent = tx.showroomPrice ? (tx.downpayment / tx.showroomPrice) * 100 : 0;
                    const matchingPlan = financePlans.find(plan => 
                      plan.variantId === tx.vehicle?.variantId &&
                      plan.tenureMonths === (tx.installments || 24) &&
                      Math.abs(plan.downPaymentPct - dpPercent) < 2 // allow small rounding diff
                    );
                    const expectedSC = matchingPlan?.serviceCharge || null;
                    return (
                      <tr key={tx.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                        <td className="py-4 px-6">
                          <p className="font-bold text-gray-900 dark:text-gray-100">{tx.customer.fullName}</p>
                          <p className="text-xs text-gray-500">{tx.vehicle?.variant?.vehicleMaster?.name || tx.vehicle?.variant?.variantName || 'Unknown'} - {tx.vehicle.vin}</p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-sm text-gray-900 dark:text-gray-100">DP: {formatNPR(tx.downpayment || 0)} ({dpPercent.toFixed(1)}%)</p>
                          <p className="text-xs text-gray-500">Tenure: {tx.installments || '?'} Months</p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{expectedSC ? formatNPR(expectedSC) : 'N/A'}</p>
                        </td>
                        <td className="py-4 px-6">
                          <p className={`text-sm font-bold ${tx.serviceCharge ? 'text-emerald-600' : 'text-gray-400'}`}>{tx.serviceCharge ? formatNPR(tx.serviceCharge) : 'Pending'}</p>
                        </td>
                        <td className="py-4 px-6">
                           <p className={`text-sm font-bold ${tx.registrationCharge ? 'text-emerald-600' : 'text-gray-400'}`}>{tx.registrationCharge ? formatNPR(tx.registrationCharge) : 'Pending'}</p>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => openEditModal(tx)}
                            className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
                            title="Edit Details"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-gray-100 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">{activeTab} - Coming Soon</p>
        </div>
      )}

      {/* Edit Details Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
              <h3 className="text-lg font-black text-gray-900 dark:text-white">Edit Finance Details</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveDetails} className="p-6 flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Index No.</label>
                  <input
                    type="text"
                    value={editForm.indexNo}
                    onChange={e => setEditForm({...editForm, indexNo: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="e.g. D1-P6"
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Client ID</label>
                  <input
                    type="text"
                    value={editForm.clientId}
                    onChange={e => setEditForm({...editForm, clientId: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="Enter ID"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Loan Amount (NPR)</label>
                  <input
                    type="number"
                    value={editForm.financeAmount}
                    onChange={e => setEditForm({...editForm, financeAmount: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Downpayment (NPR)</label>
                  <input
                    type="number"
                    value={editForm.downpayment}
                    onChange={e => setEditForm({...editForm, downpayment: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tenure (Months)</label>
                  <input
                    type="number"
                    value={editForm.installments}
                    onChange={e => setEditForm({...editForm, installments: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Service Charge</label>
                  <input
                    type="number"
                    value={editForm.serviceCharge}
                    onChange={e => setEditForm({...editForm, serviceCharge: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Reg. Charge</label>
                  <input
                    type="number"
                    value={editForm.registrationCharge}
                    onChange={e => setEditForm({...editForm, registrationCharge: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="mt-2 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingDetails}
                  className="px-6 py-2 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                  {isSavingDetails ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {isAddPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
              <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                Record Bulk Payment
              </h3>
              <button onClick={() => setIsAddPaymentModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddPayment} className="p-6 flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Date</label>
                  <input
                    type="date"
                    required
                    value={paymentForm.date}
                    onChange={e => setPaymentForm({...paymentForm, date: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Amount (NPR)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={paymentForm.amount}
                    onChange={e => setPaymentForm({...paymentForm, amount: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="e.g. 500000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Transaction ID</label>
                  <input
                    type="text"
                    required
                    value={paymentForm.bankTransactionId}
                    onChange={e => setPaymentForm({...paymentForm, bankTransactionId: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="Bank Reference ID"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Received Bank</label>
                  <input
                    type="text"
                    required
                    value={paymentForm.receivedBank}
                    onChange={e => setPaymentForm({...paymentForm, receivedBank: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="e.g. Nabil Bank"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Paid By (Sender)</label>
                <input
                  type="text"
                  required
                  value={paymentForm.sender}
                  onChange={e => setPaymentForm({...paymentForm, sender: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="Sender Name"
                />
              </div>

              <div className="mt-2 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddPaymentModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingPayment}
                  className="px-6 py-2 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                  {isAddingPayment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
