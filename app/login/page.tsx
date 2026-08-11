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
    <div className="min-h-screen bg-[#f3ebdd] dark:bg-[#0B0B0C] flex flex-col items-center justify-center p-6 selection:bg-[#c1291A] selection:text-[#f3ebdd] relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#c1291A]/10 blur-[150px] rounded-full pointer-events-none"></div>

      <Link href="/" className="absolute top-8 left-8 text-gray-400 hover:text-gray-800 dark:hover:text-[#f3ebdd] flex items-center gap-2 transition-colors z-20">
        <ArrowLeft className="w-4 h-4" /> Back to Showroom
      </Link>

      <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800 rounded-3xl p-10 backdrop-blur-md shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8 text-center">
           <div className="bg-black border border-slate-700 p-4 rounded-2xl mb-6 shadow-[0_0_20px_rgba(230,0,18,0.2)]">
              <Logo className="w-12 h-12" />
           </div>
           <h1 className="text-2xl font-bold text-gray-900 dark:text-[#f3ebdd] mb-2">Sign In or Sign Up</h1>
           <p className="text-sm text-gray-500 dark:text-gray-400">
             {step === "request" ? "Enter your email or WhatsApp number to continue. If you don't have an account, one will be created." : "Enter the 6-digit code sent to you."}
           </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-100/10 border border-red-500/50 rounded-xl text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        {step === "request" ? (
          <form onSubmit={handleRequestOtp} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
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
                       className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-[#f3ebdd] focus:border-[#c1291A] focus:ring-1 focus:ring-[#c1291A] outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-slate-600"
                       placeholder="name@example.com"
                     />
                   </>
                 ) : (
                   <div className="flex">
                     <div className="flex items-center justify-center bg-gray-100 dark:bg-slate-800 border border-r-0 border-gray-200 dark:border-slate-700 rounded-l-xl px-4 text-gray-700 dark:text-[#f3ebdd] font-medium shrink-0">
                       +977
                     </div>
                     <div className="relative w-full">
                       <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                       <input 
                         type="tel" 
                         required
                         value={identifier}
                         onChange={e => setIdentifier(e.target.value)}
                         className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-slate-700 rounded-r-xl py-3 pl-10 pr-4 text-gray-900 dark:text-[#f3ebdd] focus:border-[#c1291A] focus:ring-1 focus:ring-[#c1291A] outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-slate-600"
                         placeholder="98XXXXXXX"
                       />
                     </div>
                   </div>
                 )}
              </div>
            </div>

            <button disabled={loading} type="submit" className="w-full bg-[#c1291A] hover:bg-[#a02014] text-[#f3ebdd] py-3.5 rounded-xl font-bold text-lg transition-all shadow-lg shadow-[#c1291A]/20 mt-4 flex justify-center items-center gap-2 disabled:opacity-50">
               {loading ? "Sending OTP..." : "Continue"} <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <div className="flex justify-between items-center mb-2">
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">One Time Password (OTP)</label>
                 <button type="button" onClick={() => setStep("request")} className="text-xs text-[#c1291A] hover:text-[#ff3344] font-medium transition-colors">Change {loginMethod}</button>
              </div>
              <div className="relative">
                 <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                 <input 
                   type="text"
                   required 
                   maxLength={6}
                   value={otp}
                   onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                   className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-center tracking-widest text-xl text-gray-900 dark:text-[#f3ebdd] focus:border-[#c1291A] focus:ring-1 focus:ring-[#c1291A] outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-slate-700"
                   placeholder="------"
                 />
              </div>
            </div>

            <button disabled={loading} type="submit" className="w-full bg-[#c1291A] hover:bg-[#a02014] text-[#f3ebdd] py-3.5 rounded-xl font-bold text-lg transition-all shadow-lg shadow-[#c1291A]/20 mt-4 flex justify-center items-center gap-2 disabled:opacity-50">
               {loading ? "Verifying..." : "Verify & Sign In"} <ShieldCheck className="w-5 h-5" />
            </button>
          </form>
        )}

        {step === "request" && (
          <>
            <div className="mt-8 flex items-center justify-center gap-4">
               <div className="h-px bg-gray-200 dark:bg-slate-800 flex-1"></div>
               <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Or Use</span>
               <div className="h-px bg-gray-200 dark:bg-slate-800 flex-1"></div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
               {loginMethod === "email" ? (
                 <button 
                   onClick={() => setLoginMethod("whatsapp")}
                   className="bg-gray-50 hover:bg-gray-100 dark:bg-[#f3ebdd]/5 dark:hover:bg-[#f3ebdd]/10 border border-gray-200 dark:border-slate-700 py-3 rounded-xl flex justify-center items-center gap-2 transition-colors text-sm font-medium text-gray-700 dark:text-[#f3ebdd]"
                 >
                    <MessageCircle className="w-4 h-4 text-green-500" /> WhatsApp
                 </button>
               ) : (
                 <button 
                   onClick={() => setLoginMethod("email")}
                   className="bg-gray-50 hover:bg-gray-100 dark:bg-[#f3ebdd]/5 dark:hover:bg-[#f3ebdd]/10 border border-gray-200 dark:border-slate-700 py-3 rounded-xl flex justify-center items-center gap-2 transition-colors text-sm font-medium text-gray-700 dark:text-[#f3ebdd]"
                 >
                    <Mail className="w-4 h-4 text-blue-500" /> Email
                 </button>
               )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
