"use client";

import React, { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import QuotationPDF from '@/components/admin/QuotationPDF';
import { Calculator, User, Phone, Bike, Calendar, FileDown, CheckCircle, Loader2 } from 'lucide-react';

export default function DigitalQuotationPage() {
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    bikeModel: 'CB Shine SP',
    basePrice: 235000,
    downPayment: 100000,
    tenureMonths: 24,
    interestRate: 14.5,
  });

  const [quotationData, setQuotationData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const calculateEMI = (e: React.FormEvent) => {
    e.preventDefault();
    const loanAmount = formData.basePrice - formData.downPayment;
    if (loanAmount <= 0) {
      alert("Down payment cannot be greater than or equal to Base Price.");
      return;
    }
    
    // Flat interest rate calculation for simplicity
    const totalInterest = loanAmount * (formData.interestRate / 100) * (formData.tenureMonths / 12);
    const totalPayable = loanAmount + totalInterest;
    const emiAmount = totalPayable / formData.tenureMonths;
    
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 15); // Valid for 15 days

    setQuotationData({
      ...formData,
      loanAmount,
      emiAmount,
      validUntil
    });
  };

  const saveQuotation = async () => {
    if (!quotationData) return;
    setIsSaving(true);
    try {
      // In a real scenario we would upload the PDF and save the URL, 
      // but here we just save the record data.
      const res = await fetch('/api/admin/finance/quotation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quotationData),
      });
      if (res.ok) {
        alert("Quotation saved successfully!");
      } else {
        alert("Failed to save quotation.");
      }
    } catch (error) {
      console.error(error);
      alert("Error saving quotation.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['basePrice', 'downPayment', 'tenureMonths', 'interestRate'].includes(name) 
        ? Number(value) 
        : value
    }));
    setQuotationData(null); // Reset when inputs change
  };

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 text-gray-100 p-8">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold font-extrabold text-primary-foreground mb-2 flex items-center gap-3">
          <Calculator className="w-8 h-8 text-primary" /> Digital Quotation Generator
        </h1>
        <p className="text-gray-400 mb-8">Create and export customized finance EMI quotations for customers.</p>
        
        <div className="grid lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <form onSubmit={calculateEMI} className="space-y-6">
                
                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Customer Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                      <input type="text" name="customerName" required value={formData.customerName} onChange={handleInputChange} className="w-full bg-black border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                      <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full bg-black border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary outline-none" />
                    </div>
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Vehicle Model</label>
                    <div className="relative">
                      <Bike className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                      <select name="bikeModel" required value={formData.bikeModel} onChange={handleInputChange} className="w-full bg-black border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary outline-none appearance-none">
                        <option value="CB Shine SP">CB Shine SP</option>
                        <option value="CBR 250RR">CBR 250RR</option>
                        <option value="Dio DLX">Dio DLX</option>
                        <option value="Hornet 2.0">Hornet 2.0</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Base Price (NPR)</label>
                    <input type="number" name="basePrice" required min="0" value={formData.basePrice} onChange={handleInputChange} className="w-full bg-black border border-slate-700 rounded-xl py-3 px-4 text-white focus:border-primary outline-none" />
                  </div>
                </div>

                {/* Finance Details */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Down Payment</label>
                    <input type="number" name="downPayment" required min="0" value={formData.downPayment} onChange={handleInputChange} className="w-full bg-black border border-slate-700 rounded-xl py-3 px-4 text-white focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Tenure (Months)</label>
                    <select name="tenureMonths" required value={formData.tenureMonths} onChange={handleInputChange} className="w-full bg-black border border-slate-700 rounded-xl py-3 px-4 text-white focus:border-primary outline-none appearance-none">
                      <option value="12">12 Months</option>
                      <option value="18">18 Months</option>
                      <option value="24">24 Months</option>
                      <option value="36">36 Months</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Interest (% p.a)</label>
                    <input type="number" name="interestRate" required step="0.1" value={formData.interestRate} onChange={handleInputChange} className="w-full bg-black border border-slate-700 rounded-xl py-3 px-4 text-white focus:border-primary outline-none" />
                  </div>
                </div>

                <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-bold transition-colors">
                  Calculate Quotation
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-5">
            {quotationData ? (
              <div className="bg-slate-900 border-2 border-primary/50 rounded-2xl p-6 shadow-2xl shadow-primary/10 sticky top-8">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-800">
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Calculated EMI</div>
                    <div className="text-3xl font-black text-white mt-1">NPR {Math.round(quotationData.emiAmount).toLocaleString()} <span className="text-sm font-medium text-gray-400">/mo</span></div>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Loan Amount</span>
                    <span className="text-white font-bold">NPR {quotationData.loanAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Down Payment</span>
                    <span className="text-white font-bold">NPR {quotationData.downPayment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Tenure</span>
                    <span className="text-white font-bold">{quotationData.tenureMonths} Months</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Interest Rate</span>
                    <span className="text-white font-bold">{quotationData.interestRate}% Flat</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {isClient && (
                    <PDFDownloadLink
                      document={<QuotationPDF data={quotationData} />}
                      fileName={`Quotation_${quotationData.customerName.replace(/\s+/g, '_')}.pdf`}
                      className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      {({ loading }) => (loading ? 'Generating PDF...' : <><FileDown className="w-5 h-5" /> Export PDF</>)}
                    </PDFDownloadLink>
                  )}
                  <button 
                    onClick={saveQuotation}
                    disabled={isSaving}
                    className="w-full bg-white/10 hover:bg-white/20 text-white py-3.5 rounded-xl font-bold transition-colors disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save to CRM'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
                <Calculator className="w-16 h-16 text-slate-700 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Ready to Calculate</h3>
                <p className="text-gray-400">Fill out the details on the left to generate an instant EMI breakdown and PDF quotation.</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
