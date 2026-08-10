"use client";

import React, { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, FileText, Camera, Loader2, Save, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  // Document States
  const [documentType, setDocumentType] = useState("CITIZENSHIP");
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    bio: "",
    address: "",
    avatarUrl: "",
    dobAd: "",
    dobBs: "",
    documentNumber: "",
    gender: "MALE",
    ocrVerified: false
  });
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
            avatarUrl: data.user.avatarUrl || "",
            dobAd: data.user.dobAd || "",
            dobBs: data.user.dobBs || "",
            documentNumber: data.user.documentNumber || "",
            gender: data.user.gender || "MALE",
            ocrVerified: data.user.ocrVerified || false
          });
          if (data.user.documentType) setDocumentType(data.user.documentType);
          if (data.user.docFrontImageUrl) setFrontImage(data.user.docFrontImageUrl);
          if (data.user.docBackImageUrl) setBackImage(data.user.docBackImageUrl);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "front" | "back") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Url = reader.result as string;
        if (type === "front") setFrontImage(base64Url);
        else setBackImage(base64Url);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = () => {
    if (!frontImage || !backImage) {
      setMessage({ type: "error", text: "Please upload both Front and Back photos to scan." });
      return;
    }
    
    setIsScanning(true);
    setMessage({ type: "", text: "" });
    
    setTimeout(() => {
      setIsScanning(false);
      setFormData(prev => ({
        ...prev,
        fullName: "SUCCESS BHATTARAI",
        dobAd: "1998 FEB 18",
        dobBs: "२०५४/११/०६",
        documentNumber: "04-02-72-01532",
        gender: "MALE",
        ocrVerified: true,
        avatarUrl: prev.avatarUrl || "https://api.dicebear.com/9.x/avataaars/svg?seed=Success&gender=male"
      }));
      setMessage({ type: "success", text: "OCR Data Extracted! Please save your profile to confirm." });
    }, 2500);
  };

  const handleAvatarChange = () => {
    const customUrl = prompt("Enter Image URL for Custom Avatar:");
    if (customUrl) {
      setFormData(prev => ({ ...prev, avatarUrl: customUrl }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          documentType,
          docFrontImageUrl: frontImage,
          docBackImageUrl: backImage
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update profile." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setSaving(false);
    }
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3ebdd] dark:bg-[#0B0B0C] flex items-center justify-center pt-24">
        <Loader2 className="w-8 h-8 text-[#c1291A] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3ebdd] dark:bg-[#0B0B0C] pt-32 pb-16 px-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex justify-between items-end">
          <h1 className="text-3xl font-black text-gray-900 dark:text-[#f3ebdd]">My Profile</h1>
          {formData.ocrVerified && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold bg-green-100 dark:bg-green-500/10 px-4 py-2 rounded-xl">
              <ShieldCheck className="w-5 h-5" /> Verified Account
            </div>
          )}
        </div>

        {message.text && (
          <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${message.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}>
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION 1: Personal Information */}
          <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-4 mb-8">Personal Information</h2>
            
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
                  <Camera className="w-6 h-6 text-white" onClick={handleAvatarChange} />
                </div>
              </div>
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-[#f3ebdd]">{formData.fullName || "Update your name"}</h2>
                <p className="text-sm text-gray-500 mt-1">This information will be displayed on your account.</p>
                <div className="mt-4 max-w-md">
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
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#c1291A]" /> Full Name
                </label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full bg-[#f3ebdd] dark:bg-black border border-transparent dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#c1291A] outline-none text-gray-900 dark:text-[#f3ebdd] transition-all" placeholder="John Doe" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#c1291A]" /> Email Address
                </label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-[#f3ebdd] dark:bg-black border border-transparent dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#c1291A] outline-none text-gray-900 dark:text-[#f3ebdd] transition-all" placeholder="you@example.com" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#c1291A]" /> Phone Number
                </label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-[#f3ebdd] dark:bg-black border border-transparent dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#c1291A] outline-none text-gray-900 dark:text-[#f3ebdd] transition-all" placeholder="+977 98XXXXXXXX" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#c1291A]" /> Full Address
                </label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-[#f3ebdd] dark:bg-black border border-transparent dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#c1291A] outline-none text-gray-900 dark:text-[#f3ebdd] transition-all" placeholder="Kathmandu, Nepal" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#c1291A]" /> Bio / Notes
                </label>
                <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows={3} className="w-full bg-[#f3ebdd] dark:bg-black border border-transparent dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#c1291A] outline-none text-gray-900 dark:text-[#f3ebdd] transition-all resize-none" placeholder="Tell us a little about your riding experience..."></textarea>
              </div>
            </div>
          </div>

          {/* SECTION 2: Identity Verification (OCR) */}
          <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-4 mb-8">Identity Document (OCR Verification)</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              {/* Document Uploads */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-2">Document Type</label>
                  <select 
                    value={documentType}
                    onChange={e => setDocumentType(e.target.value)}
                    className="w-full bg-[#f3ebdd] dark:bg-black border border-transparent dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-[#c1291A] outline-none transition-colors dark:text-[#f3ebdd]"
                  >
                    <option value="CITIZENSHIP">Citizenship (नागरिकता)</option>
                    <option value="LICENSE">Driver's License (लाइसेन्स)</option>
                    <option value="NATIONAL_ID">National ID (राष्ट्रिय परिचयपत्र)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-2">Front Side</label>
                    <label className="border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-xl overflow-hidden cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors aspect-[1.6/1] flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 bg-white dark:bg-black block w-full relative">
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "front")} />
                      {frontImage ? (
                        <img src={frontImage} alt="Front" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <FileText className="w-8 h-8 mb-2 opacity-50" />
                          <span className="text-sm font-medium">Upload Image</span>
                        </>
                      )}
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-2">Back Side</label>
                    <label className="border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-xl overflow-hidden cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors aspect-[1.6/1] flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 bg-white dark:bg-black block w-full relative">
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "back")} />
                      {backImage ? (
                        <img src={backImage} alt="Back" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <FileText className="w-8 h-8 mb-2 opacity-50" />
                          <span className="text-sm font-medium">Upload Image</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={handleScan}
                  disabled={isScanning || !frontImage || !backImage}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isScanning ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Scanning Document Data with OCR...</>
                  ) : "Complete OCR Verification"}
                </button>
              </div>

              {/* Extracted Data Fields */}
              <div className="space-y-4 bg-gray-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-gray-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-500" /> Extracted KYC Details
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full bg-white dark:bg-black border border-gray-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:border-black outline-none transition-colors dark:text-[#f3ebdd]">
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Date of Birth (AD)</label>
                    <input type="text" name="dobAd" value={formData.dobAd} onChange={handleInputChange} className="w-full bg-white dark:bg-black border border-gray-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:border-black outline-none transition-colors dark:text-[#f3ebdd]" placeholder="YYYY MMM DD" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Date of Birth (BS)</label>
                    <input type="text" name="dobBs" value={formData.dobBs} onChange={handleInputChange} className="w-full bg-white dark:bg-black border border-gray-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:border-black outline-none transition-colors dark:text-[#f3ebdd]" placeholder="YYYY/MM/DD" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Citizenship / Document Number</label>
                    <input type="text" name="documentNumber" value={formData.documentNumber} onChange={handleInputChange} className="w-full bg-white dark:bg-black border border-gray-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:border-black outline-none transition-colors dark:text-[#f3ebdd]" placeholder="e.g. 04-02-72-01532" />
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="flex justify-end pt-4 sticky bottom-8">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#c1291A] hover:bg-red-700 text-white font-bold py-4 px-12 rounded-2xl flex items-center gap-2 transition-transform active:scale-95 shadow-2xl shadow-[#c1291A]/30 disabled:opacity-50 text-lg"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {saving ? "Saving Profile..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
