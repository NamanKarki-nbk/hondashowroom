"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import Logo from "@/components/Logo";

function ForgotPasswordContent() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, origin: window.location.origin }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to process request");
      }
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-white dark:bg-black">
      {/* Background patterns similar to login */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gray-200/20 dark:bg-zinc-800/20 rounded-full blur-3xl opacity-50 translate-y-1/3 -translate-x-1/3"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] dark:opacity-[0.05]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/80 dark:bg-black/50 backdrop-blur-2xl border border-white/20 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.05)] rounded-3xl p-8 md:p-10">
          <div className="flex justify-center mb-8 relative">
            <div className="absolute -inset-4 bg-primary/5 blur-xl rounded-full"></div>
            <div className="relative">
              <Logo />
            </div>
          </div>
          
          {success ? (
            <div className="text-center animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Check your email</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                If an account exists for <span className="font-bold text-gray-900 dark:text-white">{email}</span>, we have sent a password reset link.
              </p>
              <Link href="/login" className="block w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white py-3.5 rounded-xl font-bold text-base transition-all text-center">
                Return to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-2">Forgot Password?</h1>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  No worries, we'll send you reset instructions.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl flex items-start gap-3 animate-in shake duration-300">
                  <div className="p-1 bg-rose-100 dark:bg-rose-500/20 rounded-lg shrink-0 mt-0.5">
                     <div className="w-3 h-3 bg-rose-600 dark:bg-rose-400 rounded-full"></div>
                  </div>
                  <p className="text-sm font-bold text-rose-800 dark:text-rose-300">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
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

                <button disabled={loading} type="submit" className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-bold text-base transition-all shadow-lg shadow-primary/20 mt-4 disabled:opacity-50">
                   {loading ? "Sending link..." : "Reset Password"}
                </button>
              </form>

              <div className="mt-8 text-center border-t border-gray-100 dark:border-gray-800 pt-6">
                <Link href="/login" className="inline-flex items-center justify-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to log in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-black" />}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
