"use client";

import React from "react";
import { Wrench, PiggyBank, Shield, Bike, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const SERVICES = [
  {
    icon: Wrench,
    title: "Expert Servicing",
    description: "Factory-trained technicians using genuine Honda parts for all maintenance and repairs.",
    link: "/service-booking",
    linkText: "Book Service",
  },
  {
    icon: PiggyBank,
    title: "Easy Finance",
    description: "Flexible EMI options and low down payments to make your dream Honda affordable.",
    link: "/finance",
    linkText: "Calculate EMI",
  },
  {
    icon: Bike,
    title: "Test Rides",
    description: "Experience the thrill before you buy. Schedule a test ride at your convenience.",
    link: "/test-ride",
    linkText: "Schedule Ride",
  },
  {
    icon: Shield,
    title: "Extended Warranty",
    description: "Complete peace of mind with our comprehensive warranty and AMC packages.",
    link: "/amc",
    linkText: "View Packages",
  },
];

export default function ServicesGrid() {
  return (
    <section className="py-12 md:py-16 lg:py-24 px-4 sm:px-6 md:px-12 lg:px-16 mx-auto w-full max-w-[1600px] bg-background">
      <div className="w-full">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-primary-foreground tracking-tight uppercase">
            Our <span className="text-primary">Services</span>
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Experience premium ownership with our comprehensive range of services designed for your convenience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-[#1a1a1a] p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-transparent hover:border-primary/20 group flex flex-col h-full"
              >
                <div className="w-14 h-14 bg-background dark:bg-black rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow">{service.description}</p>
                <Link
                  href={service.link}
                  className="inline-flex items-center text-primary font-bold hover:gap-2 transition-all group-hover:text-primary-hover uppercase tracking-wider text-sm mt-auto"
                >
                  {service.linkText} <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
