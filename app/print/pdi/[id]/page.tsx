import React from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import NepaliDate from "nepali-date-converter";

export default async function PDIPrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const transaction = await prisma.salesTransaction.findUnique({
    where: { id },
    include: {
      customer: true,
      vehicle: { include: { variant: { include: { vehicleMaster: true } } } }
    }
  });

  if (!transaction) return notFound();

  const printDate = new Date();
  const nepaliDateObj = new NepaliDate(printDate);
  const nepaliDateStr = nepaliDateObj.format("YYYY-MM-DD");
  const englishDateStr = printDate.toISOString().split("T")[0];

  return (
    <div className="w-full max-w-4xl mx-auto bg-white text-black p-4 md:p-8 min-h-screen text-[13px] leading-tight print:p-0 print:pt-[1.5in]">
      <style>{`
        @media print {
          @page { size: letter; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
      <div className="print:hidden p-4 bg-gray-100 flex justify-center sticky top-0 shadow-sm z-50 mb-4">
        <button id="print-btn" className="bg-primary text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-red-700 transition">Print PDI</button>
      </div>

      <div className="flex justify-between items-start mb-6">
        <div className="w-1/3 print:invisible">
          <h1 className="text-xl font-bold uppercase text-red-600 print:text-black">HONDA</h1>
          <p className="font-bold">Society Enterprises Pvt. Ltd.</p>
          <p>Damak-05, Jhapa</p>
          <p>9801615250 /</p>
          <p>Reg No. : 619869261</p>
        </div>
        <div className="w-1/3 text-center pt-8">
          <h1 className="text-2xl font-black">PDI CHECK SHEET</h1>
        </div>
        <div className="w-1/3 flex flex-col items-end pt-8">
           <p className="font-bold border-t border-black pt-1 w-32 text-center">Date</p>
           <p className="text-right font-medium">{nepaliDateStr}</p>
           <p className="text-right font-medium">{englishDateStr}</p>
        </div>
      </div>

      {/* Merged Info Table */}
      <table className="w-full border-collapse border border-black text-left table-fixed mb-1 font-medium">
        <colgroup>
           <col className="w-[25%]" />
           <col className="w-[35%]" />
           <col className="w-[20%]" />
           <col className="w-[20%]" />
        </colgroup>
        <tbody>
          <tr>
            <td className="p-1 border border-black font-bold bg-gray-100" style={{ backgroundColor: '#f3f4f6', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>Index No.</td>
            <td className="p-1 border border-black">{transaction.vehicle.indexNo || ""}</td>
            <td className="p-1 border border-black font-bold"></td>
            <td className="p-1 border border-black"></td>
          </tr>
          <tr>
            <td className="p-1 border border-black font-bold">Name</td>
            <td className="p-1 border border-black uppercase">{transaction.customer.fullName}</td>
            <td className="p-1 border border-black font-bold">Address</td>
            <td className="p-1 border border-black uppercase">{transaction.customer.address || ""}</td>
          </tr>
          <tr>
            <td className="p-1 border border-black font-bold">Contact No.</td>
            <td className="p-1 border border-black uppercase">{transaction.customer.phone}</td>
            <td className="p-1 border border-black font-bold">S.B.N</td>
            <td className="p-1 border border-black uppercase">{transaction.serviceBookNo || ""}</td>
          </tr>
          <tr>
            <td className="p-1 border border-black font-bold">VARIENT</td>
            <td className="p-1 border border-black uppercase">{transaction.vehicle.variant.variantName.includes("Scooter") || transaction.vehicle.variant.variantName.includes("Dio") ? "SCOOTER" : "MOTORCYCLE"}</td>
            <td className="p-1 border border-black font-bold">Odometer Reading</td>
            <td className="p-1 border border-black uppercase">0</td>
          </tr>
          <tr>
            <td className="p-1 border border-black font-bold">Model Code</td>
            <td className="p-1 border border-black uppercase">{transaction.vehicle.variant.vehicleMaster.name}</td>
            <td className="p-1 border border-black font-bold">Frame No.</td>
            <td className="p-1 border border-black uppercase">{transaction.vehicle.vin}</td>
          </tr>
          <tr>
            <td className="p-1 border border-black font-bold">Colour Code</td>
            <td className="p-1 border border-black uppercase">{transaction.vehicle.color}</td>
            <td className="p-1 border border-black font-bold">Engine No.</td>
            <td className="p-1 border border-black uppercase">{transaction.vehicle.engineNo}</td>
          </tr>
          <tr>
            <td className="p-1 border border-black font-bold">Chalan No.</td>
            <td className="p-1 border border-black uppercase"></td>
            <td className="p-1 border border-black font-bold">Key No.</td>
            <td className="p-1 border border-black uppercase"></td>
          </tr>
          <tr>
            <td className="p-1 border border-black font-bold">Temp. Registration No.</td>
            <td className="p-1 border border-black uppercase">{transaction.vehicle.tempRegistrationNo || ""}</td>
            <td className="p-1 border border-black font-bold">Tyre Make :</td>
            <td className="p-1 border border-black uppercase"></td>
          </tr>
          <tr>
            <td className="p-1 border border-black font-bold">Mechi Registration No.</td>
            <td className="p-1 border border-black uppercase">{transaction.vehicle.mechiRegistrationNo || ""}</td>
            <td className="p-1 border border-black font-bold">Battery No. :</td>
            <td className="p-1 border border-black uppercase"></td>
          </tr>
        </tbody>
      </table>

      <div className="text-center font-bold text-xs p-1">
        Tick Each Item Following Satisfactory Inspection, If any Defects Put X Marks & 'NA' if item is not applicable to product initial check.
      </div>

      <div className="border border-black">
        <div className="bg-gray-300 print:bg-gray-300 font-bold text-center border-b border-black p-1" style={{ backgroundColor: '#d1d5db', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>Initial Check</div>
        <div className="grid grid-cols-2 gap-4 p-2 font-medium">
          <div className="flex gap-2 items-center"><div className="w-4 h-4 border border-black flex items-center justify-center font-bold">✓</div> Body Parts Free from Dent, Scratch, Damage or Paint Defect.</div>
          <div className="flex gap-2 items-center"><div className="w-4 h-4 border border-black flex items-center justify-center font-bold">✓</div> Availability of Tools Kit, First Aid Kit, Owner's Manual.</div>
          <div className="flex gap-2 items-center"><div className="w-4 h-4 border border-black flex items-center justify-center font-bold">✓</div> Check Engine Oil level with Dipstick (Topup if required)</div>
          <div className="flex gap-2 items-center"><div className="w-4 h-4 border border-black flex items-center justify-center font-bold">✓</div> Check Body Parts for fit and finish.</div>
        </div>

        <div className="bg-gray-300 print:bg-gray-300 font-bold text-center border-y border-black p-1 mt-4" style={{ backgroundColor: '#d1d5db', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>Function Check</div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-3 p-4 font-medium text-[11px] leading-tight">
          <div className="flex gap-2 items-start"><div className="w-4 h-4 min-w-[1rem] min-h-[1rem] flex-shrink-0 border border-black mt-0.5"></div> Handle Movement</div>
          <div className="flex gap-2 items-start"><div className="w-4 h-4 min-w-[1rem] min-h-[1rem] flex-shrink-0 border border-black mt-0.5"></div> Seat Condition / Lock operation</div>
          <div className="flex gap-2 items-start"><div className="w-4 h-4 min-w-[1rem] min-h-[1rem] flex-shrink-0 border border-black mt-0.5"></div> Fuel lid and fuel cap operation</div>
          <div className="flex gap-2 items-start"><div className="w-4 h-4 min-w-[1rem] min-h-[1rem] flex-shrink-0 border border-black mt-0.5"></div> Head light (Hi/Low) operation & Beam alignment</div>
          
          <div className="flex gap-2 items-start"><div className="w-4 h-4 min-w-[1rem] min-h-[1rem] flex-shrink-0 border border-black mt-0.5"></div> FR Tyre cut/wear</div>
          <div className="flex gap-2 items-start"><div className="w-4 h-4 min-w-[1rem] min-h-[1rem] flex-shrink-0 border border-black mt-0.5"></div> Kick Operation</div>
          <div className="flex gap-2 items-start"><div className="w-4 h-4 min-w-[1rem] min-h-[1rem] flex-shrink-0 border border-black mt-0.5"></div> Tail / Brake Light operation</div>
          <div className="flex gap-2 items-start"><div className="w-4 h-4 min-w-[1rem] min-h-[1rem] flex-shrink-0 border border-black mt-0.5"></div> Fr. LH & RH Fork Condition</div>
          
          <div className="flex gap-2 items-start"><div className="w-4 h-4 min-w-[1rem] min-h-[1rem] flex-shrink-0 border border-black mt-0.5"></div> RR Tyre cut/wear</div>
          <div className="flex gap-2 items-start"><div className="w-4 h-4 min-w-[1rem] min-h-[1rem] flex-shrink-0 border border-black mt-0.5"></div> Rear Suspension</div>
          <div className="flex gap-2 items-start"><div className="w-4 h-4 min-w-[1rem] min-h-[1rem] flex-shrink-0 border border-black mt-0.5"></div> Idle RPM</div>
          <div className="flex gap-2 items-start"><div className="w-4 h-4 min-w-[1rem] min-h-[1rem] flex-shrink-0 border border-black mt-0.5"></div> Wheel Assy. FR/RR</div>
          
          <div className="flex gap-2 items-start"><div className="w-4 h-4 min-w-[1rem] min-h-[1rem] flex-shrink-0 border border-black mt-0.5"></div> Rear brake freeplay & Brake switch functioning</div>
          <div className="flex gap-2 items-start"><div className="w-4 h-4 min-w-[1rem] min-h-[1rem] flex-shrink-0 border border-black mt-0.5"></div> Side Stand Operation</div>
          <div className="flex gap-2 items-start"><div className="w-4 h-4 min-w-[1rem] min-h-[1rem] flex-shrink-0 border border-black mt-0.5"></div> Main Stand Operation</div>
          <div className="flex gap-2 items-start"><div className="w-4 h-4 min-w-[1rem] min-h-[1rem] flex-shrink-0 border border-black mt-0.5"></div> Winkers Indication Light</div>

          <div className="flex gap-2 items-start"><div className="w-4 h-4 min-w-[1rem] min-h-[1rem] flex-shrink-0 border border-black mt-0.5"></div> Pass Light High/Low beam Switch</div>
          <div className="flex gap-2 items-start"><div className="w-4 h-4 min-w-[1rem] min-h-[1rem] flex-shrink-0 border border-black mt-0.5"></div> Mirror Assembly</div>
          <div className="flex gap-2 items-start"><div className="w-4 h-4 min-w-[1rem] min-h-[1rem] flex-shrink-0 border border-black mt-0.5"></div> Front brake freeplay & Brake switch functioning</div>
          <div className="flex gap-2 items-start"><div className="w-4 h-4 min-w-[1rem] min-h-[1rem] flex-shrink-0 border border-black mt-0.5"></div> MIL Indication Light</div>

          <div className="flex gap-2 items-start"><div className="w-4 h-4 min-w-[1rem] min-h-[1rem] flex-shrink-0 border border-black mt-0.5"></div> Winker Operation</div>
          <div className="flex gap-2 items-start"><div className="w-4 h-4 min-w-[1rem] min-h-[1rem] flex-shrink-0 border border-black mt-0.5"></div> Throttle freeplay & functioning</div>
          <div className="flex gap-2 items-start"><div className="w-4 h-4 min-w-[1rem] min-h-[1rem] flex-shrink-0 border border-black mt-0.5"></div> Fuel Indication</div>
          <div className="flex gap-2 items-start"><div className="w-4 h-4 min-w-[1rem] min-h-[1rem] flex-shrink-0 border border-black mt-0.5"></div> ECO Indicator</div>

          <div className="flex gap-2 items-start"><div className="w-4 h-4 min-w-[1rem] min-h-[1rem] flex-shrink-0 border border-black mt-0.5"></div> Horn Operation</div>
          <div className="flex gap-2 items-start"><div className="w-4 h-4 min-w-[1rem] min-h-[1rem] flex-shrink-0 border border-black mt-0.5"></div> Start button / Idling Stop Switch</div>
          <div className="flex gap-2 items-start"><div className="w-4 h-4 min-w-[1rem] min-h-[1rem] flex-shrink-0 border border-black mt-0.5"></div> Odometer / Tripmeter / current fuel</div>
          <div className="flex gap-2 items-start"><div className="w-4 h-4 min-w-[1rem] min-h-[1rem] flex-shrink-0 border border-black mt-0.5"></div> SMART Key Indicator (VII ID)</div>

          <div className="flex gap-2 items-start"><div className="w-4 h-4 min-w-[1rem] min-h-[1rem] flex-shrink-0 border border-black mt-0.5"></div> Key Switch and Handle Lock functioning</div>
          <div className="flex gap-2 items-start"><div className="w-4 h-4 min-w-[1rem] min-h-[1rem] flex-shrink-0 border border-black mt-0.5"></div> Combi Switch (Seat/Fuel lid) functioning</div>
          <div className="flex gap-2 items-start"><div className="w-4 h-4 min-w-[1rem] min-h-[1rem] flex-shrink-0 border border-black mt-0.5"></div> Time</div>
          <div className="flex gap-2 items-start"><div className="w-4 h-4 min-w-[1rem] min-h-[1rem] flex-shrink-0 border border-black mt-0.5"></div> High/Low Beam Indication Light</div>
        </div>

        <div className="bg-gray-300 print:bg-gray-300 font-bold text-center border-y border-black p-1 mt-4" style={{ backgroundColor: '#d1d5db', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>Road Test</div>
        <div className="grid grid-cols-2 gap-4 p-4 font-medium">
          <div className="flex gap-2 items-center"><div className="w-4 h-4 border border-black flex items-center justify-center font-bold">✓</div> Vehicle Driving Performance</div>
          <div className="flex gap-2 items-center"><div className="w-4 h-4 border border-black flex items-center justify-center font-bold">✓</div> Wash and Clean</div>
          <div className="flex gap-2 items-center"><div className="w-4 h-4 border border-black flex items-center justify-center font-bold">✓</div> Brake Function</div>
          <div className="flex gap-2 items-center"><div className="w-4 h-4 border border-black flex items-center justify-center font-bold">✓</div> Front/Rear Suspension.</div>
          <div className="flex gap-2 items-center"><div className="w-4 h-4 border border-black flex items-center justify-center font-bold">✓</div> Check for Fuel Oil and Exhaust leakage</div>
        </div>
      </div>

      <div className="flex border-x border-b border-black mt-0">
        <div className="w-1/2 p-2 border-r border-black font-bold">
          I hereby certify that the above items have been inspected for<br/>
          correct information, adjustment and operation.
        </div>
        <div className="w-1/2 p-2 font-bold">
          I hereby acknowledge receipt of the products and confirm that<br/>
          I have thoroughly checked all the specified fields.
        </div>
      </div>

      <div className="flex justify-between items-end mt-16 text-[13px] pb-10">
        <div className="w-1/2 text-center">
          <p className="font-bold">- Dambar Bahadur Karki</p>
        </div>
        <div className="w-1/2 text-center">
          <p className="font-bold uppercase">- {transaction.customer.fullName}</p>
        </div>
      </div>
      
      <script dangerouslySetInnerHTML={{ __html: `document.getElementById('print-btn')?.addEventListener('click', () => window.print()); setTimeout(() => window.print(), 500);` }} />
    </div>
  );
}
