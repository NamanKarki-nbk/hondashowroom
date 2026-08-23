"use client";

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Bike, User, Phone, CheckCircle, MapPin, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function TestRidePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [defaultModel, setDefaultModel] = useState("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const model = params.get('model');
      if (model) {
        setDefaultModel(model);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      customerName: formData.get('name'),
      phone: formData.get('phone'),
      bikeModel: formData.get('bikeModel'),
      date: formData.get('date'),
      timeSlot: formData.get('timeSlot'),
      notes: formData.get('notes')
    };

    try {
      const res = await fetch('/api/test-ride', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
      } else {
        alert("Failed to book test ride. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <main className="min-h-screen bg-gray-50 pt-28 pb-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12">
        
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tight mb-4">
            Book a <span className="text-primary">Test Ride</span>
          </h1>
          <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">
            Experience the thrill of a new Honda. Choose your model and preferred time, and we'll have it ready for you.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Info Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -z-10"></div>
              
              <h3 className="text-2xl font-black text-gray-900 uppercase mb-6 flex items-center gap-2">
                <MapPin className="text-primary w-6 h-6" /> Our Showroom
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Location</div>
                  <div className="text-lg font-bold text-gray-900">Damak-06, Campus Mode</div>
                  <div className="text-gray-600">Jhapa, Koshi Province, Nepal</div>
                </div>
                
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Test Ride Hours</div>
                  <div className="text-lg font-bold text-gray-900">10:00 AM - 5:00 PM</div>
                  <div className="text-gray-600">Sunday to Friday</div>
                </div>
                
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Contact for queries</div>
                  <div className="text-lg font-bold text-primary">023-580111</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
               <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                 <CheckCircle className="text-green-400 w-5 h-5" /> Requirements
               </h3>
               <ul className="space-y-3 text-gray-300 font-medium">
                 <li className="flex items-start gap-2">
                   <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></div>
                   Valid Driving License is mandatory.
                 </li>
                 <li className="flex items-start gap-2">
                   <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></div>
                   Please bring your Citizenship Card.
                 </li>
                 <li className="flex items-start gap-2">
                   <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></div>
                   Wear proper safety gear (Helmet provided).
                 </li>
               </ul>
            </div>
          </div>
          
          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
              
              {success ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 uppercase mb-4">Booking Confirmed!</h2>
                  <p className="text-lg text-gray-600 font-medium mb-8">
                    Your test ride request has been received. Our sales executive will call you shortly to confirm the appointment.
                  </p>
                  <button 
                    onClick={() => setSuccess(false)}
                    className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-bold tracking-wide transition-colors"
                  >
                    Book Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Full Name <span className="text-primary">*</span></label>
                      <div className="relative">
                        <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        <input type="text" name="name" required className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none font-medium" placeholder="John Doe" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Phone Number <span className="text-primary">*</span></label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        <input type="tel" name="phone" required className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none font-medium" placeholder="98XXXXXX" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Select Vehicle <span className="text-primary">*</span></label>
                    <div className="relative">
                      <Bike className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                      <select name="bikeModel" required defaultValue={defaultModel || ""} key={defaultModel} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none font-medium appearance-none">
                        <option value="">-- Choose a Model --</option>
                        <option value="CB Shine SP">CB Shine SP</option>
                        <option value="CBR 250RR">CBR 250RR</option>
                        <option value="Dio DLX">Dio DLX</option>
                        <option value="Hornet 2.0">Hornet 2.0</option>
                        <option value="XBlade 160">XBlade 160</option>
                        <option value="Dio 125">Dio 125</option>
                        <option value="Dio 110">Dio 110</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Preferred Date <span className="text-primary">*</span></label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                        <input type="date" name="date" required min={minDate} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none font-medium text-gray-700" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Time Slot <span className="text-primary">*</span></label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                        <select name="timeSlot" required className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none font-medium appearance-none">
                          <option value="">-- Select Time --</option>
                          <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                          <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                          <option value="12:00 PM - 01:00 PM">12:00 PM - 01:00 PM</option>
                          <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                          <option value="03:00 PM - 04:00 PM">03:00 PM - 04:00 PM</option>
                          <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Additional Notes (Optional)</label>
                    <textarea name="notes" rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none font-medium" placeholder="Any specific requirements?"></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-black text-lg tracking-wider uppercase transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                    ) : (
                      <>Confirm Booking</>
                    )}
                  </button>

                </form>
              )}
              
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}
