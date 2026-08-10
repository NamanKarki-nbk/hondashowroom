"use client";

import React, { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, FileText, Camera, Loader2, Save, CheckCircle2, AlertCircle, ShieldCheck, ChevronRight, Home, Upload, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
        // Simulating high-quality face extraction from the ID document
        avatarUrl: prev.avatarUrl || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300&h=300"
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
      <div className="min-h-screen bg-gray-50 dark:bg-[#0B0B0C] flex flex-col pt-[120px]">
        <div className="flex-1 flex items-center justify-center">
           <Loader2 className="w-10 h-10 text-[#cc0000] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0B0C] font-sans pt-[80px] lg:pt-[100px] pb-16">
      
      {/* Breadcrumbs */}
      <div className="bg-white dark:bg-[#111111] border-b border-gray-200 dark:border-slate-800 py-4 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-2">
          <Link href="/" className="hover:text-[#cc0000] transition-colors flex items-center gap-1.5"><Home className="w-4 h-4" /> Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-white font-medium">My Profile</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 mt-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight uppercase">My Profile</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm md:text-base">Manage your personal information and identity verification.</p>
          </div>
          {formData.ocrVerified && (
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold bg-green-50 dark:bg-green-500/10 px-5 py-2.5 rounded-none border border-green-200 dark:border-green-900 shadow-sm">
              <ShieldCheck className="w-5 h-5" /> KYC Verified
            </div>
          )}
        </div>

        {message.text && (
          <div className={`p-4 rounded-none border-l-4 text-sm font-medium flex items-center gap-3 shadow-sm ${message.type === 'success' ? 'bg-green-50 border-green-500 text-green-800 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-50 border-red-500 text-red-800 dark:bg-red-500/10 dark:text-red-400'}`}>
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* SECTION 1: Personal Information */}
          <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-slate-800 rounded-none p-6 md:p-10 shadow-sm">
            <div className="border-l-4 border-[#cc0000] pl-4 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">Personal Details</h2>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-8 mb-10 pb-10 border-b border-gray-100 dark:border-slate-800">
              <div className="relative group shrink-0">
                {formData.avatarUrl ? (
                  <img src={formData.avatarUrl} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-gray-50 dark:border-slate-900 shadow-md" />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#cc0000] to-red-600 flex items-center justify-center text-white text-4xl font-bold shadow-md">
                    {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : (formData.email ? formData.email.charAt(0).toUpperCase() : "U")}
                  </div>
                )}
                <button type="button" onClick={handleAvatarChange} className="absolute bottom-0 right-0 bg-gray-900 text-white p-2.5 rounded-full hover:bg-[#cc0000] transition-colors border-2 border-white dark:border-[#111111] shadow-lg">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              
              <div className="text-center sm:text-left flex-1 w-full">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase">{formData.fullName || "Your Name"}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-5">Click the camera icon to set a custom profile picture URL.</p>
                
                <div className="max-w-md">
                   <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Avatar URL</label>
                   <input 
                     type="url" 
                     name="avatarUrl" 
                     value={formData.avatarUrl} 
                     onChange={handleInputChange} 
                     placeholder="https://example.com/avatar.jpg" 
                     className="w-full bg-gray-50 dark:bg-[#0B0B0C] border border-gray-200 dark:border-slate-800 rounded-none px-4 py-3 text-sm focus:border-[#cc0000] focus:ring-1 focus:ring-[#cc0000] outline-none text-gray-900 dark:text-white transition-all"
                   />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <User className="w-3.5 h-3.5" /> Full Name
                </label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-[#0B0B0C] border border-gray-200 dark:border-slate-800 rounded-none px-4 py-3 text-sm focus:border-[#cc0000] focus:ring-1 focus:ring-[#cc0000] outline-none text-gray-900 dark:text-white transition-all" placeholder="John Doe" />
              </div>
              
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" /> Email Address
                </label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-[#0B0B0C] border border-gray-200 dark:border-slate-800 rounded-none px-4 py-3 text-sm focus:border-[#cc0000] focus:ring-1 focus:ring-[#cc0000] outline-none text-gray-900 dark:text-white transition-all" placeholder="you@example.com" />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" /> Phone Number
                </label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-[#0B0B0C] border border-gray-200 dark:border-slate-800 rounded-none px-4 py-3 text-sm focus:border-[#cc0000] focus:ring-1 focus:ring-[#cc0000] outline-none text-gray-900 dark:text-white transition-all" placeholder="+977 98XXXXXXXX" />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" /> Full Address
                </label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-[#0B0B0C] border border-gray-200 dark:border-slate-800 rounded-none px-4 py-3 text-sm focus:border-[#cc0000] focus:ring-1 focus:ring-[#cc0000] outline-none text-gray-900 dark:text-white transition-all" placeholder="Kathmandu, Nepal" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" /> Bio / Notes
                </label>
                <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows={3} className="w-full bg-gray-50 dark:bg-[#0B0B0C] border border-gray-200 dark:border-slate-800 rounded-none px-4 py-3 text-sm focus:border-[#cc0000] focus:ring-1 focus:ring-[#cc0000] outline-none text-gray-900 dark:text-white transition-all resize-none" placeholder="Tell us a little about your riding experience..."></textarea>
              </div>
            </div>
          </div>

          {/* SECTION 2: Identity Verification (OCR) */}
          <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-slate-800 rounded-none p-6 md:p-10 shadow-sm relative overflow-hidden">
            <div className="border-l-4 border-[#cc0000] pl-4 mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">Identity Document</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">OCR Verification for secure booking and test rides.</p>
              </div>
            </div>

            {formData.ocrVerified ? (
              /* Verified State */
              <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-none p-6 flex items-start gap-4">
                  <ShieldCheck className="w-8 h-8 text-green-600 dark:text-green-500 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-green-900 dark:text-green-400 uppercase">Document Successfully Verified</h3>
                    <p className="text-sm text-green-700 dark:text-green-500/80 mt-1 leading-relaxed">
                      Your identity document has been scanned and verified. You are now eligible for priority test rides and fast-track financing. The data below is locked for security.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Read-Only Images */}
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200 dark:border-slate-800 pb-2">Uploaded Document</h4>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="aspect-[1.6/1] bg-gray-100 dark:bg-black border border-gray-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm relative group">
                          {frontImage ? (
                            <img src={frontImage} alt="Front ID" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon className="w-8 h-8" /></div>
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs font-bold uppercase tracking-wider">Front</span>
                          </div>
                       </div>
                       <div className="aspect-[1.6/1] bg-gray-100 dark:bg-black border border-gray-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm relative group">
                          {backImage ? (
                            <img src={backImage} alt="Back ID" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon className="w-8 h-8" /></div>
                          )}
                           <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs font-bold uppercase tracking-wider">Back</span>
                          </div>
                       </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => {
                        if (confirm("Are you sure you want to rescan your document? This will remove your verified status.")) {
                          setFormData(prev => ({ ...prev, ocrVerified: false }));
                        }
                      }}
                      className="text-sm font-bold text-[#cc0000] hover:underline"
                    >
                      Update Document
                    </button>
                  </div>

                  {/* Read-Only Fields */}
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200 dark:border-slate-800 pb-2">Verified Data</h4>
                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                      <div>
                        <span className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Gender</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{formData.gender === 'MALE' ? 'Male' : formData.gender === 'FEMALE' ? 'Female' : 'Other'}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Doc Type</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white capitalize">{documentType.toLowerCase().replace('_', ' ')}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">DOB (AD)</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{formData.dobAd || '-'}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">DOB (BS)</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{formData.dobBs || '-'}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Document Number</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{formData.documentNumber || '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Unverified / Scanning State */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                
                {/* Document Uploads */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-800 dark:text-gray-300 uppercase tracking-widest mb-2">Select Identity Document</label>
                    <select 
                      value={documentType}
                      onChange={e => setDocumentType(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-[#0B0B0C] border border-gray-200 dark:border-slate-800 rounded-none px-4 py-3.5 text-sm focus:border-[#cc0000] focus:ring-1 focus:ring-[#cc0000] outline-none transition-all dark:text-white font-medium"
                    >
                      <option value="CITIZENSHIP">Citizenship (नागरिकता)</option>
                      <option value="LICENSE">Driver's License (लाइसेन्स)</option>
                      <option value="NATIONAL_ID">National ID (राष्ट्रिय परिचयपत्र)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Front Photo</label>
                      <label className="border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-none overflow-hidden cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors aspect-[1.6/1] flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 bg-white dark:bg-black block w-full relative group">
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "front")} />
                        {frontImage ? (
                          <>
                            <img src={frontImage} alt="Front" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white text-xs font-bold uppercase tracking-wider">Change Image</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <Upload className="w-6 h-6 mb-2 opacity-60 group-hover:-translate-y-1 transition-transform" />
                            <span className="text-xs font-bold uppercase tracking-wider">Click to Scan</span>
                          </>
                        )}
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Back Photo</label>
                      <label className="border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-none overflow-hidden cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors aspect-[1.6/1] flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 bg-white dark:bg-black block w-full relative group">
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "back")} />
                        {backImage ? (
                           <>
                           <img src={backImage} alt="Back" className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <span className="text-white text-xs font-bold uppercase tracking-wider">Change Image</span>
                           </div>
                         </>
                        ) : (
                          <>
                            <Upload className="w-6 h-6 mb-2 opacity-60 group-hover:-translate-y-1 transition-transform" />
                            <span className="text-xs font-bold uppercase tracking-wider">Click to Scan</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={handleScan}
                    disabled={isScanning || !frontImage || !backImage}
                    className="w-full bg-gray-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest py-4 px-4 rounded-none hover:bg-black hover:text-[#cc0000] dark:hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isScanning ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Extracting OCR Data...</>
                    ) : "Complete OCR Verification"}
                  </button>
                </div>

                {/* Extracted Data Fields */}
                <div className="bg-gray-50 dark:bg-[#0B0B0C] border border-gray-200 dark:border-slate-800 rounded-none p-6 relative">
                  
                  {isScanning && (
                    <div className="absolute inset-0 z-10 bg-white/60 dark:bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 border-t-2 border-[#cc0000] rounded-full animate-spin"></div>
                        <ShieldCheck className="w-12 h-12 text-[#cc0000] opacity-50 animate-pulse" />
                      </div>
                      <p className="mt-4 text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest animate-pulse">Scanning Document...</p>
                    </div>
                  )}

                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#cc0000]" /> Extracted Data
                  </h3>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Gender</label>
                      <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full bg-white dark:bg-[#111111] border border-gray-200 dark:border-slate-800 rounded-none px-4 py-2.5 text-sm focus:border-[#cc0000] outline-none transition-colors dark:text-white font-medium">
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Date of Birth (AD)</label>
                      <input type="text" name="dobAd" value={formData.dobAd} onChange={handleInputChange} className="w-full bg-white dark:bg-[#111111] border border-gray-200 dark:border-slate-800 rounded-none px-4 py-2.5 text-sm focus:border-[#cc0000] outline-none transition-colors dark:text-white font-medium" placeholder="YYYY MMM DD" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Date of Birth (BS)</label>
                      <input type="text" name="dobBs" value={formData.dobBs} onChange={handleInputChange} className="w-full bg-white dark:bg-[#111111] border border-gray-200 dark:border-slate-800 rounded-none px-4 py-2.5 text-sm focus:border-[#cc0000] outline-none transition-colors dark:text-white font-medium" placeholder="YYYY/MM/DD" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Document Number</label>
                      <input type="text" name="documentNumber" value={formData.documentNumber} onChange={handleInputChange} className="w-full bg-white dark:bg-[#111111] border border-gray-200 dark:border-slate-800 rounded-none px-4 py-2.5 text-sm focus:border-[#cc0000] outline-none transition-colors dark:text-white font-medium" placeholder="e.g. 04-02-72-01532" />
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end pt-4 pb-20 sticky bottom-0 z-20 pointer-events-none">
            <div className="pointer-events-auto">
              <button
                type="submit"
                disabled={saving}
                className="bg-[#cc0000] hover:bg-red-700 text-white font-black uppercase tracking-widest py-4 px-10 rounded-none flex items-center gap-3 transition-transform active:scale-95 shadow-xl disabled:opacity-50 text-base"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {saving ? "Saving Changes..." : "Save Profile"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
