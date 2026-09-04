import React from "react";
import Link from "next/link";
import { TrendingUp, Package, DollarSign, Calendar as CalendarIcon, Users, ArrowUpRight, ArrowDownRight, ChevronRight, ArrowRight, Wallet, Building, Receipt, HandCoins, PlusCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  // 1. Get current month date range
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // 2. Fetch KPIs
  const [revenueResult, commissionResult, inStockCount, totalCustomersCount, todayCustomersCount, outstandingDuesResult, financeSalesCount] = await Promise.all([
    prisma.salesTransaction.aggregate({
      _sum: { finalAmount: true },
      where: { createdAt: { gte: startOfMonth } }
    }),
    prisma.salesTransaction.aggregate({
      _sum: { commission: true },
      where: { createdAt: { gte: startOfMonth } }
    }),
    prisma.vehicleInventory.count({
      where: { status: 'IN_STOCK' }
    }),
    prisma.customer.count(),
    prisma.customer.count({
      where: { createdAt: { gte: startOfToday } }
    }),
    prisma.salesTransaction.aggregate({
      _sum: { dueAmount: true },
      where: { dueAmount: { gt: 0 } }
    }),
    prisma.salesTransaction.count({
      where: { paymentType: 'FINANCE', createdAt: { gte: startOfMonth } }
    })
  ]);

  const totalRevenue = revenueResult._sum.finalAmount || 0;
  const totalCommission = commissionResult._sum.commission || 0;
  const totalOutstandingDues = outstandingDuesResult._sum.dueAmount || 0;

  // Format currency
  const formatCurrency = (val: number) => `Rs. ${val.toLocaleString()}`;

  const KPI_DATA = [
    { label: "Total Revenue (MTD)", value: formatCurrency(totalRevenue), change: "+0%", trend: "up", icon: DollarSign },
    { label: "Outstanding Dues", value: formatCurrency(totalOutstandingDues), change: "Action Needed", trend: "down", icon: Wallet },
    { label: "Finance Sales (MTD)", value: financeSalesCount.toString(), change: "+0%", trend: "up", icon: Building },
    { label: "In-Stock Units", value: inStockCount.toString(), change: "0", trend: "up", icon: Package },
    { label: "Monthly Commissions", value: formatCurrency(totalCommission), change: "+0%", trend: "up", icon: TrendingUp },
    { label: "Total Customers", value: totalCustomersCount.toString(), change: `+${todayCustomersCount} Today`, trend: todayCustomersCount > 0 ? "up" : "down", icon: Users },
  ];

  // 3. Fetch Inventory Matrix Data grouped by Branch, Model, Color
  const rawInventory = await prisma.vehicleInventory.findMany({
    where: { status: 'IN_STOCK' },
    select: { variant: { select: { vehicleMaster: { select: { name: true } } } }, color: true, branch: { select: { name: true } } }
  });

  const branchesSet = new Set<string>();
  rawInventory.forEach(item => {
     if (item.branch?.name) branchesSet.add(item.branch.name);
  });
  const branches = Array.from(branchesSet).sort();

  // Create matrix: [modelName][color][branchName] = count
  const matrixMap: Record<string, Record<string, Record<string, number>>> = {};
  rawInventory.forEach(item => {
     const branchName = item.branch?.name || "Unassigned";
     const itemName = item.variant?.vehicleMaster?.name || "Unknown Model";
     
     if (!matrixMap[itemName]) matrixMap[itemName] = {};
     if (!matrixMap[itemName][item.color]) {
         matrixMap[itemName][item.color] = {};
         branches.forEach(b => matrixMap[itemName][item.color][b] = 0);
         matrixMap[itemName][item.color]["Unassigned"] = 0;
     }
     matrixMap[itemName][item.color][branchName]++;
  });

  const COLOR_MATRIX: any[] = [];
  Object.entries(matrixMap).forEach(([model, colors]) => {
     Object.entries(colors).forEach(([color, branchCounts]) => {
         const total = Object.values(branchCounts).reduce((sum, val) => sum + val, 0);
         COLOR_MATRIX.push({
             model,
             color,
             counts: branchCounts,
             total
         });
     });
  });

  COLOR_MATRIX.sort((a, b) => {
     if (a.model !== b.model) return a.model.localeCompare(b.model);
     return b.total - a.total;
  });

  // 4. Fetch Upcoming/Recent Schedule (Sales, Services, Test Rides)
  const recentSales = await prisma.salesTransaction.findMany({
    take: 2,
    orderBy: { createdAt: 'desc' },
    include: { 
      customer: true, 
      vehicle: {
        include: {
          variant: {
            include: { vehicleMaster: true }
          }
        }
      } 
    }
  });
  
  const upcomingTestRides = await prisma.testRideBooking.findMany({
    take: 2,
    where: { preferredDate: { gte: new Date() } },
    orderBy: { preferredDate: 'asc' }
  });
  
  const upcomingServices = await prisma.serviceBooking.findMany({
    take: 2,
    where: { preferredDate: { gte: new Date() } },
    orderBy: { preferredDate: 'asc' },
    include: { customer: true }
  });

  const recentDuesCollected = await prisma.paymentReceipt.findMany({
    take: 2,
    where: { receiptNo: { endsWith: '-C' } },
    orderBy: { createdAt: 'desc' },
    include: { transaction: { include: { customer: true } } }
  });

  const SCHEDULE = [
    ...recentSales.map(sale => ({
      date: sale.createdAt,
      title: sale.customer.fullName,
      subtitle: sale.vehicle?.variant?.vehicleMaster?.name || "Unknown Vehicle",
      status: "Delivered",
      type: "DELIVERY"
    })),
    ...recentDuesCollected.map(receipt => ({
      date: receipt.createdAt,
      title: `Due: ${receipt.transaction?.customer?.fullName || "Unknown"}`,
      subtitle: `Collected: Rs. ${receipt.amount.toLocaleString()}`,
      status: "Collected",
      type: "DUE_COLLECTION"
    })),
    ...upcomingTestRides.map(tr => ({
      date: tr.preferredDate,
      title: `Test Ride: ${tr.name}`,
      subtitle: tr.name,
      status: "Upcoming",
      type: "TEST_RIDE"
    })),
    ...upcomingServices.map(srv => ({
      date: srv.preferredDate,
      title: `Service: ${srv.customer.fullName}`,
      subtitle: srv.serviceType,
      status: "Upcoming",
      type: "SERVICE"
    }))
  ]
  .sort((a, b) => b.date.getTime() - a.date.getTime())
  .slice(0, 4)
  .map(item => {
    return {
      ...item,
      dateStr: item.date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
    };
  });

  const currentMonthStr = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

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
            <span className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">{currentMonthStr}</span>
          </div>
        </header>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {KPI_DATA.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
            <div key={idx} className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-gray-100 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.02)] rounded-3xl p-6 relative overflow-hidden group hover:border-primary/30 dark:hover:border-primary/30 hover:-translate-y-1 transition-all duration-300">
               <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl text-gray-500 dark:text-gray-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors shadow-sm">
                     <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider ${kpi.trend === 'up' ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-400/10 border border-emerald-200 dark:border-emerald-400/20' : 'text-rose-700 bg-rose-100 dark:text-rose-400 dark:bg-rose-400/10 border border-rose-200 dark:border-rose-400/20'}`}>
                     {kpi.change} 
                     {kpi.trend === 'up' ? <ArrowUpRight className="w-3 h-3"/> : <ArrowDownRight className="w-3 h-3"/>}
                  </span>
               </div>
               <div>
                 <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-2 group-hover:text-primary transition-colors">{kpi.value}</h3>
                 <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{kpi.label}</p>
               </div>
            </div>
            );
          })}
        </div>

        {/* Quick Action Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <Link href="/admin/pos/checkout" className="bg-primary hover:bg-red-700 text-white p-4 md:p-6 rounded-3xl shadow-lg hover:shadow-red-500/30 transition-all hover:-translate-y-1 group flex flex-col items-center justify-center text-center">
            <PlusCircle className="w-8 h-8 mb-3 opacity-90 group-hover:scale-110 transition-transform" />
            <h4 className="font-black uppercase tracking-widest text-sm">New Invoice</h4>
          </Link>
          <Link href="/admin/accounts/dues" className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-gray-100 dark:border-slate-800/80 hover:border-amber-500/50 p-4 md:p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-all hover:-translate-y-1 group flex flex-col items-center justify-center text-center">
            <HandCoins className="w-8 h-8 mb-3 text-amber-500 opacity-90 group-hover:scale-110 transition-transform" />
            <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-sm">Collect Dues</h4>
          </Link>
          <Link href="/admin/accounts/finance-tracker" className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-gray-100 dark:border-slate-800/80 hover:border-indigo-500/50 p-4 md:p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-all hover:-translate-y-1 group flex flex-col items-center justify-center text-center">
            <Building className="w-8 h-8 mb-3 text-indigo-500 opacity-90 group-hover:scale-110 transition-transform" />
            <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-sm">Finance Sales</h4>
          </Link>
          <Link href="/admin/inventory/create" className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-gray-100 dark:border-slate-800/80 hover:border-primary/50 p-4 md:p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-all hover:-translate-y-1 group flex flex-col items-center justify-center text-center">
            <Package className="w-8 h-8 mb-3 text-primary opacity-90 group-hover:scale-110 transition-transform" />
            <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-sm">Add Inventory</h4>
          </Link>
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
            
            <div className="overflow-x-auto w-full max-h-[400px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead className="sticky top-0 bg-white dark:bg-slate-900 z-10">
                  <tr className="border-b-2 border-gray-100 dark:border-slate-800/80 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    <th className="py-4 pl-4">Model</th>
                    <th className="py-4">Color</th>
                    {branches.map((branch, idx) => (
                       <th key={idx} className="py-4 text-center px-2">{branch}</th>
                    ))}
                    <th className="py-4 pr-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/50">
                  {COLOR_MATRIX.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/80 dark:hover:bg-zinc-800/30 transition-colors group">
                      <td className="py-4 pl-4 text-gray-900 dark:text-white font-black tracking-tight whitespace-nowrap">{row.model}</td>
                      <td className="py-4">
                         <div className="flex items-center gap-2">
                           <div className="w-3 h-3 rounded-full shadow-sm border border-gray-200 dark:border-gray-700" style={{ backgroundColor: row.color.toLowerCase() }}></div>
                           <span className="text-gray-900 dark:text-gray-200 font-bold tracking-tight whitespace-nowrap">{row.color}</span>
                         </div>
                      </td>
                      {branches.map((branch, branchIdx) => (
                         <td key={branchIdx} className="py-4 text-center font-bold text-gray-600 dark:text-gray-300">
                            {row.counts[branch] > 0 ? row.counts[branch] : '-'}
                         </td>
                      ))}
                      <td className="py-4 pr-4 text-right">
                         <span className="inline-flex items-center justify-center bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white font-black px-3 py-1.5 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                            {row.total}
                         </span>
                      </td>
                    </tr>
                  ))}
                  {COLOR_MATRIX.length === 0 && (
                    <tr>
                      <td colSpan={branches.length + 3} className="py-8 text-center text-gray-500">No inventory data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Schedule Widget */}
          <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-gray-100 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none rounded-3xl p-6 md:p-8 flex flex-col">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-8">Schedule Overview</h2>
            
            <div className="space-y-4 flex-1">
               {SCHEDULE.map((item, idx) => {
                 const dateParts = item.dateStr.split(' ');
                 const monthStr = dateParts[0];
                 const dayStr = dateParts[1] || '';
                 return (
                 <div key={idx} className="flex gap-4 items-center group">
                    <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 rounded-2xl w-16 h-16 shrink-0 group-hover:border-primary/50 group-hover:bg-red-50 dark:group-hover:bg-primary/10 transition-colors">
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{monthStr}</span>
                       <span className="text-xl font-black text-gray-900 dark:text-white">{dayStr}</span>
                    </div>
                    
                    <div className="flex-1">
                       <h4 className="text-sm font-black text-gray-900 dark:text-white tracking-tight">{item.title}</h4>
                       <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5">{item.subtitle}</p>
                    </div>

                    <div className={`w-2.5 h-2.5 rounded-full ${item.status === 'Delivered' || item.status === 'Collected' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} title={item.status} />
                 </div>
                 );
               })}
               {SCHEDULE.length === 0 && (
                 <div className="text-center text-gray-500 py-4">No recent or upcoming schedule</div>
               )}
            </div>
            
            <Link href="/admin/sales-calendar" className="block mt-8 pt-6 border-t border-gray-100 dark:border-slate-800">
              <button className="w-full flex items-center justify-center gap-2 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-900 dark:text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors group">
                 View Full Calendar <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
