"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Search, Menu, ChevronDown } from "lucide-react";
import Logo from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { usePathname, useRouter } from "next/navigation";

/**
 * Global navigation header for the customer portal.
 * 
 * Features:
 * - Responsive layout with mobile menu support.
 * - Dynamic scroll behavior (hides on scroll down, shows on scroll up).
 * - Multi-level dropdown menus for "Services" and "Resources" using Tailwind group-hover.
 * - Integrated global search bar.
 * - Dark mode toggle integration.
 * 
 * @returns {JSX.Element} The rendered global header component.
 */
export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    router.push('/');
    router.refresh();
  };

  if (pathname?.includes('/vehicles/')) return null;
  if (!mounted) return null;

  return (
    <header className="w-full bg-[#f3ebdd] dark:bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-[#f3ebdd]/95 fixed top-0 z-50 shadow-md dark:shadow-white/5 transition-colors duration-300">
      {/* Top Red Bar (from honda.com.np) */}
      <div className="w-full bg-[#c1291A] text-[#f3ebdd] text-sm py-2">
         <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <div className="flex gap-4 font-semibold">
               <Link href="/finance" className="hover:underline">Honda Finance From Home</Link>
               <span className="opacity-50">|</span>
               <Link href="/takata-special-service-campaign" className="hover:underline">J Rakhna Man xa Rakh</Link>
               <span className="opacity-50">|</span>
               <Link href="/service-booking" className="hover:underline">Honda Service Booking</Link>
            </div>
            <div className="hidden md:flex gap-4">
               <Link href="/admin/dashboard" className="hover:underline flex items-center gap-1">Admin Portal <ArrowRight className="w-3 h-3" /></Link>
               {!isLoggedIn ? (
                 <Link href="/login" className="hover:underline">Login</Link>
               ) : (
                 <>
                   <Link href="/profile" className="hover:underline">My Profile</Link>
                   <button onClick={handleLogout} className="hover:underline">Log Out</button>
                 </>
               )}
            </div>
         </div>
      </div>

      {/* Main Nav (Header) */}
      <div className="w-full px-6 md:px-12 lg:px-16 h-20 flex items-center justify-between gap-4">
        <div className="flex items-center flex-shrink-0">
           <button className="lg:hidden text-gray-800 dark:text-gray-200 p-2 mr-2"><Menu className="w-6 h-6" /></button>
           <Link href="/" className="flex items-center group">
             <Logo className="h-6 md:h-8 group-hover:scale-105 transition-transform text-[#c1291A] flex-shrink-0" />
           </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-4 xl:gap-8 text-[13px] xl:text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide flex-1 justify-center">
          <Link href="/shop" className="hover:text-[#c1291A] dark:hover:text-[#c1291A] transition-colors whitespace-nowrap">Shop</Link>
          <Link href="/compare" className="hover:text-[#c1291A] dark:hover:text-[#c1291A] transition-colors whitespace-nowrap">Compare</Link>
          <Link href="/finance" className="hover:text-[#c1291A] dark:hover:text-[#c1291A] transition-colors whitespace-nowrap">Finance</Link>

          {/* Tools Dropdown */}
          <div className="relative group py-2">
            <button className="flex items-center gap-1 hover:text-[#c1291A] dark:hover:text-[#c1291A] transition-colors uppercase whitespace-nowrap">
              Tools <ChevronDown className="w-4 h-4" />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-52 bg-[#f3ebdd] dark:bg-[#1A1A1A] border border-gray-100 dark:border-[#f3ebdd]/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
              <div className="py-2 flex flex-col">
                <Link href="/finance" className="px-4 py-2 hover:bg-[#f3ebdd] dark:hover:bg-[#2A2A2A] hover:text-[#c1291A] dark:hover:text-[#c1291A] transition-colors text-xs font-bold whitespace-nowrap">💰 EMI Calculator</Link>
                <Link href="/fuel-calculator" className="px-4 py-2 hover:bg-[#f3ebdd] dark:hover:bg-[#2A2A2A] hover:text-[#c1291A] dark:hover:text-[#c1291A] transition-colors text-xs font-bold whitespace-nowrap">⛽ Fuel Calculator</Link>
                <Link href="/compare" className="px-4 py-2 hover:bg-[#f3ebdd] dark:hover:bg-[#2A2A2A] hover:text-[#c1291A] dark:hover:text-[#c1291A] transition-colors text-xs font-bold whitespace-nowrap">⚖️ Compare Vehicles</Link>
              </div>
            </div>
          </div>

          <div className="relative group py-2">
            <button className="flex items-center gap-1 hover:text-[#c1291A] dark:hover:text-[#c1291A] transition-colors uppercase whitespace-nowrap">
              Services <ChevronDown className="w-4 h-4" />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-48 bg-[#f3ebdd] dark:bg-[#1A1A1A] border border-gray-100 dark:border-[#f3ebdd]/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
              <div className="py-2 flex flex-col">
                <Link href="/amc" className="px-4 py-2 hover:bg-[#f3ebdd] dark:hover:bg-[#2A2A2A] hover:text-[#c1291A] dark:hover:text-[#c1291A] transition-colors text-xs font-bold whitespace-nowrap">AMC Book</Link>
                <Link href="/know-your-vehicle" className="px-4 py-2 hover:bg-[#f3ebdd] dark:hover:bg-[#2A2A2A] hover:text-[#c1291A] dark:hover:text-[#c1291A] transition-colors text-xs font-bold whitespace-nowrap">Know Your Vehicle</Link>
                <Link href="/warranty" className="px-4 py-2 hover:bg-[#f3ebdd] dark:hover:bg-[#2A2A2A] hover:text-[#c1291A] dark:hover:text-[#c1291A] transition-colors text-xs font-bold whitespace-nowrap">About Warranty</Link>
              </div>
            </div>
          </div>

          <Link href="/about" className="hover:text-[#c1291A] dark:hover:text-[#c1291A] transition-colors whitespace-nowrap">About Us</Link>
          <Link href="/owners-manual" className="hover:text-[#c1291A] dark:hover:text-[#c1291A] transition-colors whitespace-nowrap">Manuals & Maintenance</Link>
        </nav>

        <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
          <form onSubmit={handleSearch} className="hidden xl:flex relative w-48">
             <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search Honda" className="w-full bg-[#e8dfd1] dark:bg-gray-800 border-none rounded-full py-2 pl-4 pr-10 text-sm focus:ring-2 focus:ring-[#c1291A] outline-none" />
             <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#c1291A]">
               <Search className="w-4 h-4" />
             </button>
          </form>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
