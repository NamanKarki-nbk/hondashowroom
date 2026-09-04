import React from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import NepaliDate from "nepali-date-converter";

export default async function UndertakingPrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const transaction = await prisma.salesTransaction.findUnique({
    where: { id },
    include: {
      customer: { include: { documents: true, user: true } },
      vehicle: { include: { variant: { include: { vehicleMaster: true } }, purchaseInvoice: true } },
      receipts: true
    }
  });

  if (!transaction) return notFound();

  const printDate = new Date();
  const nepaliDateObj = new NepaliDate(printDate);
  const nepaliDateStr = nepaliDateObj.format("YYYY-MM-DD");
  const englishDateStr = printDate.toISOString().split("T")[0];
  
  const f = (n: number | null | undefined) => (n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  const citizenship = transaction.customer.documents.find(d => d.docType === 'CITIZENSHIP')?.docNumber || "";
  const firstReceipt = transaction.receipts[0] ? transaction.receipts[0].receiptNo : "";
  const dobAdFormatted = transaction.customer?.user?.dobAd ? new Date(transaction.customer.user.dobAd).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : "";

  return (
    <div className="w-full max-w-4xl mx-auto bg-white text-black p-4 md:p-8 min-h-screen text-[13px] leading-tight print:p-0 print:pt-4">
      <style>{`
        @media print {
          @page { size: letter; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
      <div className="print:hidden p-4 bg-gray-100 flex justify-center sticky top-0 shadow-sm z-50 mb-4">
        <button id="print-btn" className="bg-primary text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-red-700 transition">Print Undertaking</button>
      </div>

      <div className="flex items-start mb-6 border-b border-black pb-4 relative">
        <div>
          <h1 className="text-xl font-bold uppercase">Society Enterprises Pvt. Ltd.</h1>
          <p>Urlabari-05, Morang</p>
          <p>9801615250 / 9801708936</p>
          <p>Reg No. : 619869261</p>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2">
          <h1 className="text-2xl font-black">UNDERTAKING</h1>
        </div>
      </div>

      <p className="font-bold mb-4 leading-relaxed text-sm">
        म हस्ताक्षर गर्दछु कि मैले यस शोरुमबाट होन्डा कम्पनीको मोटरसाइकल तथा स्कुटरको पूर्ण रूपमा जाँचबुझ गरी, सन्तोषजनक तथा सञ्चालन योग्य अवस्थामा रहेको 
        पुष्टि गर्दै आफ्नो स्वेच्छा तथा पूर्ण जिम्मेवारीमा बुझिलिएको छु। सवारी साधनमा भैपरी आउने सम्पूर्ण समस्याहरू सहुँला बुझौला । साथै, सवारी साधनसँगै निम्न सामग्रीहरू 
        बुझिएको पुष्टि गर्दछु: एक सेट First Aid Kit, Tools Bag र Servicing Book । कुनै बाँकी बक्यौता रकम भएमा तोकिएको समयमै भुक्तानी गर्नेछु । जसको 
        विवरण यस प्रकार छ :-
      </p>

      {/* Merged Table 1 (Vehicle & Extra) */}
      <table className="w-full border-collapse border border-black text-left table-fixed mb-3 font-medium">
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
            <td className="p-1 border border-black font-bold bg-green-300 print:bg-green-300" style={{ backgroundColor: '#86efac', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>Varient</td>
            <td className="p-1 border border-black">{transaction.vehicle.variant.variantName.includes("Scooter") || transaction.vehicle.variant.variantName.includes("Dio") ? "SCOOTER" : "MOTORCYCLE"}</td>
          </tr>
          <tr>
            <td className="p-1 border border-black font-bold">Model</td>
            <td className="p-1 border border-black uppercase">{transaction.vehicle.variant.vehicleMaster.name}</td>
            <td className="p-1 border border-black font-bold">Insurance</td>
            <td className="p-1 border border-black">{transaction.insurance > 0 ? "YES" : "NO"}</td>
          </tr>
          <tr>
            <td className="p-1 border border-black font-bold">Displacement (CC)</td>
            <td className="p-1 border border-black">{((transaction.vehicle.variant.specDifferences as any)?.cc || (transaction.vehicle.variant.vehicleMaster.specifications as any)?.cc) || "110"} CC</td>
            <td className="p-1 border border-black font-bold">Service Book No.</td>
            <td className="p-1 border border-black">{transaction.serviceBookNo || ""}</td>
          </tr>
          <tr>
            <td className="p-1 border border-black font-bold">Colour</td>
            <td className="p-1 border border-black uppercase">{transaction.vehicle.color}</td>
            <td className="p-1 border border-black font-bold">STC Invoice No.</td>
            <td className="p-1 border border-black uppercase">{transaction.vehicle.purchaseInvoice?.invoiceNo || ""}</td>
          </tr>
          <tr>
            <td className="p-1 border border-black font-bold">VIN No.</td>
            <td className="p-1 border border-black uppercase">{transaction.vehicle.vin}</td>
            <td className="p-1 border border-black font-bold">Mechi Reg No.</td>
            <td className="p-1 border border-black uppercase">{transaction.vehicle.mechiRegistrationNo || ""}</td>
          </tr>
          <tr>
            <td className="p-1 border border-black font-bold">Engine No.</td>
            <td className="p-1 border border-black uppercase">{transaction.vehicle.engineNo}</td>
            <td className="p-1 border border-black font-bold">If Scheme #</td>
            <td className="p-1 border border-black"></td>
          </tr>
          <tr>
            <td className="p-1 border border-black font-bold">Temporary Registration No.</td>
            <td className="p-1 border border-black uppercase">{transaction.vehicle.tempRegistrationNo || ""}</td>
            <td className="p-1 border border-black font-bold">Vat Bill No.</td>
            <td className="p-1 border border-black">
              {transaction.vatBillNo
                ? <>
                    <span className="font-bold">{transaction.vatBillNo}</span>
                    {transaction.vatBillIssuedDate && <span className="text-xs block text-gray-500">{new Date(transaction.vatBillIssuedDate).toLocaleDateString('en-IN')}</span>}
                  </>
                : <span className="text-gray-400 italic">DOCUMENT PENDING</span>
              }
            </td>
          </tr>
        </tbody>
      </table>

      {/* Merged Table 2 (Customer & Pricing) */}
      <table className="w-full border-collapse border border-black text-left table-fixed mb-3 font-medium">
        <colgroup>
           <col className="w-[25%]" />
           <col className="w-[35%]" />
           <col className="w-[20%]" />
           <col className="w-[20%]" />
        </colgroup>
        <tbody>
          <tr>
            <td className="p-1 border border-black font-bold">Customer's Name</td>
            <td className="p-1 border border-black uppercase">{transaction.customer.fullName}</td>
            <td className="p-1 border border-black font-bold">Price of Vehicle</td>
            <td className="p-1 border border-black text-right">{f(transaction.showroomPrice)}</td>
          </tr>
          <tr>
            <td className="p-1 border border-black font-bold">Address</td>
            <td className="p-1 border border-black uppercase">{transaction.customer.address || ""}</td>
            <td className="p-1 border border-black font-bold">Accessories</td>
            <td className="p-1 border border-black text-right">{f(transaction.accessoriesCharge)}</td>
          </tr>
          <tr>
            <td className="p-1 border border-black font-bold">Contact No.</td>
            <td className="p-1 border border-black uppercase">{transaction.customer.phone}</td>
            <td className="p-1 border border-black font-bold bg-gray-100" style={{ backgroundColor: '#f3f4f6', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>Total</td>
            <td className="p-1 border border-black text-right font-bold bg-gray-100" style={{ backgroundColor: '#f3f4f6', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>{f(transaction.showroomPrice + transaction.accessoriesCharge)}</td>
          </tr>
          <tr>
            <td className="p-1 border border-black font-bold">Date of Birth (AD)</td>
            <td className="p-1 border border-black uppercase">{dobAdFormatted}</td>
            <td className="p-1 border border-black font-bold">Exchange</td>
            <td className="p-1 border border-black text-right">{f(transaction.exchangeValue)}</td>
          </tr>
          <tr>
            <td className="p-1 border border-black font-bold">Citizenship No.</td>
            <td className="p-1 border border-black uppercase">{citizenship}</td>
            <td className="p-1 border border-black font-bold">Discount</td>
            <td className="p-1 border border-black text-right">{f(transaction.discount)}</td>
          </tr>
          <tr>
            <td className="p-1 border border-black font-bold">Purchase Type</td>
            <td className="p-1 border border-black uppercase">{transaction.paymentType} ( {transaction.paymentType === 'CASH' ? 'पूरा नगद भुक्तानी' : transaction.paymentType} )</td>
            <td className="p-1 border border-black font-bold bg-gray-100" style={{ backgroundColor: '#f3f4f6', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>Payable</td>
            <td className="p-1 border border-black text-right font-bold bg-gray-100" style={{ backgroundColor: '#f3f4f6', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>{f(transaction.finalAmount)}</td>
          </tr>
          <tr>
            <td className="p-1 border border-black font-bold">Cash Receive No.</td>
            <td className="p-1 border border-black uppercase">{firstReceipt}</td>
            <td className="p-1 border border-black font-bold">Financed</td>
            <td className="p-1 border border-black text-right">{f(transaction.financeAmount)}</td>
          </tr>
          <tr>
            <td className="p-1 border border-black font-bold align-top" rowSpan={2}>Transcations Remarks</td>
            <td className="p-1 border border-black uppercase align-top" rowSpan={2}>Due Transaction</td>
            <td className="p-1 border border-black font-bold">Paid</td>
            <td className="p-1 border border-black text-right">{f(transaction.totalAmountPaid)}</td>
          </tr>
          <tr>
            <td className="p-1 border border-black font-bold bg-gray-100" style={{ backgroundColor: '#f3f4f6', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>Due</td>
            <td className="p-1 border border-black text-right font-bold text-red-600 print:text-black bg-gray-100" style={{ backgroundColor: '#f3f4f6', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>{f(transaction.dueAmount)}</td>
          </tr>
        </tbody>
      </table>

      <div className="border border-black mb-3">
        <div className="border-b border-black font-bold p-1 underline uppercase">Terms & Conditions</div>
        <div className="p-2 space-y-2 font-bold uppercase">
          <p>ACCESSORIES GIVEN : Seat Cover, Helmet{transaction.accessories ? `, ${JSON.parse(transaction.accessories as string)}` : ""}</p>
          <p>AMOUNT PAID : रु {transaction.totalAmountPaid} मात्र ।</p>
          <p>INSURANCE MUST BE DONE BEFORE VEHICLE REGISTRATION. THANK YOU !</p>
        </div>
      </div>

      <div className="border border-black p-3 space-y-3 font-semibold text-[13px] leading-relaxed relative">
        <p className="font-bold">म हस्ताक्षर गर्दछु कि कारोबारमा बाकी रहेको उल्लेखीत रकम तोकीएको म्यादमा चुक्ता गर्नेछु । यदि तोकीएको म्यादको भाका नाघेमा विक्री मिति देखी नै बाकी रकमको १८ प्रतिशत व्याज र ताकेता शुल्क रू ७०० /- सहितको रकम भुक्तानी गर्नेछु । र यदि बाकी वक्यौताको कारण मो.सा. तथा स्कुटर को विक्रेता सोसाइटी इन्टरप्राइजेज प्रा. लि. ले आफ्नो स्वामित्वमा लिन चाहेमा त्यस प्रती मेरो, मैले कुनै पनि विरोध वा उजुर वाजुर गर्ने छैन भनी अख्तीयारी दिइ सहि गरेको छु ।</p>

        <ol className="list-decimal pl-5 space-y-1 w-4/5">
          <li>वारेन्टी अन्तर्गत पर्ने सामानहरुः<br/>क. इन्जिन सम्बन्धी (क्लच प्लेट, ग्यास्केट, आयलसिल, इन्जिन आयल बाहेक)<br/>ख. गियर वक्सका सामानहरु<br/>ग. ब्याट्रीमा १ वर्ष मात्र वारेन्टी ।</li>
          <li>वारेन्टी अन्तर्गत नपर्ने सामानहरुः<br/>क. कन्ट्रोल केवल, स्पार्क प्लग, बल्ब, रवरका सामानहरु, जोरिङ सामान, फिल्टर, ग्यास्केटहरु ।<br/>ख. चल्दा चल्दै टुट्ने, खिइने, नासिने सामानहरु जस्तैः क्लच, प्लेट, ब्रेक शु, चेन स्पोकेट, टायर, ट्युव आदि ।<br/>ग. Wheel Rim, Valve, Cam Chain, कार्बोरेटर र यस सम्बन्धी सामानहरु ।<br/>घ. एक्सीडेन्ट, मिस्युज र मोडिफाइ भएका मोटरसाईकलका सामानहरु ।</li>
          <li>एक पटक वारेन्टीमा दिएको सामान पुनः खराब भए या बिग्रिएमा वारेन्टी प्राप्त हुनेछैन ।</li>
          <li>सर्भिसिङ्गमा आउँदा मोटरसाईकल खरिद गर्दा दिएको सर्भिसिङ बुक लिएर आउनुहोला । यदि यो हराएमा वा नासिएमा फ्रि सर्भिस तथा वारेन्टीको सुविधा उपलब्ध हुनेछैन र सो बुक सुरक्षित राख्नुहोला ।</li>
          <li>बिक्री भइसकेको मोटर साईकल फिर्ता हुने वा साटिने छैन । खरिद पछिको सम्पूर्ण जिम्मेवारी ग्राहक स्वयम्को हुनेछ ।</li>
          <li>मोटरसाईकलको नामसारी खर्च रु १००० र बिमा खरिदकर्ताले नै व्यहोर्नु पर्नेछ ।</li>
          <li>बिक्री भएको मिति देखि 59 दिन भित्र सवारीसाधन स्थानान्तरण गरिसक्नुपर्छ । यदि नगरेमा, सरकारी यातायात कार्यालयले लिएको कुनै पनि शुल्कको लागि डिलर जिम्मेवार हुनेछैन।</li>
        </ol>
      </div>

      <div className="border border-black p-2 mt-4 font-bold text-[13px]">
        नोट : गाडी पासको लागि कृपया शोरुममा सम्पर्क गर्नुहोला ।<br/>सवारी साधन पासका लागि आवश्यक कागजातहरु: संस्थाको प्रतिनिधी, छाप, कर चुक्ता, पान नं., नामसारी चिठी साथै<br/>ऋणी भएमा ऋणीको नागरिकता, खरिद गरिएको सवारी साधन अनिवार्य लिएर जानु होला ।
      </div>

      <div className="flex justify-between items-end mt-10 text-[13px] pb-4">
        <div>
          <div className="border-t border-black pt-1 w-56 font-bold">Customer's Signature</div>
          <p className="font-bold uppercase mt-1">{transaction.customer.fullName}</p>
          <p className="uppercase">{transaction.customer.address || ""}</p>
        </div>
        <div className="text-right">
          <div className="border-t border-black pt-1 w-56 font-bold text-center inline-block">Dambar Bahadur Karki</div>
          <p className="font-bold mt-1">9801708936</p>
          <p>Damak-5, Jhapa</p>
        </div>
      </div>
      
      <script dangerouslySetInnerHTML={{ __html: `document.getElementById('print-btn')?.addEventListener('click', () => window.print()); setTimeout(() => window.print(), 500);` }} />
    </div>
  );
}
