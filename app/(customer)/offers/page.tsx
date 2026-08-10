"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, Tag, Percent, Gift, Clock, CheckCircle, Zap, Phone, Mail, User, Car, MessageSquare } from "lucide-react";

const OFFERS = [
  {
    id: 1,
    title: "Festive Season Offer",
    badge: "LIMITED TIME",
    badgeColor: "bg-red-500",
    discount: "Up to NPR 15,000 off",
    description: "Get exciting discounts on select Honda scooters and motorcycles this festive season. Valid on CB Hornet, Dio 125, and SP 125.",
    validTill: "31 August 2026",
    icon: Gift,
    models: ["CB Hornet 2.0", "Honda Dio 125", "Honda SP 125"],
    highlight: true,
  },
  {
    id: 2,
    title: "Zero Down Payment EMI",
    badge: "FINANCE OFFER",
    badgeColor: "bg-blue-500",
    discount: "0% Down Payment",
    description: "Drive home your new Honda today with zero down payment. Special EMI plans starting from NPR 4,999/month.",
    validTill: "30 September 2026",
    icon: Percent,
    models: ["All Models"],
    highlight: false,
  },
  {
    id: 3,
    title: "Exchange Bonus",
    badge: "EXCHANGE",
    badgeColor: "bg-green-500",
    discount: "Up to NPR 20,000 bonus",
    description: "Get extra exchange bonus when you trade in your old two-wheeler for a brand new Honda. Avail this exclusive offer now!",
    validTill: "15 September 2026",
    icon: Zap,
    models: ["Honda NX 200", "CB Hornet 2.0", "Honda Shine BS6"],
    highlight: false,
  },
  {
    id: 4,
    title: "Free Accessories Pack",
    badge: "VALUE ADD",
    badgeColor: "bg-amber-500",
    discount: "Worth NPR 8,000 FREE",
    description: "Purchase any Honda scooter and get a free accessories kit including helmet, riding gloves, and a cover.",
    validTill: "20 August 2026",
    icon: Gift,
    models: ["Honda Dio 125", "Honda Dio BS6"],
    highlight: false,
  },
];

const MODELS = [
  "CB Hornet 2.0", "Honda NX 200", "Honda Shine BS6", "Honda SP 125",
  "Honda Dio 125", "Honda Dio BS6", "EG 1000", "EP 1000", "EU22i", "HRU 196",
];

