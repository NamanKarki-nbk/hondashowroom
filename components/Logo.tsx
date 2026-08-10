import React from 'react';

export default function Logo({ className = "h-8" }: { className?: string }) {
  // Strip hardcoded widths to prevent the horizontal logo from being squished
  const cleanClassName = className
    .replace(/w-\d+/g, '') 
    .replace('w-full', '')
    .trim();

  return (
    <img 
      src="/honda-logo.svg" 
      alt="Honda" 
      className={`w-auto object-contain ${cleanClassName || 'h-8'}`} 
    />
  );
}
