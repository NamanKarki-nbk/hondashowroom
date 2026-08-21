"use client";

import React from "react";
import { TrendingUp, Package, DollarSign, Calendar as CalendarIcon, Users, ArrowUpRight } from "lucide-react";

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
];

export default function AdminDashboard() {
  return (
    <div className="bg-background dark:bg-[#0B0B0C] text-gray-100 p-8 selection:bg-primary selection:text-primary-foreground h-full">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold font-extrabold text-primary-foreground tracking-tight">Executive Dashboard</h1>
            <p className="text-gray-400 mt-1">Real-time overview of Society Enterprises Pvt. Ltd.</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-3 backdrop-blur-md">
            <CalendarIcon className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary-foreground">August 2026</span>
          </div>
        </header>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {KPI_DATA.map((kpi, idx) => (
            <div key={idx} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group hover:border-slate-700 transition-colors">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-background/5 rounded-xl text-gray-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                     <kpi.icon className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded flex items-center gap-1 ${kpi.trend === 'up' ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>
                     {kpi.change} {kpi.trend === 'up' ? <ArrowUpRight className="w-3 h-3"/> : null}
                  </span>
               </div>
               <h3 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold font-black text-primary-foreground mb-1">{kpi.value}</h3>
               <p className="text-sm text-gray-500 font-medium">{kpi.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Color Variant Matrix */}
          <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-md">
            <h2 className="text-xl md:text-2xl font-semibold font-bold text-primary-foreground mb-6">Inventory: Color Variant Matrix</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-gray-500">
                    <th className="pb-4 font-semibold">Model</th>
                    <th className="pb-4 font-semibold text-center"><div className="w-4 h-4 rounded-full bg-primary mx-auto mb-1"></div>Red</th>
                    <th className="pb-4 font-semibold text-center"><div className="w-4 h-4 rounded-full bg-[#111111] mx-auto mb-1"></div>Black</th>
                    <th className="pb-4 font-semibold text-center"><div className="w-4 h-4 rounded-full bg-gray-500 mx-auto mb-1"></div>Matte Grey</th>
                    <th className="pb-4 font-semibold text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {COLOR_MATRIX.map((row, idx) => (
                    <tr key={idx} className="hover:bg-background/5 transition-colors">
                      <td className="py-4 text-primary-foreground font-medium">{row.model}</td>
                      <td className="py-4 text-center text-gray-300">{row.red}</td>
                      <td className="py-4 text-center text-gray-300">{row.black}</td>
                      <td className="py-4 text-center text-gray-300">{row.matte}</td>
                      <td className="py-4 text-right text-primary-foreground font-bold">{row.red + row.black + row.matte}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sales Calendar Widget */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-md">
            <h2 className="text-xl md:text-2xl font-semibold font-bold text-primary-foreground mb-6">Upcoming Deliveries</h2>
            <div className="space-y-4">
               {[
                 { date: "Aug 05", customer: "Bikash Shrestha", model: "CBR 250RR" },
                 { date: "Aug 05", customer: "Sita Sharma", model: "Dio 125" },
                 { date: "Aug 06", customer: "Ramesh Gurung", model: "XR 190L" },
                 { date: "Aug 08", customer: "Nabin Thapa", model: "CB Shine" },
               ].map((delivery, idx) => (
                 <div key={idx} className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-background/5">
                    <div>
                       <p className="text-sm font-bold text-primary-foreground">{delivery.customer}</p>
                       <p className="text-xs text-primary font-medium">{delivery.model}</p>
                    </div>
                    <div className="text-xs text-gray-500 font-mono bg-background/5 px-2 py-1 rounded">
                       {delivery.date}
                    </div>
                 </div>
               ))}
            </div>
            <button className="w-full mt-6 bg-background/5 hover:bg-background/10 text-primary-foreground py-3 rounded-xl text-sm font-semibold transition-colors">
               View Full Calendar
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
