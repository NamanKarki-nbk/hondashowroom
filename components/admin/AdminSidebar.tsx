"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, Package, ShoppingCart, 
  FileText, LogOut, ChevronLeft, ChevronRight, Settings, X 
} from "lucide-react";
import Logo from "@/components/Logo";

interface AdminSidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (val: boolean) => void;
}

export default function AdminSidebar({ isMobileOpen, setIsMobileOpen }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Inventory", href: "/admin/inventory", icon: Package },
    { name: "Accessories", href: "/admin/accessories", icon: Package },
    { name: "POS", href: "/admin/pos", icon: ShoppingCart },
    { name: "Letters", href: "/admin/letters", icon: FileText },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          flex flex-col bg-[#1a1a1a] text-white
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-zinc-800 shrink-0">
          <Link href="/admin/dashboard" className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}>
            <Logo className="h-8 text-primary shrink-0" />
            {!isCollapsed && <span className="font-black text-xl md:text-2xl font-semibold uppercase tracking-tight whitespace-nowrap">Admin</span>}
          </Link>
          
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  flex items-center px-3 py-3 rounded-lg transition-colors group
                  ${isCollapsed ? 'justify-center' : 'gap-3'}
                  ${isActive 
                    ? "bg-primary text-white" 
                    : "text-gray-400 hover:bg-white/10 hover:text-white"}
                `}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'group-hover:text-white'}`} />
                {!isCollapsed && <span className="font-bold text-sm tracking-wide">{item.name}</span>}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-zinc-800 shrink-0 flex flex-col gap-2">
          {!isCollapsed && (
            <div className="px-3 py-2 text-xs text-gray-500 font-medium">
              Society Enterprises
            </div>
          )}
          <Link
            href="/"
            className={`
              flex items-center px-3 py-3 rounded-lg transition-colors group text-gray-400 hover:bg-white/10 hover:text-white
              ${isCollapsed ? 'justify-center' : 'gap-3'}
            `}
            title={isCollapsed ? "Back to Showroom" : undefined}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="font-bold text-sm">Exit Admin</span>}
          </Link>
        </div>

        {/* Collapse Toggle (Desktop Only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-24 w-6 h-6 bg-primary text-white rounded-full items-center justify-center shadow-md hover:scale-110 transition-transform"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>
    </>
  );
}
