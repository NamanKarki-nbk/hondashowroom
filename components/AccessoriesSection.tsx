"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ChevronRight } from "lucide-react";
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

export default function AccessoriesSection() {
  return (
    <section className="py-24 px-4 sm:px-6 md:px-12 lg:px-16 mx-auto w-full max-w-[1600px] bg-background overflow-hidden">
      <div className="w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 xl:mb-24 gap-8">
          <div>
            <div className="inline-flex items-center space-x-2 bg-red-50 border border-red-100 rounded-full px-4 py-1.5 xl:px-6 xl:py-2 mb-6 text-sm xl:text-lg font-medium text-primary">
              <ShoppingBag className="w-4 h-4 xl:w-5 xl:h-5" />
              <span>Genuine Accessories</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.1] uppercase">
              EXPLORE <span className="text-primary">ACCESSORIES</span>
            </h2>
          </div>
          
          <Link href="/accessories" className="inline-flex items-center space-x-2 text-gray-900 font-bold hover:text-primary transition-colors group text-lg xl:text-xl">
            <span>View Catalog</span>
            <div className="w-10 h-10 rounded-full bg-[#e8dfd1] flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
              <ChevronRight className="w-5 h-5" />
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-12">
          {ACCESSORIES.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative bg-background rounded-3xl p-8 border border-gray-100 hover:border-primary/30 hover:shadow-2xl hover:shadow-red-900/5 transition-all duration-300 flex flex-col items-center text-center h-full"
            >
              <div className="absolute top-6 left-6 bg-background px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-gray-600 shadow-sm border border-gray-100">
                {item.tag}
              </div>
              
              <div className="h-48 xl:h-64 w-full flex items-center justify-center mb-8 relative">
                {/* Background glow effect on hover */}
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 rounded-full blur-2xl transition-colors duration-500" />
                
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500 relative z-10"
                  onError={(e) => {
                    // Fallback to an inline SVG placeholder if image fails to load
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200" fill="%23f3f4f6"><rect width="200" height="200" fill="%23e5e7eb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%236b7280">Accessory</text></svg>';
                  }}
                />
              </div>
              
              <div className="mt-auto w-full">
                <h3 className="text-xl xl:text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">{item.name}</h3>
                <p className="text-gray-500 font-medium text-lg xl:text-xl">{item.price}</p>
                
                <button className="w-full mt-6 bg-background border-2 border-gray-200 text-gray-900 font-bold py-3 rounded-xl hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
