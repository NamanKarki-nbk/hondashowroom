"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, MessageCircleQuestion } from "lucide-react";

const CATEGORIES = ["All Questions", "Billing", "Product", "Technical"];

const FAQS = [
  {
    category: "Billing",
    question: "Do you offer financing options for two-wheelers?",
    answer: "Yes, we offer comprehensive financing options through Syakar Hire Purchase and other partner banks. We provide flexible EMI schemes with competitive interest rates and low down payments tailored to your needs."
  },
  {
    category: "Technical",
    question: "How do I book my vehicle for servicing?",
    answer: "You can book a service appointment directly through our website by navigating to the 'Service Booking' section, calling our hotline, or using our WhatsApp integration to message us directly."
  },
  {
    category: "Product",
    question: "Do you accept old vehicles for exchange?",
    answer: "Absolutely! We accept all brands of two-wheelers for exchange. Our expert evaluators will inspect your vehicle and offer you the best market value which can be adjusted against your new Honda purchase."
  },
  {
    category: "Product",
    question: "Are genuine spare parts available?",
    answer: "Yes, as an authorized Honda dealership, we only use and sell 100% genuine Honda parts and accessories to ensure the longevity and performance of your vehicle."
  },
  {
    category: "Technical",
    question: "What does the extended warranty cover?",
    answer: "The extended warranty covers engine and transmission defects, electrical failures, and manufacturing faults beyond the standard warranty period. It gives you peace of mind for up to 5 years."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState("All Questions");

  const filteredFaqs = FAQS.filter(faq => 
    activeCategory === "All Questions" || faq.category === activeCategory
  );

  return (
    <section className="py-24 w-full bg-gray-50/50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 w-full">
        
        {/* Header */}
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-gray-200/50 dark:bg-white/5 border border-gray-300/50 dark:border-white/10 rounded-full px-5 py-2 mb-6 text-sm font-bold tracking-widest uppercase text-gray-600 dark:text-gray-300">
            <MessageCircleQuestion className="w-4 h-4" />
            <span>Help Center</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight">
            Frequently Asked <span className="text-[#CC0000]">Questions</span>
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10 w-full mx-auto">
          <div className="flex w-full overflow-hidden bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => { setActiveCategory(category); setOpenIndex(0); }}
                className={`flex-1 px-2 py-3.5 sm:py-3 text-[14px] font-bold transition-all duration-300 border-r border-gray-200 dark:border-slate-800 last:border-r-0 whitespace-nowrap ${
                  activeCategory === category
                    ? "bg-[#161C2D] dark:bg-white text-white dark:text-gray-900"
                    : "bg-transparent text-slate-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion Container */}
        <div className="w-full mx-auto space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No questions found in this category.</div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div 
                  key={index} 
                  className={`bg-white dark:bg-slate-900 rounded-lg overflow-hidden transition-all duration-300 border ${isOpen ? 'border-gray-300 dark:border-gray-600' : 'border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700'}`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none group"
                  >
                    <span className={`text-[15px] md:text-[16px] font-bold pr-8 transition-colors duration-300 ${isOpen ? 'text-[#161C2D] dark:text-white' : 'text-slate-800 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                      {faq.question}
                    </span>
                    
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-[#161C2D] dark:bg-white text-white dark:text-gray-900' : 'bg-[#F4F4F5] dark:bg-white/10 text-[#71717A] dark:text-gray-400 group-hover:bg-[#E4E4E7] dark:group-hover:bg-white/20'}`}>
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                      >
                        <div className="px-5 md:px-6 pb-5 md:pb-6 text-gray-500 dark:text-gray-400 text-[14px] leading-relaxed font-medium">
                          <div className="pt-5 border-t border-gray-100 dark:border-slate-800">
                            <p>{faq.answer}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
