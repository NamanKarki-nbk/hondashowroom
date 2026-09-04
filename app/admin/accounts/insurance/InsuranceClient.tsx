"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Shield, ShieldCheck, Send, Plus, X, AlertCircle, CheckCircle2,
  CreditCard, Wallet, FileText, Building2, Eye, Loader2,
} from "lucide-react";

const formatNPR = (amount: number) =>
  new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(amount);

type InsuredVehicle = {
  id: string;
  invoiceNo: string;
  insurance: number;
  insuranceCompany: string | null;
  insuranceType: string | null;
  policyNo: string | null;
  createdAt: string;
  customer: { fullName: string; phone: string; address?: string | null; email?: string | null };
  vehicle: {
    indexNo?: string | null;
    vin: string;
    engineNo: string;
    color: string;
    tempRegistrationNo?: string | null;
    mechiRegistrationNo?: string | null;
    variant: {
      variantName: string;
      vehicleMaster: { name: string };
      specDifferences?: any;
    };
  };
};

type InsurancePayment = {
  id: string;
  date: string;
  paidTo: string;
  amount: number;
  notes: string | null;
  receiptNo: string | null;
  createdAt: string;
};

interface Props {
  insuredVehicles: InsuredVehicle[];
  insurancePayments: InsurancePayment[];
  totalInsuranceValue: number;
  totalPaid: number;
}

