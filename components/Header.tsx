"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Search, Menu, ChevronDown, X, User } from "lucide-react";
import Logo from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => {
  return (
    <Link href={href} className="relative group px-1 py-2">
      <span className="text-[13px] xl:text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide group-hover:text-primary dark:group-hover:text-primary transition-colors whitespace-nowrap">
        {children}
      </span>
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-orange-500 transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
};

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

  if (!mounted) return null;

  return (
    <>
      <div className="fixed top-2 md:top-4 left-0 w-full z-50 flex justify-center px-2 sm:px-4 md:px-8 pointer-events-none">
        <header className="w-full max-w-[1600px] bg-white/75 dark:bg-black/50 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.05)] pointer-events-auto transition-all duration-300">
          <div className="h-16 flex items-center justify-between px-3 sm:px-6 xl:px-8">
            {/* Logo */}
            <div className="flex items-center min-w-0 shrink">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/" className="flex items-center group">
                  <Logo className="h-4 sm:h-5 md:h-6 lg:h-7 shrink text-primary pointer-events-none" />
                </Link>
              </motion.div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 flex-1 justify-center">
              <NavLink href="/shop">Shop</NavLink>
              <NavLink href="/finance">Finance</NavLink>
              
              {/* Tools Dropdown */}
              <div className="relative group py-4">
                <button className="flex items-center gap-1 text-[13px] xl:text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide group-hover:text-primary dark:group-hover:text-primary transition-colors whitespace-nowrap">
                  Tools <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                </button>
                <div className="absolute top-[80%] left-1/2 -translate-x-1/2 pt-4 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border border-gray-100 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden py-2 flex flex-col gap-1 p-2">
                    <Link href="/fuel-calculator" className="px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary transition-colors text-sm font-bold whitespace-nowrap flex items-center gap-2">
                      <span className="text-lg">⛽</span> Fuel Calculator
                    </Link>
                    <Link href="/compare" className="px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary transition-colors text-sm font-bold whitespace-nowrap flex items-center gap-2">
                      <span className="text-lg">⚖️</span> Compare Vehicles
                    </Link>
                  </div>
                </div>
              </div>

              {/* Services Dropdown */}
              <div className="relative group py-4">
                <button className="flex items-center gap-1 text-[13px] xl:text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide group-hover:text-primary dark:group-hover:text-primary transition-colors whitespace-nowrap">
                  Services <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                </button>
                <div className="absolute top-[80%] left-1/2 -translate-x-1/2 pt-4 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border border-gray-100 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden py-2 flex flex-col gap-1 p-2">
                    <Link href="/amc" className="px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary transition-colors text-sm font-bold whitespace-nowrap">AMC Book</Link>
                    <Link href="/service-booking" className="px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary transition-colors text-sm font-bold whitespace-nowrap">Service Booking</Link>
                    <Link href="/know-your-vehicle" className="px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary transition-colors text-sm font-bold whitespace-nowrap">Know Your Vehicle</Link>
                    <Link href="/warranty" className="px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary transition-colors text-sm font-bold whitespace-nowrap">About Warranty</Link>
                  </div>
                </div>
              </div>

              <NavLink href="/accessories">Accessories</NavLink>
              <NavLink href="/about">About Us</NavLink>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-4 shrink-0">
              {/* Search */}
              <form onSubmit={handleSearch} className="relative hidden xl:block w-48 2xl:w-64 group">
                <input 
                  type="search" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  placeholder="Search Honda..." 
                  className="w-full bg-gray-100/50 dark:bg-gray-800/50 border border-transparent focus:border-primary/50 rounded-full py-2 pl-4 pr-10 text-sm focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 group-hover:bg-gray-100 dark:group-hover:bg-gray-800" 
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors">
                  <Search className="w-4 h-4" />
                </button>
              </form>

              {/* Auth Button */}
              <div className={`relative py-2 ${isLoggedIn ? 'group' : ''}`}>
                <Link href={isLoggedIn ? "/profile" : "/login"} className="p-2 lg:px-4 lg:py-2 rounded-full lg:rounded-xl bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-primary transition-colors flex items-center justify-center cursor-pointer gap-2 z-10 relative">
                   <User className="w-5 h-5 shrink-0" />
                   <span className="hidden lg:block text-xs xl:text-sm font-bold uppercase tracking-wide">
                     {isLoggedIn ? "Profile" : "Login"}
                   </span>
                </Link>
                {/* Auth Dropdown */}
                {isLoggedIn && (
                  <div className="absolute top-[90%] right-0 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border border-gray-100 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden py-2 flex flex-col p-2">
                      <Link href="/admin/dashboard" className="px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-sm font-bold flex items-center justify-between">Admin <ArrowRight className="w-3 h-3" /></Link>
                      <Link href="/profile" className="px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-sm font-bold">My Profile</Link>
                      <button onClick={handleLogout} className="px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-primary transition-colors text-sm font-bold text-left text-gray-500">Log Out</button>
                    </div>
                  </div>
                )}
              </div>

              <ThemeToggle />

              <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-gray-800 dark:text-gray-200 p-2 rounded-full bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>
      </div>
      
      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setIsMobileMenuOpen(false)} 
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 bottom-0 left-0 w-[85%] max-w-sm bg-white dark:bg-slate-950 shadow-2xl overflow-y-auto flex flex-col border-r border-gray-200 dark:border-slate-800"
            >
              <div className="p-6 flex items-center justify-between border-b border-gray-100 dark:border-slate-800">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <Logo className="h-6 text-primary" />
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-primary transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 flex flex-col gap-6 text-lg font-bold text-gray-900 dark:text-gray-100 uppercase overflow-y-auto pb-24">
                {/* Mobile Search */}
                <form onSubmit={(e) => { handleSearch(e); setIsMobileMenuOpen(false); }} className="relative w-full">
                   <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search Honda..." className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-2xl py-3 pl-4 pr-10 text-sm focus:ring-2 focus:ring-primary outline-none placeholder:text-gray-500" />
                   <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary">
                     <Search className="w-5 h-5" />
                   </button>
                </form>
                
                <nav className="flex flex-col gap-5 mt-2">
                  <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">Shop</Link>
                  <Link href="/compare" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">Compare</Link>
                  <Link href="/finance" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">Finance</Link>
                  <Link href="/offers" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">Special Offers</Link>
                  <Link href="/service-booking" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">Service Booking</Link>
                  <Link href="/accessories" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">Accessories</Link>
                  <Link href="/amc" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">AMC Book</Link>
                  <Link href="/know-your-vehicle" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">Know Your Vehicle</Link>
                  <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">About Us</Link>
                  <Link href="/owners-manual" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">Manuals</Link>

                  {/* Auth and Admin Links */}
                  <div className="h-px w-full bg-gray-100 dark:bg-gray-800 my-4" />
                  
                  <Link href="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-primary flex items-center gap-2 hover:opacity-80">Admin Portal <ArrowRight className="w-4 h-4" /></Link>
                  {!isLoggedIn ? (
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">Login</Link>
                  ) : (
                    <>
                      <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">My Profile</Link>
                      <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="text-left text-gray-500 hover:text-primary transition-colors uppercase font-bold">Log Out</button>
                    </>
                  )}
                </nav>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
