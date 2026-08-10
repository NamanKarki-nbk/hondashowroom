"use client";

import React, { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, FileText, Camera, Loader2, Save } from "lucide-react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    bio: "",
    address: "",
    avatarUrl: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setFormData({
            fullName: data.user.fullName || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
            bio: data.user.bio || "",
            address: data.user.address || "",
            avatarUrl: data.user.avatarUrl || ""
          });
        }
      } else {
        setMessage({ type: "error", text: "Failed to load profile data." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "An error occurred while fetching profile." });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update profile." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3ebdd] dark:bg-[#0B0B0C] flex items-center justify-center pt-24">
        <Loader2 className="w-8 h-8 text-[#c1291A] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3ebdd] dark:bg-[#0B0B0C] pt-32 pb-16 px-6 font-sans">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 dark:text-[#f3ebdd] mb-8">My Profile</h1>

        {message.text && (
          <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 pb-10 border-b border-gray-100 dark:border-slate-800">
            <div className="relative group">
              {formData.avatarUrl ? (
                <img src={formData.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-[#f3ebdd] dark:border-slate-800" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#c1291A] to-orange-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : (formData.email ? formData.email.charAt(0).toUpperCase() : "U")}
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-gray-900 dark:text-[#f3ebdd]">{formData.fullName || "Update your name"}</h2>
              <p className="text-sm text-gray-500 mt-1">This information will be displayed on your account.</p>
              
              <div className="mt-3">
                 <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Avatar Image URL (Optional)</label>
                 <input 
                   type="url" 
                   name="avatarUrl" 
                   value={formData.avatarUrl} 
                   onChange={handleInputChange} 
                   placeholder="https://example.com/avatar.jpg" 
                   className="w-full bg-[#f3ebdd]/50 dark:bg-black/50 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#c1291A] outline-none text-gray-900 dark:text-[#f3ebdd]"
                 />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <User className="w-4 h-4 text-[#c1291A]" /> Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full bg-[#f3ebdd] dark:bg-black border border-transparent dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#c1291A] outline-none text-gray-900 dark:text-[#f3ebdd] transition-all"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#c1291A]" /> Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-[#f3ebdd] dark:bg-black border border-transparent dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#c1291A] outline-none text-gray-900 dark:text-[#f3ebdd] transition-all"
                placeholder="you@example.com"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#c1291A]" /> Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full bg-[#f3ebdd] dark:bg-black border border-transparent dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#c1291A] outline-none text-gray-900 dark:text-[#f3ebdd] transition-all"
                placeholder="+977 98XXXXXXXX"
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#c1291A]" /> Full Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full bg-[#f3ebdd] dark:bg-black border border-transparent dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#c1291A] outline-none text-gray-900 dark:text-[#f3ebdd] transition-all"
                placeholder="Kathmandu, Nepal"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#c1291A]" /> Bio / Notes
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-[#f3ebdd] dark:bg-black border border-transparent dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#c1291A] outline-none text-gray-900 dark:text-[#f3ebdd] transition-all resize-none"
                placeholder="Tell us a little about your riding experience..."
              ></textarea>
            </div>
          </div>

          <div className="mt-10 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#c1291A] hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-[#c1291A]/30 disabled:opacity-50 disabled:pointer-events-none"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {saving ? "Saving Changes..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
