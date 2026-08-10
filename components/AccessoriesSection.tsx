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
    image: "https://honda.com.np/wp-content/uploads/2020/09/Seat-Cover.png",
    tag: "Bestseller"
  },
  {
    id: 2,
    name: "Grip Cover",
    price: "Rs. 150",
    image: "https://honda.com.np/wp-content/uploads/2020/09/Grip-Cover.png",
    tag: "Essential"
  },
  {
    id: 3,
    name: "Floor Mat",
    price: "Rs. 350",
    image: "https://honda.com.np/wp-content/uploads/2020/09/Floor-Mat.png",
    tag: "Protection"
  },
  {
    id: 4,
    name: "Body Cover",
    price: "Rs. 450",
    image: "https://honda.com.np/wp-content/uploads/2020/09/Body-Cover.png",
    tag: "Weatherproof"
  }
];

export default function AccessoriesSection() {
  return (
    <section className="py-24 px-6 bg-[#f3ebdd] border-t border-gray-100 overflow-hidden">
      <div className="max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 xl:mb-24 gap-8">
          <div>
            <div className="inline-flex items-center space-x-2 bg-red-50 border border-red-100 rounded-full px-4 py-1.5 xl:px-6 xl:py-2 mb-6 text-sm xl:text-lg font-medium text-[#c1291A]">
              <ShoppingBag className="w-4 h-4 xl:w-5 xl:h-5" />
              <span>Genuine Accessories</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.1] uppercase">
              EXPLORE <span className="text-[#c1291A]">ACCESSORIES</span>
            </h2>
          </div>
          
          <Link href="/accessories" className="inline-flex items-center space-x-2 text-gray-900 font-bold hover:text-[#c1291A] transition-colors group text-lg xl:text-xl">
            <span>View Catalog</span>
            <div className="w-10 h-10 rounded-full bg-[#e8dfd1] flex items-center justify-center group-hover:bg-[#c1291A] group-hover:text-[#f3ebdd] transition-all">
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
              className="group relative bg-[#f3ebdd] rounded-3xl p-8 border border-gray-100 hover:border-[#c1291A]/30 hover:shadow-2xl hover:shadow-red-900/5 transition-all duration-300 flex flex-col items-center text-center h-full"
            >
              <div className="absolute top-6 left-6 bg-[#f3ebdd] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-gray-600 shadow-sm border border-gray-100">
                {item.tag}
              </div>
              
              <div className="h-48 xl:h-64 w-full flex items-center justify-center mb-8 relative">
                {/* Background glow effect on hover */}
                <div className="absolute inset-0 bg-[#c1291A]/0 group-hover:bg-[#c1291A]/5 rounded-full blur-2xl transition-colors duration-500" />
                
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500 relative z-10"
                  onError={(e) => {
                    // Fallback to a placeholder if image fails to load
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x200?text=Accessory';
                  }}
                />
              </div>
              
              <div className="mt-auto w-full">
                <h3 className="text-xl xl:text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#c1291A] transition-colors">{item.name}</h3>
                <p className="text-gray-500 font-medium text-lg xl:text-xl">{item.price}</p>
                
                <button className="w-full mt-6 bg-[#f3ebdd] border-2 border-gray-200 text-gray-900 font-bold py-3 rounded-xl hover:border-[#c1291A] hover:bg-[#c1291A] hover:text-[#f3ebdd] transition-all duration-300">
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
