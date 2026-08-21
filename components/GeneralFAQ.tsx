"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

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
    <section className="py-12 md:py-16 lg:py-24 px-4 sm:px-6 md:px-12 lg:px-16 mx-auto w-full max-w-[1600px] bg-background">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-primary-foreground tracking-tight uppercase">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`bg-white dark:bg-[#1a1a1a] rounded-2xl overflow-hidden transition-all duration-300 border ${isOpen ? 'border-primary/50 shadow-md' : 'border-transparent shadow-sm hover:border-gray-200'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none"
                >
                  <span className={`text-lg md:text-xl font-bold pr-8 ${isOpen ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                    {faq.question}
                  </span>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 md:px-8 pb-6 md:pb-8 text-gray-600 dark:text-gray-400 leading-relaxed">
                        {faq.answer}
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
