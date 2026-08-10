import React from "react";
import Link from "next/link";
import { LayoutDashboard, Users, Package, Settings, FileText, ShoppingCart, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0B0B0C] flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-800">
          <Link href="/admin/dashboard" className="text-xl font-black text-[#f3ebdd] flex items-center gap-2">
            <span className="text-[#c1291A]">HONDA</span> Admin
          </Link>
          <p className="text-xs text-gray-500 mt-1">Society Enterprises</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-300 hover:text-white hover:bg-slate-800 transition-colors">
            <LayoutDashboard className="w-5 h-5 text-gray-400" />
            Dashboard
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-300 hover:text-white hover:bg-slate-800 transition-colors">
            <Users className="w-5 h-5 text-gray-400" />
            All Users
          </Link>
          <Link href="/admin/inventory" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-300 hover:text-white hover:bg-slate-800 transition-colors">
            <Package className="w-5 h-5 text-gray-400" />
            Inventory
          </Link>
          <Link href="/admin/pos" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-300 hover:text-white hover:bg-slate-800 transition-colors">
            <ShoppingCart className="w-5 h-5 text-gray-400" />
            POS
          </Link>
          <Link href="/admin/letters" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-300 hover:text-white hover:bg-slate-800 transition-colors">
            <FileText className="w-5 h-5 text-gray-400" />
            Letters & Docs
          </Link>
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-400 hover:text-[#c1291A] hover:bg-[#c1291A]/10 transition-colors">
            <LogOut className="w-5 h-5" />
            Back to Showroom
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
