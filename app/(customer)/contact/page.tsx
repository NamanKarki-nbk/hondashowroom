"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

function ContactForm() {
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formDataState, setFormDataState] = useState({
    name: '',
    phone: '',
    interestedIn: '',
    remarks: ''
  });

  useEffect(() => {
    const interestedInParam = searchParams.get('interestedIn');
    const remarksParam = searchParams.get('remarks');
    if (interestedInParam || remarksParam) {
      setFormDataState(prev => ({
        ...prev,
        interestedIn: interestedInParam || prev.interestedIn,
        remarks: remarksParam || prev.remarks
      }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      interestedIn: formData.get('interestedIn'),
      remarks: formData.get('remarks'),
      source: 'Website Contact Form'
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
      } else {
        alert("Failed to submit your inquiry. Please try again or call us.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-28 pb-12">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold md:text-4xl font-bold md:text-5xl font-extrabold text-gray-900 mb-4">
            Get in <span className="text-primary">Touch</span>
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-gray-600 max-w-2xl mx-auto">
            Have questions about a new vehicle, finance options, or need to schedule a service? We are here to help!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 bg-white rounded-2xl shadow-xl overflow-hidden">
          
          {/* Contact Info & Map */}
          <div className="bg-gray-900 text-white p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold font-bold mb-8 text-white">Contact Information</h2>
            
            <div className="space-y-6 mb-12">
              <div className="flex items-start">
                <MapPin className="w-6 h-6 text-primary mr-4 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg text-white">Showroom Address</h4>
                  <p className="text-gray-400">Goarkha Department Building, Ganga Nagari, Damak-05<br/>Jhapa, Koshi Province, Nepal</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="w-6 h-6 text-primary mr-4 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg text-white">Phone</h4>
                  <p className="text-gray-400">9801615250</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="w-6 h-6 text-primary mr-4 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg text-white">Email</h4>
                  <p className="text-gray-400">info@damakhonda.com.np</p>
                </div>
              </div>
            </div>

            {/* Google Map Embed */}
            <div className="w-full h-64 bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14251.365311210214!2d87.683311!3d26.664426!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e58e3f9eb28117%3A0xcda6b00ecdf5f9a6!2sDamak%20Honda!5e0!3m2!1sen!2snp!4v1684820231920!5m2!1sen!2snp" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Form */}
          <div className="p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold font-bold text-gray-900 mb-8">Send an Inquiry</h2>
            
            {success ? (
              <div className="bg-green-50 text-green-800 border border-green-200 rounded-xl p-6 text-center">
                <h3 className="text-xl md:text-2xl font-semibold font-bold mb-2">Thank You!</h3>
                <p>Your inquiry has been received. Our sales team will contact you shortly.</p>
                <button 
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name <span className="text-primary">*</span></label>
                    <input 
                      type="text" 
                      name="name" 
                      required
                      value={formDataState.name}
                      onChange={e => setFormDataState({...formDataState, name: e.target.value})}
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary p-3 border"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number <span className="text-primary">*</span></label>
                    <input 
                      type="tel" 
                      name="phone" 
                      required
                      value={formDataState.phone}
                      onChange={e => setFormDataState({...formDataState, phone: e.target.value})}
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary p-3 border"
                      placeholder="98XXXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interested In</label>
                  <select 
                    name="interestedIn"
                    value={formDataState.interestedIn}
                    onChange={e => setFormDataState({...formDataState, interestedIn: e.target.value})}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary p-3 border bg-white"
                  >
                    <option value="">-- Select an Option --</option>
                    <option value="New Vehicle Purchase">New Vehicle Purchase</option>
                    <option value="Finance Inquiry">Finance Inquiry</option>
                    <option value="Exchange Valuation">Exchange Valuation</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea 
                    name="remarks" 
                    rows={6}
                    value={formDataState.remarks}
                    onChange={e => setFormDataState({...formDataState, remarks: e.target.value})}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary p-3 border"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors flex items-center justify-center shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...</>
                  ) : (
                    <><Send className="w-5 h-5 mr-2" /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <ContactForm />
    </Suspense>
  );
}
