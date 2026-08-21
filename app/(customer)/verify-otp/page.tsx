"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const identifier = searchParams.get('identifier') || ''; // phone or email

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      setSuccess('Verification successful! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, type: identifier.includes('@') ? 'email' : 'whatsapp' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
      setSuccess('OTP sent successfully. Please check your messages.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 pt-28">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <ShieldCheck className="w-16 h-16 text-[#CC0000]" />
        </div>
        <h2 className="mt-6 text-center text-2xl md:text-3xl font-semibold md:text-4xl font-bold font-extrabold text-foreground uppercase tracking-tight">
          Verify Your Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          We need to verify your identity. Please request and enter the OTP.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200 dark:border-slate-800">
          <form className="space-y-6" onSubmit={handleVerify}>
            
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 text-sm font-medium rounded">
                {error}
              </div>
            )}
            
            {success && (
              <div className="p-3 bg-green-100 border border-green-400 text-green-700 text-sm font-medium rounded">
                {success}
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Registered Contact (Email / Phone)
                </label>
              </div>
              <div className="mt-1 flex gap-2">
                <input
                  id="identifier"
                  type="text"
                  readOnly
                  value={identifier}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-gray-100 dark:bg-gray-800 text-gray-500 sm:text-sm cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={loading || !identifier}
                  className="whitespace-nowrap px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[#CC0000] bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40"
                >
                  Send OTP
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                6-Digit OTP
              </label>
              <div className="mt-1">
                <input
                  id="otp"
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#CC0000] focus:border-[#CC0000] sm:text-sm bg-white dark:bg-black text-center text-2xl md:text-3xl font-semibold tracking-widest"
                  placeholder="------"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#CC0000] hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CC0000] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
