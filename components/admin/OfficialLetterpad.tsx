import React from "react";

interface OfficialLetterpadProps {
  children: React.ReactNode;
  className?: string;
  disableTableWrapper?: boolean;
}

export default function OfficialLetterpad({ children, className = "", disableTableWrapper = false }: OfficialLetterpadProps) {
  return (
    <div className={`relative w-full min-h-[11in] print:min-h-0 bg-white text-black print:bg-transparent ${className}`}>
      
      {/* Background Watermark (Screen & Print) */}
      <div className="absolute inset-0 pointer-events-none z-0 flex justify-center items-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/honda-wing-logo.png" alt="Honda Watermark" className="w-[800px] max-w-[80%] opacity-[0.07]" />
      </div>

      {/* ==========================================
          MAIN CONTENT AREA (Using Table for Spacing)
          The thead/tfoot create empty space on EVERY printed page
          so the content doesn't overlap the fixed header/footer.
          ========================================== */}
      {!disableTableWrapper ? (
        <table className="w-full relative z-10 border-none">
          <thead className="table-header-group">
            <tr>
              <td className="border-none">
                <div className="w-full flex justify-end px-[1in] pt-[0.5in] pb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/honda-wing-logo.png" alt="Honda Logo" className="w-[1in] h-auto object-contain" />
                </div>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-[1in] align-top border-none h-[6.0in]">
                {children}
              </td>
            </tr>
          </tbody>
          <tfoot className="table-footer-group">
            <tr>
              <td className="border-none">
                <div className="w-full text-center px-[1in] pb-[0.5in] pt-2 bg-white">
                  <p className="text-[13px] font-bold text-gray-800">
                    <span className="text-[#CC0000] font-black uppercase">SOCIETY ENTERPRISES PVT. LTD.</span>, Goarkha Department Building, Ganga Nagari, Damak-05, Jhapa, Nepal
                  </p>
                  <p className="text-xs font-semibold text-gray-700 mt-1">
                    <span className="font-bold text-black">Sales Division</span> Phone No.: 9801615250, 9801615251, E-mail: societyenterprises2024@gmail.com
                  </p>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      ) : (
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      )}

    </div>
  );
}
