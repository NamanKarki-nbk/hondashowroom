"use client";

import React, { useState, useEffect } from 'react';
import { Gift, Users, Copy, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

export default function ReferralsPage() {
  const [data, setData] = useState<{loyaltyPoints: number, referrals: any[]}>({ loyaltyPoints: 0, referrals: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    referredName: "",
    referredPhone: "",
    remarks: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/customer/referrals');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch('/api/customer/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const json = await res.json();

      if (res.ok) {
        setSuccessMsg("Referral submitted successfully!");
        setFormData({ referredName: "", referredPhone: "", remarks: "" });
        fetchData();
      } else {
        setErrorMsg(json.error || "Failed to submit referral.");
      }
    } catch (error) {
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none text-gray-900 dark:text-white";
  const labelClass = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5";

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-28 pb-12">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Refer & <span className="text-primary">Earn</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Refer your friends and family to our Honda showroom. When they buy a vehicle or book a service, you earn Loyalty Points for exciting rewards!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Points Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-primary to-red-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <Gift className="w-10 h-10 mb-4 opacity-80" />
              <p className="text-white/80 text-sm font-semibold mb-1 uppercase tracking-wider">Your Balance</p>
              <h2 className="text-5xl font-black mb-2 flex items-baseline gap-2">
                {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : data.loyaltyPoints}
                <span className="text-lg font-medium opacity-80 text-white">Points</span>
              </h2>
              <p className="text-white/70 text-sm mt-4 leading-relaxed">
                Use your points for discounts on AMC plans, servicing, or genuine Honda accessories.
              </p>
            </div>
            
            {/* Submit Referral Form */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Submit a Referral
              </h3>
              
              {successMsg && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded-xl text-sm font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> {successMsg}
                </div>
              )}
              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded-xl text-sm font-medium">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={labelClass}>Friend's Name</label>
                  <input
                    type="text"
                    required
                    value={formData.referredName}
                    onChange={e => setFormData({...formData, referredName: e.target.value})}
                    placeholder="e.g. Rahul Sharma"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Friend's Phone</label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={formData.referredPhone}
                    onChange={e => setFormData({...formData, referredPhone: e.target.value})}
                    placeholder="10-digit mobile number"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Remarks (Optional)</label>
                  <textarea
                    rows={2}
                    value={formData.remarks}
                    onChange={e => setFormData({...formData, remarks: e.target.value})}
                    placeholder="e.g. Interested in Honda Shine"
                    className={inputClass}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Referral"}
                </button>
              </form>
            </div>
          </div>

          {/* History */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 h-full p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Referral History</h3>
              
              {isLoading ? (
                <div className="py-12 flex justify-center text-gray-400">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : data.referrals.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-gray-900 dark:text-white font-bold mb-1">No referrals yet</h4>
                  <p className="text-gray-500 text-sm">Start referring your friends to earn points.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.referrals.map((ref) => (
                    <div key={ref.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/50">
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{ref.referredName}</h4>
                        <p className="text-sm text-gray-500">{ref.referredPhone}</p>
                        {ref.remarks && <p className="text-xs text-gray-400 mt-1 italic">"{ref.remarks}"</p>}
                      </div>
                      <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-1 w-full sm:w-auto">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                          ref.status === 'SUCCESS' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          ref.status === 'REWARDED' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                          'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                          {ref.status}
                        </span>
                        {ref.rewardPoints > 0 && (
                          <span className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                            +{ref.rewardPoints} pts
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
