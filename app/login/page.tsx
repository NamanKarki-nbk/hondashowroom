"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Lock, MessageCircle, ShieldCheck } from "lucide-react";
import Logo from "@/components/Logo";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  
  // State for login methods
  const [method, setMethod] = useState<"password" | "whatsapp">("password");
  
  // Password Flow State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // WhatsApp OTP Flow State
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  
  // General State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('isLoggedIn', 'true');
        router.push("/");
        router.refresh();
      } else if (res.status === 403) {
        router.push(`/verify-otp?identifier=${encodeURIComponent(email)}`);
      } else {
        throw new Error(data.error || "Login failed");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "whatsapp", identifier: phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      setOtpSent(true);
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
        body: JSON.stringify({ type: "whatsapp", identifier: phone, code: otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid OTP");
      
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
    <div className="min-h-screen bg-background dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 blur-[150px] rounded-full pointer-events-none"></div>

      <Link href="/" className="absolute top-8 left-8 text-gray-500 hover:text-gray-900 dark:hover:text-primary-foreground flex items-center gap-2 transition-colors z-20 font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Showroom
      </Link>

      <div className="w-full max-w-md bg-white dark:bg-[#151517] border border-gray-200 dark:border-slate-800 rounded-3xl p-10 shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8 text-center">
           <div className="bg-black border border-gray-800 p-3 sm:p-4 rounded-xl sm:rounded-2xl mb-6 shadow-lg max-w-full w-full flex items-center justify-center overflow-hidden">
              <Logo className="max-w-full h-auto max-h-12 !text-white" />
           </div>
           <h1 className="text-2xl md:text-3xl font-semibold font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Welcome Back</h1>
           <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
             Log in to your Honda account to continue.
           </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-100/50 dark:bg-red-500/10 border border-red-500/50 rounded-xl text-red-600 dark:text-red-400 text-sm text-center font-semibold">
            {error}
          </div>
        )}

        {method === "password" && (
          <form onSubmit={handlePasswordLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email / Username</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Password</label>
                <Link href="#" className="text-xs text-primary hover:text-primary-hover font-bold transition-colors">Forgot Password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button disabled={loading} type="submit" className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-bold text-base transition-all shadow-lg shadow-primary/20 mt-4 disabled:opacity-50">
               {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        )}

        {method === "whatsapp" && !otpSent && (
          <form onSubmit={handleRequestOtp} className="space-y-5">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">WhatsApp Number</label>
                <button type="button" onClick={() => setMethod("password")} className="text-xs text-gray-500 hover:text-gray-800 dark:hover:text-white font-bold transition-colors">Use Password</button>
              </div>
              <div className="flex shadow-sm rounded-xl">
                 <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 border border-r-0 border-gray-200 dark:border-gray-700 rounded-l-xl px-4 text-gray-700 dark:text-gray-300 font-bold shrink-0">
                   +977
                 </div>
                 <div className="relative w-full">
                   <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                   <input 
                     type="tel" 
                     required
                     value={phone}
                     onChange={e => setPhone(e.target.value)}
                     className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-r-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                     placeholder="98XXXXXXX"
                   />
                 </div>
               </div>
            </div>

            <button disabled={loading} type="submit" className="w-full bg-[#25D366] hover:bg-[#1fad53] text-white py-3.5 rounded-xl font-bold text-base transition-all shadow-lg shadow-[#25D366]/20 mt-4 disabled:opacity-50">
               {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {method === "whatsapp" && otpSent && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <div className="flex justify-between items-center mb-2">
                 <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Enter OTP</label>
                 <button type="button" onClick={() => setOtpSent(false)} className="text-xs text-primary hover:text-primary-hover font-bold transition-colors">Change Number</button>
              </div>
              <div className="relative">
                 <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                 <input 
                   type="text"
                   required 
                   maxLength={6}
                   value={otp}
                   onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                   className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-12 pr-4 text-center tracking-widest text-xl md:text-2xl font-semibold font-bold text-gray-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-300"
                   placeholder="------"
                 />
              </div>
            </div>

            <button disabled={loading} type="submit" className="w-full bg-[#25D366] hover:bg-[#1fad53] text-white py-3.5 rounded-xl font-bold text-base transition-all shadow-lg shadow-[#25D366]/20 mt-4 disabled:opacity-50 flex items-center justify-center gap-2">
               {loading ? "Verifying..." : "Verify"} <ShieldCheck className="w-5 h-5" />
            </button>
          </form>
        )}

        {method === "password" && (
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-[#151517] text-gray-500 font-bold uppercase tracking-wide text-xs">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
               <a href="/api/auth/google" className="bg-gray-50 hover:bg-gray-100 dark:bg-black/40 dark:hover:bg-black/60 border border-gray-200 dark:border-gray-700 py-3 rounded-xl flex justify-center items-center gap-2 transition-colors text-sm font-bold text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Google
               </a>
               <button 
                 onClick={() => setMethod("whatsapp")}
                 className="bg-gray-50 hover:bg-gray-100 dark:bg-black/40 dark:hover:bg-black/60 border border-gray-200 dark:border-gray-700 py-3 rounded-xl flex justify-center items-center gap-2 transition-colors text-sm font-bold text-gray-700 dark:text-gray-300"
               >
                  <MessageCircle className="w-5 h-5 text-green-500" /> WhatsApp
               </button>
            </div>
          </div>
        )}

        <p className="mt-8 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
          Don't have an account? <Link href="/signup" className="text-primary font-extrabold hover:underline">Register Now</Link>
        </p>
      </div>
    </div>
  );
}
