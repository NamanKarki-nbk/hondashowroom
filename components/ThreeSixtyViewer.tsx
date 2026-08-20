"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface ThreeSixtyViewerProps {
  vehicleSlug?: string;
  fallbackImageUrl?: string;
  threeSixty?: { localPath: string; totalFrames: number } | null;
}

export default function ThreeSixtyViewer({ vehicleSlug = "dio-125", fallbackImageUrl, threeSixty }: ThreeSixtyViewerProps) {
  const [currentFrame, setCurrentFrame] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);
  
  const totalFrames = threeSixty?.totalFrames || 34; // Based on config or fallback
  const startX = useRef(0);

  // Helper to get image URL for a frame
  const getImageUrl = (frame: number) => {
    if (threeSixty) {
      return `${threeSixty.localPath}/frame-${frame}.png`;
    }
    // Fallback to older local 360 images if they exist
    return `/360/${vehicleSlug}/frame-${frame}.png`;
  };

  // Preload images
  useEffect(() => {
    setImageError(false);
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = getImageUrl(i);
      if (i === 1) {
        img.onerror = () => setImageError(true);
      }
    }
  }, [vehicleSlug, threeSixty, totalFrames]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startX.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - startX.current;
    
    // Change frame every 10px of drag
    if (Math.abs(diff) > 10) {
      let nextFrame = currentFrame - Math.sign(diff);
      if (nextFrame > totalFrames) nextFrame = 1;
      if (nextFrame < 1) nextFrame = totalFrames;
      
      setCurrentFrame(nextFrame);
      startX.current = e.clientX; // Reset start x for next 10px
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div 
      className="w-full h-[400px] lg:h-[600px] xl:h-[750px] relative bg-background rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col items-center justify-center"
    >
      <div 
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
        style={{ touchAction: "none" }} // Prevent scroll while dragging
      >
        {imageError ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img 
            src={fallbackImageUrl || '/models/hero-1.png'} 
            alt="Vehicle Image" 
            className="w-full h-full object-contain pointer-events-none filter drop-shadow-2xl"
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img 
            src={getImageUrl(currentFrame)} 
            alt="Honda 360 View" 
            className="w-full h-full object-contain pointer-events-none"
          />
        )}
      </div>
      {!imageError && (
        <div className="absolute bottom-6 bg-black/60 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md pointer-events-none">
          Drag to Rotate 360°
        </div>
      )}
    </div>
  );
}
