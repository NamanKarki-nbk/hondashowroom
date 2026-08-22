"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 px-4">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-8 max-w-md w-full text-center shadow-xl">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
          <AlertTriangle className="w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-3">
          Something went wrong
        </h1>
        
        <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">
          We encountered an unexpected error. Our team has been notified.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-lg shadow-red-500/20"
          >
            <RefreshCcw className="w-5 h-5" /> Try Again
          </button>
          
          <Link href="/">
            <button className="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-900 dark:text-white py-4 rounded-xl font-bold uppercase tracking-wider transition-colors">
              <Home className="w-5 h-5" /> Return Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
