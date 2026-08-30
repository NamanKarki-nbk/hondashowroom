"use client";

import React, { useState } from "react";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import AdminSidebar from "@/components/admin/AdminSidebar";
import NotificationBell from "@/components/admin/NotificationBell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex transition-colors duration-300">
      
      {/* Sidebar Component */}
      <AdminSidebar 
        isMobileOpen={isMobileSidebarOpen} 
        setIsMobileOpen={setIsMobileSidebarOpen} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <div className="sticky top-4 z-30 px-4 md:px-8 shrink-0 print:hidden w-full max-w-[1600px] mx-auto pointer-events-none mb-6 mt-4">
          <header className="h-16 bg-white/75 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.05)] flex items-center justify-between px-6 md:px-8 pointer-events-auto transition-all duration-300">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <NotificationBell />
              <ThemeToggle />
            </div>
          </header>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8 bg-zinc-50 dark:bg-slate-950 print:bg-white print:overflow-visible">
          <div className="max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
        
      </div>
    </div>
  );
}
