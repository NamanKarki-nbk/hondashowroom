'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bike,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Star,
  CheckCircle,
  ChevronRight,
  Calendar,
  FileText,
} from 'lucide-react';

const HONDA_MODELS = [
  'CB Hornet 2.0',
  'Honda NX 200',
  'Honda Shine BS6',
  'Honda SP 125',
  'Honda Dio 125',
  'Honda Dio BS6',
  'Generator - EZ3000CX',
  'Generator - EZ6500CXS',
  'Generator - EU70is',
  'Generator - EG 1000',
  'Generator - EP 1000',
  'Generator - EP 1800CX',
  'Generator - EU10I',
  'Generator - EU22i',
  'Generator - EU30IS',
  'Trimmer - HHH25D75UT',
  'Lawn Mower - HRU216M3TBUH',
  'Lawn Mower - HRU 196',
  'Water pump - WV30D',
  'Water pump - WB30XD',
  'Brush Cutter - UMK 435T',
  'Brush Cutter - UMR 435T',
  'Tiller - FQ650',
  'Tiller - F300',
  'Sprayer - WJR2525T1',
  'Sprayer - WJR4025T',
];

const FEATURES = [
  {
    icon: Star,
    title: 'Free of Charge',
    desc: 'Enjoy a complimentary test ride with no hidden fees or obligations.',
  },
  {
    icon: CheckCircle,
    title: 'Certified Instructors',
    desc: 'Our trained staff will guide you through every feature safely.',
  },
  {
    icon: Bike,
    title: 'All Models Available',
    desc: 'Test ride any Honda model from our full showroom lineup.',
  },
];

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  model: string;
  preferredDate: string;
  preferredTime: string;
  location: string;
  notes: string;
}

export default function TestRidePage() {
  const [form, setForm] = useState<FormData>({
    fullName: '',
    phone: '',
    email: '',
    model: '',
    preferredDate: '',
    preferredTime: '',
    location: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [rideId, setRideId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Book a Test Ride | Honda Showroom';
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
    const id = 'TR-' + String(Math.floor(100000 + Math.random() * 900000));
    setRideId(id);
    setSubmitted(true);
    setLoading(false);
  };

  const inputClass =
    'bg-background dark:bg-[#111] border border-gray-200 dark:border-background/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none text-gray-900 dark:text-primary-foreground w-full text-sm transition-all duration-200';
  const labelClass = 'text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block';

  return (
    <main className="min-h-screen bg-background dark:bg-[#0B0B0C] pt-28 pb-20">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-[#c0151f] to-[#8b0000] py-14 px-6 mb-12">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuMDYiLz48L3N2Zz4=')] opacity-40" />
        <div className="relative max-w-3xl mx-auto text-center">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-1.5 text-primary-foreground/70 text-sm mb-6">
            <Link href="/" className="hover:text-primary-foreground transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-primary-foreground font-medium">Test Ride</span>
          </nav>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bike className="w-10 h-10 text-primary-foreground/90" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-primary-foreground tracking-tight mb-3">
            Book a Test Ride
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto">
            Experience your Honda before you buy it. Feel the power, comfort, and precision firsthand.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-background dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-background/10 p-6 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-primary-foreground text-sm mb-1.5">{title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {submitted ? (
          /* ── Success Card ── */
          <div className="bg-background dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-background/10 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-8 text-center">
              <CheckCircle className="w-16 h-16 text-primary-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-primary-foreground mb-1">Test Ride Scheduled!</h2>
              <p className="text-primary-foreground/80 text-sm">We look forward to seeing you at the showroom.</p>
            </div>
            <div className="p-8 text-center">
              <div className="inline-flex flex-col items-center bg-background dark:bg-[#1a1a1a] rounded-xl px-8 py-5 mb-6 border border-gray-200 dark:border-background/10">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">
                  Test Ride ID
                </span>
                <span className="text-2xl font-black text-primary tracking-wider">{rideId}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-base mb-4">
                Your test ride has been scheduled! Our team will confirm your slot via phone.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 rounded-xl p-4 mb-6 text-sm text-blue-700 dark:text-blue-400">
                📅 <strong>{form.preferredDate}</strong> &nbsp;·&nbsp; {form.preferredTime} &nbsp;·&nbsp; <strong>{form.model}</strong>
              </div>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({ fullName: '', phone: '', email: '', model: '', preferredDate: '', preferredTime: '', location: '', notes: '' });
                }}
                className="bg-primary hover:bg-[#c0151f] text-primary-foreground font-semibold px-8 py-3 rounded-xl transition-colors duration-200"
              >
                Book Another Ride
              </button>
            </div>
          </div>
        ) : (
          /* ── Form Card ── */
          <div className="bg-background dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-background/10 shadow-xl p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-primary-foreground mb-1">
              Schedule Your Test Ride
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Fill in your details and pick a convenient slot. It's 100% free!
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} htmlFor="fullName">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-primary" /> Full Name
                    </span>
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    placeholder="e.g. Sita Thapa"
                    value={form.fullName}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="phone">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-primary" /> Phone Number
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

              {/* Email */}
              <div>
                <label className={labelClass} htmlFor="email">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-primary" /> Email
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

              {/* Model */}
              <div>
                <label className={labelClass} htmlFor="model">
                  <span className="flex items-center gap-1.5">
                    <Bike className="w-3.5 h-3.5 text-primary" /> Preferred Model
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

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} htmlFor="preferredDate">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" /> Preferred Date
                    </span>
                  </label>
                  <input
                    id="preferredDate"
                    name="preferredDate"
                    type="date"
                    required
                    value={form.preferredDate}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="preferredTime">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary" /> Preferred Time
                    </span>
                  </label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    required
                    value={form.preferredTime}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Select time slot</option>
                    <option value="Morning 9–12">Morning 9–12</option>
                    <option value="Afternoon 12–4">Afternoon 12–4</option>
                    <option value="Evening 4–6">Evening 4–6</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className={labelClass} htmlFor="location">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" /> Your Location / Address
                  </span>
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  placeholder="e.g. Baneshwor, Kathmandu"
                  value={form.location}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Notes */}
              <div>
                <label className={labelClass} htmlFor="notes">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-primary" /> Additional Notes
                  </span>
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  placeholder="Any special requirements or questions..."
                  value={form.notes}
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
                    Scheduling...
                  </>
                ) : (
                  <>
                    <Bike className="w-4 h-4" />
                    Schedule Test Ride
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
