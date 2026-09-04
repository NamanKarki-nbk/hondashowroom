"use client";

import React from 'react';

export default function PrintButtons() {
  return (
    <div className="mb-4 print:hidden flex gap-4 w-[210mm]">
      <button 
        onClick={() => window.print()}
        className="flex-1 bg-black text-white font-bold py-3 rounded-xl shadow-lg uppercase tracking-widest hover:bg-gray-800 transition-colors"
      >
        Print Receipt
      </button>
      <button 
        onClick={() => window.history.back()}
        className="flex-1 bg-white text-black border-2 border-black font-bold py-3 rounded-xl shadow-sm uppercase tracking-widest hover:bg-gray-50 transition-colors"
      >
        Go Back
      </button>
    </div>
  );
}
