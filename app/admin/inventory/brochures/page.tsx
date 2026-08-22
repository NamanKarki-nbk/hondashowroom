"use client";

import React, { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import BrochurePDF from '@/components/admin/BrochurePDF';
import { FileDown, Bike, CheckCircle } from 'lucide-react';

const mockVehicles = [
  { id: 1, brand: 'Honda', model: 'CB Shine SP', year: 2023, price: 235000, type: 'Commuter', engineSize: '125cc', mileage: '65 kmpl' },
  { id: 2, brand: 'Honda', model: 'CBR 250RR', year: 2024, price: 1350000, type: 'Sports', engineSize: '250cc', mileage: '25 kmpl' },
  { id: 3, brand: 'Honda', model: 'Dio DLX', year: 2023, price: 220000, type: 'Scooter', engineSize: '110cc', mileage: '55 kmpl' },
];

export default function BrochuresPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 text-gray-100 p-8">
      <div className="max-w-[1600px] mx-auto">
        <h1 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold font-extrabold text-primary-foreground mb-2">PDF Brochures</h1>
        <p className="text-gray-400 mb-8">Generate official digital brochures for inventory vehicles.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockVehicles.map(vehicle => (
            <div key={vehicle.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <Bike className="w-8 h-8 text-primary" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> In Stock
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-1">{vehicle.brand} {vehicle.model}</h3>
              <p className="text-sm text-gray-400 font-medium mb-4">{vehicle.year} • {vehicle.type} • {vehicle.engineSize}</p>
              
              <div className="mt-auto pt-6 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Base Price</div>
                  <div className="text-lg font-black text-primary">Rs. {vehicle.price.toLocaleString()}</div>
                </div>
                
                {isClient && (
                  <PDFDownloadLink
                    document={<BrochurePDF vehicle={vehicle} />}
                    fileName={`${vehicle.brand}_${vehicle.model}_Brochure.pdf`}
                    className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
                  >
                    {({ loading }) => (loading ? 'Preparing...' : <><FileDown className="w-4 h-4" /> PDF</>)}
                  </PDFDownloadLink>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
