"use client";

import React, { useState, useRef, useEffect } from "react";
import { Check, RotateCw, Palette, Sparkles, Play, Pause, ChevronLeft, ChevronRight, Compass, MoveHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  image: string;
  fallbackImage: string;
  badge?: string;
}

const COLOR_OPTIONS: ColorOption[] = [
  {
    id: "red",
    name: "Sports Red",
    hex: "#C1291A",
    image: "/images/dio/dio-red.png",
    fallbackImage: "/inventory/honda-dio-bs6.png",
    badge: "Popular",
  },
  {
    id: "blue",
    name: "Matte Marvel Blue",
    hex: "#2563EB",
    image: "/images/dio/dio-blue.png",
    fallbackImage: "/inventory/honda-dio-bs6.png",
    badge: "New",
  },
  {
    id: "yellow",
    name: "Dazzle Yellow",
    hex: "#EAB308",
    image: "/images/dio/dio-yellow.png",
    fallbackImage: "/inventory/honda-dio-bs6.png",
    badge: "Gold Edition",
  },
  {
    id: "grey",
    name: "Matte Axis Grey",
    hex: "#4A4E53",
    image: "/images/dio/dio-grey.png",
    fallbackImage: "/inventory/honda-dio-bs6.png",
  },
  {
    id: "silver",
    name: "Platinum Silver",
    hex: "#94A3B8",
    image: "/images/dio/dio-silver.png",
    fallbackImage: "/inventory/honda-dio-bs6.png",
  },
];

// 360 Spin Frames (24 frames)
const TOTAL_360_FRAMES = 24;
const SPIN_FRAMES = Array.from({ length: TOTAL_360_FRAMES }, (_, i) => `/360/dio-bs6/frame-${i + 1}.png`);

interface DioColorSwitcherProps {
  onSelectColor?: (color: ColorOption) => void;
}

