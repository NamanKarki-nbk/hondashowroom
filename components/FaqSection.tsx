"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "What is the warranty period for this vehicle?",
    answer: "Honda offers a standard warranty of 3 years or 36,000 kms (whichever is earlier). You can also opt for an extended warranty up to 6 years."
  },
  {
    question: "What is the ideal tire pressure?",
    answer: "For optimal performance and mileage, maintain 22 psi in the front and 29 psi (29 psi with pillion) in the rear tires."
  },
  {
    question: "When should I get the first service done?",
    answer: "The first free service should be done between 500-750 kms or within 15-30 days from the date of purchase, whichever comes first."
  },
  {
    question: "What kind of engine oil is recommended?",
    answer: "We recommend using Honda Genuine Engine Oil (10W-30 MA) for best engine performance and longevity."
  },
  {
    question: "Does it come with an idle start-stop system?",
    answer: "Yes, select models are equipped with the ACG starter motor and Idling Stop System to improve fuel efficiency in heavy traffic."
  }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 px-6 bg-background border-t border-gray-100">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 w-full">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold md:text-4xl font-bold md:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-gray-900 uppercase">
            FREQUENTLY ASKED <span className="text-primary">QUESTIONS</span>
          </h2>
          <p className="text-lg xl:text-2xl text-gray-600">Got questions? We've got answers to help you ride with confidence.</p>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          {FAQS.map((faq, index) => (
            <div 
              key={index}
              className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${openIndex === index ? 'border-primary/30 bg-red-50/50' : 'border-gray-200 bg-background hover:border-gray-300'}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between px-6 py-6 xl:px-8 xl:py-8 text-left"
              >
                <span className="text-lg xl:text-2xl font-bold text-gray-900 pr-8">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${openIndex === index ? 'bg-primary text-primary-foreground' : 'bg-[#e8dfd1] text-gray-500'}`}
                >
                  <ChevronDown className="w-5 h-5 xl:w-6 xl:h-6" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 xl:px-8 xl:pb-8 pt-0 text-gray-600 text-base xl:text-xl leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
