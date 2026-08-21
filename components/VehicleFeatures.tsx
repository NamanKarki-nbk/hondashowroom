import React from "react";
import { motion } from "framer-motion";

interface Feature {
  title: string;
  description: string;
  image: string;
}

export default function VehicleFeatures({ features }: { features: Feature[] }) {
  if (!features || features.length === 0) return null;

  return (
    <section id="features" className="py-24 px-6 bg-background  border-t border-gray-100 dark:border-slate-800 transition-colors duration-300 min-h-screen flex items-center">
      <div className="max-w-[1600px] mx-auto w-full">
        <div className="text-center mb-16 xl:mb-24">
          <h2 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold md:text-4xl font-bold md:text-5xl xl:text-6xl font-extrabold text-gray-900 dark:text-primary-foreground uppercase tracking-tight">Key Features</h2>
          <div className="w-24 xl:w-32 h-1 xl:h-2 bg-primary mx-auto mt-6 xl:mt-8 rounded-full"></div>
        </div>
        
        <div className="space-y-24 xl:space-y-32">
          {features.map((feature, idx) => (
             <div key={idx} className={`flex flex-col lg:flex-row items-center gap-12 xl:gap-24 ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="w-full lg:w-1/2">
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="aspect-video relative rounded-3xl overflow-hidden group shadow-2xl"
                  >
                     <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img src={feature.image} alt={feature.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  </motion.div>
                </div>
                <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 lg:px-12">
                   <motion.div
                      initial={{ opacity: 0, x: idx % 2 === 0 ? 30 : -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                   >
                     <h3 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold xl:text-5xl font-extrabold text-gray-900 dark:text-primary-foreground mb-6 leading-tight">{feature.title}</h3>
                     <p className="text-lg xl:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed">
                        {feature.description}
                     </p>
                   </motion.div>
                </div>
             </div>
          ))}
        </div>
      </div>
    </section>
  );
}
