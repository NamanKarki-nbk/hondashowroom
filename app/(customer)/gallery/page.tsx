import React from 'react';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { Camera, Star } from 'lucide-react';

export const metadata = {
  title: 'Customer Deliveries Gallery | Society Enterprises',
  description: 'Join the Honda family. See our happy customers taking delivery of their new vehicles.',
};

export default async function GalleryPage() {
  const deliveries = await prisma.delivery.findMany({
    orderBy: { deliveredAt: 'desc' },
  });

  return (
    <main className="min-h-screen bg-background dark:bg-slate-950 py-24 text-gray-900 dark:text-primary-foreground transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-[#CC0000]/10 text-[#CC0000] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(184,50,39,0.3)]">
            <Camera className="w-8 h-8" />
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold md:text-4xl font-bold md:text-5xl lg:text-6xl font-black uppercase tracking-tight mb-4 text-gray-900 dark:text-white">
            Happy <span className="text-[#CC0000]">Customers</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Welcome to the Honda Family! Check out the joyful moments of our customers taking delivery of their new rides.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {deliveries.map((delivery) => (
            <div key={delivery.id} className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-gray-200 dark:border-slate-800 overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative h-72 w-full bg-gray-200 dark:bg-slate-800 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={delivery.imageUrl || '/placeholder-delivery.jpg'} 
                  alt={`Delivery to ${delivery.customerName}`}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-[#CC0000] text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md uppercase tracking-wider">
                  {delivery.vehicleName}
                </div>
              </div>
              
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl md:text-2xl font-semibold font-bold text-gray-900 dark:text-white leading-tight pr-2">{delivery.customerName}</h3>
                  <div className="flex flex-shrink-0">
                    {[...Array(delivery.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-[#FACC15] fill-current" />
                    ))}
                  </div>
                </div>
                
                {delivery.testimonial && (
                  <p className="text-gray-600 dark:text-gray-400 italic text-sm mb-6 line-clamp-3">
                    "{delivery.testimonial}"
                  </p>
                )}
                
                <p className="text-xs text-[#CC0000] font-bold uppercase tracking-wider">
                  Delivered on {new Date(delivery.deliveredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          ))}

          {deliveries.length === 0 && (
            <div className="col-span-full text-center py-20 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-200 dark:border-slate-800">
              <Camera className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
              <h3 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">Gallery is Empty</h3>
              <p className="text-gray-500 dark:text-gray-400 text-lg">We are currently uploading our delivery photos. Stay tuned!</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
