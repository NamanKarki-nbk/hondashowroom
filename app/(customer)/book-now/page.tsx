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

const HONDA_MODELS = [
  'CB Hornet 2.0',
  'Honda NX 200',
  'Honda Shine BS6',
  'Honda SP 125',
  'Honda Dio 125',
  'Honda Dio BS6',
  'EG 1000',
  'EP 1000',
  'EP 1800CX',
  'EU22i',
  'EU30IS',
  'EU70is',
  'EZ3000CX',
  'EZ6500CXS',
  'F300',
  'HRU 196',
  'UMK 435T',
  'WB30XD',
];

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

  useEffect(() => {
    document.title = 'Book Your Honda | Honda Showroom';
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
    'bg-[#f3ebdd] dark:bg-[#111] border border-gray-200 dark:border-[#f3ebdd]/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#c1291A] outline-none text-gray-900 dark:text-[#f3ebdd] w-full text-sm transition-all duration-200';
  const labelClass = 'text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block';

  return (
    <main className="min-h-screen bg-[#f3ebdd] dark:bg-[#0B0B0C] pt-28 pb-20">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#c1291A] via-[#c0151f] to-[#8b0000] py-14 px-6 mb-12">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuMDYiLz48L3N2Zz4=')] opacity-40" />
        <div className="relative max-w-3xl mx-auto text-center">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-1.5 text-[#f3ebdd]/70 text-sm mb-6">
            <Link href="/" className="hover:text-[#f3ebdd] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#f3ebdd] font-medium">Book Now</span>
          </nav>
          <div className="flex items-center justify-center gap-3 mb-4">
            <CalendarCheck className="w-10 h-10 text-[#f3ebdd]/90" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#f3ebdd] tracking-tight mb-3">
            Book Your Honda
          </h1>
          <p className="text-[#f3ebdd]/80 text-lg max-w-xl mx-auto">
            Reserve your Honda vehicle with a booking deposit and secure your dream ride today.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4">
        {submitted ? (
          /* ── Success Card ── */
          <div className="bg-[#f3ebdd] dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#f3ebdd]/10 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-8 text-center">
              <CheckCircle2 className="w-16 h-16 text-[#f3ebdd] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#f3ebdd] mb-1">Booking Confirmed!</h2>
              <p className="text-[#f3ebdd]/80 text-sm">We're excited to have you on board.</p>
            </div>
            <div className="p-8 text-center">
              <div className="inline-flex flex-col items-center bg-[#f3ebdd] dark:bg-[#1a1a1a] rounded-xl px-8 py-5 mb-6 border border-gray-200 dark:border-[#f3ebdd]/10">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">
                  Booking Reference
                </span>
                <span className="text-3xl font-black text-[#c1291A] tracking-wider">
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
                className="bg-[#c1291A] hover:bg-[#c0151f] text-[#f3ebdd] font-semibold px-8 py-3 rounded-xl transition-colors duration-200"
              >
                Make Another Booking
              </button>
            </div>
          </div>
        ) : (
          /* ── Form Card ── */
          <div className="bg-[#f3ebdd] dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#f3ebdd]/10 shadow-xl p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-[#f3ebdd] mb-1">
              Booking Details
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Fill in the form below and we'll get back to you shortly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className={labelClass} htmlFor="fullName">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#c1291A]" /> Full Name
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
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#c1291A]" /> Email
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
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#c1291A]" /> Phone Number
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
                    <MapPin className="w-3.5 h-3.5 text-[#c1291A]" /> City
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
                    <Car className="w-3.5 h-3.5 text-[#c1291A]" /> Model Interested In
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
                      <CalendarCheck className="w-3.5 h-3.5 text-[#c1291A]" /> Preferred Date
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
                      <CreditCard className="w-3.5 h-3.5 text-[#c1291A]" /> Payment Method
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
                    <MessageSquare className="w-3.5 h-3.5 text-[#c1291A]" /> Special Message
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
                className="w-full bg-[#c1291A] hover:bg-[#c0151f] disabled:opacity-70 disabled:cursor-not-allowed text-[#f3ebdd] font-bold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm tracking-wide shadow-lg shadow-[#c1291A]/30"
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
