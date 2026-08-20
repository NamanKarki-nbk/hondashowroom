"use client";

import React, { useState, useEffect } from "react";
import { Calculator, Send } from "lucide-react";
import { useSearchParams } from "next/navigation";

type Customer = { id: string; fullName: string; phone: string };
type Vehicle = { id: string; vin: string; modelName: string; purchasePrice: number };

export default function SalesForm({ customers, vehicles }: { customers: Customer[]; vehicles: Vehicle[] }) {
  const searchParams = useSearchParams();
  const prefillVehicleId = searchParams.get('vehicleId');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [customerId, setCustomerId] = useState("");
  const [chassisNo, setChassisNo] = useState("");
  const [saleType, setSaleType] = useState("Retail");
  const [paymentType, setPaymentType] = useState("CASH");

  // Pre-fill the chassis number if vehicleId is passed in URL
  useEffect(() => {
    if (prefillVehicleId) {
      const v = vehicles.find(vec => vec.id === prefillVehicleId);
      if (v) setChassisNo(v.vin);
    }
  }, [prefillVehicleId, vehicles]);

  const [showroomPrice, setShowroomPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [insurance, setInsurance] = useState(0);
  const [registrationCharge, setRegistrationCharge] = useState(0);
  const [serviceCharge, setServiceCharge] = useState(0);
  const [accessoriesCharge, setAccessoriesCharge] = useState(0);
  const [advancePaid, setAdvancePaid] = useState(0);

  const selectedVehicle = vehicles.find(v => v.vin === chassisNo);

  const finalAmount = showroomPrice - discount + insurance + registrationCharge + serviceCharge + accessoriesCharge;
  const dueAmount = finalAmount - advancePaid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/admin/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          chassisNo,
          saleType,
          paymentType,
          showroomPrice,
          discount,
          insurance,
          registrationCharge,
          serviceCharge,
          accessoriesCharge,
          advancePaid
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create sale');

      setSuccess(`Sale successful! Invoice: ${data.transaction.invoiceNo}`);
      
      // Reset
      setCustomerId("");
      setChassisNo("");
      setShowroomPrice(0);
      setDiscount(0);
      setInsurance(0);
      setRegistrationCharge(0);
      setServiceCharge(0);
      setAccessoriesCharge(0);
      setAdvancePaid(0);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <div className="p-4 bg-red-100 text-red-800 rounded-lg">{error}</div>}
      {success && <div className="p-4 bg-green-100 text-green-800 rounded-lg">{success}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer & Vehicle */}
        <div className="space-y-4">
           <h3 className="text-lg font-bold border-b border-gray-200 dark:border-white/10 pb-2">Basic Details</h3>
           
           <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Customer</label>
             <select 
               required
               value={customerId}
               onChange={e => setCustomerId(e.target.value)}
               className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#B83227]"
             >
               <option value="" disabled>Select a verified customer</option>
               {customers.map(c => <option key={c.id} value={c.id}>{c.fullName} ({c.phone})</option>)}
             </select>
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Vehicle (Chassis / VIN)</label>
             <select 
               required
               value={chassisNo}
               onChange={e => {
                 setChassisNo(e.target.value);
                 const v = vehicles.find(x => x.vin === e.target.value);
                 if (v) setShowroomPrice(v.purchasePrice * 1.15); // Add rough 15% margin for default showroom price
               }}
               className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#B83227]"
             >
               <option value="" disabled>Select an in-stock vehicle</option>
               {vehicles.map(v => <option key={v.vin} value={v.vin}>{v.vin} - {v.modelName}</option>)}
             </select>
           </div>

           <div className="flex gap-4">
             <div className="flex-1">
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sale Type</label>
               <select value={saleType} onChange={e => setSaleType(e.target.value)} className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#B83227]">
                 <option>Retail</option>
                 <option>Corporate</option>
                 <option>Dealer</option>
               </select>
             </div>
             <div className="flex-1">
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Type</label>
               <select value={paymentType} onChange={e => setPaymentType(e.target.value)} className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#B83227]">
                 <option value="CASH">Cash</option>
                 <option value="FINANCE">Finance</option>
                 <option value="EXCHANGE">Exchange</option>
               </select>
             </div>
           </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
           <h3 className="text-lg font-bold border-b border-gray-200 dark:border-white/10 pb-2">Pricing & Charges</h3>
           
           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Showroom Price</label>
               <input type="number" required value={showroomPrice} onChange={e => setShowroomPrice(Number(e.target.value))} className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#B83227]" />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Discount</label>
               <input type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#B83227]" />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Insurance</label>
               <input type="number" value={insurance} onChange={e => setInsurance(Number(e.target.value))} className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#B83227]" />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Registration</label>
               <input type="number" value={registrationCharge} onChange={e => setRegistrationCharge(Number(e.target.value))} className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#B83227]" />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service Charge</label>
               <input type="number" value={serviceCharge} onChange={e => setServiceCharge(Number(e.target.value))} className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#B83227]" />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Accessories</label>
               <input type="number" value={accessoriesCharge} onChange={e => setAccessoriesCharge(Number(e.target.value))} className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#B83227]" />
             </div>
           </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex gap-8">
           <div>
             <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Final Amount</p>
             <p className="text-3xl font-black text-[#B83227]">Rs. {finalAmount.toLocaleString()}</p>
           </div>
           <div>
             <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Due Amount</p>
             <p className="text-3xl font-black">Rs. {dueAmount.toLocaleString()}</p>
           </div>
        </div>

        <div className="flex items-center gap-4">
           <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Advance Paid</label>
             <input type="number" value={advancePaid} onChange={e => setAdvancePaid(Number(e.target.value))} className="w-32 bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#B83227]" />
           </div>
           
           <button 
             type="submit" 
             disabled={loading}
             className="bg-[#B83227] hover:bg-primary-hover text-white px-8 py-3 rounded-lg font-bold uppercase tracking-wider flex items-center gap-2 transition-colors disabled:opacity-50 mt-5"
           >
             {loading ? <Calculator className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
             Submit Sale
           </button>
        </div>
      </div>
    </form>
  );
}
