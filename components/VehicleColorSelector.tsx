import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Star } from "lucide-react";

export interface VehicleColorSelectorProps {
  vehicleName: string;
  colors: { 
    name: string; 
    hexCode?: string; 
    hex?: string; // fallback
    imageUrl?: string | null; 
    finishType?: string | null; 
    isPopular?: boolean 
  }[];
  imageUrl?: string;
}

export default function VehicleColorSelector({ vehicleName, colors, imageUrl }: VehicleColorSelectorProps) {
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [hoveredColorIndex, setHoveredColorIndex] = useState<number | null>(null);

  if (!colors || colors.length === 0) return null;

  const currentIndex = hoveredColorIndex !== null ? hoveredColorIndex : activeColorIndex;
  const currentColor = colors[currentIndex];
  // Support both hex and hexCode properties (since backend provides hexCode, but mock provides hex)
  const currentHex = currentColor.hexCode || currentColor.hex || "#ffffff";
  const activeColorObj = colors[activeColorIndex];

  return (
    <section id="colors" className="py-24 px-6 bg-[#09090B] text-primary-foreground relative min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-500">
      {/* Ambient background glow matching the active or hovered color */}
      <motion.div 
        className="absolute inset-0 opacity-15"
        animate={{ 
          background: `radial-gradient(circle at 50% 50%, ${currentHex} 0%, transparent 60%)` 
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 w-full relative z-10 flex flex-col items-center">
        <div className="text-center mb-10 w-full">
          <h2 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold md:text-4xl font-bold md:text-5xl font-extrabold uppercase tracking-tight text-white drop-shadow-md">Select Color</h2>
          <p className="text-gray-400 mt-2 text-lg">Personalize your {vehicleName}</p>
        </div>

        {/* Glowing Card Container */}
        <motion.div 
          className="relative w-full max-w-4xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col items-center"
          animate={{
            boxShadow: `0 25px 50px -12px ${currentHex}40, 0 0 40px ${currentHex}20 inset`
          }}
          transition={{ duration: 0.5 }}
        >
          {/* Header section with Badges */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-center mb-8 min-h-[40px]">
            <h3 className="text-2xl md:text-3xl font-semibold md:text-3xl font-bold text-white tracking-wide">
              {activeColorObj.name}
            </h3>
            <div className="flex gap-3 mt-4 sm:mt-0">
              {activeColorObj.finishType && (
                <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                  {activeColorObj.finishType}
                </span>
              )}
              {activeColorObj.isPopular && (
                <span className="px-3 py-1 bg-gradient-to-r from-red-600 to-orange-500 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-red-500/30">
                  <Star className="w-3 h-3 fill-white" /> Popular
                </span>
              )}
            </div>
          </div>

          {/* Vehicle Image Container */}
          <div className="relative w-full h-[350px] md:h-[500px] flex items-center justify-center mb-10">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeColorIndex}
                src={activeColorObj.imageUrl || imageUrl || '/models/hero-1.png'}
                alt={`${vehicleName} in ${activeColorObj.name}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                style={
                  activeColorObj.imageUrl 
                    ? undefined 
                    : { 
                        filter: activeColorIndex === 0 ? 'none' : `hue-rotate(${activeColorIndex * 85}deg) saturate(${activeColorIndex % 2 === 0 ? 1.5 : 1})`,
                      }
                }
              />
            </AnimatePresence>
          </div>

          {/* Bottom Dot Switcher */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 bg-black/50 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
            {colors.map((color, idx) => {
              const hex = color.hexCode || color.hex || "#fff";
              const isActive = activeColorIndex === idx;
              return (
                <button
                  key={color.name}
                  onClick={() => setActiveColorIndex(idx)}
                  onMouseEnter={() => setHoveredColorIndex(idx)}
                  onMouseLeave={() => setHoveredColorIndex(null)}
                  className="relative group focus:outline-none"
                  aria-label={`Select ${color.name}`}
                >
                  {/* Active Ring */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeColorRing"
                      className="absolute -inset-2 rounded-full border-2 opacity-80"
                      style={{ borderColor: hex }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  {/* Color Dot */}
                  <div 
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg transition-transform duration-300 flex items-center justify-center z-10 relative
                      ${isActive ? 'scale-110' : 'scale-100 group-hover:scale-110'}
                    `}
                    style={{ 
                      backgroundColor: hex,
                      boxShadow: isActive ? `0 0 20px ${hex}80` : `0 4px 10px rgba(0,0,0,0.5)`
                    }}
                  >
                    {isActive && (
                       <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}>
                          <Check className={`w-5 h-5 ${hex.toLowerCase() === '#ffffff' || hex.toLowerCase() === '#eaeaea' ? 'text-black' : 'text-white'}`} />
                       </motion.div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
