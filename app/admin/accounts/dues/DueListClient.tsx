"use client";

import { useState } from "react";
import { format } from "date-fns";
import { 
  Search, Wallet, X, AlertCircle, TrendingUp, Users, Plus, 
  Clock, CheckCircle2, Building2, CreditCard, Banknote, Receipt
} from "lucide-react";
import { addPayment } from "./actions";

const formatNPR = (amount: number) => new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(amount);

type BankTransfer = { bankName: string; transactionId: string; amount: number };

export default function DueListClient({ initialDues }: { initialDues: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTx, setSelectedTx] = useState<any | null>(null);
  const [successReceiptId, setSuccessReceiptId] = useState<string | null>(null);
  
  // Payment form state
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [remarks, setRemarks] = useState("");

  // Bank Transfer sub-fields
  const [bankTransfers, setBankTransfers] = useState<BankTransfer[]>([{ bankName: "", transactionId: "", amount: 0 }]);

  // Cash + Bank Transfer sub-fields
  const [pmCashAmount, setPmCashAmount] = useState<number>(0);

  // Cheque sub-fields
  const [pmChequeBankName, setPmChequeBankName] = useState("");
  const [pmChequeNumber, setPmChequeNumber] = useState("");
  const [pmChequeDate, setPmChequeDate] = useState("");
  const [pmChequeAmount, setPmChequeAmount] = useState<number>(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const filteredDues = initialDues.filter(tx => 
    tx.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.customer.phone.includes(searchTerm) ||
    tx.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalOutstanding = initialDues.reduce((sum, tx) => sum + tx.dueAmount, 0);
  const totalCustomers = initialDues.length;
  const highestDue = initialDues.length > 0 ? Math.max(...initialDues.map(tx => tx.dueAmount)) : 0;

  const handleOpenPayment = (tx: any) => {
    setSelectedTx(tx);
    setPaymentAmount(tx.dueAmount);
    setPaymentMethod("Cash");
    setRemarks("");
    setBankTransfers([{ bankName: "", transactionId: "", amount: 0 }]);
    setPmCashAmount(0);
    setPmChequeBankName(""); setPmChequeNumber(""); setPmChequeDate(""); setPmChequeAmount(0);
    setError("");
    setSuccessReceiptId(null);
  };

  const buildRemarksString = (): string => {
    if (paymentMethod === "Bank Transfer") {
      return bankTransfers.map(bt => `Bank: ${bt.bankName}, Ref: ${bt.transactionId}, Amt: ${bt.amount}`).join(" | ");
    }
    if (paymentMethod === "Cash + Bank Transfer") {
      const bankPart = bankTransfers.map(bt => `Bank: ${bt.bankName}, Ref: ${bt.transactionId}, Amt: ${bt.amount}`).join(" | ");
      return `Cash: ${pmCashAmount} | ${bankPart}`;
    }
    if (paymentMethod === "Cheque") {
      return `Bank: ${pmChequeBankName}, Cheque No: ${pmChequeNumber}, Date: ${pmChequeDate}, Amt: ${pmChequeAmount}`;
    }
    return remarks;
  };

  const getEffectiveAmount = (): number => {
    if (paymentMethod === "Bank Transfer") {
      return bankTransfers.reduce((s, bt) => s + (bt.amount || 0), 0);
    }
    if (paymentMethod === "Cash + Bank Transfer") {
      return (pmCashAmount || 0) + bankTransfers.reduce((s, bt) => s + (bt.amount || 0), 0);
    }
    if (paymentMethod === "Cheque") {
      return pmChequeAmount || 0;
    }
    return paymentAmount;
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTx) return;
    
    const effectiveAmount = getEffectiveAmount();
    
    if (effectiveAmount <= 0) {
      setError("Payment amount must be greater than 0.");
      return;
    }
    if (effectiveAmount > selectedTx.dueAmount) {
      setError(`Payment amount (Rs. ${effectiveAmount.toLocaleString()}) cannot exceed the due amount (Rs. ${selectedTx.dueAmount.toLocaleString()}).`);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const remarksStr = buildRemarksString();
      const res = await addPayment(selectedTx.id, effectiveAmount, paymentMethod, remarksStr);
      if (res.success && res.receiptId) {
        setSuccessReceiptId(res.receiptId);
        // Open receipt in a new tab and reload page to refresh dues
        window.open(`/print/receipt-payment/${res.receiptId}`, '_blank');
        // Close modal and reload after a brief moment
        setTimeout(() => {
          setSelectedTx(null);
          window.location.reload();
        }, 800);
      } else {
        setError(res.message || "Failed to process payment.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to process payment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all";

  const paymentMethodOptions = [
    { value: "Cash", label: "Cash", icon: Banknote },
    { value: "Bank Transfer", label: "Bank Transfer", icon: Building2 },
    { value: "Cash + Bank Transfer", label: "Cash + Bank Transfer", icon: Receipt },
    { value: "Cheque", label: "Cheque", icon: CreditCard },
  ];

  return (
    <div>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-gray-100 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none rounded-3xl p-6 relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-2xl text-amber-500 transition-colors shadow-sm">
                 <Wallet className="w-6 h-6" />
              </div>
           </div>
           <div>
             <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2 group-hover:text-primary transition-colors">{formatNPR(totalOutstanding)}</h3>
             <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Total Outstanding Dues</p>
           </div>
        </div>

        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-gray-100 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none rounded-3xl p-6 relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-blue-500 transition-colors shadow-sm">
                 <Users className="w-6 h-6" />
              </div>
           </div>
           <div>
             <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2 group-hover:text-primary transition-colors">{totalCustomers}</h3>
             <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Customers With Dues</p>
           </div>
        </div>

        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-gray-100 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none rounded-3xl p-6 relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-rose-50 dark:bg-rose-500/10 rounded-2xl text-rose-500 transition-colors shadow-sm">
                 <TrendingUp className="w-6 h-6" />
              </div>
           </div>
           <div>
             <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2 group-hover:text-primary transition-colors">{formatNPR(highestDue)}</h3>
             <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Highest Single Due</p>
           </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text"
          placeholder="Search by customer name, phone, or invoice no..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800/80 rounded-2xl pl-12 pr-4 py-4 text-gray-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-all"
        />
      </div>

      {/* Due List Table */}
      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-slate-800/80 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-800/80">
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500">Date</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500">Customer</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500">Vehicle</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500">Payment Progress</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">Due Amount</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500 text-right sticky right-0 bg-gray-50/50 dark:bg-slate-900/50 border-l border-gray-100 dark:border-slate-800/80 z-10">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/50">
              {filteredDues.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    No pending dues found.
                  </td>
                </tr>
              ) : (
                filteredDues.map((tx) => {
                  const paidPct = tx.finalAmount > 0 ? Math.round((tx.totalAmountPaid / tx.finalAmount) * 100) : 0;
                  return (
                    <tr key={tx.id} className="group hover:bg-gray-50/80 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="py-4 px-6 text-sm font-bold text-gray-600 dark:text-gray-300">
                        {format(new Date(tx.createdAt), 'MMM dd, yyyy')}
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-black text-gray-900 dark:text-white tracking-tight">{tx.customer.fullName}</p>
                        <p className="text-xs font-bold text-gray-500">{tx.customer.phone}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-bold text-gray-900 dark:text-white tracking-tight">{tx.vehicle.variant.vehicleMaster.name}</p>
                        <p className="text-xs font-bold text-gray-500">{tx.vehicle.engineNo}</p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-100 dark:bg-slate-800 rounded-full h-2 min-w-[80px]">
                            <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${paidPct}%` }} />
                          </div>
                          <span className="text-xs font-bold text-gray-500 whitespace-nowrap">{paidPct}%</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{formatNPR(tx.totalAmountPaid)} of {formatNPR(tx.finalAmount)}</p>
                      </td>
                      <td className="py-4 px-6 text-sm font-black text-amber-600 dark:text-amber-500 tracking-tight">
                        {formatNPR(tx.dueAmount)}
                      </td>
                      <td className="py-4 px-6 text-right sticky right-0 bg-white dark:bg-slate-900/50 border-l border-gray-100 dark:border-slate-800/80 z-10 transition-colors group-hover:bg-gray-50/80 dark:group-hover:bg-zinc-800/30">
                        <button 
                          onClick={() => handleOpenPayment(tx)}
                          className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors inline-flex items-center gap-2 shadow-md hover:-translate-y-0.5"
                        >
                          <Wallet className="w-4 h-4" /> Add Payment
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

      {/* Add Payment Modal */}
      {selectedTx && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-slate-800 animate-in zoom-in-95 duration-200 my-4">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-900/80">
              <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                <Wallet className="w-6 h-6 text-primary" /> Record Payment
              </h2>
              <button 
                onClick={() => setSelectedTx(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors bg-white dark:bg-slate-800 p-2 rounded-full shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">

              {/* Transaction Summary */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-4 rounded-2xl border border-amber-200/50 dark:border-amber-500/20">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="text-xs font-bold text-amber-600/70 dark:text-amber-400 uppercase tracking-widest">Customer</p>
                    <p className="text-lg font-black text-gray-900 dark:text-white mt-0.5">{selectedTx.customer.fullName}</p>
                    <p className="text-xs text-gray-500 mt-1">{selectedTx.vehicle.variant.vehicleMaster.name} • {selectedTx.vehicle.engineNo}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-amber-600/70 dark:text-amber-400 uppercase tracking-widest">Due Amount</p>
                    <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-0.5">{formatNPR(selectedTx.dueAmount)}</p>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Paid: {formatNPR(selectedTx.totalAmountPaid)}</span>
                    <span>Total: {formatNPR(selectedTx.finalAmount)}</span>
                  </div>
                  <div className="bg-amber-200/50 dark:bg-amber-900/30 rounded-full h-2">
                    <div 
                      className="bg-amber-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.round((selectedTx.totalAmountPaid / selectedTx.finalAmount) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Previous Payment History */}
              {selectedTx.receipts && selectedTx.receipts.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Payment History
                  </p>
                  <div className="space-y-2">
                    {selectedTx.receipts.map((r: any, idx: number) => (
                      <div key={r.id} className="flex justify-between items-center bg-gray-50 dark:bg-slate-800/50 rounded-xl px-4 py-2.5">
                        <div>
                          <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                            #{idx + 1} — {r.paymentMethod}
                            {idx === 0 && <span className="ml-2 text-primary text-[10px] bg-primary/10 px-1.5 py-0.5 rounded-full">Initial</span>}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{format(new Date(r.createdAt), 'MMM dd, yyyy')} {r.remarks ? `• ${r.remarks}` : ''}</p>
                        </div>
                        <p className="font-black text-gray-800 dark:text-gray-200">{formatNPR(r.amount)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm flex items-start gap-3 font-medium">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmitPayment} className="space-y-6">

                {/* Payment Method Selection */}
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Payment Method</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {paymentMethodOptions.map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setPaymentMethod(value)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 font-bold text-xs uppercase tracking-wider transition-all ${
                          paymentMethod === value
                            ? 'border-primary bg-primary/5 dark:bg-primary/10 text-primary'
                            : 'border-gray-200 dark:border-slate-700 text-gray-500 hover:border-gray-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cash Payment */}
                {paymentMethod === "Cash" && (
                  <div className="space-y-4 bg-emerald-50/50 dark:bg-emerald-900/10 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-emerald-600" /> Cash Payment
                    </h3>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Amount (NPR)</label>
                      <input
                        type="number"
                        required
                        max={selectedTx.dueAmount}
                        value={paymentAmount || ""}
                        onChange={(e) => setPaymentAmount(Number(e.target.value))}
                        className={`${inputClasses} text-xl font-black text-emerald-600 dark:text-emerald-400 h-14`}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Remarks (Optional)</label>
                      <input type="text" value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Any notes..." className={inputClasses} />
                    </div>
                  </div>
                )}

                {/* Bank Transfer */}
                {paymentMethod === "Bank Transfer" && (
                  <div className="space-y-4 bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-600" /> Bank Transfer Details
                    </h3>
                    {bankTransfers.map((bt, idx) => (
                      <div key={idx} className="relative bg-white dark:bg-black/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-900/30 space-y-3">
                        {bankTransfers.length > 1 && (
                          <button type="button" onClick={() => setBankTransfers(bankTransfers.filter((_, i) => i !== idx))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg">
                            <X className="w-3 h-3" />
                          </button>
                        )}
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Bank / Wallet Name</label>
                          <input type="text" value={bt.bankName} onChange={e => { const a = [...bankTransfers]; a[idx].bankName = e.target.value; setBankTransfers(a); }} placeholder="e.g. Nabil Bank, eSewa, Khalti" className={inputClasses} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Transaction ID</label>
                            <input type="text" value={bt.transactionId} onChange={e => { const a = [...bankTransfers]; a[idx].transactionId = e.target.value; setBankTransfers(a); }} placeholder="Ref. No." className={inputClasses} />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Amount (NPR)</label>
                            <input type="number" value={bt.amount || ""} onChange={e => { const a = [...bankTransfers]; a[idx].amount = Number(e.target.value); setBankTransfers(a); }} placeholder="0" className={inputClasses} />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={() => setBankTransfers([...bankTransfers, { bankName: "", transactionId: "", amount: 0 }])} className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Add Another Transfer
                    </button>
                  </div>
                )}

                {/* Cash + Bank Transfer */}
                {paymentMethod === "Cash + Bank Transfer" && (
                  <div className="space-y-4 bg-purple-50/50 dark:bg-purple-900/10 p-4 rounded-2xl border border-purple-100 dark:border-purple-900/30">
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-purple-600" /> Cash + Bank Transfer
                    </h3>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Cash Portion (NPR)</label>
                      <input type="number" value={pmCashAmount || ""} onChange={e => setPmCashAmount(Number(e.target.value))} placeholder="0" className={inputClasses} />
                    </div>
                    <div className="border-t border-purple-200/50 dark:border-purple-900/30 pt-4 space-y-3">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bank Transfer Portion</p>
                      {bankTransfers.map((bt, idx) => (
                        <div key={idx} className="relative bg-white dark:bg-black/20 rounded-xl p-4 border border-purple-200/50 dark:border-purple-900/30 space-y-3">
                          {bankTransfers.length > 1 && (
                            <button type="button" onClick={() => setBankTransfers(bankTransfers.filter((_, i) => i !== idx))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg">
                              <X className="w-3 h-3" />
                            </button>
                          )}
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Bank / Wallet</label>
                            <input type="text" value={bt.bankName} onChange={e => { const a = [...bankTransfers]; a[idx].bankName = e.target.value; setBankTransfers(a); }} placeholder="e.g. Nabil Bank" className={inputClasses} />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Transaction ID</label>
                              <input type="text" value={bt.transactionId} onChange={e => { const a = [...bankTransfers]; a[idx].transactionId = e.target.value; setBankTransfers(a); }} placeholder="Ref. No." className={inputClasses} />
                            </div>
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Amount (NPR)</label>
                              <input type="number" value={bt.amount || ""} onChange={e => { const a = [...bankTransfers]; a[idx].amount = Number(e.target.value); setBankTransfers(a); }} placeholder="0" className={inputClasses} />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={() => setBankTransfers([...bankTransfers, { bankName: "", transactionId: "", amount: 0 }])} className="text-sm font-bold text-purple-600 hover:text-purple-700 flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add Transfer
                      </button>
                    </div>
                    <div className="bg-purple-100/50 dark:bg-purple-900/20 rounded-xl px-4 py-3 text-sm font-bold text-purple-700 dark:text-purple-300">
                      Total: {formatNPR((pmCashAmount || 0) + bankTransfers.reduce((s, bt) => s + (bt.amount || 0), 0))}
                    </div>
                  </div>
                )}

                {/* Cheque */}
                {paymentMethod === "Cheque" && (
                  <div className="space-y-4 bg-orange-50/50 dark:bg-orange-900/10 p-4 rounded-2xl border border-orange-100 dark:border-orange-900/30">
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-orange-600" /> Cheque Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Bank Name</label>
                        <input type="text" value={pmChequeBankName} onChange={e => setPmChequeBankName(e.target.value)} placeholder="e.g. Nabil Bank" className={inputClasses} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Cheque Number</label>
                        <input type="text" value={pmChequeNumber} onChange={e => setPmChequeNumber(e.target.value)} placeholder="e.g. 12345678" className={inputClasses} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Cheque Date</label>
                        <input type="date" value={pmChequeDate} onChange={e => setPmChequeDate(e.target.value)} className={inputClasses} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Cheque Amount (NPR)</label>
                        <input type="number" value={pmChequeAmount || ""} onChange={e => setPmChequeAmount(Number(e.target.value))} placeholder="0" className={inputClasses} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Buttons */}
                <div className="pt-2 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setSelectedTx(null)}
                    className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-900 dark:text-white rounded-2xl font-bold uppercase tracking-widest transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-4 bg-primary hover:bg-red-700 text-white rounded-2xl font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Confirm & Print Receipt
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