export default function DioColorSwitcher({ onSelectColor }: DioColorSwitcherProps) {
  const [viewMode, setViewMode] = useState<"color" | "360">("color");
  const [selectedColor, setSelectedColor] = useState<ColorOption>(COLOR_OPTIONS[0]);

  // 360 Spin State
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const isDragging = useRef<boolean>(false);
  const startX = useRef<number>(0);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleColorChange = (color: ColorOption) => {
    setSelectedColor(color);
    if (onSelectColor) {
      onSelectColor(color);
    }
  };

  // 360 Drag Controls
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (viewMode !== "360") return;
    isDragging.current = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    startX.current = clientX;
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current || viewMode !== "360") return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = clientX - startX.current;
    
    // Sensitivity tuning
    if (Math.abs(diff) > 10) {
      if (diff > 0) {
        setCurrentFrame((prev) => (prev + 1) % TOTAL_360_FRAMES);
      } else {
        setCurrentFrame((prev) => (prev - 1 + TOTAL_360_FRAMES) % TOTAL_360_FRAMES);
      }
      startX.current = clientX;
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // 360 Auto Play Toggle
  const toggleAutoPlay = () => {
    if (isPlaying) {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      playIntervalRef.current = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % TOTAL_360_FRAMES);
      }, 80);
    }
  };

  useEffect(() => {
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, []);

  return (
    <section 
      id="colors" 
      className="relative py-32 overflow-hidden bg-white dark:bg-[#09090b] transition-colors duration-500"
    >
      {/* Dynamic Background Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] blur-[120px] opacity-20 rounded-full transition-all duration-1000 ease-in-out pointer-events-none"
        style={{ 
          backgroundColor: viewMode === "color" ? selectedColor.hex : "#4b5563",
          transform: `translate(-50%, -50%) scale(${viewMode === "360" ? 1.2 : 1})`
        }}
      />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-black uppercase tracking-widest mb-6 backdrop-blur-md"
            >
              <Palette className="w-4 h-4 text-primary" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                Personalize & Explore
              </span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold md:text-4xl font-bold md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[1.1] text-foreground mb-4"
            >
              Signature <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-500">
                Color Palette
              </span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600 dark:text-gray-400 max-w-lg"
            >
              Select a shade that matches your personality or experience the Dio from every angle in our interactive 360° studio.
            </motion.p>
          </div>

          {/* Mode Toggles */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex bg-gray-100/80 dark:bg-white/5 p-1.5 rounded-full backdrop-blur-xl border border-black/5 dark:border-white/5 shrink-0"
          >
            <button
              onClick={() => {
                setViewMode("color");
                if (playIntervalRef.current) clearInterval(playIntervalRef.current);
                setIsPlaying(false);
              }}
              className={`relative px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                viewMode === "color" ? "text-white" : "text-gray-500 hover:text-foreground"
              }`}
            >
              {viewMode === "color" && (
                <motion.div 
                  layoutId="mode-pill"
                  className="absolute inset-0 bg-gray-900 dark:bg-white rounded-full shadow-lg"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className={`relative z-10 flex items-center gap-2 ${viewMode === "color" ? "text-white dark:text-black" : ""}`}>
                <Palette className="w-4 h-4" /> Colors
              </span>
            </button>
            <button
              onClick={() => setViewMode("360")}
              className={`relative px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                viewMode === "360" ? "text-white" : "text-gray-500 hover:text-foreground"
              }`}
            >
              {viewMode === "360" && (
                <motion.div 
                  layoutId="mode-pill"
                  className="absolute inset-0 bg-gray-900 dark:bg-white rounded-full shadow-lg"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className={`relative z-10 flex items-center gap-2 ${viewMode === "360" ? "text-white dark:text-black" : ""}`}>
                <RotateCw className="w-4 h-4" /> 360° View
              </span>
            </button>
          </motion.div>
        </div>

        {/* Main Display Area */}
        <div className="relative">
          {/* Main Stage */}
          <div 
            className="w-full h-[400px] md:h-[550px] lg:h-[650px] relative rounded-[2.5rem] bg-gradient-to-b from-gray-50 to-gray-200 dark:from-[#111] dark:to-[#0a0a0a] border border-white/20 dark:border-white/5 shadow-2xl overflow-hidden group"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
          >
            {/* Stage Lighting / Reflections */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-white/40 dark:bg-white/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/10 dark:from-black/40 to-transparent pointer-events-none" />

            {viewMode === "color" ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedColor.id}
                  initial={{ opacity: 0, scale: 0.9, x: 50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 1.05, x: -50 }}
                  transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center p-8 md:p-16 pointer-events-none"
                >
                  <ImageWithFallback
                    src={selectedColor.image}
                    fallbackSrc={selectedColor.fallbackImage}
                    alt={`Honda Dio in ${selectedColor.name}`}
                    className="w-full h-full object-contain filter drop-shadow-[0_30px_30px_rgba(0,0,0,0.4)]"
                  />
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className={`absolute inset-0 flex flex-col items-center justify-center p-8 md:p-16 ${isDragging.current ? 'cursor-grabbing' : 'cursor-grab'}`}>
                <ImageWithFallback
                  src={SPIN_FRAMES[currentFrame]}
                  fallbackSrc="/inventory/honda-dio-bs6.png"
                  alt={`Honda Dio 360 view frame ${currentFrame}`}
                  className="w-full h-full object-contain filter drop-shadow-[0_30px_30px_rgba(0,0,0,0.4)] select-none"
                />
                
                {/* 360 Drag Indicator Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  {!isDragging.current && !isPlaying && (
                    <div className="bg-black/50 backdrop-blur-md text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl">
                      <MoveHorizontal className="w-5 h-5 animate-pulse" />
                      <span className="font-bold tracking-widest uppercase text-sm">Drag to rotate</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Ground Shadow underneath the scooter */}
            <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-2/3 md:w-1/2 h-8 bg-black/30 dark:bg-black/80 blur-2xl rounded-[100%] pointer-events-none" />

            {/* Floating Details Card (Color Mode Only) */}
            {viewMode === "color" && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={`detail-${selectedColor.id}`}
                className="absolute top-6 left-6 md:top-10 md:left-10 bg-white/80 dark:bg-black/50 backdrop-blur-xl border border-white/20 dark:border-white/10 p-5 rounded-3xl shadow-xl max-w-[200px] md:max-w-[240px]"
              >
                {selectedColor.badge && (
                  <span className="inline-block px-2.5 py-1 bg-primary/10 text-primary dark:text-red-400 text-[10px] font-black uppercase tracking-wider rounded-lg mb-2">
                    {selectedColor.badge}
                  </span>
                )}
                <h4 className="text-xl md:text-2xl font-semibold md:text-2xl font-black text-foreground leading-tight mb-1">
                  {selectedColor.name}
                </h4>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">
                  Official Paint
                </p>
              </motion.div>
            )}

            {/* 360 Play Controls */}
            {viewMode === "360" && (
              <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/80 dark:bg-black/60 backdrop-blur-xl p-2 rounded-full border border-white/20 dark:border-white/10 shadow-2xl z-20">
                <button
                  onClick={() => setCurrentFrame((prev) => (prev - 1 + TOTAL_360_FRAMES) % TOTAL_360_FRAMES)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100/50 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-foreground transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={toggleAutoPlay}
                  className="px-6 h-10 rounded-full bg-foreground text-background text-xs font-black uppercase flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? "Pause" : "Auto Spin"}</span>
                </button>
                <button
                  onClick={() => setCurrentFrame((prev) => (prev + 1) % TOTAL_360_FRAMES)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100/50 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-foreground transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Color Selector Drawer (Bottom) */}
          <div className="mt-8">
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {COLOR_OPTIONS.map((color) => {
                const isSelected = selectedColor.id === color.id && viewMode === "color";
                
                return (
                  <button
                    key={color.id}
                    onClick={() => {
                      setViewMode("color");
                      handleColorChange(color);
                    }}
                    className={`group relative flex flex-col items-center gap-3 transition-all duration-300 ${
                      !isSelected && viewMode === "color" ? "opacity-60 hover:opacity-100" : ""
                    }`}
                  >
                    {/* Swatch Ring */}
                    <div className={`relative p-1 rounded-full transition-all duration-500 ${
                      isSelected 
                        ? "border-2 border-primary scale-110 shadow-lg shadow-primary/20" 
                        : "border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-700"
                    }`}>
                      <div 
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-black/10 dark:border-white/10 shadow-inner overflow-hidden flex items-center justify-center relative"
                        style={{ backgroundColor: color.hex }}
                      >
                        {/* Metallic highlight effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/40 pointer-events-none" />
                        
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                            >
                              <Check className={`w-5 h-5 ${color.hex === "#F8FAFC" ? "text-gray-900" : "text-white"}`} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    
                    {/* Tooltip style label */}
                    <span className={`text-xs md:text-sm font-bold transition-all duration-300 ${
                      isSelected ? "text-primary translate-y-0" : "text-gray-500 translate-y-1 group-hover:text-foreground"
                    }`}>
                      {color.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
