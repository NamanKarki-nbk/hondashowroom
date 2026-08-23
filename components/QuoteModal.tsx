"use client";

import React, { useState, useEffect } from "react";
import { Loader2, X, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function QuoteModal({
  isOpen,
  onClose,
  vehicleName,
}: {
  isOpen: boolean;
  onClose: () => void;
  vehicleName: string;
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    dealer: "Damak",
  });

  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
      // Try to fetch profile to auto-fill
      fetch("/api/profile")
        .then((res) => res.json())
        .then((data) => {
          if (data && data.customer) {
            setFormData((prev) => ({
              ...prev,
              name: data.customer.fullName || data.user?.name || prev.name,
              phone: data.customer.phone || data.user?.phone || prev.phone,
              email: data.customer.email || data.user?.email || prev.email,
            }));
          }
        })
        .catch(() => {}); // ignore error if not logged in
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          interestedIn: vehicleName,
          source: "Quotation Requested",
          remarks: `Preferred Dealer: ${formData.dealer}${
            formData.email ? ` | Email: ${formData.email}` : ""
          }`,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit request.");
      }

      setSuccess(true);
      toast.success("Quote request submitted successfully!");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      toast.error("Failed to submit quote request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-background dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-slate-800 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-[#CC0000] transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {success ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">
              Request Sent
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Our team will get back to you with the quotation for {vehicleName}{" "}
              shortly.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-1">
              Get A Quote
            </h2>
            <p className="text-sm text-[#CC0000] font-bold mb-6">{vehicleName}</p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Your Name"
                  className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#CC0000]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Mobile Number"
                  className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#CC0000]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Email Address"
                  className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#CC0000]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1">
                  Preferred Dealer
                </label>
                <select
                  value={formData.dealer}
                  onChange={(e) =>
                    setFormData({ ...formData, dealer: e.target.value })
                  }
                  className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#CC0000]"
                >
                  <option value="Damak">Damak</option>
                  <option value="Birtamode">Birtamode</option>
                  <option value="Urlabari">Urlabari</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#CC0000] hover:bg-[#B83227] text-white py-3 rounded-xl font-bold uppercase tracking-wider mt-2 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
