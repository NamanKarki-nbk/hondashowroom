"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";

const ACCESSORIES = [
  {
    id: 1,
    name: "Premium Seat Cover",
    price: "Rs. 850",
    image: "/accessories/seat-cover.png",
    tag: "Bestseller"
  },
  {
    id: 2,
    name: "Grip Cover",
    price: "Rs. 150",
    image: "/accessories/grip-cover.png",
    tag: "Essential"
  },
  {
    id: 3,
    name: "Floor Mat",
    price: "Rs. 350",
    image: "/accessories/floor-mat.png",
    tag: "Protection"
  },
  {
    id: 4,
    name: "Body Cover",
    price: "Rs. 450",
    image: "/accessories/body-cover.png",
    tag: "Weatherproof"
  }
];

export default function AccessoriesSection({ accessories = [] }: { accessories?: any[] }) {
  const displayAccessories = accessories && accessories.length > 0 
    ? accessories.map(a => ({
        id: a.id,
        name: a.name,
        price: `Rs. ${a.price.toLocaleString('en-IN')}`,
        image: a.imageUrl,
        tag: a.category || "Accessory"
      }))
    : ACCESSORIES;

  return (
    <section className="py-24 w-full bg-gray-50/50 dark:bg-slate-950 transition-colors duration-300">
      <div className="px-4 sm:px-6 md:px-12 lg:px-16 mx-auto w-full max-w-[1600px]">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end mb-16 xl:mb-20 gap-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-5 py-2 mb-6 text-sm font-bold tracking-widest text-primary">
              <ShoppingBag className="w-4 h-4" />
              <span>Genuine Accessories</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-[1.1]">
              Explore <span className="text-primary">Accessories</span>
            </h2>
          </div>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
          {displayAccessories.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 border border-gray-200/60 dark:border-white/10 hover:border-primary/50 dark:hover:border-primary/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(239,68,68,0.15)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.02)] transition-all duration-500 flex flex-col items-center text-center h-full hover:-translate-y-2 cursor-pointer"
            >
              {/* Badge */}
              <div className="absolute top-6 left-6 md:top-8 md:left-8 z-10">
                 <span className="bg-white/90 dark:bg-black/50 backdrop-blur-md text-gray-900 dark:text-white border border-gray-100 dark:border-white/10 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                   {item.tag}
                 </span>
              </div>
              
              {/* Product Preview Frame */}
              <div className="h-48 xl:h-56 w-full flex items-center justify-center mb-8 relative mt-6">
                {/* Background glow effect on hover */}
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 rounded-full blur-2xl transition-colors duration-700 scale-75 group-hover:scale-100" />
                
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="max-h-full max-w-full object-contain relative z-10 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-700 drop-shadow-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200" fill="none"><rect width="200" height="200" rx="100" fill="%23f3f4f6" fill-opacity="0.1"/><path d="M100 130L65 80h70L100 130z" fill="%239ca3af" opacity="0.5"/></svg>';
                  }}
                />
              </div>
              
              {/* Product Info */}
              <div className="mt-auto w-full flex flex-col items-center">
                <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors tracking-tight line-clamp-1">{item.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 font-bold tracking-widest text-lg mb-6">{item.price}</p>
                
                {/* Action Button */}
                <button className="w-full flex items-center justify-center gap-2 bg-gray-200 dark:bg-white/20 border border-gray-300 dark:border-gray-600 group-hover:border-transparent group-hover:bg-primary text-gray-900 dark:text-white group-hover:text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all duration-300 shadow-sm group-hover:shadow-[0_4px_14px_0_rgba(239,68,68,0.39)]">
                  Add to Cart
                  <ShoppingBag className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View Catalog Button */}
        <div className="mt-16 flex justify-center">
          <Link href="/accessories" className="group flex items-center gap-4 text-gray-900 dark:text-white font-bold hover:text-primary dark:hover:text-primary transition-colors text-lg uppercase tracking-wider shrink-0 bg-white dark:bg-white/5 px-8 py-4 rounded-full border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md">
            <span>View Catalog</span>
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
