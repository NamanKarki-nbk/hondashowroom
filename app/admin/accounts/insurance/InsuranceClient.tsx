"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Shield, ShieldCheck, Send, Plus, X, AlertCircle, CheckCircle2,
  CreditCard, Wallet, FileText, Building2, Eye, Loader2, Edit2, Check, Percent, Settings2
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
  insuranceExpiry?: string | null;
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

type InsurancePriceList = {
  id: string;
  modelName: string;
  insuranceType: string;
  maxPrice: number;
};

interface Props {
  insuredVehicles: InsuredVehicle[];
  insurancePayments: InsurancePayment[];
  priceList: InsurancePriceList[];
  totalCustomerPaid: number;
  totalPmilCost: number;
  totalCommission: number;
  totalPaid: number;
}

export default function InsuranceClient({
  insuredVehicles,
  insurancePayments: initialPayments,
  priceList: initialPriceList,
  totalCustomerPaid,
  totalPmilCost,
  totalCommission,
  totalPaid: initialTotalPaid,
}: Props) {
  const [activeTab, setActiveTab] = useState<"vehicles" | "payments" | "rates">("vehicles");
  const [payments, setPayments] = useState(initialPayments);
  const [priceList, setPriceList] = useState(initialPriceList);
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

  // Edit Policy Modal
  const [editingVehicle, setEditingVehicle] = useState<InsuredVehicle | null>(null);
  const [editPolicyNo, setEditPolicyNo] = useState("");
  const [editExpiryDate, setEditExpiryDate] = useState("");
  const [isEditingPolicy, setIsEditingPolicy] = useState(false);
  const [editSuccess, setEditSuccess] = useState("");
  const [editError, setEditError] = useState("");

  // Rate Editing
  const [editingRateId, setEditingRateId] = useState<string | null>(null);
  const [editingRatePrice, setEditingRatePrice] = useState<number | "">(0);
  const [isSavingRate, setIsSavingRate] = useState(false);

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
        setEmailSuccess("Email sent successfully!");
      } else {
        setEmailError(data.error || "Failed to send email");
      }
    } catch {
      setEmailError("Network error. Please try again.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle) return;
    setIsEditingPolicy(true);
    setEditError("");
    setEditSuccess("");

    try {
      const res = await fetch("/api/admin/accounts/insurance/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingVehicle.id,
          policyNo: editPolicyNo,
          insuranceExpiry: editExpiryDate || null,
        }),
      });

      if (res.ok) {
        setEditSuccess("Policy details updated successfully!");
        setTimeout(() => {
          setEditingVehicle(null);
          window.location.reload();
        }, 1500);
      } else {
        const data = await res.json();
        setEditError(data.error || "Failed to update policy");
      }
    } catch {
      setEditError("Network error. Please try again.");
    } finally {
      setIsEditingPolicy(false);
    }
  };

  const handleSaveRate = async (id: string) => {
    if (editingRatePrice === "") return;
    setIsSavingRate(true);
    try {
      const res = await fetch("/api/admin/accounts/insurance/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, maxPrice: editingRatePrice }),
      });
      if (res.ok) {
        const data = await res.json();
        setPriceList((prev) =>
          prev.map((p) => (p.id === id ? { ...p, maxPrice: data.updated.maxPrice } : p))
        );
        setEditingRateId(null);
        window.location.reload(); // Refresh to recalculate KPIs
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingRate(false);
    }
  };

  const inputCls = "w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm";

  const remainingToPay = totalPmilCost - totalPaid;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-gray-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
          <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-blue-500 w-fit mb-4">
            <Shield className="w-6 h-6" />
          </div>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{insuredVehicles.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mt-1">Insured Vehicles</p>
        </div>
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-gray-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl text-indigo-500 w-fit mb-4">
            <Wallet className="w-6 h-6" />
          </div>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{formatNPR(totalCustomerPaid)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mt-1">Collected from Cust.</p>
        </div>
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-gray-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
          <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-2xl text-amber-500 w-fit mb-4">
            <CreditCard className="w-6 h-6" />
          </div>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{formatNPR(totalPaid)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mt-1">Total Paid to PMIL</p>
        </div>
        <div className={`bg-white dark:bg-slate-900/50 backdrop-blur-xl border rounded-3xl p-6 shadow-sm ${remainingToPay > 0 ? "border-red-200 dark:border-red-900/50" : "border-emerald-200 dark:border-emerald-900/50"}`}>
          <div className={`p-3 rounded-2xl w-fit mb-4 ${remainingToPay > 0 ? "bg-red-50 dark:bg-red-500/10 text-red-500" : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500"}`}>
            <AlertCircle className="w-6 h-6" />
          </div>
          <p className={`text-3xl font-black ${remainingToPay > 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}>{formatNPR(remainingToPay > 0 ? remainingToPay : 0)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mt-1">
            {remainingToPay > 0 ? "Pending to PMIL" : "Fully Settled"}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-slate-800">
        {[
          { key: "vehicles", label: "Insured Vehicles", icon: ShieldCheck },
          { key: "payments", label: "Payment History", icon: CreditCard },
          { key: "rates", label: "Insurance Rates", icon: Settings2 },
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
                    <th className="py-4 px-5 text-xs font-bold uppercase tracking-widest text-gray-500">Policy Details</th>
                    <th className="py-4 px-5 text-xs font-bold uppercase tracking-widest text-primary">Insurance</th>
                    <th className="py-4 px-5 text-xs font-bold uppercase tracking-widest text-gray-500 text-right sticky right-0 bg-gray-50/50 dark:bg-slate-900/50 z-10 border-l border-gray-100 dark:border-slate-800">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800/50">
                  {filteredVehicles.map((tx) => (
                    <tr key={tx.id} className="group hover:bg-gray-50/80 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-5 font-black text-gray-900 dark:text-white">{tx.vehicle.indexNo || "—"}</td>
                      <td className="py-4 px-5">
                        <p className="font-bold text-gray-900 dark:text-white">{tx.customer.fullName}</p>
                        <p className="text-xs text-gray-500">{tx.customer.phone}</p>
                      </td>
                      <td className="py-4 px-5">
                        <p className="font-bold text-gray-800 dark:text-gray-200">{tx.vehicle.variant.vehicleMaster.name}</p>
                        <p className="text-xs text-gray-500">{tx.vehicle.engineNo}</p>
                      </td>
                      <td className="py-4 px-5">
                        <p className={`text-sm ${tx.policyNo ? 'font-black text-gray-900 dark:text-white' : 'text-gray-400 italic'}`}>
                          {tx.policyNo || "Not set"}
                        </p>
                        {tx.insuranceExpiry && (
                          <p className="text-xs text-gray-500 font-medium">Exp: {format(new Date(tx.insuranceExpiry), "MMM d, yyyy")}</p>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <span className="font-black text-primary">{formatNPR(tx.insurance)}</span>
                      </td>
                      <td className="py-4 px-5 sticky right-0 bg-white group-hover:bg-gray-50/90 dark:bg-[#1a1a1a] dark:group-hover:bg-slate-800/90 border-l border-gray-100 dark:border-slate-800 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingVehicle(tx);
                              setEditPolicyNo(tx.policyNo || "");
                              setEditExpiryDate(tx.insuranceExpiry ? tx.insuranceExpiry.split('T')[0] : "");
                              setEditError("");
                              setEditSuccess("");
                            }}
                            className="bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setSendingVehicle(tx)}
                            className="bg-primary hover:bg-red-700 text-white px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm"
                          >
                            <Send className="w-3 h-3" /> Send to PMIL
                          </button>
                        </div>
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
            <p className="text-sm text-gray-500">Total Paid: <span className="font-black text-gray-900 dark:text-white">{formatNPR(totalPaid)}</span></p>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="inline-flex items-center gap-2 bg-primary hover:bg-red-700 text-white px-5 py-3 rounded-2xl font-bold uppercase tracking-wider text-sm transition-all shadow-lg"
            >
              <Plus className="w-4 h-4" /> Add Payment
            </button>
          </div>
          <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-gray-100 dark:border-slate-800/80 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-800">
                  <th className="py-4 px-5 text-xs font-bold uppercase tracking-widest text-gray-500">Date</th>
                  <th className="py-4 px-5 text-xs font-bold uppercase tracking-widest text-gray-500">Paid To</th>
                  <th className="py-4 px-5 text-xs font-bold uppercase tracking-widest text-gray-500">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800/50">
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="py-4 px-5 text-sm font-bold">{format(new Date(p.date), "MMM dd, yyyy")}</td>
                    <td className="py-4 px-5 font-bold text-sm">{p.paidTo}</td>
                    <td className="py-4 px-5 font-black text-emerald-600 dark:text-emerald-400">{formatNPR(p.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Rates Tab */}
      {activeTab === "rates" && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-gray-100 dark:border-slate-800/80 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-800">
                    <th className="py-4 px-5 text-xs font-bold uppercase tracking-widest text-gray-500">Model & Variant</th>
                    <th className="py-4 px-5 text-xs font-bold uppercase tracking-widest text-gray-500">Insurance Type</th>
                    <th className="py-4 px-5 text-xs font-bold uppercase tracking-widest text-emerald-600">Max Price (Rs.)</th>
                    <th className="py-4 px-5 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800/50">
                  {priceList.length === 0 ? (
                    <tr><td colSpan={4} className="py-12 text-center text-gray-400">No rates found. Please seed the database.</td></tr>
                  ) : priceList.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/80 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-5 font-bold text-gray-900 dark:text-white text-sm">{p.modelName}</td>
                      <td className="py-4 px-5">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          p.insuranceType === "FULL PARTY"
                            ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
                            : "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
                        }`}>
                          {p.insuranceType}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        {editingRateId === p.id ? (
                          <input
                            type="number"
                            min="0"
                            value={editingRatePrice}
                            onChange={(e) => setEditingRatePrice(e.target.value ? Number(e.target.value) : "")}
                            className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm w-32 focus:ring-2 focus:ring-primary focus:outline-none"
                            autoFocus
                          />
                        ) : (
                          <span className="font-black text-emerald-600 dark:text-emerald-400">{formatNPR(p.maxPrice)}</span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-right">
                        {editingRateId === p.id ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleSaveRate(p.id)}
                              disabled={isSavingRate || editingRatePrice === ""}
                              className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 p-2 rounded-lg transition-colors"
                              title="Save"
                            >
                              {isSavingRate ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => setEditingRateId(null)}
                              className="bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 p-2 rounded-lg transition-colors"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingRateId(p.id);
                              setEditingRatePrice(p.maxPrice);
                            }}
                            className="bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 p-2 rounded-lg transition-colors inline-flex items-center"
                            title="Edit Rate"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-slate-800">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">Record Payment</h2>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddPayment} className="p-6 space-y-5">
              {paymentError && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm">{paymentError}</div>}
              <input type="date" required value={payDate} onChange={e => setPayDate(e.target.value)} className={inputCls} />
              <input type="number" required value={payAmount || ""} onChange={e => setPayAmount(Number(e.target.value))} className={inputCls} placeholder="Amount" />
              <button type="submit" disabled={isSubmittingPayment} className="w-full py-3 bg-primary text-white rounded-xl font-bold uppercase tracking-widest">Save</button>
            </form>
          </div>
        </div>
      )}

      {/* Send Email Modal */}
      {sendingVehicle && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-slate-800">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-black flex items-center gap-2"><Send className="w-5 h-5 text-primary" /> Send Details to PMIL</h2>
              <button onClick={() => setSendingVehicle(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-5">
              {emailSuccess && <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl text-sm font-bold flex items-center gap-3"><CheckCircle2 className="w-5 h-5" /> {emailSuccess}</div>}
              {emailError && <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm"><AlertCircle className="w-5 h-5" /> {emailError}</div>}
              <div className="flex gap-3">
                <button type="button" onClick={() => setSendingVehicle(null)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-2xl font-bold text-sm">Close</button>
                <button onClick={handleSendEmail} disabled={isSendingEmail || !!emailSuccess} className="flex-1 py-3 bg-primary text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2">
                  {isSendingEmail ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : (emailSuccess ? <CheckCircle2 className="w-4 h-4" /> : <><Send className="w-4 h-4" /> Send Email</>)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Policy Modal */}
      {editingVehicle && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-slate-800">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-black flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary" /> Edit Policy</h2>
              <button onClick={() => setEditingVehicle(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <form onSubmit={handleEditSubmit} className="space-y-5">
                <input type="text" value={editPolicyNo} onChange={(e) => setEditPolicyNo(e.target.value)} className={inputCls} placeholder="Policy Number" />
                <input type="date" value={editExpiryDate} onChange={(e) => setEditExpiryDate(e.target.value)} className={inputCls} />
                {editSuccess && <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl text-sm font-bold"><CheckCircle2 className="w-5 h-5" /> {editSuccess}</div>}
                {editError && <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm"><AlertCircle className="w-5 h-5" /> {editError}</div>}
                <div className="flex gap-3">
                  <button type="button" onClick={() => setEditingVehicle(null)} className="flex-1 py-3 bg-gray-100 rounded-2xl font-bold text-sm">Cancel</button>
                  <button type="submit" disabled={isEditingPolicy || !!editSuccess} className="flex-1 py-3 bg-primary text-white rounded-2xl font-bold text-sm">
                    {isEditingPolicy ? "Saving..." : "Save Details"}
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
