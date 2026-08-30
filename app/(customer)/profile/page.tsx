"use client";

import React, { useState, useEffect, useRef } from "react";
import { User, Mail, Phone, MapPin, FileText, Camera, Loader2, Save, CheckCircle2, AlertCircle, ShieldCheck, ChevronRight, Home, Upload, Image as ImageIcon, Lock, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  // KYC Tab State
  const [activeTab, setActiveTab] = useState<"CITIZENSHIP" | "LICENSE" | "NATIONAL_ID">("CITIZENSHIP");
  
  // Active KYC Upload States
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  
  // Viewing Modal
  const [viewingImage, setViewingImage] = useState<{url: string, title: string} | null>(null);
  
  // OTP Simulation State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpTarget, setOtpTarget] = useState<"email" | "phone" | null>(null);
  const [otpValue, setOtpValue] = useState("");
  const [pendingContactValue, setPendingContactValue] = useState("");
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    bio: "",
    address: "",
    avatarUrl: "",
    dobAd: "",
    dobBs: "",
    gender: "MALE",
    
    citizenshipVerified: false,
    citizenshipNumber: "",
    citizenshipFront: "",
    citizenshipBack: "",
    
    licenseVerified: false,
    licenseNumber: "",
    licenseFront: "",
    licenseBack: "",
    
    nationalIdVerified: false,
    nationalIdNumber: "",
    nationalIdFront: "",
    nationalIdBack: "",
  });
  
  const [initialState, setInitialState] = useState<any>({});
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          const fetchedData = {
            fullName: data.user.fullName || "",
            email: (data.user.email?.startsWith("placeholder-") || data.user.email?.includes("google-")) ? "" : (data.user.email || ""),
            phone: (data.user.phone?.startsWith("placeholder-") || data.user.phone?.includes("google-") || data.user.phone?.match(/[a-z]/i)) ? "" : (data.user.phone?.replace(/\D/g, "").slice(-10) || ""),
            bio: data.user.bio || "",
            address: data.user.address || "",
            avatarUrl: data.user.avatarUrl || "",
            dobAd: data.user.dobAd || "",
            dobBs: data.user.dobBs || "",
            gender: data.user.gender || "MALE",
            
            citizenshipVerified: data.user.citizenshipVerified || false,
            citizenshipNumber: data.user.citizenshipNumber || "",
            citizenshipFront: data.user.citizenshipFront || "",
            citizenshipBack: data.user.citizenshipBack || "",
            
            licenseVerified: data.user.licenseVerified || false,
            licenseNumber: data.user.licenseNumber || "",
            licenseFront: data.user.licenseFront || "",
            licenseBack: data.user.licenseBack || "",
            
            nationalIdVerified: data.user.nationalIdVerified || false,
            nationalIdNumber: data.user.nationalIdNumber || "",
            nationalIdFront: data.user.nationalIdFront || "",
            nationalIdBack: data.user.nationalIdBack || "",
          };
          setFormData(fetchedData);
          setInitialState(fetchedData);
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
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length <= 10) {
        setFormData(prev => ({ ...prev, [name]: digitsOnly }));
      }
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Avatar Upload Logic
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
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

  const extractFaceFromID = (base64Image: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const cropSize = img.width * 0.22;
        const cropX = img.width * 0.035;
        const cropY = img.height * 0.32;
        canvas.width = cropSize;
        canvas.height = cropSize;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, cropX, cropY, cropSize, cropSize, 0, 0, cropSize, cropSize);
          resolve(canvas.toDataURL("image/jpeg", 0.9));
        } else {
          resolve(base64Image);
        }
      };
      img.src = base64Image;
    });
  };

  const preprocessForOCR = (base64Image: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(base64Image);
          return;
        }
        
        ctx.drawImage(img, 0, 0);
        
        try {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          const contrast = 1.5;
          const intercept = 128 * (1 - contrast);
          
          for (let i = 0; i < data.length; i += 4) {
              let r = data[i];
              let g = data[i+1];
              let b = data[i+2];
              
              // Grayscale
              let gray = 0.299 * r + 0.587 * g + 0.114 * b;
              // Contrast
              gray = gray * contrast + intercept;
              // Binary Threshold
              const finalValue = gray > 140 ? 255 : 0;
              
              data[i] = finalValue;
              data[i+1] = finalValue;
              data[i+2] = finalValue;
          }
          
          ctx.putImageData(imageData, 0, 0);
          resolve(canvas.toDataURL("image/jpeg", 0.9));
        } catch (e) {
          console.error("Canvas preprocessing error:", e);
          resolve(base64Image);
        }
      };
      img.onerror = () => resolve(base64Image);
      img.src = base64Image;
    });
  };

  const handleScan = async () => {
    if (!frontImage || !backImage) {
      setMessage({ type: "error", text: "Please upload both Front and Back photos to scan." });
      return;
    }
    
    setIsScanning(true);
    setMessage({ type: "", text: "" });

    try {
      const extractedFace = await extractFaceFromID(frontImage);
      
      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker('eng');
      
      let extractedNumber = "";
      let parsedName = "";
      let parsedDobAd = "";
      let parsedDobBs = "";
      let parsedCitizenshipNo = "";
      let parsedGender = "";

      // Only OCR the Back Image (English Side)
      const cleanedBack = await preprocessForOCR(backImage);
      const backResult = await worker.recognize(cleanedBack);
      const fullText = backResult.data.text;
      
      console.log("[OCR] Back text:", fullText);

      // Extract Name
      const nameMatch = fullText.match(/(?:Full\s*Name|Name)[^\nA-Za-z]*([A-Za-z \t]+)/i);
      if (nameMatch) {
          let rawName = nameMatch[1].trim();
          rawName = rawName.replace(/(Date|DOB|Birth|Sex|Gender|Year).*$/i, '').trim();
          
          // Validation: Ensure it looks like a real name (at least 2 words, mostly alphabet)
          let words = rawName.split(/\s+/).filter(w => /^[a-zA-Z]+$/.test(w) && w.length >= 2);
          if (words.length >= 2) {
              parsedName = words.join(" ").toUpperCase();
          }
      }

      if (activeTab === 'CITIZENSHIP') {
        // Document Number
        const explicitMatch = fullText.match(/Citizenship Certificate No[\.\:\-\s]*([0-9O\-\s]+)/i);
        const numberRegex = /(?:[0-9O]{2,}\s*[\-\/]\s*[0-9O]{2,}\s*[\-\/]\s*[0-9O]{2,}\s*[\-\/]\s*[0-9O]{3,})|(?:[0-9O]{2,}\s*[/\-]\s*[0-9O]{2,}\s*[/\-]\s*[0-9O]{4,})/;
        let match = fullText.match(numberRegex);
        
        if (explicitMatch) {
          let cleanNum = explicitMatch[1].replace(/O/g, '0').replace(/[\s\-]/g, '');
          if (cleanNum.length === 11) {
              extractedNumber = cleanNum.replace(/(\d{2})(\d{2})(\d{2})(\d{5})/, '$1-$2-$3-$4');
          } else {
              extractedNumber = explicitMatch[1].replace(/O/g, '0').trim().replace(/\s/g, ''); 
          }
        } else if (match) {
          let cleanNum = match[0].replace(/O/g, '0').replace(/[\s\-]/g, '');
          if (cleanNum.length === 11) {
              extractedNumber = cleanNum.replace(/(\d{2})(\d{2})(\d{2})(\d{5})/, '$1-$2-$3-$4');
          } else {
              extractedNumber = match[0].replace(/O/g, '0').replace(/\s+/g, '');
          }
        }
        
        // DOB (AD)
        const dobBlockMatch = fullText.match(/(?:Date\s*of\s*Birth|DOB|Birth)[\s\S]{0,150}/i);
        const dobBlock = dobBlockMatch ? dobBlockMatch[0] : fullText;

        const yearM = dobBlock.match(/(19\d{2}|20\d{2})/);
        const monthM = dobBlock.match(/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)/i);
        const numbers = [...dobBlock.matchAll(/\b([0-3]?\d)\b/g)].map(m => m[1]);
        const validDays = numbers.filter(n => parseInt(n) > 0 && parseInt(n) <= 31);
        
        if (yearM && monthM && validDays.length > 0) {
            const year = yearM[1];
            let month = monthM[1].toUpperCase().substring(0, 3);
            const day = String(validDays[validDays.length - 1]).padStart(2, '0');
            
            const monthMap: Record<string, string> = {
                'JAN': '01', 'FEB': '02', 'MAR': '03', 'APR': '04', 'MAY': '05', 'JUN': '06',
                'JUL': '07', 'AUG': '08', 'SEP': '09', 'OCT': '10', 'NOV': '11', 'DEC': '12'
            };
            
            month = monthMap[month] || month.padStart(2, '0');
            parsedDobAd = `${year}-${month}-${day}`;
        }
        
        // Gender
        const genderMatch = fullText.match(/Sex[\:\-\s]*(Male|Female|Other)/i);
        if (genderMatch) {
            parsedGender = genderMatch[1].toUpperCase();
        }

      } 
      else if (activeTab === 'LICENSE') {
        const dlMatch = fullText.match(/[D0O]\.?\s*[LI]\.?\s*No[\.\:\s]*([A-Z0-9\-]+)/i);
        if (dlMatch) extractedNumber = dlMatch[1].replace(/O/g, '0');
        
        const dobMatch = fullText.match(/[D0O]\.?\s*[O0]\.?\s*B\.?\s*[\:\-]?\s*([\d\-\/]+)/i);
        if (dobMatch) {
          parsedDobAd = dobMatch[1].trim();
        }

        const citzMatch = fullText.match(/Citizenship\s*No[\.\:\s]*([A-Z\d\-]+)/i);
        if (citzMatch) parsedCitizenshipNo = citzMatch[1].trim().replace(/O/g, '0');
      }
      else if (activeTab === 'NATIONAL_ID') {
        const ninMatch = fullText.match(/N(?:ational)?\s*I(?:dentity)?\s*N(?:umber)?[\s\.\:]*([\d\-]+)/i);
        if (ninMatch) extractedNumber = ninMatch[1];
        
        const dobAdMatch = fullText.match(/D\.?\s*O\.?\s*B\.?\s*[\:\-]?\s*([\d\-\/]+)/i);
        if (dobAdMatch) {
          parsedDobAd = dobAdMatch[1].trim();
        }

        const dobBsMatch = fullText.match(/(?:20\d\d[-/]\d\d[-/]\d\d)/);
        if (dobBsMatch) {
          parsedDobBs = dobBsMatch[0];
        }

        const citzMatch = fullText.match(/Citizenship\s*No[\.\:\s]*([\d\-]+)/i);
        if (citzMatch) parsedCitizenshipNo = citzMatch[1].trim();
      }
      
      await worker.terminate();

      // Determine verification status cross-checking
      const hasCoreIdentity = formData.citizenshipVerified || formData.licenseVerified || formData.nationalIdVerified;
      
      if (hasCoreIdentity && (activeTab === 'LICENSE' || activeTab === 'NATIONAL_ID')) {
        // Cross-validation
        const nameMatches = !parsedName || formData.fullName.toLowerCase() === parsedName.toLowerCase();
        const dobMatches = !parsedDobAd || formData.dobAd === parsedDobAd;
        const citzMatches = !formData.citizenshipVerified || (formData.citizenshipNumber === parsedCitizenshipNo);

        if (!nameMatches || !dobMatches || !citzMatches) {
          setMessage({ type: "error", text: "Verification Failed: Details on document do not match verified profile." });
          setIsScanning(false);
          return;
        }
      }

      // Prepare Scanned Data
      const newStatus: any = {
        [`${activeTab.toLowerCase().replace('_', '')}Verified`]: true,
        [`${activeTab.toLowerCase().replace('_', '')}Number`]: extractedNumber || "",
        [`${activeTab.toLowerCase().replace('_', '')}Front`]: frontImage,
        [`${activeTab.toLowerCase().replace('_', '')}Back`]: backImage,
      };

      let extractedData = { ...newStatus };

      if (!hasCoreIdentity) {
        // First scan, populate core identity
        extractedData = {
          ...extractedData,
          fullName: parsedName || "",
          dobAd: parsedDobAd || "",
          dobBs: parsedDobBs || "",
          gender: parsedGender || "",
          avatarUrl: extractedFace
        };
        if (parsedCitizenshipNo) {
          extractedData.citizenshipNumber = parsedCitizenshipNo;
        }
      }

      setScannedData(extractedData);
      setMessage({ type: "success", text: `${activeTab.replace('_', ' ')} Scanned! Review the data and confirm.` });
    } catch (err) {
      console.error("OCR Error:", err);
      setMessage({ type: "error", text: "OCR failed. Please try again or enter manually." });
    } finally {
      setIsScanning(false);
    }
  };

  const handleConfirmScan = () => {
    setFormData(prev => ({ ...prev, ...scannedData }));
    setScannedData(null);
    setFrontImage(null);
    setBackImage(null);
    setMessage({ type: "success", text: `${activeTab.replace('_', ' ')} Added! Please save your profile to confirm.` });
  };

  const handleCancelScan = () => {
    setScannedData(null);
    setFrontImage(null);
    setBackImage(null);
    setMessage({ type: "", text: "" });
  };

  const handleVerifyContact = async (target: "email" | "phone") => {
    if (!formData[target]) return;
    
    // Check if WhatsApp is connected if trying to send to phone
    setOtpTarget(target);
    setPendingContactValue(formData[target]);
    setOtpValue("");
    
    try {
      // Show loading state by using an empty message
      setMessage({ type: "", text: "" });
      
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: formData[target],
          type: target === "phone" ? "whatsapp" : "email"
        })
      });
      
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Failed to send OTP." });
        return;
      }
      
      setShowOtpModal(true);
      setMessage({ type: "success", text: data.message || `OTP sent to ${formData[target]}` });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to send OTP. Please try again." });
    }
  };

  const handleOtpSubmit = async () => {
    setIsOtpVerifying(true);
    try {
      const res = await fetch("/api/profile/verify-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: pendingContactValue,
          code: otpValue,
          type: otpTarget === "phone" ? "whatsapp" : "email"
        })
      });
      
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Invalid OTP.");
        setIsOtpVerifying(false);
        return;
      }
      if (otpTarget) {
        setInitialState((prev: any) => ({ ...prev, [otpTarget]: pendingContactValue }));
      }
      setShowOtpModal(false);
      setMessage({ type: "success", text: `${otpTarget === 'email' ? 'Email' : 'Phone'} verified! Please save your profile.` });
    } catch (err) {
      console.error(err);
      alert("Verification failed. Please try again.");
    } finally {
      setIsOtpVerifying(false);
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
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setInitialState(formData);
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
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col pt-[120px]">
        <div className="flex-1 flex items-center justify-center">
           <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  // Determine which identifier is the "Primary" locked one based on initial state
  const isPhonePrimary = !!initialState.phone && !initialState.email;
  const isEmailPrimary = !!initialState.email && !initialState.phone;
  // If both existed initially, lock both or let's just lock phone.
  const lockPhone = isPhonePrimary || (!!initialState.phone && !!initialState.email);
  const lockEmail = isEmailPrimary;

  // Active KYC State helper
  const prefix = activeTab.toLowerCase().replace('_', '');
  const isCurrentTabVerified = (formData as any)[`${prefix}Verified`];
  const currentTabFront = (formData as any)[`${prefix}Front`];
  const currentTabBack = (formData as any)[`${prefix}Back`];
  const currentTabNumber = (formData as any)[`${prefix}Number`];
  
  const hasAnyVerification = formData.citizenshipVerified || formData.licenseVerified || formData.nationalIdVerified;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 font-sans pt-[80px] lg:pt-[100px] pb-16">
      
      {/* Breadcrumbs */}
      <div className="bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800 py-4 px-6 md:px-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-2">
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1.5"><Home className="w-4 h-4" /> Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-white font-medium">My Profile</span>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 mt-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold md:text-4xl font-bold md:text-4xl font-bold font-black text-gray-900 dark:text-white tracking-tight uppercase">My Profile</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm md:text-base">Manage your personal information and multi-document verification.</p>
          </div>
          {hasAnyVerification && (
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold bg-green-50 dark:bg-green-500/10 px-5 py-2.5 rounded-none border border-green-200 dark:border-green-900 shadow-sm">
              <ShieldCheck className="w-5 h-5" /> Identity Verified
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
          <div className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-none p-6 md:p-10 shadow-sm relative">
            
            {hasAnyVerification && (
              <div className="absolute top-6 right-6 md:top-10 md:right-10 flex items-center gap-1.5 text-xs font-bold text-gray-400 bg-gray-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                <Lock className="w-3 h-3" /> Core Identity Locked
              </div>
            )}

            <div className="border-l-4 border-primary pl-4 mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold font-bold text-gray-900 dark:text-white uppercase tracking-tight">Personal Details</h2>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-8 mb-10 pb-10 border-b border-gray-100 dark:border-slate-800">
              <div className="relative group shrink-0 cursor-pointer" onClick={handleAvatarClick}>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleAvatarFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                {formData.avatarUrl ? (
                  <img src={formData.avatarUrl} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-gray-50 dark:border-slate-900 shadow-md group-hover:opacity-75 transition-opacity" />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-red-600 flex items-center justify-center text-white text-2xl md:text-3xl font-semibold md:text-4xl font-bold md:text-4xl font-bold font-bold shadow-md group-hover:opacity-75 transition-opacity">
                    {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : (formData.email ? formData.email.charAt(0).toUpperCase() : "U")}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 bg-gray-900 text-white p-2.5 rounded-full hover:bg-primary transition-colors border-2 border-white dark:border-[#111111] shadow-lg">
                  <Camera className="w-5 h-5" />
                </div>
              </div>
              
              <div className="text-center sm:text-left flex-1 w-full">
                <h2 className="text-2xl md:text-3xl font-semibold font-black text-gray-900 dark:text-white uppercase">{formData.fullName || "Your Name"}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-5">Click your avatar to upload a new profile picture from your gallery.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              {/* Full Name (Locked if verified) */}
              <div className="space-y-2 relative">
                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <User className="w-3.5 h-3.5" /> Full Name
                </label>
                <input 
                  type="text" 
                  name="fullName" 
                  value={formData.fullName} 
                  onChange={handleInputChange} 
                  disabled={hasAnyVerification}
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-none px-4 py-3 text-sm focus:border-primary outline-none text-gray-900 dark:text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed" 
                  placeholder="John Doe" 
                />
              </div>

              {/* Gender (Locked if verified) */}
              <div className="space-y-2 relative">
                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  Gender
                </label>
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleInputChange} 
                  disabled={hasAnyVerification}
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-none px-4 py-3.5 text-sm focus:border-primary outline-none transition-colors dark:text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* DOB (Locked if verified) */}
              <div className="space-y-2 relative">
                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  Date of Birth (AD)
                </label>
                <input 
                  type="text" 
                  name="dobAd" 
                  value={formData.dobAd} 
                  onChange={handleInputChange} 
                  disabled={hasAnyVerification}
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-none px-4 py-3 text-sm focus:border-primary outline-none text-gray-900 dark:text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed" 
                  placeholder="YYYY MMM DD" 
                />
              </div>

              {/* Email (OTP Editable if Phone is Primary) */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center justify-between">
                  <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Email Address</div>
                  {lockEmail && <span className="text-gray-400 flex items-center gap-1"><Lock className="w-3 h-3" /> Primary</span>}
                </label>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    disabled={lockEmail}
                    className="flex-1 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-none px-4 py-3 text-sm focus:border-primary outline-none text-gray-900 dark:text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed" 
                    placeholder="you@example.com" 
                  />
                  {!lockEmail && formData.email !== initialState.email && (
                    <button 
                      type="button"
                      onClick={() => handleVerifyContact('email')}
                      className="bg-gray-900 text-white px-4 text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
                    >
                      Verify
                    </button>
                  )}
                </div>
              </div>

              {/* Phone (OTP Editable if Email is Primary) */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center justify-between">
                  <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> Phone Number</div>
                  {lockPhone && <span className="text-gray-400 flex items-center gap-1"><Lock className="w-3 h-3" /> Primary</span>}
                </label>
                <div className="flex gap-2">
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    disabled={lockPhone}
                    className="flex-1 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-none px-4 py-3 text-sm focus:border-primary outline-none text-gray-900 dark:text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed" 
                    placeholder="+977 98XXXXXXXX" 
                  />
                  {!lockPhone && formData.phone !== initialState.phone && (
                    <button 
                      type="button"
                      onClick={() => handleVerifyContact('phone')}
                      className="bg-gray-900 text-white px-4 text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
                    >
                      Verify
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" /> Full Address
                </label>
                <input 
                  type="text" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleInputChange} 
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-none px-4 py-3 text-sm focus:border-primary outline-none text-gray-900 dark:text-white transition-all" 
                  placeholder="Kathmandu, Nepal" 
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" /> Bio / Notes
                </label>
                <textarea 
                  name="bio" 
                  value={formData.bio} 
                  onChange={handleInputChange} 
                  rows={3} 
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-none px-4 py-3 text-sm focus:border-primary outline-none text-gray-900 dark:text-white transition-all resize-none" 
                  placeholder="Tell us a little about your riding experience..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* SECTION 2: Multi-Document KYC Verification */}
          <div className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-none shadow-sm relative overflow-hidden">
            
            <div className="p-6 md:p-10 pb-0">
              <div className="border-l-4 border-primary pl-4 mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold font-bold text-gray-900 dark:text-white uppercase tracking-tight">Identity Documents</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Verify multiple documents to increase your profile trust score.</p>
                </div>
              </div>
            </div>

            {/* KYC Tabs */}
            <div className="flex border-b border-gray-200 dark:border-slate-800 px-6 md:px-10 gap-8">
              {[
                { id: "CITIZENSHIP", label: "Citizenship", icon: FileText, verified: formData.citizenshipVerified },
                { id: "LICENSE", label: "Driver's License", icon: FileText, verified: formData.licenseVerified },
                { id: "NATIONAL_ID", label: "National ID", icon: FileText, verified: formData.nationalIdVerified },
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setFrontImage(null);
                    setBackImage(null);
                  }}
                  className={`py-4 px-2 font-bold text-sm uppercase tracking-wider border-b-2 flex items-center gap-2 transition-colors ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                >
                  {tab.label}
                  {tab.verified && <ShieldCheck className="w-4 h-4 text-green-500" />}
                </button>
              ))}
            </div>

            <div className="p-6 md:p-10 pt-8 bg-gray-50/50 dark:bg-slate-950/50">
              {isCurrentTabVerified ? (
                /* Verified State for Active Tab */
                <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                  <div className="flex flex-col gap-3">
                    {formData.citizenshipVerified && (
                      <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-none p-4 flex items-center gap-4">
                        <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-500 shrink-0" />
                        <div>
                          <h3 className="text-sm font-bold text-green-900 dark:text-green-400 uppercase tracking-wider">CITIZENSHIP Verified</h3>
                          {activeTab === 'CITIZENSHIP' && <p className="text-xs text-green-700 dark:text-green-500/80 mt-1">This document has been successfully scanned and verified.</p>}
                        </div>
                      </div>
                    )}
                    {formData.licenseVerified && (
                      <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-none p-4 flex items-center gap-4">
                        <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-500 shrink-0" />
                        <div>
                          <h3 className="text-sm font-bold text-green-900 dark:text-green-400 uppercase tracking-wider">LICENSE Verified</h3>
                          {activeTab === 'LICENSE' && <p className="text-xs text-green-700 dark:text-green-500/80 mt-1">This document has been successfully scanned and verified.</p>}
                        </div>
                      </div>
                    )}
                    {formData.nationalIdVerified && (
                      <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-none p-4 flex items-center gap-4">
                        <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-500 shrink-0" />
                        <div>
                          <h3 className="text-sm font-bold text-green-900 dark:text-green-400 uppercase tracking-wider">NATIONAL ID Verified</h3>
                          {activeTab === 'NATIONAL_ID' && <p className="text-xs text-green-700 dark:text-green-500/80 mt-1">This document has been successfully scanned and verified.</p>}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200 dark:border-slate-800 pb-2">Uploaded Document</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div onClick={() => currentTabFront && setViewingImage({url: currentTabFront, title: `Front ${activeTab}`})} className="aspect-[1.6/1] bg-gray-100 dark:bg-black border border-gray-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm relative group cursor-pointer">
                          {currentTabFront ? <img src={currentTabFront} alt="Front" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon className="w-8 h-8" /></div>}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><span className="text-white text-xs font-bold uppercase tracking-wider">View</span></div>
                        </div>
                        <div onClick={() => currentTabBack && setViewingImage({url: currentTabBack, title: `Back ${activeTab}`})} className="aspect-[1.6/1] bg-gray-100 dark:bg-black border border-gray-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm relative group cursor-pointer">
                          {currentTabBack ? <img src={currentTabBack} alt="Back" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon className="w-8 h-8" /></div>}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><span className="text-white text-xs font-bold uppercase tracking-wider">View</span></div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200 dark:border-slate-800 pb-2">Verified Data</h4>
                      <div className="grid grid-cols-1 gap-y-6">
                        <div>
                          <span className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Document Number</span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{currentTabNumber || '-'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Unverified / Scanning State for Active Tab */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Front Photo</label>
                        <label className="border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-none overflow-hidden cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors aspect-[1.6/1] flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 bg-white dark:bg-black block w-full relative group">
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "front")} />
                          {frontImage ? (
                            <><img src={frontImage} alt="Front" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><span className="text-white text-xs font-bold uppercase tracking-wider">Change</span></div></>
                          ) : (
                            <><Upload className="w-6 h-6 mb-2 opacity-60 group-hover:-translate-y-1 transition-transform" /><span className="text-xs font-bold uppercase tracking-wider">Browse</span></>
                          )}
                        </label>
                      </div>
                      
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Back Photo</label>
                        <label className="border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-none overflow-hidden cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors aspect-[1.6/1] flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 bg-white dark:bg-black block w-full relative group">
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "back")} />
                          {backImage ? (
                             <><img src={backImage} alt="Back" className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><span className="text-white text-xs font-bold uppercase tracking-wider">Change</span></div></>
                          ) : (
                            <><Upload className="w-6 h-6 mb-2 opacity-60 group-hover:-translate-y-1 transition-transform" /><span className="text-xs font-bold uppercase tracking-wider">Browse</span></>
                          )}
                        </label>
                      </div>
                    </div>

                    <button 
                      type="button"
                      onClick={handleScan}
                      disabled={isScanning || !frontImage || !backImage}
                      className="w-full bg-gray-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest py-4 px-4 rounded-none hover:bg-black hover:text-primary dark:hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      {isScanning ? <><Loader2 className="w-5 h-5 animate-spin" /> Extracting...</> : `Scan ${activeTab === 'LICENSE' ? "DRIVER'S LICENSE" : activeTab.replace('_', ' ')}`}
                    </button>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-none p-6 relative">
                    {isScanning && (
                      <div className="absolute inset-0 z-10 bg-white/60 dark:bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                        <div className="relative"><div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin"></div><ShieldCheck className="w-12 h-12 text-primary opacity-50 animate-pulse" /></div>
                        <p className="mt-4 text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest animate-pulse">Scanning Document...</p>
                      </div>
                    )}
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> Extracted Data</h3>
                    {scannedData ? (
                      <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="block text-gray-500 uppercase tracking-widest text-[10px] font-bold mb-1">Document Number</span>
                            <input 
                              type="text" 
                              value={scannedData[`${activeTab.toLowerCase().replace('_', '')}Number`] || ''} 
                              onChange={(e) => setScannedData({...scannedData, [`${activeTab.toLowerCase().replace('_', '')}Number`]: e.target.value})}
                              className="w-full bg-white dark:bg-black border border-gray-300 dark:border-slate-700 rounded-none px-2 py-1 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors"
                            />
                          </div>
                          {scannedData.fullName !== undefined && (
                            <div>
                              <span className="block text-gray-500 uppercase tracking-widest text-[10px] font-bold mb-1">Full Name</span>
                              <input 
                                type="text" 
                                value={scannedData.fullName} 
                                onChange={(e) => setScannedData({...scannedData, fullName: e.target.value})}
                                className="w-full bg-white dark:bg-black border border-gray-300 dark:border-slate-700 rounded-none px-2 py-1 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors"
                              />
                            </div>
                          )}
                          {scannedData.dobAd !== undefined && (
                            <div>
                              <span className="block text-gray-500 uppercase tracking-widest text-[10px] font-bold mb-1">DOB (AD)</span>
                              <input 
                                type="text" 
                                value={scannedData.dobAd} 
                                onChange={(e) => setScannedData({...scannedData, dobAd: e.target.value})}
                                className="w-full bg-white dark:bg-black border border-gray-300 dark:border-slate-700 rounded-none px-2 py-1 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors"
                              />
                            </div>
                          )}
                          {scannedData.gender !== undefined && (
                            <div>
                              <span className="block text-gray-500 uppercase tracking-widest text-[10px] font-bold mb-1">Gender</span>
                              <select 
                                value={scannedData.gender} 
                                onChange={(e) => setScannedData({...scannedData, gender: e.target.value})}
                                className="w-full bg-white dark:bg-black border border-gray-300 dark:border-slate-700 rounded-none px-2 py-1 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors"
                              >
                                <option value="MALE">MALE</option>
                                <option value="FEMALE">FEMALE</option>
                                <option value="OTHER">OTHER</option>
                              </select>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-slate-800">
                          <button type="button" onClick={handleCancelScan} className="flex-1 py-2 text-xs font-bold uppercase tracking-wider border border-gray-300 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">Discard</button>
                          <button type="button" onClick={handleConfirmScan} className="flex-1 py-2 text-xs font-bold uppercase tracking-wider bg-primary hover:bg-red-700 text-white transition-colors">Confirm & Add</button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-5 flex items-center justify-center h-40">
                         <p className="text-sm text-gray-400 text-center">Data will appear here after scanning.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end pt-4 pb-20 sticky bottom-0 z-20 pointer-events-none">
            <div className="pointer-events-auto">
              <button type="submit" disabled={saving} className="bg-primary hover:bg-red-700 text-white font-black uppercase tracking-widest py-4 px-10 rounded-none flex items-center gap-3 transition-transform active:scale-95 shadow-xl disabled:opacity-50 text-base">
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {saving ? "Saving Changes..." : "Save Profile"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-950 w-full max-w-md border border-gray-200 dark:border-slate-800 p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold font-bold text-gray-900 dark:text-white uppercase tracking-wider">Verify Contact</h2>
              <p className="text-sm text-gray-500 mt-2">Enter the OTP sent to <span className="font-bold text-gray-800 dark:text-gray-300">{pendingContactValue}</span></p>
            </div>
            
            <input 
              type="text" 
              value={otpValue}
              onChange={(e) => setOtpValue(e.target.value)}
              placeholder="Enter 6-digit code"
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 text-center text-2xl md:text-3xl font-semibold tracking-[0.5em] font-mono py-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-gray-900 dark:text-white mb-6"
            />

            <div className="flex gap-4">
              <button 
                type="button" 
                onClick={() => setShowOtpModal(false)}
                className="flex-1 py-3 text-sm font-bold uppercase tracking-wider border border-gray-300 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleOtpSubmit}
                disabled={isOtpVerifying || otpValue.length !== 6}
                className="flex-1 py-3 text-sm font-bold uppercase tracking-wider bg-primary hover:bg-red-700 text-white disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isOtpVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Viewer Modal */}
      {viewingImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center animate-in fade-in duration-200 backdrop-blur-sm p-4">
          <div className="absolute top-6 right-6 flex items-center gap-4">
            <a href={viewingImage.url} download={viewingImage.title.replace(' ', '_') + ".jpg"} className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4 rotate-180" /> Download High-Res
            </a>
            <button onClick={() => setViewingImage(null)} className="text-white bg-white/20 hover:bg-white/30 rounded-full w-10 h-10 flex items-center justify-center transition-colors">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M1 1L13 13M1 13L13 1" />
              </svg>
            </button>
          </div>
          <img src={viewingImage.url} alt="Expanded Document" className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border border-white/10" />
        </div>
      )}
    </div>
  );
}
