"use client";

import React, { useState } from "react";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f3ebdd] dark:bg-[#0B0B0C] text-gray-900 dark:text-gray-100 flex transition-colors duration-300">
      
      {/* Sidebar Component */}
      <AdminSidebar 
        isMobileOpen={isMobileSidebarOpen} 
        setIsMobileOpen={setIsMobileSidebarOpen} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-20 bg-white/80 dark:bg-black/50 backdrop-blur-md border-b border-gray-200 dark:border-white/10 sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 shrink-0 transition-colors duration-300 print:hidden">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-black uppercase tracking-tight hidden sm:block">Admin Portal</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8 bg-[#f3ebdd] dark:bg-[#0B0B0C] print:bg-white print:overflow-visible">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
        
      </div>
    </div>
  );
}
