import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import NepaliDate from 'nepali-date-converter';

const formatNPR = (amount: number) =>
  new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 2 }).format(amount);

function toWords(num: number): string {
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ',
    'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const n_str = Math.round(num).toString();
  if (n_str.length > 9) return 'Overflow';
  const n = ('000000000' + n_str).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/)!;
  if (!n) return '';
  let str = '';
  str += (Number(n[1]) !== 0) ? (a[Number(n[1])] || b[parseInt(n[1][0])] + ' ' + a[parseInt(n[1][1])]) + 'Crore ' : '';
  str += (Number(n[2]) !== 0) ? (a[Number(n[2])] || b[parseInt(n[2][0])] + ' ' + a[parseInt(n[2][1])]) + 'Lakh ' : '';
  str += (Number(n[3]) !== 0) ? (a[Number(n[3])] || b[parseInt(n[3][0])] + ' ' + a[parseInt(n[3][1])]) + 'Thousand ' : '';
  str += (Number(n[4]) !== 0) ? (a[Number(n[4])] + 'Hundred ') : '';
  str += (Number(n[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[parseInt(n[5][0])] + ' ' + a[parseInt(n[5][1])]) : '';
  return str.trim() + ' Rupees Only';
}

import PrintButtons from './PrintButtons';

export default async function PaymentReceiptPrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const receipt = await prisma.paymentReceipt.findUnique({
    where: { id },
    include: {
      transaction: {
        include: {
          customer: true,
          vehicle: {
            include: {
              variant: { include: { vehicleMaster: true } },
            },
          },
        },
      },
    },
  });

  if (!receipt) notFound();

  const tx = receipt.transaction;
  const customer = tx.customer;
  const vehicleName = `${tx.vehicle.variant.vehicleMaster.name} — ${tx.vehicle.variant.variantName}`;

  // BS Date
  let bsDateStr = '';
  try {
    bsDateStr = new NepaliDate(new Date(receipt.createdAt)).format('YYYY/MM/DD');
  } catch { bsDateStr = ''; }
  const adDateStr = format(new Date(receipt.createdAt), 'dd/MM/yyyy');

  // All receipts for this transaction (ordered oldest→newest)
  const allReceipts = await prisma.paymentReceipt.findMany({
    where: { transactionId: tx.id },
    orderBy: { createdAt: 'asc' },
  });

  // Build itemized history
  const currentIndex = allReceipts.findIndex((r) => r.id === receipt.id);
  const previousReceipts = allReceipts.slice(0, currentIndex); // all before this one
  const previousTotal = previousReceipts.reduce((s, r) => s + r.amount, 0);
  const totalPaidAfterThis = previousTotal + receipt.amount;
  const remainingDue = tx.finalAmount - totalPaidAfterThis;
  const isFullPayment = remainingDue <= 0;

  const ReceiptSection = ({ copyType }: { copyType: string }) => (
    <div className="receipt-container border-2 border-black rounded-lg p-6 relative w-[210mm] max-w-full bg-white text-black mb-8">
      {/* Payment Status Badge */}
      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border-2 ${
        isFullPayment
          ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
          : 'bg-amber-100 text-amber-800 border-amber-400'
      }`}>
        {isFullPayment ? '✓ FULLY CLEARED' : 'PARTIAL PAYMENT'}
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-black">
        <div className="w-1/3">
          <img src="/logo.png" alt="Society Enterprises" className="h-16 object-contain grayscale" />
        </div>
        <div className="w-1/3 text-center">
          <h1 className="text-xl font-black uppercase tracking-wide mb-1">Society Enterprises</h1>
          <p className="text-xs font-semibold">Damak-05, Jhapa, Nepal</p>
          <p className="text-xs font-semibold">Ph: 9801615250</p>
          <h2 className="text-base font-bold uppercase mt-2 inline-block border-2 border-black px-3 py-1 rounded-full">
            Cash / Bank Receipt
          </h2>
        </div>
        <div className="w-1/3 text-right">
          <p className="font-bold text-xs bg-gray-200 inline-block px-2 py-1 border border-black mb-2">{copyType}</p>
          <div className="space-y-0.5 text-xs font-semibold">
            <p>Receipt No: <span className="font-bold">{receipt.receiptNo}</span></p>
            <p>Invoice No: <span className="font-bold">{tx.invoiceNo}</span></p>
            <p>Date (AD): <span className="font-bold">{adDateStr}</span></p>
            {bsDateStr && <p>Date (BS): <span className="font-bold">{bsDateStr}</span></p>}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-3 mb-6 text-sm">
        <div className="flex items-end gap-2">
          <span className="font-semibold whitespace-nowrap">Received with thanks from:</span>
          <span className="flex-grow border-b border-black font-bold uppercase pb-0.5 px-2">{customer.fullName}</span>
        </div>
        <div className="flex items-end gap-2">
          <span className="font-semibold whitespace-nowrap">A sum of Rupees:</span>
          <span className="flex-grow border-b border-black font-bold uppercase pb-0.5 px-2">{toWords(receipt.amount)}</span>
        </div>
        <div className="flex items-end gap-4">
          <div className="flex items-end gap-2 flex-grow">
            <span className="font-semibold whitespace-nowrap">By Cash / Cheque / Bank Transfer:</span>
            <span className="flex-grow border-b border-black font-bold pb-0.5 px-2">
              {receipt.paymentMethod}{receipt.remarks ? ` — ${receipt.remarks}` : ''}
            </span>
          </div>
          <div className="flex items-end gap-2 shrink-0">
            <span className="font-semibold whitespace-nowrap">Dated:</span>
            <span className="border-b border-black font-bold pb-0.5 px-2">{adDateStr}</span>
          </div>
        </div>
        <div className="flex items-end gap-2">
          <span className="font-semibold whitespace-nowrap">Towards payment of vehicle:</span>
          <span className="flex-grow border-b border-black font-bold pb-0.5 px-2">
            {vehicleName} (VIN: {tx.vehicle.vin} / Eng: {tx.vehicle.engineNo})
          </span>
        </div>
      </div>

      {/* Payment Summary + History */}
      <div className="flex justify-between items-start gap-6 mt-8">
        <div className="flex-1">
          <div className="border-2 border-black rounded-lg p-3">
            <table className="w-full text-xs font-semibold">
              <tbody>
                <tr className="border-b border-dashed border-gray-300">
                  <td className="pb-1.5">Total Invoice Amount:</td>
                  <td className="text-right pb-1.5 font-bold">{formatNPR(tx.finalAmount)}</td>
                </tr>
                {/* Itemized previous payments */}
                {previousReceipts.map((r, idx) => (
                  <tr key={r.id}>
                    <td className="py-0.5 text-gray-500">
                      Payment #{idx + 1} ({format(new Date(r.createdAt), 'MMM dd')} — {r.paymentMethod}):
                    </td>
                    <td className="text-right py-0.5 text-gray-500">{formatNPR(r.amount)}</td>
                  </tr>
                ))}
                {previousTotal > 0 && (
                  <tr className="border-b border-dashed border-gray-300">
                    <td className="pb-1.5 text-gray-600 font-bold">Total Previously Paid:</td>
                    <td className="text-right pb-1.5 text-gray-600 font-bold">{formatNPR(previousTotal)}</td>
                  </tr>
                )}
                <tr>
                  <td className="py-1.5 font-black text-gray-900">THIS PAYMENT #{currentIndex + 1}:</td>
                  <td className="text-right py-1.5 font-black bg-yellow-50 border border-dashed border-gray-400 px-2">
                    {formatNPR(receipt.amount)}
                  </td>
                </tr>
                <tr className="border-t border-gray-300">
                  <td className="pt-1.5">Total Paid So Far:</td>
                  <td className="text-right pt-1.5 font-bold">{formatNPR(totalPaidAfterThis)}</td>
                </tr>
                <tr className={isFullPayment ? 'text-emerald-700' : 'text-red-600 font-bold'}>
                  <td className="pt-1 border-t-2 border-black">
                    {isFullPayment ? '✓ Balance Cleared:' : 'Remaining Due:'}
                  </td>
                  <td className="text-right pt-1 border-t-2 border-black">
                    {formatNPR(Math.max(remainingDue, 0))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-1/3 text-center shrink-0">
          <div className="border-b-2 border-black pb-1 mb-1 h-14 flex items-end justify-center"></div>
          <p className="font-bold uppercase text-xs">Authorized Signatory</p>
          <p className="text-xs text-gray-500 mt-0.5">Society Enterprises Pvt. Ltd.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="print-wrapper min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <PrintButtons />

      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          body { background: white; }
          .print-wrapper { background: white; padding: 0; }
          .receipt-container { break-inside: avoid; border-color: black !important; }
        }
      `,
      }} />

      <ReceiptSection copyType="CUSTOMER COPY" />
      <div className="w-[210mm] border-t-2 border-dashed border-gray-400 my-4 print:my-8 relative">
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-100 print:bg-white px-2 text-gray-400 text-xs uppercase tracking-widest">
          ✂ Fold / Tear Here ✂
        </span>
      </div>
      <ReceiptSection copyType="OFFICE COPY" />
    </div>
  );
}
