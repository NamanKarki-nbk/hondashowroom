"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format, addDays, subDays, addMonths, subMonths, addYears, subYears } from "date-fns";
import {
  ChevronLeft, ChevronRight, CalendarDays, TrendingUp, TrendingDown,
  Wallet, Plus, X, AlertCircle, CheckCircle2, Loader2, ArrowUpRight,
  ArrowDownRight, BookOpen, PackagePlus,
} from "lucide-react";
import NepaliDate from "nepali-date-converter";
import { addExpense, deleteExpense, addDayBookIncome, deleteDayBookIncome } from "./actions";

const formatNPR = (amount: number) =>
  new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(amount);

type Receipt = {
  id: string;
  receiptNo: string;
  amount: number;
  paymentMethod: string;
  remarks: string | null;
  createdAt: string;
  transaction: {
    invoiceNo: string;
    customer: { fullName: string };
    vehicle: { indexNo: string; variant: { vehicleMaster: { name: string } } };
    accessories: string | null;
  };
};

type Expense = {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  createdAt: string;
};

type GeneralIncome = {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  createdAt: string;
};

interface Props {
  selectedDate: string;
  defaultDate: string;
  mode: "day" | "month" | "year";
  receipts: Receipt[];
  generalIncomes: GeneralIncome[];
  expenses: Expense[];
  openingBalance: number;
  totalIncome: number;
  totalExpenses: number;
  closingBalance: number;
}

const EXPENSE_CATEGORIES = [
  "General", "Salary", "Utilities", "Rent", "Marketing", "Maintenance",
  "Transport", "Office Supplies", "Food & Beverage", "Tax", "Other",
];

