"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Rahul Sharma",
    role: "Daily Commuter",
    content: "The handling in city traffic is phenomenal. The smart key features make my daily commutes so much more convenient. Absolutely love the new design!",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=rahul"
  },
  {
    name: "Priya Patel",
    role: "College Student",
    content: "It's stylish, bold, and exactly what I was looking for. The mileage is great and the under-seat storage fits my helmet perfectly.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=priya"
  },
  {
    name: "Amit Kumar",
    role: "Enthusiast",
    content: "Honda engines never disappoint. The refinement is top-notch and the suspension handles rough roads with ease. A highly recommended purchase.",
    rating: 4,
    avatar: "https://i.pravatar.cc/150?u=amit"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 px-6 bg-background border-t border-gray-100 overflow-hidden">
      <div className="max-w-[1600px] mx-auto w-full">
        <div className="text-center mb-16 xl:mb-24">
          <h2 className="text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-gray-900 uppercase">
            HEAR FROM OUR <span className="text-primary">RIDERS</span>
          </h2>
          <p className="text-lg xl:text-2xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Discover why thousands of riders choose Honda for their daily journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 xl:gap-12 relative z-10">
          {/* Decorative quotes background */}
          <div className="absolute -top-10 -left-10 text-gray-200/50 -z-10">
            <Quote size={200} />
          </div>

          {TESTIMONIALS.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-background rounded-3xl p-8 xl:p-12 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col h-full hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="flex items-center space-x-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 xl:w-6 xl:h-6 ${i < testimonial.rating ? 'fill-primary text-primary' : 'fill-gray-200 text-gray-200'}`} 
                  />
                ))}
              </div>
              
              <p className="text-gray-700 text-lg xl:text-xl leading-relaxed mb-8 flex-grow italic">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center space-x-4 mt-auto pt-6 border-t border-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-14 h-14 xl:w-16 xl:h-16 rounded-full object-cover border-2 border-background shadow-md"
                />
                <div>
                  <h4 className="font-bold text-gray-900 text-lg xl:text-xl">{testimonial.name}</h4>
                  <p className="text-sm xl:text-base text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
