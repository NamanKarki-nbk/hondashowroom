'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeftRight,
  Car,
  Wrench,
  Star,
  CheckCircle,
  Clock,
  ChevronRight,
  User,
  Phone,
  Mail,
  MessageSquare,
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

const YEARS = Array.from({ length: 11 }, (_, i) => String(2025 - i));

const HOW_IT_WORKS = [
  {
    icon: Car,
    step: '01',
    title: 'Submit Details',
    desc: 'Fill in your current vehicle information and the Honda model you want.',
  },
  {
    icon: Star,
    step: '02',
    title: 'Get Valuation',
    desc: 'Our experts evaluate your vehicle and provide a fair market valuation.',
  },
  {
    icon: ArrowLeftRight,
    step: '03',
    title: 'Choose New Honda',
    desc: 'Pick your new Honda and apply your trade-in value as a discount.',
  },
  {
    icon: CheckCircle,
    step: '04',
    title: 'Drive Home',
    desc: 'Complete the paperwork and drive home in your brand new Honda.',
  },
];

interface FormData {
  name: string;
  phone: string;
  email: string;
  currentBrand: string;
  currentModel: string;
  yearOfPurchase: string;
  kmDriven: string;
  condition: string;
  newModel: string;
  message: string;
}

export default function ExchangePage() {
  const [form, setForm] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    currentBrand: '',
    currentModel: '',
    yearOfPurchase: '',
    kmDriven: '',
    condition: '',
    newModel: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Vehicle Exchange & Trade-In | Honda Showroom';
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
    const id = 'EX-' + String(Math.floor(100000 + Math.random() * 900000));
    setRefId(id);
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
            <span className="text-[#f3ebdd] font-medium">Exchange</span>
          </nav>
          <div className="flex items-center justify-center gap-3 mb-4">
            <ArrowLeftRight className="w-10 h-10 text-[#f3ebdd]/90" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#f3ebdd] tracking-tight mb-3">
            Vehicle Exchange / Trade-In
          </h1>
          <p className="text-[#f3ebdd]/80 text-lg max-w-xl mx-auto">
            Trade in your old vehicle and upgrade to a new Honda — fast, fair, and hassle-free.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        {/* How It Works */}
        <div className="mb-10">
          <h2 className="text-center text-xl font-bold text-gray-900 dark:text-[#f3ebdd] mb-6">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HOW_IT_WORKS.map(({ icon: Icon, step, title, desc }) => (
              <div
                key={step}
                className="relative bg-[#f3ebdd] dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#f3ebdd]/10 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <span className="absolute top-4 right-4 text-3xl font-black text-gray-100 dark:text-[#f3ebdd]/5 select-none">
                  {step}
                </span>
                <div className="w-10 h-10 rounded-full bg-[#c1291A]/10 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-[#c1291A]" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-[#f3ebdd] text-sm mb-1">{title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {submitted ? (
          /* ── Success Card ── */
          <div className="bg-[#f3ebdd] dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#f3ebdd]/10 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-8 text-center">
              <CheckCircle className="w-16 h-16 text-[#f3ebdd] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#f3ebdd] mb-1">Valuation Submitted!</h2>
              <p className="text-[#f3ebdd]/80 text-sm">Our experts are reviewing your vehicle details.</p>
            </div>
            <div className="p-8 text-center">
              <div className="inline-flex flex-col items-center bg-[#f3ebdd] dark:bg-[#1a1a1a] rounded-xl px-8 py-5 mb-6 border border-gray-200 dark:border-[#f3ebdd]/10">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">
                  Exchange Reference ID
                </span>
                <span className="text-2xl font-black text-[#c1291A] tracking-wider">{refId}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-left">
                <div className="bg-[#f3ebdd] dark:bg-[#1a1a1a] rounded-xl p-4 border border-gray-200 dark:border-[#f3ebdd]/10">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Your Vehicle</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-[#f3ebdd]">
                    {form.currentBrand} {form.currentModel} ({form.yearOfPurchase})
                  </p>
                </div>
                <div className="bg-[#f3ebdd] dark:bg-[#1a1a1a] rounded-xl p-4 border border-gray-200 dark:border-[#f3ebdd]/10">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">New Honda</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-[#f3ebdd]">{form.newModel}</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4 mb-6 text-sm text-amber-700 dark:text-amber-400">
                <Clock className="w-4 h-4 shrink-0" />
                Our valuation team will call you at <strong className="ml-1">{form.phone}</strong> within 24 hours.
              </div>

              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: '', phone: '', email: '', currentBrand: '', currentModel: '', yearOfPurchase: '', kmDriven: '', condition: '', newModel: '', message: '' });
                }}
                className="bg-[#c1291A] hover:bg-[#c0151f] text-[#f3ebdd] font-semibold px-8 py-3 rounded-xl transition-colors duration-200"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          /* ── Form Card ── */
          <div className="bg-[#f3ebdd] dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#f3ebdd]/10 shadow-xl p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-[#f3ebdd] mb-1">
              Trade-In Request Form
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Share your vehicle details and we'll provide a fair valuation.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="pb-4 border-b border-gray-100 dark:border-[#f3ebdd]/10">
                <p className="text-xs font-bold uppercase tracking-widest text-[#c1291A] mb-4">
                  Personal Information
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={labelClass} htmlFor="name">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#c1291A]" /> Your Name
                      </span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="e.g. Bikash Karki"
                      value={form.name}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="phone">
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#c1291A]" /> Phone
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
              </div>

              {/* Current Vehicle */}
              <div className="pb-4 border-b border-gray-100 dark:border-[#f3ebdd]/10">
                <p className="text-xs font-bold uppercase tracking-widest text-[#c1291A] mb-4">
                  Current Vehicle Details
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={labelClass} htmlFor="currentBrand">
                      <span className="flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5 text-[#c1291A]" /> Vehicle Brand
                      </span>
                    </label>
                    <input
                      id="currentBrand"
                      name="currentBrand"
                      type="text"
                      required
                      placeholder="e.g. Yamaha, Bajaj, TVS"
                      value={form.currentBrand}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="currentModel">
                      <span className="flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5 text-[#c1291A]" /> Vehicle Model
                      </span>
                    </label>
                    <input
                      id="currentModel"
                      name="currentModel"
                      type="text"
                      required
                      placeholder="e.g. FZ-S, Pulsar 150"
                      value={form.currentModel}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className={labelClass} htmlFor="yearOfPurchase">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#c1291A]" /> Year of Purchase
                      </span>
                    </label>
                    <select
                      id="yearOfPurchase"
                      name="yearOfPurchase"
                      required
                      value={form.yearOfPurchase}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select year</option>
                      {YEARS.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="kmDriven">
                      <span className="flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-[#c1291A]" /> KM Driven
                      </span>
                    </label>
                    <select
                      id="kmDriven"
                      name="kmDriven"
                      required
                      value={form.kmDriven}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select range</option>
                      <option value="Under 10,000">Under 10,000</option>
                      <option value="10,000–30,000">10,000–30,000</option>
                      <option value="30,000–60,000">30,000–60,000</option>
                      <option value="60,000+">60,000+</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="condition">
                      <span className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-[#c1291A]" /> Vehicle Condition
                      </span>
                    </label>
                    <select
                      id="condition"
                      name="condition"
                      required
                      value={form.condition}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select condition</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Average">Average</option>
                      <option value="Needs Repair">Needs Repair</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* New Honda */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#c1291A] mb-4">
                  Desired Honda Model
                </p>
                <div className="mb-4">
                  <label className={labelClass} htmlFor="newModel">
                    <span className="flex items-center gap-1.5">
                      <ArrowLeftRight className="w-3.5 h-3.5 text-[#c1291A]" /> New Honda Model Interested In
                    </span>
                  </label>
                  <select
                    id="newModel"
                    name="newModel"
                    required
                    value={form.newModel}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Select a model</option>
                    {HONDA_MODELS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className={labelClass} htmlFor="message">
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-[#c1291A]" /> Any Message
                    </span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    placeholder="Any additional information about your vehicle or questions..."
                    value={form.message}
                    onChange={handleChange}
                    className={inputClass + ' resize-none'}
                  />
                </div>
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
                    Submitting...
                  </>
                ) : (
                  <>
                    <ArrowLeftRight className="w-4 h-4" />
                    Submit for Valuation
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