export default function DayBookClient({
  selectedDate,
  defaultDate,
  mode,
  receipts,
  generalIncomes: initialGeneralIncomes,
  expenses: initialExpenses,
  openingBalance,
  totalIncome: initialTotalIncome,
  totalExpenses: initialTotalExpenses,
  closingBalance: initialClosingBalance,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [expenses, setExpenses] = useState(initialExpenses);
  const [generalIncomes, setGeneralIncomes] = useState(initialGeneralIncomes);
  const [totalExpenses, setTotalExpenses] = useState(initialTotalExpenses);
  const [totalIncome, setTotalIncome] = useState(initialTotalIncome);
  const [closingBalance, setClosingBalance] = useState(initialClosingBalance);

  // Add expense modal
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expDesc, setExpDesc] = useState("");
  const [expAmount, setExpAmount] = useState<number>(0);
  const [expCategory, setExpCategory] = useState("General");
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [expenseError, setExpenseError] = useState("");

  // Add income modal
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [incDesc, setIncDesc] = useState("");
  const [incAmount, setIncAmount] = useState<number>(0);
  const [incCategory, setIncCategory] = useState("General");
  const [isAddingIncome, setIsAddingIncome] = useState(false);
  const [incomeError, setIncomeError] = useState("");

  const navigateDate = (direction: "prev" | "next" | "today" | "mode", newMode?: "day" | "month" | "year") => {
    let newDate = selectedDate;
    let targetMode = newMode || mode;

    if (direction === "today") {
      newDate = defaultDate;
      targetMode = "day"; // usually go back to day view for today
    } else if (direction === "mode") {
      // Just change mode, keep current selected date as anchor
    } else {
      const current = new Date(selectedDate + "T12:00:00");
      if (mode === "year") {
        newDate = format(direction === "prev" ? subYears(current, 1) : addYears(current, 1), "yyyy-MM-dd");
      } else if (mode === "month") {
        newDate = format(direction === "prev" ? subMonths(current, 1) : addMonths(current, 1), "yyyy-MM-dd");
      } else {
        newDate = format(direction === "prev" ? subDays(current, 1) : addDays(current, 1), "yyyy-MM-dd");
      }
    }
    
    startTransition(() => router.push(`/admin/accounts/daybook?date=${newDate}&mode=${targetMode}`));
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (expAmount <= 0) { setExpenseError("Amount must be greater than 0"); return; }
    if (!expDesc.trim()) { setExpenseError("Description is required"); return; }
    setIsAddingExpense(true);
    setExpenseError("");
    try {
      const result = await addExpense(selectedDate, expDesc.trim(), expAmount, expCategory);
      if (result.success && result.expense) {
        const newExpense = result.expense as unknown as Expense;
        setExpenses((prev) => [...prev, newExpense]);
        setTotalExpenses((prev) => prev + expAmount);
        setClosingBalance((prev) => prev - expAmount);
        setShowAddExpense(false);
        setExpDesc(""); setExpAmount(0); setExpCategory("General");
      } else {
        setExpenseError(result.error || "Failed to add expense");
      }
    } catch {
      setExpenseError("Network error");
    } finally {
      setIsAddingExpense(false);
    }
  };

  const handleDeleteExpense = async (id: string, amount: number) => {
    if (!confirm("Delete this expense entry?")) return;
    const result = await deleteExpense(id);
    if (result.success) {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      setTotalExpenses((prev) => prev - amount);
      setClosingBalance((prev) => prev + amount);
    }
  };

  const handleAddIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (incAmount <= 0) { setIncomeError("Amount must be greater than 0"); return; }
    if (!incDesc.trim()) { setIncomeError("Description is required"); return; }
    setIsAddingIncome(true);
    setIncomeError("");
    try {
      const result = await addDayBookIncome(selectedDate, incDesc.trim(), incAmount, incCategory);
      if (result.success && result.income) {
        const newIncome = result.income as unknown as GeneralIncome;
        setGeneralIncomes((prev) => [...prev, newIncome]);
        setTotalIncome((prev) => prev + incAmount);
        setClosingBalance((prev) => prev + incAmount);
        setShowAddIncome(false);
        setIncDesc(""); setIncAmount(0); setIncCategory("General");
      } else {
        setIncomeError(result.error || "Failed to add income");
      }
    } catch {
      setIncomeError("Network error");
    } finally {
      setIsAddingIncome(false);
    }
  };

  const handleDeleteIncome = async (id: string, amount: number) => {
    if (!confirm("Delete this income entry?")) return;
    const result = await deleteDayBookIncome(id);
    if (result.success) {
      setGeneralIncomes((prev) => prev.filter((i) => i.id !== id));
      setTotalIncome((prev) => prev - amount);
      setClosingBalance((prev) => prev - amount);
    }
  };

  const mergedIncomes = [
    ...receipts.map(r => ({ ...r, type: 'receipt' as const, sortDate: new Date(r.createdAt).getTime() })),
    ...generalIncomes.map(i => ({ ...i, type: 'general' as const, sortDate: new Date(i.createdAt).getTime() }))
  ].sort((a, b) => a.sortDate - b.sortDate);

  const isToday = selectedDate === defaultDate;
  const isFuture = selectedDate > defaultDate;
  const inputCls = "w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm";

  return (
    <div className="space-y-6">
      {/* Date Navigator & View Modes */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800/80 rounded-2xl p-3 w-fit shadow-sm">
          <button onClick={() => navigateDate("prev")} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-600 dark:text-gray-400">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 px-2 min-w-[140px] justify-center">
            <CalendarDays className="w-5 h-5 text-primary" />
            <span className="font-black text-gray-900 dark:text-white text-lg whitespace-nowrap">
              {mode === "year" 
                ? format(new Date(selectedDate + "T12:00:00"), "yyyy")
                : mode === "month"
                ? format(new Date(selectedDate + "T12:00:00"), "MMMM yyyy")
                : format(new Date(selectedDate + "T12:00:00"), "MMMM dd, yyyy")}
            </span>
            {isToday && mode === "day" && (
              <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">Today</span>
            )}
            {isPending && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
          </div>
          <button
            onClick={() => navigateDate("next")}
            disabled={isFuture && mode === "day"}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-600 dark:text-gray-400 disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          {(!isToday || mode !== "day") && (
            <button onClick={() => navigateDate("today")} className="ml-1 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors">
              Today
            </button>
          )}
        </div>

        <div className="flex items-center bg-gray-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
          <button 
            onClick={() => navigateDate("mode", "day")}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${mode === "day" ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
          >
            Daily
          </button>
          <button 
            onClick={() => navigateDate("mode", "month")}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${mode === "month" ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => navigateDate("mode", "year")}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${mode === "year" ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Opening Balance", value: openingBalance, icon: Wallet, color: "blue", prefix: "Carried Forward" },
          { label: "Total Income", value: totalIncome, icon: TrendingUp, color: "emerald", prefix: `${receipts.length} receipt(s)` },
          { label: "Total Expenses", value: totalExpenses, icon: TrendingDown, color: "red", prefix: `${expenses.length} entry(s)` },
          { label: "Closing Balance", value: closingBalance, icon: BookOpen, color: closingBalance >= 0 ? "violet" : "red", prefix: "Carry Forward →" },
        ].map(({ label, value, icon: Icon, color, prefix }) => (
          <div key={label} className={`bg-white dark:bg-slate-900/50 border rounded-3xl p-5 shadow-sm transition-all ${
            color === "red" && value > 0 ? "border-red-200 dark:border-red-900/30" :
            color === "emerald" ? "border-emerald-100 dark:border-emerald-900/20" :
            "border-gray-100 dark:border-slate-800/80"
          }`}>
            <div className={`p-2.5 rounded-xl w-fit mb-3 ${
              color === "emerald" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600" :
              color === "red" ? "bg-red-50 dark:bg-red-500/10 text-red-500" :
              color === "violet" ? "bg-violet-50 dark:bg-violet-500/10 text-violet-600" :
              "bg-blue-50 dark:bg-blue-500/10 text-blue-600"
            }`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className={`text-2xl font-black tracking-tight ${
              color === "emerald" ? "text-emerald-700 dark:text-emerald-400" :
              color === "red" && value > 0 ? "text-red-600 dark:text-red-400" :
              color === "violet" ? "text-violet-700 dark:text-violet-400" :
              "text-gray-900 dark:text-white"
            }`}>
              {formatNPR(value)}
            </p>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">{label}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{prefix}</p>
          </div>
        ))}
      </div>

      {/* Income Table */}
      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-gray-100 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ArrowUpRight className="w-5 h-5 text-emerald-500" />
            <h2 className="font-black text-gray-900 dark:text-white uppercase tracking-tight">Income — Cash Receipts</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-black text-emerald-600 dark:text-emerald-400">{formatNPR(totalIncome)}</span>
            <button
              onClick={() => setShowAddIncome(true)}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Income
            </button>
          </div>
        </div>
        {mergedIncomes.length === 0 ? (
          <div className="py-10 text-center text-gray-400 text-sm">No receipts recorded for this day.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-800">
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-widest text-gray-500">Date</th>
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-widest text-gray-500">Receipt / Ref</th>
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-widest text-gray-500">Customer / Details</th>
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-widest text-gray-500">Vehicle / Category</th>
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-widest text-gray-500">Method</th>
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-widest text-emerald-600 text-right">Amount</th>
                  <th className="py-3 px-5 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800/50">
                {mergedIncomes.map((inc) => (
                  <tr key={inc.id} className="group hover:bg-gray-50/80 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-5 text-sm text-gray-600 dark:text-gray-400 font-medium">
                      <div>{format(new Date(inc.createdAt), "MMM d, yyyy")} (AD)</div>
                      <div className="text-xs text-gray-500 mt-0.5">{new NepaliDate(new Date(inc.createdAt)).format("YYYY-MM-DD")} (BS)</div>
                    </td>
                    <td className="py-3 px-5 font-mono text-xs text-gray-700 dark:text-gray-300">
                      {inc.type === 'receipt' ? inc.receiptNo : "MANUAL"}
                    </td>
                    <td className="py-3 px-5 font-bold text-gray-900 dark:text-white text-sm">
                      {inc.type === 'receipt' ? inc.transaction.customer.fullName : inc.description}
                    </td>
                    <td className="py-3 px-5 text-sm text-gray-600 dark:text-gray-400">
                      {inc.type === 'receipt' ? (
                        <>
                          <div>
                            {inc.transaction.vehicle.variant.vehicleMaster.name}
                            <span className="text-xs text-gray-500 font-mono ml-1">({inc.transaction.vehicle.indexNo})</span>
                          </div>
                          {inc.transaction.accessories && (
                            <div className="text-xs text-orange-600 dark:text-orange-400 mt-1 flex items-center gap-1 font-medium">
                              <PackagePlus className="w-3 h-3" /> 
                              {(() => {
                                try {
                                  const acc = JSON.parse(inc.transaction.accessories);
                                  return Array.isArray(acc) ? acc.join(", ") : acc.toString();
                                } catch {
                                  return inc.transaction.accessories;
                                }
                              })()}
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-xs font-bold bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full">{inc.category}</span>
                      )}
                    </td>
                    <td className="py-3 px-5">
                      <span className="text-xs font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">{inc.type === 'receipt' ? inc.paymentMethod : "Cash"}</span>
                    </td>
                    <td className="py-3 px-5 text-right font-black text-emerald-600 dark:text-emerald-400">{formatNPR(inc.amount)}</td>
                    <td className="py-3 px-2">
                      {inc.type === 'general' && (
                        <button
                          onClick={() => handleDeleteIncome(inc.id, inc.amount)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 p-1 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-emerald-200 dark:border-emerald-900/30">
                <tr>
                  <td colSpan={5} className="py-3 px-5 text-right font-black text-gray-900 dark:text-white uppercase tracking-wider text-sm">Total Income:</td>
                  <td className="py-3 px-5 text-right font-black text-emerald-600 dark:text-emerald-400 text-lg">{formatNPR(totalIncome)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Expenses Table */}
      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-gray-100 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ArrowDownRight className="w-5 h-5 text-red-500" />
            <h2 className="font-black text-gray-900 dark:text-white uppercase tracking-tight">Expenses</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-black text-red-600 dark:text-red-400">{formatNPR(totalExpenses)}</span>
            <button
              onClick={() => setShowAddExpense(true)}
              className="inline-flex items-center gap-2 bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Expense
            </button>
          </div>
        </div>
        {expenses.length === 0 ? (
          <div className="py-10 text-center text-gray-400 text-sm">No expenses recorded for this day.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-800">
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-widest text-gray-500">Date</th>
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-widest text-gray-500">Description</th>
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-widest text-gray-500">Category</th>
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-widest text-red-600 text-right">Amount</th>
                  <th className="py-3 px-5 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800/50">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="group hover:bg-gray-50/80 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-5 text-sm text-gray-600 dark:text-gray-400 font-medium">
                      <div>{format(new Date(exp.date), "MMM d, yyyy")} (AD)</div>
                      <div className="text-xs text-gray-500 mt-0.5">{new NepaliDate(new Date(exp.date)).format("YYYY-MM-DD")} (BS)</div>
                    </td>
                    <td className="py-3 px-5 font-bold text-gray-900 dark:text-white text-sm">{exp.description}</td>
                    <td className="py-3 px-5">
                      <span className="text-xs font-bold bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full">{exp.category}</span>
                    </td>
                    <td className="py-3 px-5 text-right font-black text-red-600 dark:text-red-400">{formatNPR(exp.amount)}</td>
                    <td className="py-3 px-2">
                      <button
                        onClick={() => handleDeleteExpense(exp.id, exp.amount)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 p-1 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-red-200 dark:border-red-900/30">
                <tr>
                  <td colSpan={3} className="py-3 px-5 text-right font-black text-gray-900 dark:text-white uppercase tracking-wider text-sm">Total Expenses:</td>
                  <td className="py-3 px-5 text-right font-black text-red-600 dark:text-red-400 text-lg">{formatNPR(totalExpenses)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Closing Balance Summary */}
      <div className={`rounded-3xl p-6 border-2 text-right ${closingBalance >= 0 ? "bg-violet-50 dark:bg-violet-900/10 border-violet-200 dark:border-violet-900/30" : "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30"}`}>
        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Closing Balance (Carried Forward to Next Day)</p>
        <p className={`text-4xl font-black ${closingBalance >= 0 ? "text-violet-700 dark:text-violet-400" : "text-red-600 dark:text-red-400"}`}>
          {formatNPR(closingBalance)}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          {formatNPR(openingBalance)} (Opening) + {formatNPR(totalIncome)} (Income) − {formatNPR(totalExpenses)} (Expenses) = {formatNPR(closingBalance)}
        </p>
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-900/80">
              <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-500" /> Add Expense
              </h2>
              <button onClick={() => setShowAddExpense(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-white dark:bg-slate-800 p-2 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddExpense} className="p-6 space-y-5">
              <p className="text-sm text-gray-500">
                Recording expense for: <span className="font-bold text-gray-900 dark:text-white">{format(new Date(selectedDate + "T12:00:00"), "MMMM dd, yyyy")}</span>
              </p>
              {expenseError && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {expenseError}
                </div>
              )}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Description</label>
                <input type="text" required value={expDesc} onChange={e => setExpDesc(e.target.value)} placeholder="What was this expense for?" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Category</label>
                <select value={expCategory} onChange={e => setExpCategory(e.target.value)} className={inputCls}>
                  {EXPENSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Amount (NPR)</label>
                <input type="number" required min={1} value={expAmount || ""} onChange={e => setExpAmount(Number(e.target.value))} placeholder="0" className={`${inputCls} text-xl font-black text-red-600 dark:text-red-400 h-14`} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddExpense(false)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-900 dark:text-white rounded-2xl font-bold text-sm uppercase tracking-widest transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isAddingExpense} className="flex-1 py-3 bg-primary hover:bg-red-700 text-white rounded-2xl font-bold text-sm uppercase tracking-widest transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
                  {isAddingExpense ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : <><CheckCircle2 className="w-4 h-4" /> Add Expense</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Income Modal */}
      {showAddIncome && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-900/80">
              <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" /> Add Income
              </h2>
              <button onClick={() => setShowAddIncome(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-white dark:bg-slate-800 p-2 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddIncome} className="p-6 space-y-5">
              <p className="text-sm text-gray-500">
                Recording income for: <span className="font-bold text-gray-900 dark:text-white">{format(new Date(selectedDate + "T12:00:00"), "MMMM dd, yyyy")}</span>
              </p>
              {incomeError && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {incomeError}
                </div>
              )}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Description / Details</label>
                <input type="text" required value={incDesc} onChange={e => setIncDesc(e.target.value)} placeholder="e.g. Accessories Sale" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Category</label>
                <select value={incCategory} onChange={e => setIncCategory(e.target.value)} className={inputCls}>
                  {EXPENSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  <option value="Accessories">Accessories</option>
                  <option value="Services">Services</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Amount (NPR)</label>
                <input type="number" required min={1} value={incAmount || ""} onChange={e => setIncAmount(Number(e.target.value))} placeholder="0" className={`${inputCls} text-xl font-black text-emerald-600 dark:text-emerald-400 h-14`} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddIncome(false)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-900 dark:text-white rounded-2xl font-bold text-sm uppercase tracking-widest transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isAddingIncome} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm uppercase tracking-widest transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
                  {isAddingIncome ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : <><CheckCircle2 className="w-4 h-4" /> Add Income</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
