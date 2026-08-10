"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Key, Mail, ShieldCheck, Fingerprint, FileText } from "lucide-react";
import Logo from "@/components/Logo";

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<"email" | "govId">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy login action
    // In a real application, you'd verify the email/password or documentNumber here
    window.location.href = "/admin/dashboard";
  };

  return (
    <div className="min-h-screen bg-[#f3ebdd] dark:bg-[#0B0B0C] flex flex-col items-center justify-center p-6 selection:bg-[#c1291A] selection:text-[#f3ebdd] relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#c1291A]/10 blur-[150px] rounded-full pointer-events-none"></div>

      <Link href="/" className="absolute top-8 left-8 text-gray-400 hover:text-[#f3ebdd] flex items-center gap-2 transition-colors z-20">
        <ArrowLeft className="w-4 h-4" /> Back to Showroom
      </Link>

      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800 rounded-3xl p-10 backdrop-blur-md shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-10 text-center">
           <div className="bg-black border border-slate-700 p-4 rounded-2xl mb-6 shadow-[0_0_20px_rgba(230,0,18,0.2)]">
              <Logo className="w-12 h-12" />
           </div>
           <h1 className="text-2xl font-bold text-[#f3ebdd] mb-2">Society Enterprises</h1>
           <p className="text-sm text-gray-400">Sign in to your customer or admin account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {loginMethod === "email" ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                <div className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                   <input 
                     type="email" 
                     required
                     value={email}
                     onChange={e => setEmail(e.target.value)}
                     className="w-full bg-black/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-[#f3ebdd] focus:border-[#c1291A] focus:ring-1 focus:ring-[#c1291A] outline-none transition-all placeholder:text-slate-600"
                     placeholder="name@example.com"
                   />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                   <label className="block text-sm font-medium text-gray-400">Password</label>
                   <Link href="#" className="text-xs text-[#c1291A] hover:text-[#ff3344] font-medium transition-colors">Forgot Password?</Link>
                </div>
                <div className="relative">
                   <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                   <input 
                     type="password"
                     required 
                     value={password}
                     onChange={e => setPassword(e.target.value)}
                     className="w-full bg-black/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-[#f3ebdd] focus:border-[#c1291A] focus:ring-1 focus:ring-[#c1291A] outline-none transition-all placeholder:text-slate-600"
                     placeholder="••••••••"
                   />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Government ID Number</label>
              <div className="relative">
                 <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                 <input 
                   type="text" 
                   required
                   value={documentNumber}
                   onChange={e => setDocumentNumber(e.target.value)}
                   className="w-full bg-black/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-[#f3ebdd] focus:border-[#c1291A] focus:ring-1 focus:ring-[#c1291A] outline-none transition-all placeholder:text-slate-600"
                   placeholder="Enter your Document Number"
                 />
              </div>
              <p className="mt-2 text-xs text-gray-500">Enter your registered Aadhar, PAN, or other Govt. ID number.</p>
            </div>
          )}

          <button type="submit" className="w-full bg-[#c1291A] hover:bg-[#a02014] text-[#f3ebdd] py-3.5 rounded-xl font-bold text-lg transition-all shadow-lg shadow-[#c1291A]/20 mt-4 flex justify-center items-center gap-2">
             Sign In <ArrowLeft className="w-4 h-4 rotate-180" />
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-4">
           <div className="h-px bg-slate-800 flex-1"></div>
           <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Or Login With</span>
           <div className="h-px bg-slate-800 flex-1"></div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
           {loginMethod === "email" ? (
             <button 
               onClick={() => setLoginMethod("govId")}
               className="bg-[#f3ebdd]/5 hover:bg-[#f3ebdd]/10 border border-slate-700 py-3 rounded-xl flex justify-center items-center gap-2 transition-colors text-sm font-medium text-[#f3ebdd]"
             >
                <ShieldCheck className="w-4 h-4 text-blue-400" /> Govt. ID
             </button>
           ) : (
             <button 
               onClick={() => setLoginMethod("email")}
               className="bg-[#f3ebdd]/5 hover:bg-[#f3ebdd]/10 border border-slate-700 py-3 rounded-xl flex justify-center items-center gap-2 transition-colors text-sm font-medium text-[#f3ebdd]"
             >
                <Mail className="w-4 h-4 text-blue-400" /> Email
             </button>
           )}
           <button className="bg-[#f3ebdd]/5 hover:bg-[#f3ebdd]/10 border border-slate-700 py-3 rounded-xl flex justify-center items-center gap-2 transition-colors text-sm font-medium text-[#f3ebdd]">
              <Fingerprint className="w-4 h-4 text-green-400" /> Biometric
           </button>
        </div>
      </div>
      
      <p className="mt-12 text-sm text-gray-600 relative z-10">
        Don't have an account? <Link href="#" className="text-gray-900 dark:text-[#f3ebdd] hover:text-[#c1291A] dark:hover:text-[#c1291A] font-semibold transition-colors">Create one</Link>
      </p>
    </div>
  );
}

