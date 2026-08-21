"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp, Package, DollarSign, Calendar as CalendarIcon, Users, ArrowUpRight, ArrowDownRight, ChevronRight, ArrowRight } from "lucide-react";

const KPI_DATA = [
  { label: "Total Revenue (MTD)", value: "Rs. 42,500,000", change: "+12.5%", trend: "up", icon: DollarSign },
  { label: "In-Stock Units", value: "148", change: "-5", trend: "down", icon: Package },
  { label: "Monthly Commissions", value: "Rs. 637,500", change: "+8.2%", trend: "up", icon: TrendingUp },
  { label: "New Customers", value: "32", change: "+15%", trend: "up", icon: Users },
];

const COLOR_MATRIX = [
  { model: "CBR 250RR", red: 4, black: 2, matte: 1 },
  { model: "Dio 125", red: 15, black: 10, matte: 8 },
  { model: "XR 190L", red: 5, black: 3, matte: 0 },
  { model: "CB Shine", red: 8, black: 12, matte: 5 },
];

const DELIVERIES = [
  { date: "Aug 05", customer: "Bikash Shrestha", model: "CBR 250RR", status: "Confirmed" },
  { date: "Aug 05", customer: "Sita Sharma", model: "Dio 125", status: "Pending" },
  { date: "Aug 06", customer: "Ramesh Gurung", model: "XR 190L", status: "Confirmed" },
  { date: "Aug 08", customer: "Nabin Thapa", model: "CB Shine", status: "Confirmed" },
];

export default function AdminDashboard() {
  return (
    <div className="bg-transparent text-gray-900 dark:text-gray-100 p-4 md:p-8 selection:bg-primary selection:text-primary-foreground h-full transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto space-y-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">Executive Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium tracking-wide">Real-time overview of Society Enterprises Pvt. Ltd.</p>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-gray-200 dark:border-slate-800 shadow-sm rounded-2xl px-5 py-3 flex items-center gap-3 shrink-0">
            <div className="bg-primary/10 p-2 rounded-xl">
               <CalendarIcon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">August 2026</span>
          </div>
        </header>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {KPI_DATA.map((kpi, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-gray-100 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.02)] rounded-3xl p-6 relative overflow-hidden group hover:border-primary/30 dark:hover:border-primary/30 hover:-translate-y-1 transition-all duration-300">
               <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl text-gray-500 dark:text-gray-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors shadow-sm">
                     <kpi.icon className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 uppercase tracking-wider ${kpi.trend === 'up' ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-400/10 border border-emerald-200 dark:border-emerald-400/20' : 'text-rose-700 bg-rose-100 dark:text-rose-400 dark:bg-rose-400/10 border border-rose-200 dark:border-rose-400/20'}`}>
                     {kpi.change} 
                     {kpi.trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5"/> : <ArrowDownRight className="w-3.5 h-3.5"/>}
                  </span>
               </div>
               <div>
                 <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2 group-hover:text-primary transition-colors">{kpi.value}</h3>
                 <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{kpi.label}</p>
               </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Color Variant Matrix */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-gray-100 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none rounded-3xl p-6 md:p-8">
            <div className="flex justify-between items-center mb-8">
               <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">Inventory Matrix</h2>
               <Link href="/admin/inventory" className="text-xs font-bold text-primary hover:text-primary-hover uppercase tracking-widest flex items-center gap-1 transition-colors">
                  View All <ChevronRight className="w-4 h-4" />
               </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-100 dark:border-slate-800/80 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    <th className="pb-4 pl-4">Model</th>
                    <th className="pb-4 text-center">
                       <div className="flex flex-col items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-red-600 shadow-sm border border-red-700/20"></div>
                          <span>Red</span>
                       </div>
                    </th>
                    <th className="pb-4 text-center">
                       <div className="flex flex-col items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-zinc-900 shadow-sm border border-zinc-700/50"></div>
                          <span>Black</span>
                       </div>
                    </th>
                    <th className="pb-4 text-center">
                       <div className="flex flex-col items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-zinc-500 shadow-sm border border-zinc-400/50"></div>
                          <span>Matte</span>
                       </div>
                    </th>
                    <th className="pb-4 pr-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/50">
                  {COLOR_MATRIX.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/80 dark:hover:bg-zinc-800/30 transition-colors group">
                      <td className="py-5 pl-4 text-gray-900 dark:text-white font-black tracking-tight">{row.model}</td>
                      <td className="py-5 text-center font-bold text-gray-600 dark:text-gray-300">{row.red}</td>
                      <td className="py-5 text-center font-bold text-gray-600 dark:text-gray-300">{row.black}</td>
                      <td className="py-5 text-center font-bold text-gray-600 dark:text-gray-300">{row.matte}</td>
                      <td className="py-5 pr-4 text-right">
                         <span className="inline-flex items-center justify-center bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white font-black px-3 py-1.5 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                            {row.red + row.black + row.matte}
                         </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sales Calendar Widget */}
          <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-gray-100 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none rounded-3xl p-6 md:p-8 flex flex-col">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-8">Deliveries</h2>
            
            <div className="space-y-4 flex-1">
               {DELIVERIES.map((delivery, idx) => (
                 <div key={idx} className="flex gap-4 items-center group">
                    <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-2xl w-16 h-16 shrink-0 group-hover:border-primary/50 group-hover:bg-red-50 dark:group-hover:bg-primary/10 transition-colors">
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{delivery.date.split(' ')[0]}</span>
                       <span className="text-xl font-black text-gray-900 dark:text-white">{delivery.date.split(' ')[1]}</span>
                    </div>
                    
                    <div className="flex-1">
                       <h4 className="text-sm font-black text-gray-900 dark:text-white tracking-tight">{delivery.customer}</h4>
                       <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5">{delivery.model}</p>
                    </div>

                    <div className={`w-2.5 h-2.5 rounded-full ${delivery.status === 'Confirmed' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} title={delivery.status} />
                 </div>
               ))}
            </div>
            
            <Link href="/admin/sales-calendar" className="block mt-8 pt-6 border-t border-gray-100 dark:border-slate-800">
              <button className="w-full flex items-center justify-center gap-2 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-900 dark:text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors group">
                 View Schedule <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
