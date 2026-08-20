"use client";

import React from "react";
import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="flex items-center gap-2 bg-[#B83227] hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-md transition-colors"
    >
      <Printer className="w-4 h-4" /> Print Document
    </button>
  );
}
