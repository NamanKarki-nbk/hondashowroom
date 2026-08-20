"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
export interface Feature {
  title: string;
  description: string;
  image: string;
}
import Logo from "@/components/Logo";

interface Section {
  title: string;
  features: Feature[];
}

interface BigWingTechnologySectionProps {
  sections: Section[];
  threeSixty?: { localPath: string; totalFrames: number } | null;
  vehicleSlug?: string;
  vehicleName?: string;
}

export default function BigWingTechnologySection({ 
  sections, 
  threeSixty, 
  vehicleSlug = "hornet-2",
  vehicleName = "Hornet 2.0"
}: BigWingTechnologySectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress within this specific container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [currentFrame, setCurrentFrame] = useState(1);
  const [activeTitle, setActiveTitle] = useState(sections.length > 0 ? sections[0].title : "");
  const totalFrames = threeSixty?.totalFrames || 24;

  // Flatten features with gaps
  const flatFeatures: (Feature & { sectionTitle: string; absoluteSlot: number })[] = [];
  let currentSlot = 0;

  sections.forEach((section, sIndex) => {
    section.features.forEach((feature) => {
      flatFeatures.push({
        ...feature,
        sectionTitle: section.title,
        absoluteSlot: currentSlot
      });
      currentSlot++;
    });
    
    // Add 1 scroll gap after each section (except the last one)
    if (sIndex < sections.length - 1) {
      currentSlot += 1;
    }
  });

  const totalSlots = currentSlot > 0 ? currentSlot : 1;
  
  // Map scroll progress to frame number and active title
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Reverse rotation direction
    let frame = totalFrames - Math.floor(latest * (totalFrames - 1));
    if (frame < 1) frame = 1;
    if (frame > totalFrames) frame = totalFrames;
    setCurrentFrame(frame);

    // Determine active title based on scroll progress
    const currentAbsoluteSlot = Math.floor(latest * totalSlots);
    const activeFeature = flatFeatures.find(f => f.absoluteSlot === currentAbsoluteSlot || f.absoluteSlot === currentAbsoluteSlot - 1);
    
    if (activeFeature) {
      setActiveTitle(activeFeature.sectionTitle);
    } else if (latest < 0.1 && sections.length > 0) {
      setActiveTitle(sections[0].title);
    } else if (latest > 0.9 && sections.length > 0) {
      setActiveTitle(sections[sections.length - 1].title);
    }
  });

  // Calculate image path
  const imagePath = threeSixty 
    ? `${threeSixty.localPath}/frame-${currentFrame}.png`
    : `/models/${vehicleSlug}.png`;

  // Preload images to avoid flickering during fast scrolling
  useEffect(() => {
    if (!threeSixty) return;
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = `${threeSixty.localPath}/frame-${i}.png`;
    }
  }, [threeSixty, totalFrames]);

  // If there are no sections, just return empty
  if (!sections || sections.length === 0) return null;

  return (
    // Height is dependent on total slots so we have enough scroll space
    <div ref={containerRef} style={{ height: `${(totalSlots + 1.5) * 100}vh` }} className="relative bg-[#050505] w-full">
      
      {/* Sticky Container - This stays fixed in the viewport while we scroll the parent */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#0a0a0a]">
        
        {/* Subtle Noise Texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
        
        {/* Title Transitions */}
        <motion.div 
          style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0]) }}
          className="absolute top-8 left-8 md:top-12 md:left-12 z-20 flex items-center gap-4"
        >
          <div className="bg-[#111111] p-2 flex flex-col items-center justify-center w-14 h-14">
             <Logo className="w-8 h-8" />
             <div className="text-primary-foreground text-[8px] font-bold uppercase tracking-wider mt-1">Honda</div>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-primary-foreground">{vehicleName}</h2>
        </motion.div>

        <motion.div 
          style={{ opacity: useTransform(scrollYProgress, [0.05, 0.1], [0, 1]) }}
          className="absolute top-8 left-8 md:top-12 md:left-12 z-20"
        >
          <h2 className="text-3xl md:text-5xl font-black text-primary-foreground">{activeTitle}</h2>
        </motion.div>

        {/* Concentric Circles behind the bike */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] z-0">
          <div className="w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full border-[1.5px] border-background absolute"></div>
          <div className="w-[450px] h-[450px] md:w-[650px] md:h-[650px] rounded-full border-[1.5px] border-background absolute"></div>
          <div className="w-[600px] h-[600px] md:w-[850px] md:h-[850px] rounded-full border-[1.5px] border-background absolute"></div>
          <div className="w-[750px] h-[750px] md:w-[1050px] md:h-[1050px] rounded-full border-[1.5px] border-background absolute"></div>
        </div>

        {/* Feature Backgrounds layer */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {flatFeatures.map((feature, index) => {
            const start = feature.absoluteSlot / totalSlots;
            const mid = (feature.absoluteSlot + 0.5) / totalSlots;
            const end = (feature.absoluteSlot + 1) / totalSlots;

            return (
              <FeatureBackground 
                key={`bg-${index}`}
                image={feature.image}
                progress={scrollYProgress}
                start={start}
                mid={mid}
                end={end}
                sectionTitle={feature.sectionTitle}
              />
            );
          })}
        </div>

        {/* 360 Motorcycle Image */}
        <div className="relative z-10 w-full max-w-4xl px-4 flex items-center justify-center pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={imagePath} 
            alt="360 view" 
            className="w-full h-auto object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
          />
        </div>

        {/* Feature Text layer */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="max-w-7xl mx-auto h-full relative">
            {flatFeatures.map((feature, index) => {
              const start = feature.absoluteSlot / totalSlots;
              const mid = (feature.absoluteSlot + 0.5) / totalSlots;
              const end = (feature.absoluteSlot + 1) / totalSlots;

              return (
                <FeatureCard 
                  key={index}
                  feature={feature}
                  index={index}
                  progress={scrollYProgress}
                  start={start}
                  mid={mid}
                  end={end}
                />
              );
            })}
          </div>
        </div>

        {/* Action Button at bottom */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-30 pointer-events-auto">
          <button className="bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-3 rounded-full font-bold text-sm shadow-[0_0_20px_rgba(237,27,46,0.5)] transition-all">
            More on {activeTitle.toLowerCase()}
          </button>
        </div>

      </div>
    </div>
  );
}

// Sub-component for individual feature background
function FeatureBackground({ 
  image, 
  progress, 
  start, 
  mid, 
  end,
  sectionTitle
}: { 
  image: string; 
  progress: any; 
  start: number; 
  mid: number; 
  end: number;
  sectionTitle: string;
}) {
  // Very low opacity, fades in and out with the feature text
  const opacity = useTransform(progress, [start, mid, end], [0, 0.15, 0]);
  
  if (!image || sectionTitle !== "Design") return null;

  return (
    <motion.div style={{ opacity }} className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt="Background" className="w-full h-full object-cover opacity-80" />
    </motion.div>
  );
}

// Sub-component for individual feature text animations
function FeatureCard({ 
  feature, 
  index, 
  progress, 
  start, 
  mid, 
  end 
}: { 
  feature: Feature & { sectionTitle: string; absoluteSlot: number }; 
  index: number; 
  progress: any; 
  start: number; 
  mid: number; 
  end: number;
}) {
  // Opacity: fade in quickly, stay fully visible, then fade out
  const opacity = useTransform(
    progress, 
    [
      start, 
      start + (mid - start) * 0.3, 
      end - (end - mid) * 0.3, 
      end
    ], 
    [0, 1, 1, 0]
  );
  
  // Y-axis translation for a bottom-up reveal effect
  const y = useTransform(progress, [start, mid, end], ["100vh", "0vh", "-100vh"]);

  // Alternate positions (left, right)
  const isLeft = index % 2 === 0;

  const showImageCard = feature.sectionTitle === "Technology";

  return (
    <motion.div 
      style={{ opacity, y }}
      className={`absolute ${showImageCard ? 'top-1/3 md:top-1/4 lg:top-[20%]' : 'top-1/2 md:top-1/3'} ${isLeft ? 'left-4 md:left-8 lg:left-12 xl:left-20' : 'right-4 md:right-8 lg:right-12 xl:right-20'} ${showImageCard ? 'w-56 md:w-72 lg:w-96' : 'w-56 md:w-80 lg:w-[400px]'} pointer-events-auto`}
    >
      <div className={`bg-transparent ${showImageCard ? 'group cursor-pointer' : ''}`}>
        {showImageCard && feature.image && (
          <div className="w-full h-40 md:h-48 lg:h-64 overflow-hidden mb-4 lg:mb-6 relative bg-transparent rounded-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={feature.image} alt={feature.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
        )}
        <h3 className={`${showImageCard ? 'text-lg md:text-xl lg:text-3xl font-bold' : 'text-xl md:text-3xl lg:text-4xl font-black'} text-primary-foreground mb-2 lg:mb-3 leading-tight ${showImageCard ? '' : 'tracking-wide'}`}>{feature.title}</h3>
        <p className={`text-[#888888] ${showImageCard ? 'text-xs md:text-sm lg:text-base' : 'text-sm md:text-base lg:text-lg font-medium'} leading-relaxed`}>{feature.description}</p>
      </div>
    </motion.div>
  );
}
