"use client";

import { useState } from "react";
import { format } from "date-fns";
import NepaliDate from "nepali-date-converter";
import { Search, RefreshCw, Car, CheckCircle2, Wallet, X, AlertCircle } from "lucide-react";
import { collectExchangerPayment } from "./actions";
import Link from "next/link";

const formatNPR = (amount: number) => new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(amount);

export default function ExchangeLogClient({ initialSales }: { initialSales: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTx, setSelectedTx] = useState<any | null>(null);
  const [successReceiptNo, setSuccessReceiptNo] = useState<string | null>(null);
  
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const filteredSales = initialSales.filter(tx => 
    tx.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tx.exchangeModel && tx.exchangeModel.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (tx.exchangeNumber && tx.exchangeNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalExchangeValue = initialSales.reduce((sum, tx) => sum + (tx.exchangeValue || 0), 0);
  const totalCollected = initialSales.reduce((sum, tx) => sum + (tx.exchangerPaid || 0), 0);
  const totalOutstanding = totalExchangeValue - totalCollected;

  const handleOpenPayment = (tx: any) => {
    setSelectedTx(tx);
    const outstanding = (tx.exchangeValue || 0) - (tx.exchangerPaid || 0);
    setPaymentAmount(outstanding);
    setPaymentMethod("Cash");
    setRemarks(tx.remarks || "");
    setError("");
    setSuccessReceiptNo(null);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTx) return;

    if (paymentAmount <= 0) {
      setError("Payment amount must be greater than 0.");
      return;
    }

    const outstanding = (selectedTx.exchangeValue || 0) - (selectedTx.exchangerPaid || 0);
    if (paymentAmount > outstanding) {
      setError(`Payment amount cannot exceed the outstanding due (${formatNPR(outstanding)}).`);
      return;
    }

    setIsSubmitting(true);
    setError("");

    const res = await collectExchangerPayment({
      transactionId: selectedTx.id,
      amount: paymentAmount,
      paymentMethod,
      remarks
    });

    if (res.success) {
      setSuccessReceiptNo(res.receiptNo || "PAID");
    } else {
      setError(res.error || "Failed to process payment");
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-gray-100 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-6 relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-2xl text-purple-500 transition-colors shadow-sm">
                 <Car className="w-6 h-6" />
              </div>
           </div>
           <div>
             <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">{formatNPR(totalExchangeValue)}</h3>
             <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Total Exchange Valuation</p>
           </div>
        </div>

        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-gray-100 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-6 relative overflow-hidden group hover:border-green-500/30 transition-all duration-300">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-green-50 dark:bg-green-500/10 rounded-2xl text-green-500 transition-colors shadow-sm">
                 <CheckCircle2 className="w-6 h-6" />
              </div>
           </div>
           <div>
             <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2 text-green-600 dark:text-green-400">{formatNPR(totalCollected)}</h3>
             <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Total Collected</p>
           </div>
        </div>

        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-gray-100 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-6 relative overflow-hidden group hover:border-rose-500/30 transition-all duration-300">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-rose-50 dark:bg-rose-500/10 rounded-2xl text-rose-500 transition-colors shadow-sm">
                 <Wallet className="w-6 h-6" />
              </div>
           </div>
           <div>
             <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2 text-rose-600 dark:text-rose-500">{formatNPR(totalOutstanding)}</h3>
             <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Total Outstanding Dues</p>
           </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text"
          placeholder="Search by customer name, old vehicle model, or reg no..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800/80 rounded-2xl pl-12 pr-4 py-4 text-gray-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-slate-800/80 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-800/80">
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500">Date</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500">Customer</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">Traded-in Vehicle (Old)</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-primary">Purchased Vehicle (New)</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500">Valuation</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-rose-500 text-right">Outstanding</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/50">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    No exchange sales found.
                  </td>
                </tr>
              ) : (
                filteredSales.map((tx) => {
                  const val = tx.exchangeValue || 0;
                  const paid = tx.exchangerPaid || 0;
                  const outstanding = val - paid;

                  return (
                    <tr key={tx.id} className="group hover:bg-gray-50/80 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="py-4 px-6 text-sm">
                        <p className="font-bold text-gray-900 dark:text-white">
                          {new NepaliDate(new Date(tx.createdAt)).format('YYYY-MM-DD')}
                        </p>
                        <p className="text-xs font-bold text-gray-500 mt-1">
                          {format(new Date(tx.createdAt), 'MMM dd, yyyy')}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-black text-gray-900 dark:text-white tracking-tight">{tx.customer.fullName}</p>
                        <p className="text-xs font-bold text-gray-500">{tx.customer.phone}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-black text-purple-600 dark:text-purple-400 tracking-tight">{tx.exchangeModel}</p>
                        {tx.exchangeNumber && <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Reg: {tx.exchangeNumber}</p>}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded font-bold">{tx.vehicle.variant.vehicleMaster.name}</span>
                          <span className="text-xs text-gray-400 font-mono">{tx.vehicle.vin}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-bold text-gray-900 dark:text-gray-300">
                        {formatNPR(val)}
                        {paid > 0 && (
                          <div className="text-xs text-green-600 font-semibold mt-1">
                            Paid: {formatNPR(paid)}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {outstanding > 0 ? (
                          <span className="text-rose-600 dark:text-rose-500 font-black tracking-tight">{formatNPR(outstanding)}</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded font-bold text-xs uppercase tracking-wider">
                            <CheckCircle2 className="w-3 h-3" /> Settled
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {outstanding > 0 ? (
                          <button
                            onClick={() => handleOpenPayment(tx)}
                            className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-xl text-xs transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0"
                          >
                            Collect
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 font-medium italic">Done</span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-slate-800 transform transition-all">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900/50">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Collect Exchanger Payment</h3>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Vehicle: {selectedTx.exchangeModel}</p>
              </div>
              <button 
                onClick={() => setSelectedTx(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors bg-white dark:bg-slate-800 shadow-sm p-2 rounded-full border border-gray-100 dark:border-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {successReceiptNo ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-50 dark:border-green-900/10">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Payment Collected!</h4>
                  <p className="text-gray-500 mb-6 font-medium">Receipt No: <span className="font-mono bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded text-gray-900 dark:text-gray-200">{successReceiptNo}</span></p>
                  <button 
                    onClick={() => {
                      setSelectedTx(null);
                      window.location.reload(); // Quick refresh to update state
                    }}
                    className="bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitPayment} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-2xl flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-rose-700 dark:text-rose-400 font-medium">{error}</p>
                    </div>
                  )}

                  <div className="bg-gray-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-gray-100 dark:border-slate-700/50 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Outstanding</p>
                      <p className="text-2xl font-black text-rose-600 dark:text-rose-500 mt-0.5">{formatNPR((selectedTx.exchangeValue || 0) - (selectedTx.exchangerPaid || 0))}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Customer</p>
                       <p className="font-bold text-gray-900 dark:text-gray-200 mt-0.5">{selectedTx.customer.fullName}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Payment Amount (NPR) <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-gray-500 font-bold">Rs.</span>
                      </div>
                      <input 
                        type="number"
                        required
                        min={1}
                        max={(selectedTx.exchangeValue || 0) - (selectedTx.exchangerPaid || 0)}
                        value={paymentAmount || ''}
                        onChange={(e) => setPaymentAmount(Number(e.target.value))}
                        className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-3 text-lg font-bold text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Payment Method <span className="text-rose-500">*</span></label>
                    <select 
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                    >
                      <option value="Cash">Cash</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cheque">Cheque</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Remarks / Ref No. (Optional)</label>
                    <input 
                      type="text"
                      placeholder="e.g. Bank Ref No, Cheque No, Exchanger Name"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button 
                      type="button"
                      onClick={() => setSelectedTx(null)}
                      className="px-6 py-3 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Collect Payment'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
