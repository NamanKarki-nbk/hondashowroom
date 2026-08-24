"use client";

import React, { useMemo } from "react";
import { DocCategory, generateNepaliTemplate } from "@/lib/letterTemplates";
import OfficialLetterpad from "../OfficialLetterpad";

interface LetterPreviewProps {
  docType: DocCategory;
  recipient: string;
  metadata: any;
}

export default function LetterPreview({ docType, recipient, metadata }: LetterPreviewProps) {
  const previewHtml = useMemo(() => {
    // Generate preview with current date and dummy letter number
    const templateData = {
      letterNo: "YYYY/YY-000XX",
      date: new Date(),
      recipient: recipient || "[Recipient Name / Organization]",
      metadata: metadata,
    };

    const { html } = generateNepaliTemplate(docType, templateData);
    return html;
  }, [docType, recipient, metadata]);

  return (
    <div className="bg-[#E5E7EB] dark:bg-[#090909] rounded-2xl shadow-inner overflow-hidden h-full flex flex-col relative border border-gray-300 dark:border-slate-800">
      <div className="bg-white/80 dark:bg-black/50 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 px-5 py-4 flex justify-between items-center z-10">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
          Live Document Preview
        </h3>
        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-slate-900 px-3 py-1.5 rounded-full shadow-inner border border-gray-200 dark:border-slate-800">Letter (8.5&quot; x 11&quot;)</span>
      </div>
      
      {/* Scrollable Letter Container */}
      <div className="flex-grow overflow-auto p-4 sm:p-8 bg-gradient-to-b from-transparent to-black/5 flex flex-col gap-8">
        {previewHtml.split('<!-- LANDSCAPE_PAGE_BREAK -->').map((part, index) => {
          const isLandscape = index > 0;
          return (
            <div 
              key={index}
              className={`bg-white mx-auto shadow-2xl border border-gray-300 relative ${
                isLandscape ? 'min-h-[8.5in] w-[11in]' : 'min-h-[11in] max-w-[8.5in] w-full'
              }`}
            >
              <OfficialLetterpad disableTableWrapper={true}>
                <table className="w-full relative z-10 border-none">
                  <thead className="table-header-group">
                    <tr>
                      <td className="border-none">
                        <div className="w-full flex justify-end px-[1in] pt-[0.5in] pb-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/honda-wing-logo.png" alt="Honda Logo" className="w-[1in] h-auto object-contain" />
                        </div>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td 
                        className={`px-[1in] align-top border-none prose prose-sm max-w-none text-black print:text-black ${docType !== 'Quotation' ? 'font-nepali' : ''} leading-normal text-justify ${isLandscape ? 'h-[5.5in]' : 'h-[6.0in]'}`}
                        dangerouslySetInnerHTML={{ __html: part }} 
                      />
                    </tr>
                  </tbody>
                  <tfoot className="table-footer-group">
                    <tr>
                      <td className="border-none">
                        <div className="w-full text-center px-[1in] pb-[0.5in] pt-2 bg-white">
                          <p className="text-[13px] font-bold text-gray-800">
                            <span className="text-[#CC0000] font-black uppercase">SOCIETY ENTERPRISES PVT. LTD.</span>, Goarkha Department Building, Ganga Nagari, Damak-05, Jhapa, Nepal
                          </p>
                          <p className="text-[10px] font-semibold text-gray-700 mt-1">
                            <span className="font-bold text-black">Sales Division</span> Phone No.: 9801615250, 9801615251, E-mail: societyenterprises2024@gmail.com
                          </p>
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </OfficialLetterpad>
            </div>
          );
        })}
      </div>
    </div>
  );
}
