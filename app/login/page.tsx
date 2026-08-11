"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, MessageCircle, ShieldCheck } from "lucide-react";
import Logo from "@/components/Logo";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<"email" | "whatsapp">("email");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"request" | "verify">("request");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;
    
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: loginMethod,
          identifier,
        }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }
      
      setStep("verify");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: loginMethod,
          identifier,
          code: otp,
        }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Invalid OTP");
      }
      
      // Successfully logged in / signed up
      localStorage.setItem('isLoggedIn', 'true');
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f3ebdd] dark:bg-[#0B0B0C]">
      {/* Left Column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 relative overflow-y-auto">
        <Link href="/" className="absolute top-8 left-8 text-gray-400 hover:text-gray-800 dark:hover:text-[#f3ebdd] flex items-center gap-2 transition-colors z-20 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Showroom
        </Link>

        <div className="w-full max-w-md mx-auto mt-12">
          {/* Logo / Branding */}
          <div className="mb-10 flex justify-start">
             <div className="bg-black p-3 rounded-xl shadow-lg border border-gray-800">
               <Logo className="w-8 h-8" />
             </div>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Sign In or Sign Up</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-10 text-sm leading-relaxed">
            {step === "request" ? "Enter your email or WhatsApp number to continue. If you don't have an account, one will be created." : "Enter the 6-digit code sent to you."}
          </p>

          {error && (
            <div className="mb-6 p-3 bg-red-100/10 border border-red-500/50 rounded-xl text-red-500 text-sm text-center font-medium">
              {error}
            </div>
          )}

          {step === "request" ? (
            <form onSubmit={handleRequestOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {loginMethod === "email" ? "Email Address" : "WhatsApp Number"}
                </label>
                <div className="relative">
                   {loginMethod === "email" ? (
                     <>
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                       <input 
                         type="email" 
                         required
                         value={identifier}
                         onChange={e => setIdentifier(e.target.value)}
                         className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white focus:border-[#c1291A] focus:ring-1 focus:ring-[#c1291A] outline-none transition-all placeholder:text-gray-400"
                         placeholder="name@example.com"
                       />
                     </>
                   ) : (
                     <div className="flex shadow-sm rounded-xl">
                       <div className="flex items-center justify-center bg-gray-50 dark:bg-slate-800 border border-r-0 border-gray-200 dark:border-slate-700 rounded-l-xl px-4 text-gray-700 dark:text-[#f3ebdd] font-medium shrink-0">
                         +977
                       </div>
                       <div className="relative w-full">
                         <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                         <input 
                           type="tel" 
                           required
                           value={identifier}
                           onChange={e => setIdentifier(e.target.value)}
                           className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-slate-700 rounded-r-xl py-3 pl-10 pr-4 text-gray-900 dark:text-[#f3ebdd] focus:border-[#c1291A] focus:ring-1 focus:ring-[#c1291A] outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-slate-600"
                           placeholder="98XXXXXXX"
                         />
                       </div>
                     </div>
                   )}
                </div>
              </div>

              <button disabled={loading} type="submit" className="w-full bg-[#c1291A] hover:bg-[#a02014] text-[#f3ebdd] py-3.5 rounded-xl font-bold text-base transition-all shadow-lg shadow-[#c1291A]/20 flex justify-center items-center gap-2 disabled:opacity-50">
                 {loading ? "Sending OTP..." : "Continue"} <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                   <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">One Time Password (OTP)</label>
                   <button type="button" onClick={() => setStep("request")} className="text-xs text-[#c1291A] hover:text-[#a02014] font-bold transition-colors">Change {loginMethod}</button>
                </div>
                <div className="relative">
                   <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                   <input 
                     type="text"
                     required 
                     maxLength={6}
                     value={otp}
                     onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                     className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-center tracking-widest text-xl font-bold text-gray-900 dark:text-white focus:border-[#c1291A] focus:ring-1 focus:ring-[#c1291A] outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-slate-700"
                     placeholder="------"
                   />
                </div>
              </div>

              <button disabled={loading} type="submit" className="w-full bg-[#c1291A] hover:bg-[#a02014] text-[#f3ebdd] py-3.5 rounded-xl font-bold text-base transition-all shadow-lg shadow-[#c1291A]/20 flex justify-center items-center gap-2 disabled:opacity-50">
                 {loading ? "Verifying..." : "Verify & Sign In"} <ShieldCheck className="w-5 h-5" />
              </button>
            </form>
          )}

          {step === "request" && (
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[#f3ebdd] dark:bg-[#0B0B0C] text-gray-500 font-medium tracking-wide">Or Use</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                 {loginMethod === "email" ? (
                   <button 
                     onClick={() => setLoginMethod("whatsapp")}
                     className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 py-3 rounded-xl flex justify-center items-center gap-2 transition-colors hover:bg-gray-50 dark:hover:bg-slate-700 text-sm font-semibold text-gray-700 dark:text-[#f3ebdd] shadow-sm"
                   >
                      <MessageCircle className="w-5 h-5 text-green-500" /> WhatsApp
                   </button>
                 ) : (
                   <button 
                     onClick={() => setLoginMethod("email")}
                     className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 py-3 rounded-xl flex justify-center items-center gap-2 transition-colors hover:bg-gray-50 dark:hover:bg-slate-700 text-sm font-semibold text-gray-700 dark:text-[#f3ebdd] shadow-sm"
                   >
                      <Mail className="w-5 h-5 text-blue-500" /> Email
                   </button>
                 )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Column - Decorative Showcase */}
      <div className="hidden lg:block lg:w-1/2 relative bg-black overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/finance-hero.jpg')] bg-cover bg-center opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        
        <div className="absolute bottom-16 left-16 right-16">
          <h2 className="text-4xl font-bold text-white mb-4">The Power of Dreams.</h2>
          <p className="text-lg text-gray-300 leading-relaxed font-light">Log in to manage your test rides, track your showroom orders, and view exclusive financing offers tailored just for you.</p>
        </div>
      </div>
    </div>
  );
}
