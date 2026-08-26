import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Home, ChevronRight, Tag, Clock, Gift } from "lucide-react";
import OfferForm from "@/components/OfferForm";
import { prisma } from "@/lib/prisma";

export const revalidate = 60; // Revalidate every minute

export default async function OffersPage() {
  const offers = await prisma.offer.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 pt-28 pb-24">

      {/* Hero */}
      <div className="bg-background dark:bg-slate-950 border-b border-gray-100 dark:border-background/5">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-10">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-primary flex items-center gap-1 transition-colors">
              <Home className="w-3.5 h-3.5" /> Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 dark:text-primary-foreground font-medium">Offers</span>
          </nav>

          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Tag className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold lg:text-4xl font-black text-gray-900 dark:text-primary-foreground tracking-tight">
                Current Offers & Deals
              </h1>
              <p className="text-gray-500 mt-1.5 max-w-2xl">
                Exclusive offers on Honda motorcycles, scooters, and power products. Limited time deals — don't miss out!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-12">
        <h2 className="text-2xl md:text-3xl font-semibold font-black text-gray-900 dark:text-primary-foreground mb-8">Active Promotions</h2>
        
        {offers.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 mb-16">
            <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No active offers right now</h3>
            <p className="text-gray-500 mt-2">Check back later for exciting new deals!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {offers.map((offer) => {
              return (
                <div
                  key={offer.id}
                  className="flex flex-col bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden"
                >
                  <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-800">
                    {offer.imageUrl ? (
                      <Image 
                        src={offer.imageUrl} 
                        alt={offer.title} 
                        fill 
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Gift className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    {offer.badgeText && (
                      <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1 tracking-wider uppercase shadow-md">
                        {offer.badgeText}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-[17px] font-bold text-gray-900 dark:text-white mb-2 leading-snug">
                      {offer.title}
                    </h3>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-5 font-medium flex items-center gap-1.5">
                      {offer.createdAt 
                        ? new Date(offer.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                        : ''}
                    </div>

                    {offer.description && (
                      <p className="text-[15px] text-gray-600 dark:text-gray-400 mb-6 leading-relaxed line-clamp-3">
                        {offer.description}
                      </p>
                    )}

                    <div className="mt-auto">
                      <a
                        href="#apply-form"
                        className="text-sm font-bold text-[#1a56db] dark:text-[#3f83f8] hover:underline flex items-center gap-0.5 transition-colors"
                      >
                        Read More <ChevronRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Application Form */}
        <div id="apply-form" className="max-w-2xl mx-auto">
          <div className="bg-background dark:bg-slate-950 rounded-3xl border border-gray-200 dark:border-background/8 p-8 shadow-xl">
            <OfferForm />
          </div>
        </div>
      </div>
    </div>
  );
}
