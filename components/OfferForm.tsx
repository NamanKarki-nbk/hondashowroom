"use client";

import React, { useState } from "react";
import { User, Phone, Mail, Car, MessageSquare, CheckCircle, Tag } from "lucide-react";

const MODELS = [
  "CB Hornet 2.0", "Honda NX 200", "Honda Shine BS6", "Honda SP 125",
  "Honda Dio 125", "Honda Dio BS6", "EG 1000", "EP 1000", "EU22i", "HRU 196",
];

export default function OfferForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", model: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          interestedIn: form.model,
          remarks: `Email: ${form.email}\nOffer Message: ${form.message}`,
          source: 'Offer Application'
        })
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center py-8">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-5">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold font-black text-gray-900 dark:text-primary-foreground mb-2">Application Received!</h2>
        <p className="text-gray-500 text-sm max-w-sm">
          Thank you! Our team will review your application and contact you within 24 hours with offer details.
        </p>
        <button
          onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", model: "", message: "" }); }}
          className="mt-6 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary-hover transition-colors"
        >
          Apply for Another
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold font-black text-gray-900 dark:text-primary-foreground">Apply for an Offer</h2>
        <p className="text-sm text-gray-500 mt-1">Fill in your details and our team will reach out with the best deal for you.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Your name" className="w-full bg-background dark:bg-slate-950 border border-gray-200 dark:border-background/10 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary outline-none text-gray-900 dark:text-primary-foreground text-sm" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Phone Number *</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input required value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} placeholder="98XXXXXXXX" className="w-full bg-background dark:bg-slate-950 border border-gray-200 dark:border-background/10 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary outline-none text-gray-900 dark:text-primary-foreground text-sm" />
            </div>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="you@example.com" className="w-full bg-background dark:bg-slate-950 border border-gray-200 dark:border-background/10 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary outline-none text-gray-900 dark:text-primary-foreground text-sm" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Model Interested In *</label>
          <div className="relative">
            <Car className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select required value={form.model} onChange={e => setForm(f => ({...f, model: e.target.value}))} className="w-full bg-background dark:bg-slate-950 border border-gray-200 dark:border-background/10 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary outline-none text-gray-900 dark:text-primary-foreground text-sm appearance-none">
              <option value="">Select a model</option>
              {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Message / Offer You're Interested In</label>
          <div className="relative">
            <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
            <textarea rows={3} value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} placeholder="Tell us which offer you'd like to avail..." className="w-full bg-background dark:bg-slate-950 border border-gray-200 dark:border-background/10 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary outline-none text-gray-900 dark:text-primary-foreground text-sm resize-none" />
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-hover disabled:opacity-70 text-primary-foreground py-3.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
          {loading ? <span className="animate-spin w-4 h-4 border-2 border-background border-t-transparent rounded-full" /> : <Tag className="w-4 h-4" />}
          {loading ? "Submitting..." : "Apply for Offer"}
        </button>
      </form>
    </>
  );
}
