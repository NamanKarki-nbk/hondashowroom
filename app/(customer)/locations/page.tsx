import React from "react";
import { MapPin, Phone, Clock, Mail, Navigation } from "lucide-react";

export const metadata = {
  title: 'Our Locations | Society Enterprises',
  description: 'Find Honda Showrooms and Service Centers near you.',
};

const LOCATIONS = [
  {
    name: "Damak Main Showroom",
    type: "Showroom & Service Center",
    address: "Goarkha Department Building, Ganga Nagari, Damak-05, Jhapa",
    phone: "+977-9801615250",
    email: "damakhonda@gmail.com",
    hours: "Sun - Fri: 9:00 AM - 6:00 PM",
    isMain: true,
  },
  {
    name: "Birtamode Branch",
    type: "Showroom",
    address: "Mukti Chowk, Birtamode, Jhapa",
    phone: "+977-9800000001",
    email: "birtamode@hondadamak.com",
    hours: "Sun - Fri: 10:00 AM - 5:30 PM",
    isMain: false,
  },
  {
    name: "Urlabari Branch",
    type: "Showroom & Service Center",
    address: "Hotel grand Building, Urlabari",
    phone: "+977-9801615250",
    email: "urlabari@hondadamak.com",
    hours: "Sun - Fri: 9:30 AM - 5:30 PM",
    isMain: false,
  }
];

export default function LocationsPage() {
  return (
    <main className="min-h-screen bg-background dark:bg-slate-950 py-24 text-gray-900 dark:text-primary-foreground transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-[#CC0000]/10 text-[#CC0000] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(184,50,39,0.3)]">
            <MapPin className="w-8 h-8" />
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold md:text-4xl font-bold md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4">
            Our <span className="text-[#CC0000]">Locations</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find an authorized Society Enterprises Honda Showroom or Service Center near you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Location Cards */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {LOCATIONS.map((loc, idx) => (
              <div 
                key={idx} 
                className={`p-6 rounded-3xl border transition-all duration-300 ${
                  loc.isMain 
                    ? "bg-[#CC0000] border-[#CC0000] text-white shadow-xl shadow-[#B83227]/20 transform hover:-translate-y-1" 
                    : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 hover:shadow-xl dark:hover:border-slate-700 transform hover:-translate-y-1"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className={`text-xl md:text-2xl font-semibold font-bold uppercase tracking-tight ${!loc.isMain && "text-gray-900 dark:text-white"}`}>{loc.name}</h3>
                    <p className={`text-sm font-semibold uppercase tracking-wider mt-1 ${loc.isMain ? "text-red-200" : "text-[#CC0000]"}`}>{loc.type}</p>
                  </div>
                  {loc.isMain && <span className="bg-background text-primary dark:text-red-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">HQ</span>}
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className={`flex items-start gap-3 ${!loc.isMain && "text-gray-600 dark:text-gray-400"}`}>
                    <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{loc.address}</span>
                  </div>
                  <div className={`flex items-center gap-3 ${!loc.isMain && "text-gray-600 dark:text-gray-400"}`}>
                    <Phone className="w-5 h-5 flex-shrink-0" />
                    <span>{loc.phone}</span>
                  </div>
                  <div className={`flex items-center gap-3 ${!loc.isMain && "text-gray-600 dark:text-gray-400"}`}>
                    <Mail className="w-5 h-5 flex-shrink-0" />
                    <span>{loc.email}</span>
                  </div>
                  <div className={`flex items-center gap-3 ${!loc.isMain && "text-gray-600 dark:text-gray-400"}`}>
                    <Clock className="w-5 h-5 flex-shrink-0" />
                    <span>{loc.hours}</span>
                  </div>
                </div>

                <button className={`w-full py-3 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
                  loc.isMain 
                    ? "bg-background text-primary dark:text-red-500 hover:bg-gray-100 dark:hover:bg-slate-800" 
                    : "bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-700"
                }`}>
                  <Navigation className="w-4 h-4" /> Get Directions
                </button>
              </div>
            ))}
          </div>

          {/* Map Area */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-2 overflow-hidden shadow-2xl h-[500px] lg:h-auto">
             <div className="w-full h-full bg-gray-200 dark:bg-slate-800 rounded-2xl overflow-hidden relative group">
                <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 text-gray-500 dark:text-gray-400 group-hover:scale-105 transition-transform duration-700">
                   <MapPin className="w-16 h-16 text-[#CC0000] opacity-50" />
                   <p className="font-bold uppercase tracking-widest text-sm">Interactive Map Integration Here</p>
                </div>
                {/* Embedded Google Map goes here */}
                {/* <iframe src="..." className="w-full h-full border-0" allowFullScreen loading="lazy"></iframe> */}
             </div>
          </div>
        </div>

      </div>
    </main>
  );
}
