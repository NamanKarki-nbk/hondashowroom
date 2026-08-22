import { notFound } from "next/navigation";
import { getLetter } from "@/app/actions/letter";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PrintButton from "@/components/admin/letters/PrintButton";
import OfficialLetterpad from "@/components/admin/OfficialLetterpad";

interface LetterPrintPageProps {
  params: Promise<{ letterNo: string }>;
}

export default async function LetterPrintPage({ params }: LetterPrintPageProps) {
  const resolvedParams = await params;
  const decodedLetterNo = decodeURIComponent(resolvedParams.letterNo);
  const letter = await getLetter(decodedLetterNo);

  if (!letter) {
    notFound();
  }

  const hasLandscape = letter.nepaliBody.includes('<!-- LANDSCAPE_PAGE_BREAK -->');

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white flex flex-col items-center py-8 print:py-0 print:block print:min-h-0">
      
      {/* Non-printable Control Bar */}
      <div className="w-full max-w-[210mm] flex justify-between items-center mb-8 print:hidden px-4">
        <Link 
          href="/admin/letters" 
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Letters
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 font-medium">Letter (8.5" x 11") Ready</span>
          <PrintButton />
        </div>
      </div>

      {/* Printable A4 Page */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          html, body {
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
          }
          @page {
            size: letter ${hasLandscape ? 'landscape' : 'portrait'};
            margin: 0;
          }
          ${hasLandscape ? `
          @page portrait {
            size: letter portrait;
            margin: 0;
          }
          .page-portrait {
            page: portrait;
          }
          ` : ''}
        }
      `}} />

      <div className="w-full flex flex-col items-center gap-8 print:block print:gap-0">
        {letter.nepaliBody.split('<!-- LANDSCAPE_PAGE_BREAK -->').map((part, index) => {
          const isLandscape = index > 0;
          return (
            <div 
              key={index} 
              className={`print:shadow-none print:min-h-0 print:w-full print:m-0 print:p-0 relative ${
                isLandscape ? 'w-[11in] print:break-before-page' : `w-[8.5in] ${hasLandscape ? 'page-portrait' : ''}`
              }`}
            >
              <OfficialLetterpad disableTableWrapper={true} className={isLandscape ? '!min-h-[8.5in] shadow-2xl print:shadow-none print:!min-h-0' : 'shadow-2xl print:shadow-none print:!min-h-0'}>
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
                        className={`px-[1in] align-top border-none prose prose-sm max-w-none text-black print:text-black ${letter.docType !== 'Quotation' ? 'font-nepali' : ''} leading-normal text-justify ${isLandscape ? 'h-[5.5in]' : 'h-[6.0in]'}`}
                        dangerouslySetInnerHTML={{ __html: part }}
                      />
                    </tr>
                  </tbody>
                  <tfoot className="table-footer-group">
                    <tr>
                      <td className="border-none">
                        <div className="w-full text-center px-[1in] pb-[0.5in] pt-2 bg-white">
                          <p className="text-[13px] font-bold text-gray-800">
                            <span className="text-[#CC0000] font-black uppercase">SOCIETY ENTERPRISES PVT. LTD.</span>, Ganga Nagari, Damak-05, Jhapa, Nepal
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
