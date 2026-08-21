"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, MessageCircleQuestion } from "lucide-react";

const FAQS = [
  {
    question: "Do you offer financing options for two-wheelers?",
    answer: "Yes, we offer comprehensive financing options through Syakar Hire Purchase and other partner banks. We provide flexible EMI schemes with competitive interest rates and low down payments tailored to your needs."
  },
  {
    question: "How do I book my vehicle for servicing?",
    answer: "You can book a service appointment directly through our website by navigating to the 'Service Booking' section, calling our hotline, or using our WhatsApp integration to message us directly."
  },
  {
    question: "Do you accept old vehicles for exchange?",
    answer: "Absolutely! We accept all brands of two-wheelers for exchange. Our expert evaluators will inspect your vehicle and offer you the best market value which can be adjusted against your new Honda purchase."
  },
  {
    question: "Are genuine spare parts available?",
    answer: "Yes, as an authorized Honda dealership, we only use and sell 100% genuine Honda parts and accessories to ensure the longevity and performance of your vehicle."
  },
  {
    question: "What does the extended warranty cover?",
    answer: "The extended warranty covers engine and transmission defects, electrical failures, and manufacturing faults beyond the standard warranty period. It gives you peace of mind for up to 5 years."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 w-full bg-gray-50/50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 w-full">
        
        {/* Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-gray-200/50 dark:bg-white/5 border border-gray-300/50 dark:border-white/10 rounded-full px-5 py-2 mb-6 text-sm font-bold tracking-widest uppercase text-gray-600 dark:text-gray-300">
            <MessageCircleQuestion className="w-4 h-4" />
            <span>Help Center</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-[1.1]">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
        </div>

        {/* Accordion Container */}
        <div className="w-full max-w-4xl mx-auto space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden transition-all duration-500 border ${isOpen ? 'border-primary/50 shadow-[0_12px_30px_-10px_rgba(239,68,68,0.2)] dark:shadow-[0_12px_30px_-10px_rgba(239,68,68,0.3)]' : 'border-gray-200/60 dark:border-white/10 shadow-sm hover:border-gray-300 dark:hover:border-white/20'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none group"
                >
                  <span className={`text-lg md:text-xl font-bold pr-8 transition-colors duration-300 ${isOpen ? 'text-primary' : 'text-gray-900 dark:text-white group-hover:text-primary'}`}>
                    {faq.question}
                  </span>
                  
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-primary text-white rotate-180 shadow-md shadow-red-500/30' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-white/20'}`}>
                    {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
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
                      <div className="px-6 md:px-8 pb-6 md:pb-8 text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed font-medium">
                        <div className="pt-2 border-t border-gray-100 dark:border-white/5 mt-2">
                          <p className="mt-4">{faq.answer}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
