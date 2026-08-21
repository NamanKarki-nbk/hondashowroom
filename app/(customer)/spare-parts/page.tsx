import React from 'react';
import { prisma } from '@/lib/prisma';
import { formatNPRPrice } from '@/lib/utils/priceFormatter';
import { Search, Package } from 'lucide-react';

export const metadata = {
  title: 'Genuine Spare Parts | Society Enterprises',
  description: 'Search for Honda Genuine Spare Parts at Society Enterprises.',
};

export default async function SparePartsPage({
  searchParams,
}: {
  searchParams?: { query?: string };
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams?.query || '';

  const spareParts = await prisma.sparePart.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { partNumber: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
      ],
    },
    take: 50,
  });

  return (
    <main className="min-h-screen bg-background dark:bg-slate-950 py-24 text-gray-900 dark:text-primary-foreground transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-[#CC0000]/10 text-[#CC0000] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(184,50,39,0.3)]">
            <Package className="w-8 h-8" />
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold md:text-4xl font-bold md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4">
            Honda Genuine <span className="text-[#CC0000]">Parts</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Ensure your vehicle runs perfectly with 100% authentic Honda spare parts and accessories.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-16">
          <form className="relative flex items-center shadow-xl" method="GET" action="/spare-parts">
            <Search className="absolute left-6 text-gray-400 w-6 h-6" />
            <input 
              type="text" 
              name="query"
              defaultValue={query}
              placeholder="Search by part name, part number, or category..." 
              className="w-full pl-16 pr-36 py-5 rounded-full border border-gray-300 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-inner focus:ring-2 focus:ring-[#CC0000] focus:border-[#CC0000] text-gray-900 dark:text-white outline-none backdrop-blur-sm transition-all"
            />
            <button 
              type="submit" 
              className="absolute right-3 bg-[#CC0000] hover:bg-primary-hover text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#B83227]/20"
            >
              Search
            </button>
          </form>
        </div>

        {/* Parts Grid */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden relative">
          {spareParts.length === 0 ? (
            <div className="p-16 text-center text-gray-500 dark:text-gray-400">
              <Package className="w-16 h-16 mx-auto mb-6 text-gray-300 dark:text-gray-600" />
              <p className="text-xl md:text-2xl font-semibold font-medium">No spare parts found matching "{query}".</p>
              <p className="mt-2">Try searching with a different term or part number.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-800">
                    <th className="p-5 font-bold uppercase tracking-wider text-xs text-gray-500 dark:text-gray-400">Part Number</th>
                    <th className="p-5 font-bold uppercase tracking-wider text-xs text-gray-500 dark:text-gray-400">Part Name</th>
                    <th className="p-5 font-bold uppercase tracking-wider text-xs text-gray-500 dark:text-gray-400">Category</th>
                    <th className="p-5 font-bold uppercase tracking-wider text-xs text-gray-500 dark:text-gray-400 text-right">Price (NPR)</th>
                    <th className="p-5 font-bold uppercase tracking-wider text-xs text-gray-500 dark:text-gray-400 text-center">Availability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                  {spareParts.map(part => (
                    <tr key={part.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-5 font-mono text-sm text-gray-600 dark:text-gray-400">{part.partNumber}</td>
                      <td className="p-5 font-bold text-gray-900 dark:text-white flex items-center gap-3">
                         <div className="w-8 h-8 rounded-md bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
                            <Package className="w-4 h-4 text-gray-500" />
                         </div>
                         {part.name}
                      </td>
                      <td className="p-5 text-gray-500 dark:text-gray-400 text-sm font-medium">
                        <span className="bg-gray-100 dark:bg-slate-800 px-3 py-1.5 rounded-full text-xs">{part.category}</span>
                      </td>
                      <td className="p-5 text-right font-black text-[#CC0000] text-lg">
                        {formatNPRPrice(part.price)}
                      </td>
                      <td className="p-5 text-center">
                        {part.stock > 0 ? (
                          <span className="text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-wide bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 px-3 py-1 rounded-full">In Stock ({part.stock})</span>
                        ) : (
                          <span className="text-red-700 dark:text-red-400 text-xs font-bold uppercase tracking-wide bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 px-3 py-1 rounded-full">Out of Stock</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-16 bg-[#CC0000] rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
           <div className="absolute right-0 top-0 w-64 h-64 bg-black/10 rounded-full blur-3xl pointer-events-none"></div>
           <div className="relative z-10 max-w-2xl mb-8 md:mb-0 text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold font-black uppercase tracking-tight mb-2">Need Help Finding A Part?</h3>
              <p className="text-red-100 font-medium">Our technicians can help you identify exactly what you need. Upload a photo of your damaged part or provide your chassis number.</p>
           </div>
           <button className="relative z-10 bg-white text-[#CC0000] px-8 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-gray-100 transition-colors shadow-xl whitespace-nowrap">
              Contact Support
           </button>
        </div>

      </div>
    </main>
  );
}
