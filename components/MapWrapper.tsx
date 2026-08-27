"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const InteractiveMap = dynamic(() => import("./InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gray-100 dark:bg-slate-800 rounded-2xl">
      <div className="flex flex-col items-center text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-[#CC0000] mb-2" />
        <p className="font-semibold text-sm uppercase tracking-wider">Loading Map...</p>
      </div>
    </div>
  ),
});

export default InteractiveMap;
