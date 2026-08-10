"use client";

import React, { useState, useEffect } from "react";
import { Camera, Loader2, Save, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const [documentType, setDocumentType] = useState("CITIZENSHIP");
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    dobAd: "",
    dobBs: "",
    documentNumber: "",
    gender: "MALE",
    avatarUrl: "",
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
          setFormData(prev => ({
            ...prev,
            fullName: data.user.fullName || "",
            dobAd: data.user.dobAd || "",
            dobBs: data.user.dobBs || "",
            documentNumber: data.user.documentNumber || "",
            gender: data.user.gender || "MALE",
            avatarUrl: data.user.avatarUrl || "",
            ocrVerified: data.user.ocrVerified || false
          }));
          if (data.user.documentType) setDocumentType(data.user.documentType);
          if (data.user.docFrontImageUrl) setFrontImage(data.user.docFrontImageUrl);
          if (data.user.docBackImageUrl) setBackImage(data.user.docBackImageUrl);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Simulated OCR functionality based on user's exact specifications
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
        // Auto-assign default male avatar if none is present
        avatarUrl: prev.avatarUrl || "https://api.dicebear.com/9.x/avataaars/svg?seed=Success&gender=male"
      }));
      setMessage({ type: "success", text: "Data found! English fields prioritized from back side. Transliteration used for fallback on front." });
    }, 2500);
  };

  const handleFileChange = (type: "front" | "back") => {
    // Simulated file upload picking a generic placeholder for demo
    if (type === "front") setFrontImage("https://placehold.co/400x250/e2e8f0/64748b?text=Front+Side");
    else setBackImage("https://placehold.co/400x250/e2e8f0/64748b?text=Back+Side");
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

      if (res.ok) {
        setMessage({ type: "success", text: "Profile verified and saved successfully!" });
        // Optionally redirect home after 1 second
        setTimeout(() => router.push("/"), 1500);
      } else {
        const data = await res.json();
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
      <div className="min-h-screen bg-[#f3ebdd] flex items-center justify-center pt-24">
        <Loader2 className="w-8 h-8 text-[#c1291A] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3ebdd] pt-24 pb-16 px-4 md:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-3xl p-6 md:p-10 shadow-2xl">
        <h1 className="text-2xl font-black text-gray-900 uppercase mb-8">ACCOUNT SIGN-UP (OCR VERIFICATION)</h1>

        {message.text && (
          <div className={`p-4 rounded-xl mb-6 text-sm font-medium flex items-center gap-2 ${message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Documents */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Document Selection</label>
              <select 
                value={documentType}
                onChange={e => setDocumentType(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-black outline-none transition-colors"
              >
                <option value="CITIZENSHIP">Citizenship (नागरिकता)</option>
                <option value="LICENSE">Driver's License (लाइसेन्स)</option>
                <option value="NATIONAL_ID">National ID (राष्ट्रिय परिचयपत्र)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Front</label>
                <div 
                  onClick={() => handleFileChange("front")}
                  className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors aspect-[1.6/1] flex flex-col items-center justify-center text-gray-500 bg-white"
                >
                  {frontImage ? (
                    <img src={frontImage} alt="Front" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <FileText className="w-8 h-8 mb-2 opacity-50" />
                      <span className="text-sm font-medium">Click to Scan</span>
                    </>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Back</label>
                <div 
                  onClick={() => handleFileChange("back")}
                  className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors aspect-[1.6/1] flex flex-col items-center justify-center text-gray-500 bg-white"
                >
                  {backImage ? (
                    <img src={backImage} alt="Back" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <FileText className="w-8 h-8 mb-2 opacity-50" />
                      <span className="text-sm font-medium">Click to Scan</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleScan}
              disabled={isScanning || !frontImage || !backImage}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {isScanning ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Scanning Document Data with OCR...</>
              ) : "Complete OCR Registration"}
            </button>
          </div>

          {/* Right Column: Avatar */}
          <div className="flex flex-col items-center border-l border-gray-100 pl-8 pb-8">
            <div className="w-48 h-48 bg-gray-100 rounded-2xl overflow-hidden mb-4 border border-gray-200 shadow-inner flex items-center justify-center">
              {formData.avatarUrl ? (
                <img src={formData.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-20 h-20 text-gray-300" />
              )}
            </div>
            <p className="text-xs text-gray-500 mb-3 text-center">(Upload to replace character avatar)</p>
            <button 
              type="button" 
              onClick={handleAvatarChange}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Upload Profile Photo
            </button>
          </div>
        </div>

        {/* OCR Scan Status & Fields */}
        <div className="mt-10 border-t border-gray-100 pt-8">
          <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl">
            
            <div className="grid grid-cols-[200px_1fr] items-center gap-4">
              <label className="text-sm font-bold text-gray-800">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-black outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-[200px_1fr] items-center gap-4">
              <label className="text-sm font-bold text-gray-800">Date of Birth (AD)</label>
              <input
                type="text"
                name="dobAd"
                value={formData.dobAd}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-black outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-[200px_1fr] items-center gap-4">
              <label className="text-sm font-bold text-gray-800">Date of Birth (BS)</label>
              <input
                type="text"
                name="dobBs"
                value={formData.dobBs}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-black outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-[200px_1fr] items-center gap-4">
              <label className="text-sm font-bold text-gray-800">Citizenship Number</label>
              <input
                type="text"
                name="documentNumber"
                value={formData.documentNumber}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-black outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-[200px_1fr] items-center gap-4">
              <label className="text-sm font-bold text-gray-800">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-black outline-none transition-colors"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="pt-6 flex justify-center">
              <button
                type="submit"
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-10 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-green-600/20 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                Confirm and Continue
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
