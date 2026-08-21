"use client";

import React, { useState } from 'react';
import { Wrench, Calendar, MapPin, Loader2, CheckCircle } from 'lucide-react';

export default function ServiceBookingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      fullName: formData.get('fullName'),
      phone: formData.get('phone'),
      vehicleNo: formData.get('vehicleNo'),
      chassisNo: formData.get('chassisNo'),
      serviceType: formData.get('serviceType'),
      preferredDate: formData.get('preferredDate'),
    };

    try {
      const res = await fetch('/api/service-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (res.ok) {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
      } else {
        alert("Failed to book service. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-red-100 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Wrench className="w-8 h-8" />
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold md:text-4xl font-bold md:text-5xl font-extrabold text-gray-900 mb-4">
            Book a <span className="text-primary">Service</span>
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-gray-600">
            Schedule your next maintenance at Society Enterprises. Genuine parts, certified mechanics.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8 md:p-12">
          {success ? (
            <div className="text-center py-12">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
              <p className="text-gray-600 text-lg mb-8">
                Your service appointment has been successfully requested. Our service advisor will call you to confirm the exact time slot.
              </p>
              <button 
                onClick={() => setSuccess(false)}
                className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-red-700 font-bold"
              >
                Book Another Service
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Details */}
                <div className="space-y-6">
                  <h3 className="text-xl md:text-2xl font-semibold font-bold text-gray-900 border-b pb-2">Customer Details</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                    <input type="text" name="fullName" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                    <input type="tel" name="phone" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="space-y-6">
                  <h3 className="text-xl md:text-2xl font-semibold font-bold text-gray-900 border-b pb-2">Vehicle Details</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Number (e.g. Me 1 Pa 1234)</label>
                    <input type="text" name="vehicleNo" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chassis Number (Optional)</label>
                    <input type="text" name="chassisNo" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                  </div>
                </div>
              </div>

              {/* Service Requirements */}
              <div className="pt-6">
                <h3 className="text-xl md:text-2xl font-semibold font-bold text-gray-900 border-b pb-2 mb-6">Service Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type of Service <span className="text-red-500">*</span></label>
                    <select name="serviceType" required className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-primary focus:border-primary">
                      <option value="">-- Select Service Type --</option>
                      <option value="Free Servicing">Free Servicing</option>
                      <option value="Paid Servicing">Paid Servicing</option>
                      <option value="Accidental Repair">Accidental Repair</option>
                      <option value="Washing / Detailing">Washing / Detailing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input 
                        type="date" 
                        name="preferredDate" 
                        required 
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-4 px-6 rounded-lg font-bold text-xl md:text-2xl font-semibold hover:bg-red-700 transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-6 h-6 mr-2 animate-spin" /> Processing...</>
                  ) : (
                    'Confirm Service Booking'
                  )}
                </button>
                <p className="text-sm text-gray-500 text-center mt-4">
                  By booking, you agree to our terms of service. You will pay at the service center after the maintenance is completed.
                </p>
              </div>

            </form>
          )}
        </div>
      </div>
    </main>
  );
}