export default function OffersPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", model: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#f3ebdd] dark:bg-[#0B0B0C] pt-28 pb-24">

      {/* Hero */}
      <div className="bg-[#f3ebdd] dark:bg-[#111] border-b border-gray-100 dark:border-[#f3ebdd]/5">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-[#c1291A] flex items-center gap-1 transition-colors">
              <Home className="w-3.5 h-3.5" /> Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 dark:text-[#f3ebdd] font-medium">Offers</span>
          </nav>

          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-[#c1291A]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Tag className="w-8 h-8 text-[#c1291A]" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-[#f3ebdd] tracking-tight">
                Current Offers & Deals
              </h1>
              <p className="text-gray-500 mt-1.5 max-w-2xl">
                Exclusive offers on Honda motorcycles, scooters, and power products. Limited time deals — don't miss out!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-black text-gray-900 dark:text-[#f3ebdd] mb-8">Active Promotions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {OFFERS.map((offer) => {
            const Icon = offer.icon;
            return (
              <div
                key={offer.id}
                className={`relative bg-[#f3ebdd] dark:bg-[#111] rounded-2xl border overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl ${
                  offer.highlight
                    ? "border-[#c1291A] shadow-lg shadow-red-100 dark:shadow-red-900/20"
                    : "border-gray-200 dark:border-[#f3ebdd]/8"
                }`}
              >
                {offer.highlight && (
                  <div className="absolute top-0 left-0 right-0 bg-[#c1291A] text-[#f3ebdd] text-xs font-bold text-center py-1.5 tracking-widest uppercase">
                    ⭐ Best Deal
                  </div>
                )}
                <div className={`p-6 ${offer.highlight ? "mt-7" : ""}`}>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-12 h-12 bg-[#f3ebdd] dark:bg-[#1A1A1A] rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-[#c1291A]" />
                    </div>
                    <span className={`${offer.badgeColor} text-[#f3ebdd] text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider`}>
                      {offer.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-gray-900 dark:text-[#f3ebdd] mb-1">{offer.title}</h3>
                  <p className="text-2xl font-black text-[#c1291A] mb-3">{offer.discount}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{offer.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {offer.models.map((m) => (
                      <span key={m} className="text-xs bg-[#e8dfd1] dark:bg-[#1A1A1A] text-gray-600 dark:text-gray-400 px-2.5 py-1 rounded-full">
                        {m}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-[#f3ebdd]/5">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock className="w-3.5 h-3.5" /> Valid till {offer.validTill}
                    </div>
                    <button
                      onClick={() => document.getElementById("apply-form")?.scrollIntoView({ behavior: "smooth" })}
                      className="text-xs font-bold text-[#c1291A] hover:underline"
                    >
                      Apply Now →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Application Form */}
        <div id="apply-form" className="max-w-2xl mx-auto">
          <div className="bg-[#f3ebdd] dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-[#f3ebdd]/8 p-8 shadow-xl">
            {submitted ? (
              <div className="flex flex-col items-center text-center py-8">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-5">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-[#f3ebdd] mb-2">Application Received!</h2>
                <p className="text-gray-500 text-sm max-w-sm">
                  Thank you! Our team will review your application and contact you within 24 hours with offer details.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", model: "", message: "" }); }}
                  className="mt-6 px-6 py-2.5 bg-[#c1291A] text-[#f3ebdd] rounded-xl font-bold text-sm hover:bg-[#a02014] transition-colors"
                >
                  Apply for Another
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-black text-gray-900 dark:text-[#f3ebdd]">Apply for an Offer</h2>
                  <p className="text-sm text-gray-500 mt-1">Fill in your details and our team will reach out with the best deal for you.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Your name" className="w-full bg-[#f3ebdd] dark:bg-[#111] border border-gray-200 dark:border-[#f3ebdd]/10 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-[#c1291A] outline-none text-gray-900 dark:text-[#f3ebdd] text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Phone Number *</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input required value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} placeholder="98XXXXXXXX" className="w-full bg-[#f3ebdd] dark:bg-[#111] border border-gray-200 dark:border-[#f3ebdd]/10 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-[#c1291A] outline-none text-gray-900 dark:text-[#f3ebdd] text-sm" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="you@example.com" className="w-full bg-[#f3ebdd] dark:bg-[#111] border border-gray-200 dark:border-[#f3ebdd]/10 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-[#c1291A] outline-none text-gray-900 dark:text-[#f3ebdd] text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Model Interested In *</label>
                    <div className="relative">
                      <Car className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select required value={form.model} onChange={e => setForm(f => ({...f, model: e.target.value}))} className="w-full bg-[#f3ebdd] dark:bg-[#111] border border-gray-200 dark:border-[#f3ebdd]/10 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-[#c1291A] outline-none text-gray-900 dark:text-[#f3ebdd] text-sm appearance-none">
                        <option value="">Select a model</option>
                        {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Message / Offer You're Interested In</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                      <textarea rows={3} value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} placeholder="Tell us which offer you'd like to avail..." className="w-full bg-[#f3ebdd] dark:bg-[#111] border border-gray-200 dark:border-[#f3ebdd]/10 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-[#c1291A] outline-none text-gray-900 dark:text-[#f3ebdd] text-sm resize-none" />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-[#c1291A] hover:bg-[#a02014] disabled:opacity-70 text-[#f3ebdd] py-3.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
                    {loading ? <span className="animate-spin w-4 h-4 border-2 border-[#f3ebdd] border-t-transparent rounded-full" /> : <Tag className="w-4 h-4" />}
                    {loading ? "Submitting..." : "Apply for Offer"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
