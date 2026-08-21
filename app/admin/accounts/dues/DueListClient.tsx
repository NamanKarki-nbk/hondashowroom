"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Search, Wallet, X, AlertCircle } from "lucide-react";
import { addPayment } from "./actions";
import { useRouter } from "next/navigation";

const formatNPR = (amount: number) => new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(amount);

export default function DueListClient({ initialDues }: { initialDues: any[] }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTx, setSelectedTx] = useState<any | null>(null);
  
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const filteredDues = initialDues.filter(tx => 
    tx.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.customer.phone.includes(searchTerm) ||
    tx.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenPayment = (tx: any) => {
    setSelectedTx(tx);
    setPaymentAmount(tx.dueAmount); // Default to full remaining balance
    setPaymentMethod("Cash");
    setRemarks("");
    setError("");
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTx) return;
    
    if (paymentAmount <= 0 || paymentAmount > selectedTx.dueAmount) {
      setError("Invalid payment amount. Must be greater than 0 and less than or equal to due amount.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await addPayment(selectedTx.id, paymentAmount, paymentMethod, remarks);
      if (res.success) {
        setSelectedTx(null);
        router.push(`/admin/pos/receipt/${res.receiptId}`);
      }
    } catch (err: any) {
      setError(err.message || "Failed to process payment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all";

  return (
    <div>
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text"
          placeholder="Search by customer name, phone, or invoice no..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl pl-12 pr-4 py-4 text-foreground focus:outline-none focus:border-red-500 shadow-sm"
        />
      </div>

      {/* Due List Table */}
      <div className="bg-white dark:bg-[#111111] rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-800">
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">Date</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">Customer</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">Vehicle</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">Final Amount</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-primary">Due Amount</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {filteredDues.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    No pending dues found.
                  </td>
                </tr>
              ) : (
                filteredDues.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">
                      {format(new Date(tx.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-foreground">{tx.customer.name}</p>
                      <p className="text-xs text-gray-500">{tx.customer.phone}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-foreground">{tx.vehicle.model}</p>
                      <p className="text-xs text-gray-500">{tx.vehicle.chassisNo}</p>
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-300">
                      {formatNPR(tx.finalAmount)}
                    </td>
                    <td className="py-4 px-6 text-sm font-bold text-primary">
                      {formatNPR(tx.dueAmount)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => handleOpenPayment(tx)}
                        className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 shadow-md shadow-red-500/20"
                      >
                        <Wallet className="w-4 h-4" /> Add Payment
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Payment Modal */}
      {selectedTx && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#111111] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-900/50">
              <h2 className="text-xl md:text-2xl font-semibold font-black text-foreground uppercase tracking-tight flex items-center gap-2">
                <Wallet className="w-6 h-6 text-primary" /> Record Payment
              </h2>
              <button 
                onClick={() => setSelectedTx(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors bg-white dark:bg-slate-800 p-2 rounded-full shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitPayment} className="p-6 space-y-6">
              
              <div className="bg-red-50 dark:bg-red-500/10 p-4 rounded-xl border border-red-100 dark:border-red-500/20 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-red-600/70 dark:text-red-400 uppercase tracking-widest">Total Due Amount</p>
                  <p className="text-2xl md:text-3xl font-semibold font-black text-primary mt-1">{formatNPR(selectedTx.dueAmount)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Customer</p>
                  <p className="text-sm font-bold text-foreground mt-1">{selectedTx.customer.name}</p>
                </div>
              </div>

              {error && (
                <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-lg text-sm flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  Payment Amount (NPR)
                </label>
                <input 
                  type="number"
                  required
                  max={selectedTx.dueAmount}
                  value={paymentAmount || ""}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className={`${inputClasses} text-xl md:text-2xl font-semibold font-bold text-green-600 dark:text-green-500 h-14`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                    Payment Method
                  </label>
                  <select 
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className={inputClasses}
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Card">Card</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                    Remarks (Optional)
                  </label>
                  <input 
                    type="text"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="E.g. Paid via eSewa"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setSelectedTx(null)}
                  className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-foreground rounded-xl font-bold uppercase tracking-widest transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-primary hover:bg-red-700 text-white rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Processing..." : "Confirm Payment"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
