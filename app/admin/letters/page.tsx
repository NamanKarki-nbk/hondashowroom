"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Printer, Save, FileText, Send } from "lucide-react";
import { generateLetterContent, saveLetter, LetterData } from "@/app/actions/letter";
import Logo from "@/components/Logo";

const LETTER_TYPES = [
  "Warranty Claim Letter (वारन्टी दाबी पत्र)",
  "Amount Transfer Request (रकम भुक्तानी / ट्रान्सफर अनुरोध)",
  "Vehicle/Stock Requisition (गाडी / सामान माग पत्र)",
  "Monthly Claim Settlement (मासिक क्लेम फर्छ्यौट)",
  "Custom Official Notice (सामान्य आधिकारिक पत्र)"
];

export default function LetterDispatch() {
  const [formData, setFormData] = useState<LetterData>({
    letterType: LETTER_TYPES[1],
    recipientName: "",
    recipientDesignation: "Branch Manager",
    recipientBranch: "Head Office, Kathmandu",
    amount: 0,
    reason: "",
    dateStr: format(new Date(), "yyyy-MM-dd"),
  });

  const [previewContent, setPreviewContent] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      const content = await generateLetterContent(formData);
      setPreviewContent(content);
    };
    fetchContent();
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveAndPrint = async () => {
    setIsSaving(true);
    try {
      await saveLetter(formData, previewContent);
      handlePrint();
    } catch (error) {
      console.error("Failed to save letter", error);
      alert("Failed to save the letter.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3ebdd] dark:bg-[#0B0B0C] text-gray-100 p-6 md:p-12 font-sans selection:bg-[#c1291A] selection:text-[#f3ebdd] print:p-0 print:bg-[#f3ebdd] print:text-black">
      
      {/* Non-Printable Header & Form */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 print:hidden">
        
        {/* Sidebar Form */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 bg-[#c1291A]/10 rounded-xl border border-[#c1291A]/20">
              <Send className="text-[#c1291A] w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Letter Dispatch</h1>
              <p className="text-sm text-gray-400">Head Office Communication</p>
            </div>
          </div>

          <div className="bg-[#f3ebdd]/5 border border-[#f3ebdd]/10 backdrop-blur-xl rounded-2xl p-6 space-y-5 shadow-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Letter Type</label>
              <select 
                name="letterType"
                value={formData.letterType}
                onChange={handleChange}
                className="w-full bg-black/50 border border-[#f3ebdd]/10 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#c1291A] focus:border-[#c1291A] outline-none transition-all"
              >
                {LETTER_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Designation</label>
                <input 
                  type="text" name="recipientDesignation" value={formData.recipientDesignation} onChange={handleChange}
                  className="w-full bg-black/50 border border-[#f3ebdd]/10 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#c1291A] focus:border-[#c1291A] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Branch</label>
                <input 
                  type="text" name="recipientBranch" value={formData.recipientBranch} onChange={handleChange}
                  className="w-full bg-black/50 border border-[#f3ebdd]/10 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#c1291A] focus:border-[#c1291A] outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Amount (Rs.)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500 text-sm">Rs.</span>
                <input 
                  type="number" name="amount" value={formData.amount} onChange={handleChange}
                  className="w-full bg-black/50 border border-[#f3ebdd]/10 rounded-lg p-2.5 pl-9 text-sm focus:ring-1 focus:ring-[#c1291A] focus:border-[#c1291A] outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Reason / Details</label>
              <textarea 
                name="reason" value={formData.reason} onChange={handleChange} rows={3}
                placeholder="Brief reason for the letter in English..."
                className="w-full bg-black/50 border border-[#f3ebdd]/10 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#c1291A] focus:border-[#c1291A] outline-none transition-all"
              />
            </div>

            <button 
              onClick={handleSaveAndPrint}
              disabled={isSaving}
              className="w-full mt-4 bg-gradient-to-r from-[#c1291A] to-[#b3000e] hover:from-[#ff0015] hover:to-[#c1291A] text-[#f3ebdd] font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all shadow-lg shadow-[#c1291A]/20 disabled:opacity-70"
            >
              {isSaving ? (
                <span className="animate-pulse">Saving...</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save & Print Letter</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Preview Area */}
        <div className="lg:col-span-8">
          <div className="bg-[#f3ebdd]/5 border border-[#f3ebdd]/10 rounded-2xl p-2 h-full min-h-[800px] flex justify-center overflow-auto backdrop-blur-3xl shadow-2xl">
            {/* The A4 Paper Container */}
            <div id="print-area" className="bg-[#f3ebdd] text-black w-full max-w-[210mm] min-h-[297mm] p-[20mm] shadow-xl rounded-sm print:shadow-none print:rounded-none print:m-0 print:p-0 relative">
              {/* Letterhead Header */}
              <div className="flex justify-between items-start border-b-2 border-[#c1291A] pb-6 mb-8">
                <div className="flex items-center space-x-4">
                  <Logo className="w-16 h-16 print:w-20 print:h-20" />
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#c1291A]">Society Enterprises Pvt. Ltd.</h1>
                    <p className="text-sm font-medium text-gray-600 mt-1">Authorized Honda Dealership</p>
                    <p className="text-xs text-gray-500 mt-0.5">Damak, Jhapa | Reg No: 12345/078/79</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-sm"><span className="font-semibold">Date:</span> {formData.dateStr}</div>
                  <div className="text-sm"><span className="font-semibold">Ref No:</span> SEL-{format(new Date(), "yyyy")}-XXXX</div>
                </div>
              </div>

              {/* Letter Body Content */}
              <div className="whitespace-pre-wrap font-serif leading-relaxed text-[15px] text-gray-800">
                {previewContent}
              </div>

              {/* Letter Footer (Stamps & Signatures) */}
              <div className="absolute bottom-[20mm] left-[20mm] right-[20mm]">
                <div className="flex justify-between mt-32">
                  <div className="text-center">
                    <div className="w-32 border-t border-gray-400 mb-2 mx-auto"></div>
                    <p className="text-sm font-semibold">Prepared By</p>
                  </div>
                  <div className="text-center">
                    <div className="w-32 border-t border-gray-400 mb-2 mx-auto"></div>
                    <p className="text-sm font-semibold">Authorized Signatory</p>
                    <p className="text-xs text-gray-500">Official Stamp</p>
                  </div>
                </div>
                <div className="mt-12 text-center text-xs text-gray-400 border-t pt-4">
                  <p>Society Enterprises Pvt. Ltd. | Damak, Nepal | Email: info@societyhonda.com | Phone: +977-23-580000</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Global Print Styles to enforce A4 and remove backgrounds */}
      <style jsx global>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
