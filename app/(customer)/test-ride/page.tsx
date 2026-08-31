"use client";

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Bike, User, Phone, CheckCircle, MapPin, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { HONDA_MODELS } from '@/lib/vehicleModels';

export default function TestRidePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Form state
  const [form, setForm] = useState({
    name: "",
    phone: "",
    bikeModel: "",
    date: "",
    timeSlot: "",
    notes: ""
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const model = params.get('model');
      if (model) {
        setForm(prev => ({ ...prev, bikeModel: model }));
      }
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setIsLoggedIn(true);
            setIsVerified(!!data.user.isVerified);
            setUser(data.user);
            
            // Auto-fill form
            setForm(prev => ({
              ...prev,
              name: data.user.fullName || prev.name,
              phone: (data.user.phone?.startsWith("placeholder-") || data.user.phone?.includes("google-") || data.user.phone?.match(/[a-z]/i)) ? prev.phone : (data.user.phone?.replace(/\D/g, "").slice(-10) || prev.phone),
            }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoadingProfile(false);
      }
    };
    
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const data = {
      customerName: form.name,
      phone: form.phone,
      bikeModel: form.bikeModel,
      date: form.date,
      timeSlot: form.timeSlot,
      notes: form.notes
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
    <main className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-28 pb-20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight mb-4">
            Book a <span className="text-primary">Test Ride</span>
          </h1>
          <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">
            Experience the thrill of a new Honda. Choose your model and preferred time, and we'll have it ready for you.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Info Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -z-10"></div>
              
              <h3 className="text-2xl font-black text-gray-900 dark:text-gray-100 uppercase mb-6 flex items-center gap-2">
                <MapPin className="text-primary w-6 h-6" /> Our Showroom
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Location</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100">Goarkha Department Building, Ganga Nagari, Damak-05</div>
                  <div className="text-gray-600">Jhapa, Koshi Province, Nepal</div>
                </div>
                
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Test Ride Hours</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100">10:00 AM - 5:00 PM</div>
                  <div className="text-gray-600">Sunday to Friday</div>
                </div>
                
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Contact for queries</div>
                  <div className="text-lg font-bold text-primary">9801615250</div>
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
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
              
              {success ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-gray-100 uppercase mb-4">Booking Confirmed!</h2>
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
                  
                  {!loadingProfile && !isLoggedIn && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-sm text-blue-800 dark:text-blue-300">
                        <strong>Have an account?</strong> Log in to auto-fill your details and track your booking.
                      </div>
                      <Link href={`/login?redirect=/test-ride${form.bikeModel ? `?model=${encodeURIComponent(form.bikeModel)}` : ''}`} className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                        Log In
                      </Link>
                    </div>
                  )}

                  {!loadingProfile && isLoggedIn && !isVerified && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-sm text-amber-800 dark:text-amber-300">
                        <strong>Action Required:</strong> Verify your contact number in your profile to auto-fill your details.
                      </div>
                      <Link href="/profile" className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                        Verify Contact
                      </Link>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-2">
                        <span className="flex items-center justify-between w-full">
                          <span>Full Name <span className="text-primary">*</span></span>
                          {user?.fullName && form.name === user.fullName && (
                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">✓ Profile</span>
                          )}
                        </span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        <input type="text" name="name" required value={form.name} onChange={handleChange} className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:placeholder-gray-400 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none font-medium" placeholder="John Doe" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-2">
                        <span className="flex items-center justify-between w-full">
                          <span>Phone Number <span className="text-primary">*</span></span>
                          {user?.phone && form.phone && user.phone.includes(form.phone) && (
                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">✓ Profile</span>
                          )}
                        </span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        <input type="tel" name="phone" required value={form.phone} onChange={handleChange} className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:placeholder-gray-400 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none font-medium" placeholder="98XXXXXX" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-2">Select Vehicle <span className="text-primary">*</span></label>
                    <div className="relative">
                      <Bike className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                      <select name="bikeModel" required value={form.bikeModel} onChange={handleChange} className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:placeholder-gray-400 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none font-medium appearance-none">
                        <option value="">-- Choose a Model --</option>
                        {HONDA_MODELS.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                        {form.bikeModel && !HONDA_MODELS.includes(form.bikeModel) && (
                          <option key={form.bikeModel} value={form.bikeModel}>{form.bikeModel}</option>
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-2">Preferred Date <span className="text-primary">*</span></label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                        <input type="date" name="date" required min={minDate} value={form.date} onChange={handleChange} className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:placeholder-gray-400 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none font-medium text-gray-700 dark:text-gray-300" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-2">Time Slot <span className="text-primary">*</span></label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                        <select name="timeSlot" required value={form.timeSlot} onChange={handleChange} className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:placeholder-gray-400 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none font-medium appearance-none">
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
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-2">Additional Notes (Optional)</label>
                    <textarea name="notes" rows={3} value={form.notes} onChange={handleChange} className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:placeholder-gray-400 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none font-medium" placeholder="Any specific requirements?"></textarea>
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
