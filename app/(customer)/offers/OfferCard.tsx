"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Gift, ChevronRight, ChevronUp } from "lucide-react";
import OfferForm from "@/components/OfferForm";

interface Offer {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  offerType: string;
  startDate: Date | string | null;
  endDate: Date | string | null;
  createdAt: Date | string;
}

export default function OfferCard({ offer }: { offer: Offer }) {
  const [expanded, setExpanded] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  return (
    <div className="flex flex-col bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
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
        {offer.offerType && (
          <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1 tracking-wider uppercase shadow-md">
            {offer.offerType}
          </div>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-[17px] font-bold text-gray-900 dark:text-white mb-2 leading-snug">
          {offer.title}
        </h3>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-5 font-medium flex items-center gap-1.5">
          {offer.startDate && offer.endDate
            ? `${new Date(offer.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${new Date(offer.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
            : offer.createdAt 
              ? new Date(offer.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
              : ''}
        </div>

        {offer.description && (
          <p className="text-[15px] text-gray-600 dark:text-gray-400 mb-6 leading-relaxed line-clamp-3">
            {offer.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between">
          <button
            onClick={() => setExpanded(true)}
            className="text-sm font-bold text-[#1a56db] dark:text-[#3f83f8] hover:underline flex items-center gap-0.5 transition-colors"
          >
            Read More <ChevronRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setApplyModalOpen(true)}
            className="text-[11px] font-bold bg-primary/10 text-primary hover:bg-primary hover:text-white px-3 py-1.5 rounded-full transition-colors flex items-center"
          >
            Apply Now
          </button>
        </div>
      </div>

      {/* Offer Modal */}
      {expanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setExpanded(false)}
              className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full p-1.5 backdrop-blur-md transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            
            <div className="overflow-y-auto">
              <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-800">
                {offer.imageUrl ? (
                  <Image 
                    src={offer.imageUrl} 
                    alt={offer.title} 
                    fill 
                    className="object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Gift className="w-12 h-12 text-gray-300" />
                  </div>
                )}
              </div>
              
              <div className="p-6 md:p-8">
                {offer.offerType && (
                  <span className="inline-block bg-primary text-white text-[10px] font-bold px-3 py-1 tracking-wider uppercase rounded-full shadow-sm mb-4">
                    {offer.offerType}
                  </span>
                )}
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-snug">
                  {offer.title}
                </h2>
                
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium border-b border-gray-100 dark:border-slate-800 pb-4">
                  {offer.startDate && offer.endDate
                    ? `${new Date(offer.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${new Date(offer.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                    : offer.createdAt 
                      ? new Date(offer.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                      : ''}
                </div>

                <div className="prose prose-sm md:prose-base dark:prose-invert text-gray-700 dark:text-gray-300 max-w-none whitespace-pre-wrap">
                  {offer.description}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 flex justify-end gap-3">
              <button 
                onClick={() => setExpanded(false)}
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => { setExpanded(false); setApplyModalOpen(true); }}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-sm transition-colors"
              >
                Apply for this Offer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Apply Form Modal */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-950 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-xl relative animate-in zoom-in-95 duration-200 p-8">
            <button 
              onClick={() => setApplyModalOpen(false)}
              className="absolute top-6 right-6 z-10 text-gray-500 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-slate-800 rounded-full p-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <OfferForm 
              initialMessage={`I am interested in the "${offer.title}" offer.`} 
              isModal={true} 
              onClose={() => setApplyModalOpen(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
