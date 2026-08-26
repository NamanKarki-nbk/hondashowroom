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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {offers.map((offer) => {
              return (
                <div
                  key={offer.id}
                  className="relative bg-background dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-background/8 overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="w-12 h-12 bg-background dark:bg-slate-900 rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                        {offer.imageUrl ? (
                          <Image src={offer.imageUrl} alt={offer.title} fill className="object-cover" />
                        ) : (
                          <Gift className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      {offer.badgeText && (
                        <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider uppercase">
                          {offer.badgeText}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-black text-gray-900 dark:text-primary-foreground mb-1">{offer.title}</h3>
                    {offer.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed line-clamp-2">
                        {offer.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100 dark:border-background/5">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Clock className="w-3.5 h-3.5" /> 
                        {offer.validUntil 
                          ? `Valid till ${new Date(offer.validUntil).toLocaleDateString()}` 
                          : 'Ongoing Offer'}
                      </div>
                      <a
                        href="#apply-form"
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        Apply Now →
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
