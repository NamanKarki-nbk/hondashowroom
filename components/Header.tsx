"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Search, Menu, ChevronDown, X } from "lucide-react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  if (pathname?.includes('/vehicles/') || pathname?.includes('/scooter/')) return null;
  if (!mounted) return null;

  return (
    <>
    <header className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95 fixed top-0 z-50 shadow-md dark:shadow-white/5 transition-colors duration-300">
      {/* Top Red Bar (from honda.com.np) */}
      <div className="hidden md:block w-full bg-primary text-primary-foreground text-sm py-2">
         <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <div className="hidden md:flex gap-4 font-semibold">
               <Link href="/finance" className="hover:underline">Honda Finance</Link>
               <span className="opacity-50">|</span>
               <Link href="/offers" className="hover:underline">Special Offers</Link>
               <span className="opacity-50">|</span>
               <Link href="/service-booking" className="hover:underline">Service Booking</Link>
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
      <div className="w-full px-4 md:px-12 lg:px-16 h-20 flex items-center justify-between gap-2 md:gap-4 min-w-0">
        <div className="flex items-center min-w-0">
           <Link href="/" className="flex items-center group">
             {/* Mobile Logo: Scaled to fit instead of cropped */}
             <div className="md:hidden flex items-center shrink-0">
                <Logo className="h-4 sm:h-5 max-w-[160px] sm:max-w-[200px] object-contain shrink-0" />
             </div>
             {/* Desktop Logo */}
             <Logo className="hidden md:block h-7 lg:h-8 max-w-none group-hover:scale-105 transition-transform text-primary object-contain" />
           </Link>
        </div>

        <nav className="hidden md:flex items-center gap-4 xl:gap-8 text-[13px] xl:text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide flex-1 justify-center">
          <Link href="/shop" className="hover:text-primary dark:hover:text-primary transition-colors whitespace-nowrap">Shop</Link>
          <Link href="/finance" className="hover:text-primary dark:hover:text-primary transition-colors whitespace-nowrap">Finance</Link>
          <Link href="/accessories" className="hover:text-primary dark:hover:text-primary transition-colors whitespace-nowrap">Accessories</Link>

          {/* Tools Dropdown */}
          <div className="relative group py-2">
            <button className="flex items-center gap-1 hover:text-primary dark:hover:text-primary transition-colors uppercase whitespace-nowrap">
              Tools <ChevronDown className="w-4 h-4" />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-52 bg-background dark:bg-[#1A1A1A] border border-gray-100 dark:border-background/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
              <div className="py-2 flex flex-col">
                <Link href="/fuel-calculator" className="px-4 py-2 hover:bg-background dark:hover:bg-[#2A2A2A] hover:text-primary dark:hover:text-primary transition-colors text-xs font-bold whitespace-nowrap">⛽ Fuel Calculator</Link>
                <Link href="/compare" className="px-4 py-2 hover:bg-background dark:hover:bg-[#2A2A2A] hover:text-primary dark:hover:text-primary transition-colors text-xs font-bold whitespace-nowrap">⚖️ Compare Vehicles</Link>
              </div>
            </div>
          </div>

          <div className="relative group py-2">
            <button className="flex items-center gap-1 hover:text-primary dark:hover:text-primary transition-colors uppercase whitespace-nowrap">
              Services <ChevronDown className="w-4 h-4" />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-48 bg-background dark:bg-[#1A1A1A] border border-gray-100 dark:border-background/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
              <div className="py-2 flex flex-col">
                <Link href="/amc" className="px-4 py-2 hover:bg-background dark:hover:bg-[#2A2A2A] hover:text-primary dark:hover:text-primary transition-colors text-xs font-bold whitespace-nowrap">AMC Book</Link>
                <Link href="/know-your-vehicle" className="px-4 py-2 hover:bg-background dark:hover:bg-[#2A2A2A] hover:text-primary dark:hover:text-primary transition-colors text-xs font-bold whitespace-nowrap">Know Your Vehicle</Link>
                <Link href="/warranty" className="px-4 py-2 hover:bg-background dark:hover:bg-[#2A2A2A] hover:text-primary dark:hover:text-primary transition-colors text-xs font-bold whitespace-nowrap">About Warranty</Link>
              </div>
            </div>
          </div>

          <Link href="/about" className="hover:text-primary dark:hover:text-primary transition-colors whitespace-nowrap">About Us</Link>
          <Link href="/owners-manual" className="hover:text-primary dark:hover:text-primary transition-colors whitespace-nowrap">Manuals & Maintenance</Link>
        </nav>

        <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
          <form onSubmit={handleSearch} className="relative hidden xl:block w-48 2xl:w-64">
            <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search Honda..." className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-full py-2 pl-4 pr-10 text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-gray-500" />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary">
              <Search className="w-4 h-4" />
            </button>
          </form>
          <ThemeToggle />
          <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-gray-800 dark:text-gray-200 p-1 flex-shrink-0 ml-2"><Menu className="w-6 h-6" /></button>
        </div>
      </div>
      
    </header>
    
      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-[100] md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        <div className={`absolute top-0 bottom-0 left-0 w-4/5 max-w-sm bg-background dark:bg-[#111] shadow-2xl transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto`}>
          <div className="p-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
            <Logo className="h-6 text-primary" />
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-primary">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6 flex flex-col gap-6 text-lg font-bold text-gray-900 dark:text-gray-100 uppercase">
            {/* Mobile Search */}
            <form onSubmit={(e) => { handleSearch(e); setIsMobileMenuOpen(false); }} className="relative w-full">
               <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search Honda..." className="w-full bg-[#e8dfd1] dark:bg-gray-800 border-none rounded-xl py-3 pl-4 pr-10 text-sm focus:ring-2 focus:ring-primary outline-none placeholder:text-gray-500" />
               <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary">
                 <Search className="w-5 h-5" />
               </button>
            </form>
            
            <nav className="flex flex-col gap-6">
            <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
            <Link href="/compare" onClick={() => setIsMobileMenuOpen(false)}>Compare</Link>
            <Link href="/finance" onClick={() => setIsMobileMenuOpen(false)}>Finance</Link>
            <Link href="/offers" onClick={() => setIsMobileMenuOpen(false)}>Special Offers</Link>
            <Link href="/service-booking" onClick={() => setIsMobileMenuOpen(false)}>Service Booking</Link>
            <Link href="/accessories" onClick={() => setIsMobileMenuOpen(false)}>Accessories</Link>
            <Link href="/amc" onClick={() => setIsMobileMenuOpen(false)}>AMC Book</Link>
            <Link href="/know-your-vehicle" onClick={() => setIsMobileMenuOpen(false)}>Know Your Vehicle</Link>
            <Link href="/warranty" onClick={() => setIsMobileMenuOpen(false)}>About Warranty</Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
            <Link href="/owners-manual" onClick={() => setIsMobileMenuOpen(false)}>Manuals</Link>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
