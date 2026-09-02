import React from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import NepaliDate from "nepali-date-converter";

export default async function ReceiptPrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const transaction = await prisma.salesTransaction.findUnique({
    where: { id },
    include: {
      customer: true,
      vehicle: {
        include: { variant: true }
      },
      receipts: true
    }
  });

  if (!transaction) return notFound();

  const printDate = new Date();
  const nepaliDateObj = new NepaliDate(printDate);
  const nepaliDateStr = nepaliDateObj.format("YYYY-MM-DD");
  const englishDateStr = printDate.toISOString().split("T")[0];

  const vehicleInfo = `${transaction.vehicle.variant.variantName} - ${transaction.vehicle.engineNo}`;
  
  // Format numbers
  const f = (n: number | null | undefined) => (n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const firstReceipt = transaction.receipts[0] ? transaction.receipts[0].receiptNo : "N/A";

  const ReceiptCopy = ({ isCustomer, isFirst }: { isCustomer: boolean, isFirst?: boolean }) => (
    <div className={`w-full max-w-3xl mx-auto p-4 md:p-8 bg-white text-black mb-4 border-b-2 border-dashed border-gray-300 print:border-none print:mb-2 print:break-inside-avoid ${isFirst ? 'print:pt-[1.5in]' : 'print:pt-2'}`}>
      <div className="text-center mb-4">
        <div className="print:hidden">
          <h1 className="text-xl font-bold uppercase tracking-wide">SOCIETY ENTERPRISES PRIVATE LIMITED</h1>
          <p className="text-sm">Damak-05, Jhapa, Nepal</p>
        </div>
        <h2 className="text-lg font-bold mt-2">Money Receipt {isCustomer ? "(Customer Copy)" : "(Office Copy)"}</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm font-medium">
        <div>
          <p><span className="w-32 inline-block">ACCOUNT :</span> {transaction.invoiceNo}</p>
          <p><span className="w-32 inline-block">RECEIVED FROM :</span> {transaction.customer.fullName}</p>
          <p><span className="w-32 inline-block">BIKE INFO :</span> {vehicleInfo}</p>
        </div>
        <div className="text-right">
          <p>PRINT DATE : {englishDateStr} | {nepaliDateStr}</p>
          <p>REC#: {firstReceipt}</p>
        </div>
      </div>

      <table className="w-full border-collapse border border-black text-sm mb-8">
        <thead>
          <tr className="border-b border-black">
            <th className="text-left p-2 border-r border-black font-bold w-1/2">DESCRIPTION</th>
            <th className="text-center p-2 border-r border-black font-bold w-1/4">R. NO</th>
            <th className="text-right p-2 font-bold w-1/4">AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-black">
            <td className="p-2 border-r border-black">Vehicle Amount</td>
            <td className="p-2 border-r border-black text-center"></td>
            <td className="p-2 text-right font-medium">{f(transaction.showroomPrice)}</td>
          </tr>
          <tr className="border-b border-black">
            <td className="p-2 border-r border-black">Accessories</td>
            <td className="p-2 border-r border-black"></td>
            <td className="p-2 text-right font-medium">{f(transaction.accessoriesCharge)}</td>
          </tr>
          <tr className="border-b border-black">
            <td className="p-2 border-r border-black">Exchange Valuation</td>
            <td className="p-2 border-r border-black"></td>
            <td className="p-2 text-right font-medium">{f(transaction.exchangeValue)}</td>
          </tr>
          <tr className="border-b border-black">
            <td className="p-2 border-r border-black">Insurance</td>
            <td className="p-2 border-r border-black"></td>
            <td className="p-2 text-right font-medium">{f(transaction.insurance)}</td>
          </tr>
          <tr className="border-b border-black">
            <td className="p-2 border-r border-black">Discount</td>
            <td className="p-2 border-r border-black"></td>
            <td className="p-2 text-right font-medium">{f(transaction.discount)}</td>
          </tr>
          <tr className="border-b border-black font-bold">
            <td className="p-2 border-r border-black">Total Payable Amount</td>
            <td className="p-2 border-r border-black text-center"></td>
            <td className="p-2 text-right">{f(transaction.finalAmount)}</td>
          </tr>
          <tr className="border-b border-black font-bold">
            <td className="p-2 border-r border-black">Paid Amount</td>
            <td className="p-2 border-r border-black text-center">{firstReceipt}</td>
            <td className="p-2 text-right">{f(transaction.totalAmountPaid)}</td>
          </tr>
          <tr className="border-b border-black font-bold">
            <td className="p-2 border-r border-black">Amount Receivable</td>
            <td className="p-2 border-r border-black text-center"></td>
            <td className="p-2 text-right">{f(transaction.dueAmount)}</td>
          </tr>
          <tr className="border-b border-black">
            <td className="p-2 border-r border-black">Less - 2ndPayment :</td>
            <td className="p-2 border-r border-black text-center"></td>
            <td className="p-2 text-right">0.00</td>
          </tr>
          <tr className="border-b border-black font-bold">
            <td className="p-2 border-r border-black">Amount Receivable</td>
            <td className="p-2 border-r border-black text-center"></td>
            <td className="p-2 text-right">{f(transaction.dueAmount)}</td>
          </tr>
          <tr className="border-b border-black">
            <td className="p-2 border-r border-black">Less - 3rd Payment :</td>
            <td className="p-2 border-r border-black text-center"></td>
            <td className="p-2 text-right">0.00</td>
          </tr>
          <tr className="border-b border-black font-bold">
            <td className="p-2 border-r border-black">Amount Receivable</td>
            <td className="p-2 border-r border-black text-center"></td>
            <td className="p-2 text-right">{f(transaction.dueAmount)}</td>
          </tr>
        </tbody>
      </table>

      <div className="flex justify-between items-end mt-8 text-sm font-medium">
        <div className="w-48 text-center border-t border-black pt-2">Customer Signature</div>
        <div className="w-48 text-center border-t border-black pt-2">Prepared By</div>
        <div className="w-48 text-center border-t border-black pt-2">Authorized Signature</div>
      </div>

      <div className="mt-6 text-xs italic text-center">
        <p>Payment made through cheque is subject to realisation of the cheque.</p>
        <p>Please Verify the name and M/C No. and Sign the Receipt. Otherwise the Company will not be responsible.</p>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-white text-black min-h-screen">
      <style>{`
        @media print {
          @page { size: letter; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
      <div className="print:hidden p-4 bg-gray-100 flex justify-center sticky top-0 shadow-sm z-50">
        <button 
          id="print-btn"
          className="bg-primary text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-red-700 transition"
          autoFocus
        >
          Print Receipt
        </button>
      </div>
      
      <div className="p-0 m-0">
        <ReceiptCopy isCustomer={true} isFirst={true} />
        <ReceiptCopy isCustomer={false} />
      </div>

      <script dangerouslySetInnerHTML={{ __html: `document.getElementById('print-btn')?.addEventListener('click', () => window.print()); setTimeout(() => window.print(), 500);` }} />
    </div>
  );
}
