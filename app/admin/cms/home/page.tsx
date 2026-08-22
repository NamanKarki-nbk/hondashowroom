import React from "react";
import { prisma } from "@/lib/prisma";
import { Plus, Image, Edit, Trash2 } from "lucide-react";
import Link from "next/link";


export default async function HomeCMS() {
  const banners = await prisma.heroBanner.findMany({
    orderBy: { order: 'asc' }
  });

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 text-gray-100 p-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold font-extrabold text-primary-foreground">Home Page CMS</h1>
            <p className="text-gray-400 mt-2">Manage hero banners and main page content.</p>
          </div>
          <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add Banner
          </button>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left">
              <thead className="bg-slate-950">
                <tr>
                  <th className="py-4 px-6 font-bold text-gray-400 uppercase tracking-widest text-xs">Image</th>
                  <th className="py-4 px-6 font-bold text-gray-400 uppercase tracking-widest text-xs">Title</th>
                  <th className="py-4 px-6 font-bold text-gray-400 uppercase tracking-widest text-xs">Order</th>
                  <th className="py-4 px-6 font-bold text-gray-400 uppercase tracking-widest text-xs">Status</th>
                  <th className="py-4 px-6 font-bold text-gray-400 uppercase tracking-widest text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {banners.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">No banners found.</td>
                  </tr>
                ) : (
                  banners.map((banner) => (
                    <tr key={banner.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="w-24 h-12 bg-slate-800 rounded flex items-center justify-center overflow-hidden">
                          {banner.imageUrl ? (
                            <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                          ) : (
                            <Image className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-semibold text-white">{banner.title}</td>
                      <td className="py-4 px-6 text-gray-400">{banner.order}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${banner.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                          {banner.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-3">
                          <button className="p-2 hover:bg-slate-700 rounded-lg text-gray-400 transition-colors"><Edit className="w-4 h-4" /></button>
                          <button className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
