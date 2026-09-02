import React from "react";

export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white text-black print:m-0 print:p-0 min-h-screen">
      {children}
    </div>
  );
}
