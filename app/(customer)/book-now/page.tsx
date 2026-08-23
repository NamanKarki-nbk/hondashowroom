'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  User,
  Mail,
  Phone,
  MapPin,
  Car,
  CreditCard,
  MessageSquare,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

import { HONDA_MODELS } from '@/lib/vehicleModels';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  model: string;
  bookingDate: string;
  paymentMethod: string;
  message: string;
}

export default function BookNowPage() {
  const [form, setForm] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    model: '',
    bookingDate: '',
    paymentMethod: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    document.title = 'Book Your Honda | Honda Showroom';
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const model = params.get('model');
      if (model) {
        setForm(prev => ({ ...prev, model }));
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
              fullName: data.user.fullName || prev.fullName,
              email: (data.user.email?.startsWith("placeholder-") || data.user.email?.includes("google-")) ? prev.email : (data.user.email || prev.email),
              phone: (data.user.phone?.startsWith("placeholder-") || data.user.phone?.includes("google-") || data.user.phone?.match(/[a-z]/i)) ? prev.phone : (data.user.phone?.replace(/\D/g, "").slice(-10) || prev.phone),
              city: data.user.address || prev.city,
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    const ref = String(Math.floor(100000 + Math.random() * 900000));
    setBookingRef(ref);
    setSubmitted(true);
    setLoading(false);
  };

  const inputClass =
    'bg-background dark:bg-slate-950 border border-gray-200 dark:border-background/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none text-gray-900 dark:text-primary-foreground w-full text-sm transition-all duration-200';
  const labelClass = 'text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block';

  return (
    <main className="min-h-screen bg-background dark:bg-slate-950 pt-28 pb-20">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-[#c0151f] to-[#8b0000] py-14 px-6 mb-12">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuMDYiLz48L3N2Zz4=')] opacity-40" />
        <div className="relative max-w-3xl mx-auto text-center">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-1.5 text-primary-foreground/70 text-sm mb-6">
            <Link href="/" className="hover:text-primary-foreground transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-primary-foreground font-medium">Book Now</span>
          </nav>
          <div className="flex items-center justify-center gap-3 mb-4">
            <CalendarCheck className="w-10 h-10 text-primary-foreground/90" />
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold md:text-4xl font-bold md:text-5xl font-black text-primary-foreground tracking-tight mb-3">
            Book Your Honda
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto">
            Reserve your Honda vehicle with a booking deposit and secure your dream ride today.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4">
        {submitted ? (
          /* ── Success Card ── */
          <div className="bg-background dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-background/10 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-8 text-center">
              <CheckCircle2 className="w-16 h-16 text-primary-foreground mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-semibold font-bold text-primary-foreground mb-1">Booking Confirmed!</h2>
              <p className="text-primary-foreground/80 text-sm">We're excited to have you on board.</p>
            </div>
            <div className="p-8 text-center">
              <div className="inline-flex flex-col items-center bg-background dark:bg-[#1a1a1a] rounded-xl px-8 py-5 mb-6 border border-gray-200 dark:border-background/10">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">
                  Booking Reference
                </span>
                <span className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold font-black text-primary tracking-wider">
                  #{bookingRef}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-base mb-6">
                Your booking has been confirmed! Our team will contact you within 24 hours.
              </p>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 rounded-xl p-4 mb-6 text-sm text-green-700 dark:text-green-400">
                A confirmation will be sent to <strong>{form.email}</strong>
              </div>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({ fullName: '', email: '', phone: '', city: '', model: '', bookingDate: '', paymentMethod: '', message: '' });
                }}
                className="bg-primary hover:bg-[#c0151f] text-primary-foreground font-semibold px-8 py-3 rounded-xl transition-colors duration-200"
              >
                Make Another Booking
              </button>
            </div>
          </div>
        ) : (
          /* ── Form Card ── */
          <div className="bg-background dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-background/10 shadow-xl p-8">
            <h2 className="text-xl md:text-2xl font-semibold font-bold text-gray-900 dark:text-primary-foreground mb-1">
              Booking Details
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Fill in the form below and we'll get back to you shortly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {!loadingProfile && !isLoggedIn && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>Have an account?</strong> Log in to auto-fill your details and track your booking.
                  </div>
                  <Link href={`/login?redirect=/book-now${form.model ? `?model=${encodeURIComponent(form.model)}` : ''}`} className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
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

              {/* Full Name */}
              <div>
                <label className={labelClass} htmlFor="fullName">
                  <span className="flex items-center justify-between w-full">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-primary" /> Full Name
                    </span>
                    {user?.fullName && form.fullName === user.fullName && (
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">✓ Profile</span>
                    )}
                  </span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  placeholder="e.g. Ravi Sharma"
                  value={form.fullName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} htmlFor="email">
                    <span className="flex items-center justify-between w-full">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-primary" /> Email
                      </span>
                      {user?.email && form.email === user.email && !user.email.startsWith("placeholder-") && (
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">✓ Profile</span>
                      )}
                    </span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="phone">
                    <span className="flex items-center justify-between w-full">
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-primary" /> Phone Number
                      </span>
                      {user?.phone && form.phone && user.phone.includes(form.phone) && (
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">✓ Profile</span>
                      )}
                    </span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="+977 98XXXXXXXX"
                    value={form.phone}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className={labelClass} htmlFor="city">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" /> City
                  </span>
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  placeholder="e.g. Kathmandu"
                  value={form.city}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Model */}
              <div>
                <label className={labelClass} htmlFor="model">
                  <span className="flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-primary" /> Model Interested In
                  </span>
                </label>
                <select
                  id="model"
                  name="model"
                  required
                  value={form.model}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select a model</option>
                  {HONDA_MODELS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Date & Payment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} htmlFor="bookingDate">
                    <span className="flex items-center gap-1.5">
                      <CalendarCheck className="w-3.5 h-3.5 text-primary" /> Preferred Date
                    </span>
                  </label>
                  <input
                    id="bookingDate"
                    name="bookingDate"
                    type="date"
                    required
                    value={form.bookingDate}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="paymentMethod">
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-primary" /> Payment Method
                    </span>
                  </label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    required
                    value={form.paymentMethod}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Select method</option>
                    <option value="Cash">Cash</option>
                    <option value="EMI">EMI</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className={labelClass} htmlFor="message">
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-primary" /> Special Message
                  </span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Any special requests or notes..."
                  value={form.message}
                  onChange={handleChange}
                  className={inputClass + ' resize-none'}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-[#c0151f] disabled:opacity-70 disabled:cursor-not-allowed text-primary-foreground font-bold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm tracking-wide shadow-lg shadow-primary/30"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <CalendarCheck className="w-4 h-4" />
                    Confirm Booking
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
