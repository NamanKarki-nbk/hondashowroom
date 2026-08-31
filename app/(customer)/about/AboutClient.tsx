"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ShieldCheck, Users, TrendingUp, ChevronRight, Wrench } from 'lucide-react';

const FadeIn = ({ children, delay = 0, direction = "up" }: { children: React.ReactNode, delay?: number, direction?: "up" | "left" | "right" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  let y = 0, x = 0;
  if (direction === "up") y = 40;
  if (direction === "left") x = 40;
  if (direction === "right") x = -40;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, x }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y, x }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
};

export default function AboutClient({ happyCustomers = 0, branchesCount = 0 }: { happyCustomers?: number, branchesCount?: number }) {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  // Calculate years of service since 2024-02-11
  const startDate = new Date('2024-02-11');
  const currentDate = new Date();
  let yearsOfService = currentDate.getFullYear() - startDate.getFullYear();
  
  // Adjust if the anniversary hasn't passed yet this year
  if (
    currentDate.getMonth() < startDate.getMonth() || 
    (currentDate.getMonth() === startDate.getMonth() && currentDate.getDate() < startDate.getDate())
  ) {
    yearsOfService--;
  }
  
  // Ensure it's at least 1 if less than a year
  if (yearsOfService < 1) yearsOfService = 1;

  return (
    <main className="min-h-screen bg-background dark:bg-slate-950 text-gray-900 dark:text-primary-foreground font-sans selection:bg-red-500/30 overflow-hidden">
      
      {/* Immersive Hero Section */}
      <section ref={heroRef} className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y, opacity }} className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background dark:to-slate-950 z-10" />
          <Image
            src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop"
            alt="Premium Honda Motorcycle"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
        
        <div className="relative z-20 max-w-[1600px] w-full mx-auto px-4 sm:px-6 md:px-12 lg:px-16 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold tracking-widest uppercase">
              Est. 2024 • Damak, Nepal
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
              Driving <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">Excellence</span><br />
              in Eastern Nepal
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Society Enterprises Pvt. Ltd. — The authorized dealer of Syakar Trading Company for Honda Motorcycles and Power Products.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section / By the Numbers */}
      <section className="relative z-30 -mt-16 sm:-mt-24 max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        <FadeIn>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100 dark:border-white/5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-y md:divide-y-0 divide-gray-100 dark:divide-white/10">
              
              <div className="text-center md:px-4 py-4 md:py-0 flex flex-col items-center justify-center">
                <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#cd302b] to-red-800 mb-2">{yearsOfService}+</span>
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Years of Service</span>
              </div>
              <div className="text-center md:px-4 py-4 md:py-0 flex flex-col items-center justify-center">
                <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#cd302b] to-red-800 mb-2">{happyCustomers}+</span>
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Happy Customers</span>
              </div>
              <div className="text-center md:px-4 py-4 md:py-0 flex flex-col items-center justify-center">
                <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#cd302b] to-red-800 mb-2">{branchesCount}</span>
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Branches</span>
              </div>
              <div className="text-center md:px-4 py-4 md:py-0 flex flex-col items-center justify-center">
                <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#cd302b] to-red-800 mb-2">100%</span>
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Genuine Parts</span>
              </div>

            </div>
          </div>
        </FadeIn>
      </section>

      {/* Our Story Section */}
      <section className="py-24 max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <FadeIn direction="right">
            <div className="relative group">
              {/* Background accent block */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-red-100 to-red-50 dark:from-red-900/20 dark:to-transparent rounded-3xl transform -rotate-3 transition-transform duration-500 group-hover:rotate-0" />
              
              <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl bg-gray-200 dark:bg-slate-800">
                <Image 
                  src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1000&auto=format&fit=crop" 
                  alt="Showroom view" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl">
                    <p className="text-white font-medium italic text-sm">"Setting the benchmark for automobile dealerships in Eastern Nepal since our inception."</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="left">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-1 bg-[#cd302b]" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-[#cd302b]">Our Story & Vision</h2>
              </div>
              <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                More than just a dealership. <br className="hidden md:block" />
                <span className="text-gray-400 dark:text-gray-500">We are your mobility partner.</span>
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg leading-relaxed">
                Society Enterprises Pvt. Ltd., operating as Damak Honda, has been the trusted name for Honda vehicles in Eastern Nepal. We are committed to providing exceptional sales, servicing, and genuine spare parts for all Honda Motorcycles, Scooters, and Power Products.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed">
                Our vision is to empower the community with reliable mobility solutions while maintaining the highest standards of customer satisfaction and after-sales support. We strive to be the benchmark of excellence in the automobile dealership industry.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-red-50 dark:bg-red-900/10 p-2 rounded-lg text-[#cd302b]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">Authorized Dealership</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-red-50 dark:bg-red-900/10 p-2 rounded-lg text-[#cd302b]">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">Certified Workshop</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 bg-gray-50 dark:bg-[#141b2b] border-y border-gray-200 dark:border-white/5">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#cd302b] mb-3">Our Core Values</h2>
              <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">The principles that drive us</h3>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Trust & Reliability",
                desc: "Genuine Honda parts and certified mechanics you can count on, ensuring your vehicle performs at its best for years.",
                icon: ShieldCheck,
                delay: 0.1
              },
              {
                title: "Customer First",
                desc: "Dedicated to making your purchase and servicing journey seamless. Your satisfaction is the true measure of our success.",
                icon: Users,
                delay: 0.2
              },
              {
                title: "Innovation & Growth",
                desc: "Bringing the latest Honda technologies and models to Eastern Nepal, continuously upgrading our facilities to serve you better.",
                icon: TrendingUp,
                delay: 0.3
              }
            ].map((value, idx) => (
              <FadeIn key={idx} delay={value.delay}>
                <div className="group bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 hover:shadow-xl hover:border-red-100 dark:hover:border-red-900/30 transition-all duration-300 h-full flex flex-col items-start hover:-translate-y-2">
                  <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 text-[#cd302b] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#cd302b] group-hover:text-white transition-all duration-300 transform rotate-3 group-hover:rotate-0">
                    <value.icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{value.title}</h4>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">{value.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Executive Management */}
      <section className="py-24 max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-1 bg-[#cd302b]" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-[#cd302b]">Leadership</h2>
              </div>
              <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">Executive Management</h3>
            </div>
            <p className="text-gray-500 dark:text-gray-400 max-w-md text-sm leading-relaxed">
              Our experienced leadership team is dedicated to fostering a culture of excellence and ensuring every customer receives premium service.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-10">
          
          <FadeIn delay={0.1}>
            <div className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/5 hover:shadow-2xl transition-all duration-500">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-50 to-transparent dark:from-red-900/10 rounded-full blur-3xl -mr-20 -mt-20 transition-opacity opacity-0 group-hover:opacity-100" />
              <div className="p-8 md:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-8 relative z-10">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl shrink-0 bg-gray-200 dark:bg-slate-800">
                  <Image 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&h=256&auto=format&fit=crop" 
                    alt="Chairman" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Mr. Name Here</h4>
                  <p className="text-[#cd302b] font-semibold text-sm mb-4 tracking-wide uppercase">Chairman / Managing Director</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    Leading the vision and strategic growth of Society Enterprises, ensuring top-tier service delivery and sustainable expansion across all our branches in Nepal.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/5 hover:shadow-2xl transition-all duration-500">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-50 to-transparent dark:from-red-900/10 rounded-full blur-3xl -mr-20 -mt-20 transition-opacity opacity-0 group-hover:opacity-100" />
              <div className="p-8 md:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-8 relative z-10">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl shrink-0 bg-gray-200 dark:bg-slate-800">
                  <Image 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&h=256&auto=format&fit=crop" 
                    alt="Operations Director" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Ms. Name Here</h4>
                  <p className="text-[#cd302b] font-semibold text-sm mb-4 tracking-wide uppercase">Operations Director</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    Overseeing daily showroom operations, logistics, servicing excellence, and maintaining our exceptional standard of customer relationship management.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 mb-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
          <FadeIn>
            <div className="bg-gray-900 dark:bg-slate-900 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#cd302b]/20 to-transparent opacity-50" />
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#cd302b] rounded-full blur-[80px] opacity-30" />
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Ready to experience the Honda standard?</h2>
                <p className="text-gray-300 max-w-2xl mx-auto mb-10 text-lg">
                  Visit our showroom in Damak today to test ride your dream motorcycle or schedule a premium service for your current vehicle.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a href="/contact" className="bg-[#cd302b] hover:bg-[#b32924] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 group">
                    Visit Our Showroom
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a href="/vehicles" className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center">
                    Browse Vehicles
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

    </main>
  );
}
