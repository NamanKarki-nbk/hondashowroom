"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Printer, Download, ChevronRight, Home } from 'lucide-react';
import Link from "next/link";
import DynamicForm from "@/components/admin/letters/DynamicForm";
import LetterPreview from "@/components/admin/letters/LetterPreview";
import { DocCategory, DOC_CATEGORIES } from "@/lib/letterTemplates";
import { toast } from "sonner";

export default function NewLetterPage() {
  const router = useRouter();
  const [docType, setDocType] = useState<DocCategory>(DOC_CATEGORIES[0]);
  const [recipient, setRecipient] = useState<string>("");
  const [metadata, setMetadata] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!recipient) {
      toast.error("Please enter a recipient");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/admin/letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docType: docType === 'Warranty Claim Letter' ? (metadata.warrantyType || 'Battery Warranty Claim') : docType,
          recipient,
          metadata
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate letter");
      }

      const letter = await res.json();
      toast.success("Letter generated successfully!");
      
      // Navigate to the newly created letter print view
      router.push(`/admin/letters/${encodeURIComponent(letter.letterNo)}`);
    } catch (error) {
      toast.error("Error generating letter");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col min-h-screen">
      <nav className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 px-1">
        <Link 
          href="/admin/dashboard" 
          className="flex items-center gap-1.5 hover:text-[#B83227] transition-colors"
        >
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>
        
        <ChevronRight className="w-4 h-4 mx-2 text-gray-300 dark:text-gray-700" />
        
        <Link 
          href="/admin/letters" 
          className="hover:text-[#B83227] transition-colors"
        >
          Official Letters
        </Link>
        
        <ChevronRight className="w-4 h-4 mx-2 text-gray-300 dark:text-gray-700" />
        
        <span className="text-[#B83227] bg-[#B83227]/10 dark:bg-[#B83227]/20 px-2.5 py-1 rounded-md font-bold">
          Generate New
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
        {/* Left Pane: Dynamic Form */}
        <div className="h-full">
          <DynamicForm 
            docType={docType}
            recipient={recipient}
            metadata={metadata}
            setDocType={setDocType}
            setRecipient={setRecipient}
            setMetadata={setMetadata}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Right Pane: Live Preview */}
        <div className="h-[700px] lg:h-[calc(100vh-140px)] min-h-[700px] sticky top-6">
          <LetterPreview 
            docType={docType}
            recipient={recipient}
            metadata={metadata}
          />
        </div>
      </div>
    </div>
  );
}
