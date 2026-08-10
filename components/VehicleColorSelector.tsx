import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

interface VehicleColorSelectorProps {
  vehicleName: string;
  colors: { name: string; hex: string }[];
  imageUrl?: string;
}

export default function VehicleColorSelector({ vehicleName, colors, imageUrl }: VehicleColorSelectorProps) {
  const [activeColorIndex, setActiveColorIndex] = useState(0);

  if (!colors || colors.length === 0) return null;

  return (
    <section id="colors" className="py-24 px-6 bg-gray-900 text-[#f3ebdd] relative overflow-hidden min-h-screen flex items-center">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
      <div className="max-w-[1600px] mx-auto w-full relative z-10">
        <div className="text-center mb-16 xl:mb-24">
          <h2 className="text-4xl md:text-5xl xl:text-6xl font-extrabold uppercase tracking-tight">Select Color</h2>
          <p className="text-gray-400 mt-4 text-lg xl:text-2xl">Personalize your {vehicleName}</p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-16 xl:gap-32">
          {/* Interactive Vehicle Image */}
          <div className="relative w-full max-w-lg xl:max-w-3xl 2xl:max-w-4xl h-[400px] xl:h-[600px] flex items-center justify-center">
            {/* Color-tinted background glow behind the bike */}
            <motion.div 
              className="absolute inset-0 rounded-full blur-[100px] xl:blur-[150px] opacity-20"
              animate={{ backgroundColor: colors[activeColorIndex].hex }}
              transition={{ duration: 0.5 }}
            ></motion.div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeColorIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full h-full"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={imageUrl || '/models/hero-1.png'} 
                  alt={`${vehicleName} in ${colors[activeColorIndex].name}`}
                  className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                  style={{ 
                    filter: activeColorIndex === 0 ? 'none' : `hue-rotate(${activeColorIndex * 85}deg) saturate(${activeColorIndex % 2 === 0 ? 1.5 : 1})`,
                    transition: 'filter 0.5s ease-in-out'
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Color Swatches */}
          <div className="flex flex-col items-center lg:items-start space-y-12 xl:space-y-16">
            <h3 className="text-3xl xl:text-5xl font-bold text-center lg:text-left min-h-[48px] xl:min-h-[64px]">
              {colors[activeColorIndex].name}
            </h3>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 xl:gap-8">
              {colors.map((color, idx) => (
                <button
                  key={color.name}
                  onClick={() => setActiveColorIndex(idx)}
                  className="relative group transition-transform hover:scale-110"
                  aria-label={`Select ${color.name}`}
                >
                  <div 
                    className={`w-12 h-12 xl:w-16 xl:h-16 rounded-full border-4 shadow-lg transition-colors flex items-center justify-center
                      ${activeColorIndex === idx ? 'border-[#f3ebdd]' : 'border-transparent group-hover:border-[#f3ebdd]/50'}
                    `}
                    style={{ backgroundColor: color.hex }}
                  >
                    {activeColorIndex === idx && (
                       <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <Check className={`w-6 h-6 xl:w-8 xl:h-8 ${color.hex.toLowerCase() === '#ffffff' || color.hex.toLowerCase() === '#eaeaea' ? 'text-black' : 'text-[#f3ebdd]'}`} />
                       </motion.div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