export default function InsuranceClient({
  insuredVehicles,
  insurancePayments: initialPayments,
  totalInsuranceValue,
  totalPaid: initialTotalPaid,
}: Props) {
  const [activeTab, setActiveTab] = useState<"vehicles" | "payments">("vehicles");
  const [payments, setPayments] = useState(initialPayments);
  const [totalPaid, setTotalPaid] = useState(initialTotalPaid);
  const [searchTerm, setSearchTerm] = useState("");

  // Add Payment modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payDate, setPayDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [payPaidTo, setPayPaidTo] = useState("Protective Micro Insurance Limited (PMIL)");
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payNotes, setPayNotes] = useState("");
  const [payReceiptNo, setPayReceiptNo] = useState("");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  // Send Email modal
  const [sendingVehicle, setSendingVehicle] = useState<InsuredVehicle | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState("");
  const [emailError, setEmailError] = useState("");

  const filteredVehicles = insuredVehicles.filter(
    (tx) =>
      tx.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.vehicle.variant.vehicleMaster.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.vehicle.indexNo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.policyNo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmount <= 0) { setPaymentError("Amount must be greater than 0"); return; }
    setIsSubmittingPayment(true);
    setPaymentError("");
    try {
      const res = await fetch("/api/admin/accounts/insurance/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: payDate,
          paidTo: payPaidTo,
          amount: payAmount,
          notes: payNotes,
          receiptNo: payReceiptNo,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPayments([data.payment, ...payments]);
        setTotalPaid((prev) => prev + payAmount);
        setShowPaymentModal(false);
        setPayAmount(0); setPayNotes(""); setPayReceiptNo("");
        setPayPaidTo("Protective Micro Insurance Limited (PMIL)");
        setPayDate(format(new Date(), "yyyy-MM-dd"));
      } else {
        setPaymentError(data.error || "Failed to save payment");
      }
    } catch {
      setPaymentError("Network error. Please try again.");
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const handleSendEmail = async () => {
    if (!sendingVehicle) return;
    setIsSendingEmail(true);
    setEmailError("");
    setEmailSuccess("");
    try {
      const res = await fetch("/api/admin/accounts/insurance/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: sendingVehicle.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setEmailSuccess("Email sent successfully to societykarki07@gmail.com!");
      } else {
        setEmailError(data.error || "Failed to send email");
      }
    } catch {
      setEmailError("Network error. Please try again.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const inputCls = "w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm";

  const remainingToPay = totalInsuranceValue - totalPaid;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-gray-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm group hover:border-primary/30 transition-all">
          <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-blue-500 w-fit mb-4">
            <Shield className="w-6 h-6" />
          </div>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{insuredVehicles.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mt-1">Insured Vehicles</p>
        </div>
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-gray-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm group hover:border-primary/30 transition-all">
          <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-2xl text-amber-500 w-fit mb-4">
            <Wallet className="w-6 h-6" />
          </div>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{formatNPR(totalInsuranceValue)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mt-1">Total Insurance Value</p>
        </div>
        <div className={`bg-white dark:bg-slate-900/50 backdrop-blur-xl border rounded-3xl p-6 shadow-sm transition-all ${remainingToPay > 0 ? "border-red-200 dark:border-red-900/50" : "border-emerald-200 dark:border-emerald-900/50"}`}>
          <div className={`p-3 rounded-2xl w-fit mb-4 ${remainingToPay > 0 ? "bg-red-50 dark:bg-red-500/10 text-red-500" : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500"}`}>
            <CreditCard className="w-6 h-6" />
          </div>
          <p className={`text-3xl font-black ${remainingToPay > 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}>{formatNPR(remainingToPay > 0 ? remainingToPay : 0)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mt-1">
            {remainingToPay > 0 ? "Pending Payment to PMIL" : "Fully Paid to PMIL ✓"}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-slate-800">
        {[
          { key: "vehicles", label: "Insured Vehicles", icon: ShieldCheck },
          { key: "payments", label: "Payment History", icon: CreditCard },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center gap-2 px-5 py-3 font-bold text-sm uppercase tracking-wider border-b-2 transition-all -mb-px ${
              activeTab === key
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* Vehicles Tab */}
      {activeTab === "vehicles" && (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Search by customer, vehicle, index no, policy no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800/80 rounded-2xl px-5 py-4 text-gray-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-primary shadow-sm transition-all text-sm"
          />
          <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-gray-100 dark:border-slate-800/80 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[950px]">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-800">
                    <th className="py-4 px-5 text-xs font-bold uppercase tracking-widest text-gray-500">Index No.</th>
                    <th className="py-4 px-5 text-xs font-bold uppercase tracking-widest text-gray-500">Customer</th>
                    <th className="py-4 px-5 text-xs font-bold uppercase tracking-widest text-gray-500">Vehicle</th>
                    <th className="py-4 px-5 text-xs font-bold uppercase tracking-widest text-gray-500">Insurance Company</th>
                    <th className="py-4 px-5 text-xs font-bold uppercase tracking-widest text-gray-500">Type</th>
                    <th className="py-4 px-5 text-xs font-bold uppercase tracking-widest text-gray-500">Policy No.</th>
                    <th className="py-4 px-5 text-xs font-bold uppercase tracking-widest text-primary">Insurance Amt.</th>
                    <th className="py-4 px-5 text-xs font-bold uppercase tracking-widest text-gray-500 text-right sticky right-0 bg-gray-50/50 dark:bg-slate-900/50 z-10 border-l border-gray-100 dark:border-slate-800">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800/50">
                  {filteredVehicles.length === 0 ? (
                    <tr><td colSpan={8} className="py-12 text-center text-gray-400">No insured vehicles found.</td></tr>
                  ) : filteredVehicles.map((tx) => (
                    <tr key={tx.id} className="group hover:bg-gray-50/80 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-5">
                        <span className="font-black text-gray-900 dark:text-white">{tx.vehicle.indexNo || "—"}</span>
                      </td>
                      <td className="py-4 px-5">
                        <p className="font-bold text-gray-900 dark:text-white">{tx.customer.fullName}</p>
                        <p className="text-xs text-gray-500">{tx.customer.phone}</p>
                      </td>
                      <td className="py-4 px-5">
                        <p className="font-bold text-gray-800 dark:text-gray-200">{tx.vehicle.variant.vehicleMaster.name}</p>
                        <p className="text-xs text-gray-500">{tx.vehicle.engineNo}</p>
                      </td>
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full">
                          <Shield className="w-3 h-3" />
                          {tx.insuranceCompany || "PMIL"}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          tx.insuranceType === "Full Party"
                            ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
                            : "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
                        }`}>
                          {tx.insuranceType || "3rd Party"}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-sm text-gray-700 dark:text-gray-300 font-mono">
                        {tx.policyNo || <span className="text-gray-400 italic">Not set</span>}
                      </td>
                      <td className="py-4 px-5 font-black text-primary text-sm">{formatNPR(tx.insurance)}</td>
                      <td className="py-4 px-5 text-right sticky right-0 bg-white dark:bg-slate-900/50 border-l border-gray-100 dark:border-slate-800 z-10 group-hover:bg-gray-50/80 dark:group-hover:bg-slate-800/30 transition-colors">
                        <button
                          onClick={() => { setSendingVehicle(tx); setEmailSuccess(""); setEmailError(""); }}
                          className="inline-flex items-center gap-2 bg-primary hover:bg-red-700 text-white px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm hover:-translate-y-0.5"
                        >
                          <Send className="w-3.5 h-3.5" /> Send to PMIL
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === "payments" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Paid to PMIL: <span className="font-black text-gray-900 dark:text-white">{formatNPR(totalPaid)}</span></p>
            </div>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="inline-flex items-center gap-2 bg-primary hover:bg-red-700 text-white px-5 py-3 rounded-2xl font-bold uppercase tracking-wider text-sm transition-all shadow-lg hover:shadow-red-500/20 hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" /> Add Payment
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-gray-100 dark:border-slate-800/80 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-800">
                    <th className="py-4 px-5 text-xs font-bold uppercase tracking-widest text-gray-500">Payment Date</th>
                    <th className="py-4 px-5 text-xs font-bold uppercase tracking-widest text-gray-500">Paid To</th>
                    <th className="py-4 px-5 text-xs font-bold uppercase tracking-widest text-gray-500">Receipt No.</th>
                    <th className="py-4 px-5 text-xs font-bold uppercase tracking-widest text-gray-500">Notes</th>
                    <th className="py-4 px-5 text-xs font-bold uppercase tracking-widest text-emerald-600">Amount Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800/50">
                  {payments.length === 0 ? (
                    <tr><td colSpan={5} className="py-12 text-center text-gray-400">No payments recorded yet. Click "Add Payment" to start.</td></tr>
                  ) : payments.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/80 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-5 text-sm font-bold text-gray-700 dark:text-gray-300">{format(new Date(p.date), "MMM dd, yyyy")}</td>
                      <td className="py-4 px-5 font-bold text-gray-900 dark:text-white text-sm">{p.paidTo}</td>
                      <td className="py-4 px-5 text-sm text-gray-500 font-mono">{p.receiptNo || "—"}</td>
                      <td className="py-4 px-5 text-sm text-gray-500">{p.notes || "—"}</td>
                      <td className="py-4 px-5 font-black text-emerald-600 dark:text-emerald-400">{formatNPR(p.amount)}</td>
                    </tr>
                  ))}
                </tbody>
                {payments.length > 0 && (
                  <tfoot className="border-t-2 border-gray-200 dark:border-slate-700">
                    <tr>
                      <td colSpan={4} className="py-3 px-5 font-black text-gray-900 dark:text-white uppercase tracking-wider text-sm text-right">Total Paid:</td>
                      <td className="py-3 px-5 font-black text-emerald-600 dark:text-emerald-400 text-lg">{formatNPR(totalPaid)}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-900/80">
              <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" /> Record Insurance Payment
              </h2>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-white dark:bg-slate-800 p-2 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddPayment} className="p-6 space-y-5">
              {paymentError && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 p-4 rounded-2xl text-sm flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" /> {paymentError}
                </div>
              )}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Payment Date</label>
                <input type="date" required value={payDate} onChange={e => setPayDate(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Paid To</label>
                <input type="text" required value={payPaidTo} onChange={e => setPayPaidTo(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Amount (NPR)</label>
                <input type="number" required min={1} value={payAmount || ""} onChange={e => setPayAmount(Number(e.target.value))} placeholder="0" className={`${inputCls} text-xl font-black text-emerald-600 dark:text-emerald-400 h-14`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Receipt No. (Optional)</label>
                  <input type="text" value={payReceiptNo} onChange={e => setPayReceiptNo(e.target.value)} placeholder="PMIL receipt no." className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Notes (Optional)</label>
                  <input type="text" value={payNotes} onChange={e => setPayNotes(e.target.value)} placeholder="Any notes..." className={inputCls} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowPaymentModal(false)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-900 dark:text-white rounded-2xl font-bold uppercase tracking-widest transition-colors text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmittingPayment} className="flex-1 py-3 bg-primary hover:bg-red-700 text-white rounded-2xl font-bold uppercase tracking-widest transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                  {isSubmittingPayment ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : <><CheckCircle2 className="w-4 h-4" /> Save Payment</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send Email Modal */}
      {sendingVehicle && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-900/80">
              <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" /> Send Details to PMIL
              </h2>
              <button onClick={() => setSendingVehicle(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-white dark:bg-slate-800 p-2 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Vehicle Summary */}
              <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold">Customer:</span>
                  <span className="font-black text-gray-900 dark:text-white">{sendingVehicle.customer.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold">Index No.:</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{sendingVehicle.vehicle.indexNo || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold">Vehicle:</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{sendingVehicle.vehicle.variant.vehicleMaster.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold">Engine No.:</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{sendingVehicle.vehicle.engineNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold">Insurance Type:</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{sendingVehicle.insuranceType || "3rd Party"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold">Insurance Amt.:</span>
                  <span className="font-black text-primary">{formatNPR(sendingVehicle.insurance)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-slate-700 mt-2">
                  <span className="text-gray-500 font-bold">Sending To:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">societykarki07@gmail.com</span>
                </div>
              </div>

              {emailSuccess && (
                <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 p-4 rounded-2xl text-sm flex items-center gap-3 font-bold">
                  <CheckCircle2 className="w-5 h-5 shrink-0" /> {emailSuccess}
                </div>
              )}
              {emailError && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 p-4 rounded-2xl text-sm flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" /> {emailError}
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setSendingVehicle(null)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-900 dark:text-white rounded-2xl font-bold uppercase tracking-widest transition-colors text-sm">
                  {emailSuccess ? "Close" : "Cancel"}
                </button>
                {!emailSuccess && (
                  <button
                    onClick={handleSendEmail}
                    disabled={isSendingEmail}
                    className="flex-1 py-3 bg-primary hover:bg-red-700 text-white rounded-2xl font-bold uppercase tracking-widest transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                  >
                    {isSendingEmail ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> Send Email</>}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
