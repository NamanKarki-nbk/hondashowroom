import { toNepaliNumber, formatNepaliDate, nepaliTerms, numberToNepaliWords, getNepaliFiscalYear } from './nepaliTranslator';

export type DocCategory =
  | 'Vehicle Purchase Cash Incentive Claim'
  | 'Free Service Coupon Claim'
  | 'Warranty Claim Letter'
  | 'Bank Salary Deposit Request'
  | 'Salesman Incentive Claim'
  | 'Transfer Claim Amount to Cash or BG Ledger'
  | '6 Free Service With Engine Oil Claim'
  | '2 Years Free Service With Engine Oil and Parts Claim'
  | 'Payment Request Letter for Syakar Hire Purchase'
  | 'Battery Warranty Claim'
  | 'Parts Warranty Claim'
  | 'Quotation';

export const DOC_CATEGORIES: DocCategory[] = [
  'Vehicle Purchase Cash Incentive Claim',
  'Free Service Coupon Claim',
  'Warranty Claim Letter',
  'Bank Salary Deposit Request',
  'Salesman Incentive Claim',
  'Transfer Claim Amount to Cash or BG Ledger',
  '6 Free Service With Engine Oil Claim',
  '2 Years Free Service With Engine Oil and Parts Claim',
  'Payment Request Letter for Syakar Hire Purchase',
  'Quotation'
];

export interface LetterMetadata {
  customerName?: string;
  vehicleModel?: string;
  chassisNo?: string;
  engineNo?: string;
  claimAmount?: number | string;
  bankName?: string;
  accountNo?: string;
  vatBillNo?: string;
  batterySerialNo?: string;
  totalCoupons?: string;
  month?: string;
  salesmanName?: string;
  transferLedger?: string;
  [key: string]: any;
}

export interface TemplateData {
  letterNo: string;
  date: Date;
  recipient: string;
  metadata: LetterMetadata;
}

// Helper to generate the standard header for letters
function generateHeader(data: TemplateData, subject: string, docType?: string) {
  const isCompact = docType === 'Bank Salary Deposit Request';
  const mb = isCompact ? 'mb-2' : 'mb-6';

  return `
    <div class="${mb} flex justify-between">
      <div>
        <p><strong>${nepaliTerms.refNo}</strong> ${toNepaliNumber(data.letterNo)}</p>
      </div>
      <div>
        <p><strong>${nepaliTerms.date}</strong> ${formatNepaliDate(data.date)}</p>
      </div>
    </div>
    <div class="${mb}">
      ${data.recipient.startsWith('श्रीमान्') ? '' : `<p><strong>${nepaliTerms.salutation}</strong></p>`}
      <p>${data.recipient}</p>
    </div>
    <div class="${mb} font-bold">
      <p><u><strong>विषय – ${subject}</strong></u></p>
    </div>
  `;
}

// Helper to generate standard footer
function generateFooter(docType?: string) {
  const isSalaryRequest = docType === 'Bank Salary Deposit Request';
  const mt = isSalaryRequest ? 'mt-2' : 'mt-8';
  return `
    <div class="${mt} flex justify-end pr-8">
      <div class="text-center">
        ${isSalaryRequest ? '' : '<p>भवदीय,</p><br/><br/>'}
        <p>सक्सेस भट्टराई</p>
        <p>सोसाइटी इन्टरप्राइजेज प्रा. लि.</p>
        <p>दमक-०५, झापा</p>
      </div>
    </div>
  `;
}

function numberToEnglishWordsIndian(num: number): string {
  if (num === 0) return "ZERO";
  const a = ["", "ONE ", "TWO ", "THREE ", "FOUR ", "FIVE ", "SIX ", "SEVEN ", "EIGHT ", "NINE ", "TEN ", "ELEVEN ", "TWELVE ", "THIRTEEN ", "FOURTEEN ", "FIFTEEN ", "SIXTEEN ", "SEVENTEEN ", "EIGHTEEN ", "NINETEEN "];
  const b = ["", "", "TWENTY ", "THIRTY ", "FORTY ", "FIFTY ", "SIXTY ", "SEVENTY ", "EIGHTY ", "NINETY "];

  const n = ('000000000' + num).slice(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return "";
  let str = "";
  str += (n[1] != "00") ? (a[Number(n[1])] || b[Number(n[1][0])] + a[Number(n[1][1])]) + "CRORE " : "";
  str += (n[2] != "00") ? (a[Number(n[2])] || b[Number(n[2][0])] + a[Number(n[2][1])]) + "LAKH " : "";
  str += (n[3] != "00") ? (a[Number(n[3])] || b[Number(n[3][0])] + a[Number(n[3][1])]) + "THOUSAND " : "";
  str += (n[4] != "0") ? (a[Number(n[4])] || b[Number(n[4][0])] + a[Number(n[4][1])]) + "HUNDRED " : "";
  str += (n[5] != "00") ? (str != "" ? "AND " : "") + (a[Number(n[5])] || b[Number(n[5][0])] + a[Number(n[5][1])]) : "";
  return str.trim();
}

function generateQuotationTemplate(data: TemplateData): { subject: string, html: string } {
  const meta = data.metadata || {};
  const price = Number(meta.unitPrice || 0);
  const words = numberToEnglishWordsIndian(price) + " RUPEES ONLY";
  
  const specs = meta.specs || {};

  const dateStr = data.date ? new Date(data.date).toISOString().split('T')[0] : '';
  const isPower = meta.category === 'POWER_PRODUCTS';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; color: #000; font-size: 14px; line-height: 1.5;">
      
      <!-- Ref & Date -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-weight: bold;">
        <div>Ref No. ${data.letterNo}</div>
        <div>Date : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${dateStr}</div>
      </div>

      <!-- To -->
      <div style="margin-bottom: 20px;">
        <strong>To,</strong><br/>
        ${data.recipient}<br/>
        ${meta.bankAddress || ''}
      </div>

      <div style="margin-bottom: 20px; font-weight: bold;">
        Sub: For Quotation.
      </div>

      <div style="margin-bottom: 20px;">
        <strong>Dear Sir/ Madam,</strong><br/>
        We are pleased to note your interest in Honda ${isPower ? 'Power Products' : 'Two Wheelers'}. We assure you of the best Japanese Technology for the smooth ride. Further to your inquiry, we hereby quote our best price of Honda ${isPower ? 'Power Product' : 'Two-Wheeler'} as per details and Technical Specifications as mentioned hereinafter.
      </div>

      <!-- Primary Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; border: 1px solid #000;">
        <thead>
          <tr style="font-weight: bold; text-align: center;">
            <td style="border: 1px solid #000; padding: 5px;">MODEL</td>
            <td style="border: 1px solid #000; padding: 5px;">VARIENT</td>
            <td style="border: 1px solid #000; padding: 5px;">C.C.</td>
            <td style="border: 1px solid #000; padding: 5px;">UNIT PRICE</td>
          </tr>
        </thead>
        <tbody>
          <tr style="text-align: center; font-weight: bold;">
            <td style="border: 1px solid #000; padding: 5px;">${meta.vehicleModel || ''}</td>
            <td style="border: 1px solid #000; padding: 5px;">${meta.variant || '-'}</td>
            <td style="border: 1px solid #000; padding: 5px;">${meta.cc || '-'}</td>
            <td style="border: 1px solid #000; padding: 5px;">Rs. ${price.toLocaleString('en-IN')}</td>
          </tr>
        </tbody>
      </table>

      <div style="font-weight: bold; margin-bottom: 10px;">
        IN WORD: ${words}
      </div>

      <!-- Technical Specifications -->
      <div style="font-weight: bold; margin-bottom: 5px;">Technical Specifications:</div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; border: 1px solid #000;">
        <tbody>
          <tr>
            <td style="border: 1px solid #000; padding: 5px; font-weight: bold; width: 25%;">Displacement</td>
            <td style="border: 1px solid #000; padding: 5px; width: 25%;">${specs.displacement || '-'}</td>
            <td style="border: 1px solid #000; padding: 5px; font-weight: bold; width: 25%;">Fuel Type</td>
            <td style="border: 1px solid #000; padding: 5px; width: 25%;">${specs.fuelType || '-'}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 5px; font-weight: bold;">Engine Type</td>
            <td style="border: 1px solid #000; padding: 5px;">${specs.engineType || '-'}</td>
            <td style="border: 1px solid #000; padding: 5px; font-weight: bold;">Starting Method</td>
            <td style="border: 1px solid #000; padding: 5px;">${specs.startingMethod || '-'}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 5px; font-weight: bold;">Kerb Weight</td>
            <td style="border: 1px solid #000; padding: 5px;">${specs.kerbWeight || '-'}</td>
            <td style="border: 1px solid #000; padding: 5px; font-weight: bold;">Fuel Tank</td>
            <td style="border: 1px solid #000; padding: 5px;">${specs.fuelTank || '-'}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 5px; font-weight: bold;">No. of Gears</td>
            <td style="border: 1px solid #000; padding: 5px;">${specs.noOfGears || '-'}</td>
            <td style="border: 1px solid #000; padding: 5px; font-weight: bold;">Ground Clearance</td>
            <td style="border: 1px solid #000; padding: 5px;">${specs.groundClearance || '-'}</td>
          </tr>
        </tbody>
      </table>

      <!-- Colors -->
      <div style="margin-bottom: 5px;"><strong>Available Colors:</strong></div>
      <div style="border: 1px solid #000; padding: 5px; margin-bottom: 20px; font-weight: bold;">
        ${meta.availableColors || '-'}
      </div>

      <!-- T&C -->
      <div style="font-weight: bold; margin-bottom: 5px;">Term & Conditions:</div>
      <div style="margin-bottom: 20px; font-size: 13px;">
        The above price in subject to change without any prior notice in case of any changes in the Honda Company Limited or their government levies or the tax and other policies in the government of Nepal. The price does not include contact tax. Honda Company Limited reserves the right to change without notice-colors, equipment, Honda Specifications and models and also to discontinue models.
      </div>

      <!-- Accessories and Warranty -->
      <div style="display: flex; gap: 20px; margin-bottom: 50px;">
        <div style="flex: 1;">
          <div style="font-weight: bold; margin-bottom: 5px;">Accessories:</div>
          <div style="border: 1px solid #000; padding: 10px; min-height: 80px;">
            <div style="margin-bottom: 5px;">☑ Helmet: 1 Pcs. in Each Purchase</div>
            <div style="margin-bottom: 5px;">☑ Tool Set, First Aid Kit & Spare Key.</div>
            <div>☑ Owner's Manual.</div>
          </div>
        </div>
        <div style="flex: 1;">
          <div style="font-weight: bold; margin-bottom: 5px;">Service & Warranty :</div>
          <div style="border: 1px solid #000; padding: 10px; min-height: 80px;">
            <div style="margin-bottom: 5px;">☑ Warranty: 2 Years or 24000 Km</div>
            <div>☑ Service: 3 Times</div>
          </div>
        </div>
      </div>

      <!-- Footer Signatures -->
      <div style="display: flex; justify-content: space-between; text-align: center; font-weight: bold; margin-bottom: 20px;">
        <div>
          <div style="margin-bottom: 5px;">For,</div>
          <div>${(meta.loaneeName || '').toUpperCase()}</div>
          <div>${(meta.loaneeAddress || '').toUpperCase()}</div>
          ${meta.loaneeContact ? `<div>${meta.loaneeContact}</div>` : ''}
        </div>
        <div>
          <div style="margin-bottom: 5px;">Thanking you,</div>
          <br /><br /><br />
          <div>Authorized Signatory</div>
        </div>
      </div>

    </div>
  `;
  return { subject: 'For Quotation', html };
}

export function generateNepaliTemplate(docType: DocCategory, data: TemplateData): { subject: string, html: string } {
  let subject = '';
  let body = '';
  let hideGenericFooter = false;

  const meta = data.metadata || {};
  const claimAmount = meta.claimAmount ? Number(meta.claimAmount) : 0;
  const nepaliAmount = claimAmount ? toNepaliNumber(claimAmount.toString()) : '०';
  const verbalAmount = claimAmount ? numberToNepaliWords(claimAmount) : 'शून्य';

  if (docType === 'Quotation') {
    return generateQuotationTemplate(data);
  }

  switch (docType) {
    case 'Vehicle Purchase Cash Incentive Claim':
      hideGenericFooter = true;
      // Hardcode recipient
      data.recipient = `श्रीमान् कार्यालय प्रमुख ज्यु ,<br/>स्याकार ट्रेडिङ्ग कम्पनी प्रा.ली.<br/>ज्योतिभवन, कान्तिपथ<br/>काठमाण्डै`;
      subject = 'क्यास इन्सेन्टिभ क्लेम पठाएको बारे ।';
      const fiscalYear = meta.fiscalYear || getNepaliFiscalYear(new Date(data.date));
      const stcBills = meta.stcBills || [];
      
      let totalAmountDeposited = 0;
      let totalBillAmount = 0;
      let totalTaxableAmount = 0;
      let totalDiscount = 0;
      let totalTds = 0;
      let totalNetDiscount = 0;

      let currentBalance = Number(meta.previousRemainingBalance) || 0;

      let tableRows = '';
      let rowIdx = 1;

      // Opening Balance Row
      if (currentBalance !== 0) {
        tableRows += `
          <tr>
            <td class="border border-black px-1 py-1 text-center">${rowIdx++}</td>
            <td class="border border-black px-1 py-1 text-center"></td>
            <td class="border border-black px-1 py-1 text-right">0.00</td>
            <td class="border border-black px-1 py-1 text-center"></td>
            <td class="border border-black px-1 py-1 text-center"></td>
            <td class="border border-black px-1 py-1 text-right">0.00</td>
            <td class="border border-black px-1 py-1 text-right font-medium">${currentBalance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            <td class="border border-black px-1 py-1 text-right text-red-600">0.00</td>
            <td class="border border-black px-1 py-1 text-right">0.00</td>
            <td class="border border-black px-1 py-1 text-right">0.00</td>
            <td class="border border-black px-1 py-1 text-right font-bold">0.00</td>
          </tr>
        `;
      }

      stcBills.forEach((bill: any) => {
        const amountDeposited = Number(bill.amountDeposited) || 0;
        const billAmount = Number(bill.billAmount) || 0;
        const taxableAmount = billAmount / 1.13;
        const discount = taxableAmount * 0.0125;
        const tds = discount * 0.15;
        const netDiscount = discount - tds;

        totalAmountDeposited += amountDeposited;
        totalBillAmount += billAmount;
        totalTaxableAmount += taxableAmount;
        totalDiscount += discount;
        totalTds += tds;
        totalNetDiscount += netDiscount;
        
        currentBalance = currentBalance + amountDeposited - billAmount;

        tableRows += `
          <tr>
            <td class="border border-black px-1 py-1 text-center">${rowIdx++}</td>
            <td class="border border-black px-1 py-1 text-center whitespace-nowrap">${bill.depositDate || ''}</td>
            <td class="border border-black px-1 py-1 text-right">${amountDeposited.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            <td class="border border-black px-1 py-1 text-center whitespace-nowrap">${bill.billDate || ''}</td>
            <td class="border border-black px-1 py-1 text-center whitespace-nowrap">${bill.stcBillNo || ''}</td>
            <td class="border border-black px-1 py-1 text-right">${billAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            <td class="border border-black px-1 py-1 text-right font-medium">${currentBalance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            <td class="border border-black px-1 py-1 text-right text-red-600">${taxableAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            <td class="border border-black px-1 py-1 text-right">${discount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            <td class="border border-black px-1 py-1 text-right">${tds.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            <td class="border border-black px-1 py-1 text-right font-bold">${netDiscount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          </tr>
        `;
      });

      // Closing Balance Row
      tableRows += `
        <tr>
          <td class="border border-black px-1 py-1 text-center">${rowIdx}</td>
          <td class="border border-black px-1 py-1 text-center"></td>
          <td class="border border-black px-1 py-1 text-right">0.00</td>
          <td class="border border-black px-1 py-1 text-center"></td>
          <td class="border border-black px-1 py-1 text-center"></td>
          <td class="border border-black px-1 py-1 text-right">0.00</td>
          <td class="border border-black px-1 py-1 text-right font-medium">${currentBalance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          <td class="border border-black px-1 py-1 text-right text-red-600">0.00</td>
          <td class="border border-black px-1 py-1 text-right">0.00</td>
          <td class="border border-black px-1 py-1 text-right">0.00</td>
          <td class="border border-black px-1 py-1 text-right font-bold">0.00</td>
        </tr>
      `;

      // We use the calculated total net discount for the cover letter
      const integerPart = Math.floor(totalNetDiscount);
      const decimalPart = Math.round((totalNetDiscount - integerPart) * 100);
      const decimalStr = decimalPart > 0 ? ` र ${numberToNepaliWords(decimalPart)} पैसा` : '';
      const calculatedVerbalAmount = numberToNepaliWords(integerPart) + " रुपैंया" + decimalStr;
      const formattedNepaliDiscount = toNepaliNumber(totalNetDiscount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}));

      body = `
        <p>महोदय,</p>
        <p class="indent-12 leading-relaxed text-justify mt-2">उपरोक्त सम्बन्धमा यस <strong>सोसाइटी इन्टरप्राइजेज प्रा. लि.</strong>, हामीले आर्थिक वर्ष ${toNepaliNumber(fiscalYear)} मा तपाईंको प्रतिष्ठित कम्पनीबाट गरेको खरिद गरी ल्याएको मोटरसाइकल र स्कुटर को क्यास इन्सेन्टिभ क्लेम ( Special Discount 1.25 % ) रकम रु. <strong>${formattedNepaliDiscount}/-</strong> ( अक्षेरूपी ${calculatedVerbalAmount} मात्र ) भएको र उक्त रकम हाम्रो क्लेम खातामा जम्मा गरीदिन हुन अनुरोध गर्दछौं। सम्पूर्ण विवरण र रेकर्ड यस पत्रसँगै संलग्न गरी पठाएका छौ ।</p>
        
        <div class="flex justify-end mt-16 pr-12">
          <div class="text-center leading-relaxed">
            <p>भवदीय,</p>
            <br/><br/>
            <p>सक्सेस भट्टराई</p>
            <p>प्रबन्ध निर्देशक</p>
            <p class="font-bold text-[15px]">सोसाइटी इन्टरप्राइजेज प्रा. लि.</p>
          </div>
        </div>
        
        <!-- LANDSCAPE_PAGE_BREAK -->

        <div class="mt-4 pt-4">
          <table class="w-full border-collapse border border-black text-[11px] my-4">
            <thead>
              <tr>
                <th rowspan="2" class="border border-black px-1 py-1 text-center align-middle text-blue-600 underline">S.N<br/>o</th>
                <th colspan="2" class="border border-black px-1 py-1 text-center align-middle whitespace-nowrap">AMOUNT DEPOSITED</th>
                <th colspan="3" class="border border-black px-1 py-1 text-center align-middle whitespace-nowrap">STC SALES BILL</th>
                <th rowspan="2" class="border border-black px-1 py-1 text-center align-middle">SUM</th>
                <th rowspan="2" class="border border-black px-1 py-1 text-center align-middle whitespace-nowrap">TAXABLE<br/>AMOUNT</th>
                <th colspan="3" class="border border-black px-1 py-1 text-center align-middle whitespace-nowrap">DISCOUNT CALCULATION</th>
              </tr>
              <tr>
                <th class="border border-black px-1 py-1 text-center align-middle">DATE</th>
                <th class="border border-black px-1 py-1 text-center align-middle">AMOUNT</th>
                <th class="border border-black px-1 py-1 text-center align-middle">DATE</th>
                <th class="border border-black px-1 py-1 text-center align-middle whitespace-nowrap">NO.</th>
                <th class="border border-black px-1 py-1 text-center align-middle">AMOUNT</th>
                <th class="border border-black px-1 py-1 text-center align-middle whitespace-nowrap">1.25 %<br/>CASH DISCOUNT</th>
                <th class="border border-black px-1 py-1 text-center align-middle whitespace-nowrap">15% TDS</th>
                <th class="border border-black px-1 py-1 text-center align-middle whitespace-nowrap">NET<br/>DISCOUNT</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
              <tr class="font-bold">
                <td colspan="2" class="border border-black px-1 py-1 text-left uppercase whitespace-nowrap">TOTAL AMOUNT</td>
                <td class="border border-black px-1 py-1 text-right">${totalAmountDeposited.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td colspan="2" class="border border-black px-1 py-1 text-center"></td>
                <td class="border border-black px-1 py-1 text-right">${totalBillAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td class="border border-black px-1 py-1 text-right"></td>
                <td class="border border-black px-1 py-1 text-right">${totalTaxableAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td class="border border-black px-1 py-1 text-right">${totalDiscount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td class="border border-black px-1 py-1 text-right">${totalTds.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td class="border border-black px-1 py-1 text-right">${totalNetDiscount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
      break;

    case 'Free Service Coupon Claim':
      hideGenericFooter = true;
      data.recipient = `श्रीमान् कार्यालय प्रमुख ज्यु ,<br/>स्याकार ट्रेडिङ्ग कम्पनी प्रा.ली.<br/>ज्योतिभवन, कान्तिपथ<br/>काठमाण्डै`;
      subject = 'फ्रि सर्भिस कुपन पठाएको बारे ।';

      const cd = meta.couponData || { BIKE: {}, SCOOTER: {}, BIGBIKE: {}, AMC: {}, ADDITIONAL: {} };
      
      const leftColServices = ["1ST", "2ND", "3RD", "4TH", "5TH", "6TH", "7TH", "8TH", "9TH", "10TH"];
      const rightColServices = ["11TH", "12TH", "13TH", "14TH", "15TH", "16TH", "17TH", "18TH", "19TH", "20TH"];

      let totalBike = 0, totalScooter = 0, totalBigBike = 0, totalAmc = 0, totalAdd = 0;
      
      let gridRows = '';
      
      leftColServices.forEach((leftSrv, i) => {
        const rightSrv = rightColServices[i];

        const bL = parseInt(cd.BIKE?.[leftSrv]) || 0; totalBike += bL;
        const bR = parseInt(cd.BIKE?.[rightSrv]) || 0; totalBike += bR;
        
        const sL = parseInt(cd.SCOOTER?.[leftSrv]) || 0; totalScooter += sL;
        const sR = parseInt(cd.SCOOTER?.[rightSrv]) || 0; totalScooter += sR;
        
        const bbL = parseInt(cd.BIGBIKE?.[leftSrv]) || 0; totalBigBike += bbL;
        const bbR = parseInt(cd.BIGBIKE?.[rightSrv]) || 0; totalBigBike += bbR;
        
        const aL = parseInt(cd.AMC?.[leftSrv]) || 0; totalAmc += aL;
        const aR = parseInt(cd.AMC?.[rightSrv]) || 0; totalAmc += aR;
        
        const addL = parseInt(cd.ADDITIONAL?.[leftSrv]) || 0; totalAdd += addL;
        const addR = parseInt(cd.ADDITIONAL?.[rightSrv]) || 0; totalAdd += addR;
        
        gridRows += `
          <tr>
            <td class="border border-black px-1 py-1 text-center font-medium">${leftSrv}</td>
            <td class="border border-black px-1 py-1 text-center font-medium">${bL > 0 ? bL : ''}</td>
            <td class="border border-black px-1 py-1 text-center font-medium">${rightSrv}</td>
            <td class="border border-black px-1 py-1 text-center font-medium">${bR > 0 ? bR : ''}</td>
            
            <td class="border border-black px-1 py-1 text-center font-medium">${leftSrv}</td>
            <td class="border border-black px-1 py-1 text-center font-medium">${sL > 0 ? sL : ''}</td>
            <td class="border border-black px-1 py-1 text-center font-medium">${rightSrv}</td>
            <td class="border border-black px-1 py-1 text-center font-medium">${sR > 0 ? sR : ''}</td>
            
            <td class="border border-black px-1 py-1 text-center font-medium">${leftSrv}</td>
            <td class="border border-black px-1 py-1 text-center font-medium">${bbL > 0 ? bbL : ''}</td>
            <td class="border border-black px-1 py-1 text-center font-medium">${rightSrv}</td>
            <td class="border border-black px-1 py-1 text-center font-medium">${bbR > 0 ? bbR : ''}</td>
            
            <td class="border border-black px-1 py-1 text-center font-medium">${leftSrv}</td>
            <td class="border border-black px-1 py-1 text-center font-medium">${aL > 0 ? aL : ''}</td>
            <td class="border border-black px-1 py-1 text-center font-medium">${rightSrv}</td>
            <td class="border border-black px-1 py-1 text-center font-medium">${aR > 0 ? aR : ''}</td>
            
            <td class="border border-black px-1 py-1 text-center font-medium">${leftSrv}</td>
            <td class="border border-black px-1 py-1 text-center font-medium">${addL > 0 ? addL : ''}</td>
            <td class="border border-black px-1 py-1 text-center font-medium">${rightSrv}</td>
            <td class="border border-black px-1 py-1 text-center font-medium">${addR > 0 ? addR : ''}</td>
          </tr>
        `;
      });
      
      const bonusValue = parseInt(cd.ADDITIONAL?.["BONUS"]) || 0;
      totalAdd += bonusValue;

      const grandFree = totalBike + totalScooter + totalBigBike;
      const grandAmc = totalAmc + totalAdd;
      const grandTotal = grandFree + grandAmc;

      body = `
        <p>महोदय,</p>
        <p class="indent-12 leading-relaxed text-justify mt-2">उपरोक्त सम्बन्धमा यस <strong>सोसाइटी इन्टरप्राइजेज प्रा. लि.</strong>, हामीले ${meta.nepaliStartDate || '[START_DATE]'} गते अर्थात ${meta.englishStartDate || '[START_DATE]'} देखि ${meta.nepaliEndDate || '[END_DATE]'} गते अर्थात ${meta.englishEndDate || '[END_DATE]'} सम्मको फ्रि सर्भिस कुपन यस पत्रसँगै संलग्न गरी पठाइएको छ।</p>

        <div class="mt-4 flex justify-center">
          <table class="w-full max-w-2xl border-collapse border border-black text-center text-[15px]">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-black px-4 py-2 font-medium">S. No.</th>
                <th class="border border-black px-4 py-2 font-medium">Month</th>
                <th class="border border-black px-4 py-2 font-medium">Free Service<br/>Coupons</th>
                <th class="border border-black px-4 py-2 font-medium">Amc & Additional<br/>Coupons</th>
                <th class="border border-black px-4 py-2 font-medium">Total Coupons</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border border-black px-4 py-2">1.</td>
                <td class="border border-black px-4 py-2">${meta.month || '[MONTH]'}</td>
                <td class="border border-black px-4 py-2">${grandFree}</td>
                <td class="border border-black px-4 py-2">${grandAmc}</td>
                <td class="border border-black px-4 py-2">${grandTotal}</td>
              </tr>
              <tr class="bg-gray-50">
                <td colspan="4" class="border border-black px-4 py-2 text-right">Total Coupons Sent</td>
                <td class="border border-black px-4 py-2">${grandTotal}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-4">
          <p class="font-bold">संलग्न :</p>
          <p>1. फ्रि सर्भिस कुपन</p>
          <p>2. Summary Sheet</p>
        </div>

        <div class="flex justify-end mt-4 pr-12">
          <div class="text-center leading-relaxed">
            <p>भवदीय,</p>
            <br/><br/>
            <p>सक्सेस भट्टराई</p>
            <p>सोसाइटी इन्टरप्राइजेज प्रा. लि.</p>
            <p>दमक-०५, झापा</p>
          </div>
        </div>

        <!-- LANDSCAPE_PAGE_BREAK -->
        
        <div class="mt-2 w-full text-xs">
          <table class="w-full border-none mb-2">
            <tr>
              <td class="font-bold">DEALER NAME: SOCIETY ENTERPRISES PVT. LTD.</td>
              <td class="font-bold border-l border-black pl-2">MONTH: DATE: ${meta.month ? meta.month.toUpperCase() : '[MONTH]'}</td>
            </tr>
            <tr>
              <td class="font-bold">ADDRESS: DAMAK-05, JHAPA</td>
              <td class="font-bold border-l border-black pl-2">DEALER CODE: SOCIETY ENTERPRISES</td>
            </tr>
          </table>

          <table class="w-full border-collapse border border-black text-[10px]">
            <thead>
              <tr>
                <th colspan="4" class="border border-black px-1 py-1 font-bold">BIKE(SHINE/UNICORN/HORN<br/>ET/ XBLADE/CD-110)</th>
                <th colspan="4" class="border border-black px-1 py-1 font-bold">SCOOTER(DIO/ACTIVA/AVIATO<br/>R/GRAZIA)</th>
                <th colspan="4" class="border border-black px-1 py-1 font-bold">BIGBIKE(OFF<br/>ROAD/BIGBIKE/ 200+CC)</th>
                <th colspan="4" class="border border-black px-1 py-1 font-bold">AMC</th>
                <th colspan="4" class="border border-black px-1 py-1 font-bold">ADDITIONAL</th>
              </tr>
              <tr class="text-[8px] text-center">
                <th class="border border-black px-1 py-1">Nature of<br/>Service</th>
                <th class="border border-black px-1 py-1">Submitted</th>
                <th class="border border-black px-1 py-1">Nature of<br/>Service</th>
                <th class="border border-black px-1 py-1">Submitted</th>
                <th class="border border-black px-1 py-1">Nature of<br/>Service</th>
                <th class="border border-black px-1 py-1">Submitted</th>
                <th class="border border-black px-1 py-1">Nature of<br/>Service</th>
                <th class="border border-black px-1 py-1">Submitted</th>
                <th class="border border-black px-1 py-1">Nature of<br/>Service</th>
                <th class="border border-black px-1 py-1">Submitted</th>
                <th class="border border-black px-1 py-1">Nature of<br/>Service</th>
                <th class="border border-black px-1 py-1">Submitted</th>
                <th class="border border-black px-1 py-1">Nature of<br/>Service</th>
                <th class="border border-black px-1 py-1">Submitted</th>
                <th class="border border-black px-1 py-1">Nature of<br/>Service</th>
                <th class="border border-black px-1 py-1">Submitted</th>
                <th class="border border-black px-1 py-1">Nature of<br/>Service</th>
                <th class="border border-black px-1 py-1">Submitted</th>
                <th class="border border-black px-1 py-1">Nature of<br/>Service</th>
                <th class="border border-black px-1 py-1">Submitted</th>
              </tr>
            </thead>
            <tbody>
              ${gridRows}
              ${bonusValue > 0 ? `
              <tr>
                <td colspan="16" class="border-none"></td>
                <td class="border border-black px-1 py-1 text-center font-bold uppercase">BONUS</td>
                <td class="border border-black px-1 py-1 text-center">${bonusValue}</td>
                <td colspan="2" class="border-none"></td>
              </tr>
              ` : ''}
              <tr class="font-bold">
                <td colspan="2" class="border border-black px-1 py-1 text-center uppercase">TOTAL</td>
                <td colspan="2" class="border border-black px-1 py-1 text-center">${totalBike > 0 ? totalBike : ''}</td>
                <td colspan="2" class="border border-black px-1 py-1 text-center uppercase">TOTAL</td>
                <td colspan="2" class="border border-black px-1 py-1 text-center">${totalScooter > 0 ? totalScooter : ''}</td>
                <td colspan="2" class="border border-black px-1 py-1 text-center uppercase">TOTAL</td>
                <td colspan="2" class="border border-black px-1 py-1 text-center">${totalBigBike > 0 ? totalBigBike : ''}</td>
                <td colspan="2" class="border border-black px-1 py-1 text-center uppercase">TOTAL</td>
                <td colspan="2" class="border border-black px-1 py-1 text-center">${totalAmc > 0 ? totalAmc : ''}</td>
                <td colspan="2" class="border border-black px-1 py-1 text-center uppercase">TOTAL</td>
                <td colspan="2" class="border border-black px-1 py-1 text-center">${totalAdd > 0 ? totalAdd : ''}</td>
              </tr>
            </tbody>
          </table>

          <table class="w-full border-collapse border border-black text-[10px] mt-1 font-bold">
            <tr>
              <td class="border border-black px-2 py-1 w-32">TOTAL BIKE</td>
              <td class="border border-black px-2 py-1 w-16 text-center">${totalBike}</td>
              <td rowspan="5" class="border border-black px-2 py-1 text-center align-bottom h-16 w-1/3">(RECEIVED DATE)</td>
              <td rowspan="5" class="border border-black px-2 py-1 text-center align-bottom h-16 w-1/3">(VERIFIED DATE)</td>
              <td rowspan="5" class="border border-black px-2 py-1 text-center align-bottom h-16 w-1/3">(APPROVED DATE)</td>
            </tr>
            <tr>
              <td class="border border-black px-2 py-1">TOTALSCOOTER</td>
              <td class="border border-black px-2 py-1 text-center">${totalScooter}</td>
            </tr>
            <tr>
              <td class="border border-black px-2 py-1">TOTAL BIGBIKE</td>
              <td class="border border-black px-2 py-1 text-center">${totalBigBike}</td>
            </tr>
            <tr>
              <td class="border border-black px-2 py-1">TOTAL AMC</td>
              <td class="border border-black px-2 py-1 text-center">${totalAmc}</td>
            </tr>
            <tr>
              <td class="border border-black px-2 py-1">TOTAL ADD.</td>
              <td class="border border-black px-2 py-1 text-center">${totalAdd}</td>
            </tr>
          </table>
        </div>
      `;
      break;

    case 'Warranty Claim Letter':
    case 'Battery Warranty Claim':
    case 'Parts Warranty Claim': {
      const isParts = docType === 'Parts Warranty Claim' || meta.warrantyType === 'Parts Warranty Claim';
      hideGenericFooter = isParts;
      data.recipient = `श्रीमान् कार्यालय प्रमुख ज्यु ,<br/>स्याकार ट्रेडिङ्ग कम्पनी प्रा.ली.<br/>ज्योतिभवन, कान्तिपथ<br/>काठमाण्डै`;
      subject = isParts ? 'पार्ट्स वारेन्टी क्लेम पठाएको बारे।' : 'ब्याट्री वारेन्टी क्लेम पठाएको बारे ।';

      const claims = meta.warrantyClaims || [];
      const totalAmount = claims.reduce((sum: number, claim: any) => sum + (Number(claim.amount) || 0), 0);
      const totalAmountStr = totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const nepaliTotalStr = toNepaliNumber(totalAmountStr);
      const verbalTotal = numberToNepaliWords(Math.floor(totalAmount));
      const countNepali = toNepaliNumber(claims.length.toString());

      let claimsRows = '';
      claims.forEach((claim: any, index: number) => {
        claimsRows += `
          <tr>
            <td class="border border-black px-1 py-1 text-center">${toNepaliNumber((index + 1).toString())}</td>
            <td class="border border-black px-1 py-1 uppercase">${claim.customerName || ''}</td>
            <td class="border border-black px-1 py-1 uppercase">${claim.billNo || ''}</td>
            <td class="border border-black px-1 py-1 uppercase">${claim.itemNo || ''}</td>
            <td class="border border-black px-1 py-1 text-right font-medium">${toNepaliNumber(Number(claim.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))} /-</td>
          </tr>
        `;
      });

      body = `
        <p>महोदय,</p>
        <p class="indent-12 text-justify mt-2 leading-relaxed">
          उपरोक्त सम्बन्धमा यस सोसाइटी इन्टरप्राइजेज प्रा. लि., दमकले होण्डा ग्राहकहरूप्रतिको सर्वसुलभताको लागि बिक्री भएका सवारी साधनहरूमा ${countNepali} वटा ${isParts ? 'पार्ट्स' : 'ब्याट्री'} वारेन्टीमा परिवर्तन गरे${isParts ? 'बापत' : 'वापत'} भएको क्लेम रकम रू. ${nepaliTotalStr}/- (अक्षरूपी ${verbalTotal} मात्र) हाम्रो खातामा जम्मा गरिदिन अनुरोध गर्दछौँ। साथै पुरानो ${isParts ? 'पार्ट्स' : 'ब्याट्री'} र बिल पनि पठाएको जानकारीका लागी यो पत्र पठाएका छाैँ
        </p>
        ${isParts ? '' : '<h3 class="font-bold underline mt-3 mb-1">वारेन्टी तपशिल</h3>'}
        <table class="w-full border-collapse border border-black text-sm my-1 ${isParts ? 'mt-4' : ''}">
          <thead>
            <tr>
              <th class="border border-black px-1 py-1 font-bold text-center">क्र.सं.</th>
              <th class="border border-black px-1 py-1 font-bold text-left">ग्राहकको नाम</th>
              <th class="border border-black px-1 py-1 font-bold text-left">बिल नम्बर</th>
              <th class="border border-black px-1 py-1 font-bold text-left">${isParts ? 'पार्ट्स नम्बर' : 'ब्याट्री नम्बर'}</th>
              <th class="border border-black px-1 py-1 font-bold text-center">जम्मा</th>
            </tr>
          </thead>
          <tbody>
            ${claimsRows}
            <tr>
              <td colspan="4" class="border border-black px-1 py-1 text-right font-bold">रू.</td>
              <td class="border border-black px-1 py-1 text-right font-bold">${nepaliTotalStr} /-</td>
            </tr>
          </tbody>
        </table>
        ${isParts ? `
        <p class="mt-4">सहयोगको लागी धन्यवाद ।।</p>
        <div class="mt-16 flex justify-end pr-8">
          <div class="text-center">
            <p>भवदीय,</p>
            <p>सक्सेस भट्टराई</p>
            <p class="font-bold text-lg">सोसाइटी इन्टरप्राइजेज प्रा. लि.</p>
            <p>दमक-०५, झापा</p>
          </div>
        </div>
        ` : ''}
      `;
      break;
    }

    case 'Bank Salary Deposit Request': {
      let month = meta.month || '[महिना]';
      // Automatically translate common English month names to Nepali
      const monthMap: Record<string, string> = {
        'baisakh': 'वैशाख', 'baishakh': 'वैशाख',
        'jestha': 'जेठ', 'jeth': 'जेठ',
        'ashadh': 'असार', 'asar': 'असार',
        'shrawan': 'साउन', 'sawan': 'साउन', 'saun': 'साउन',
        'bhadra': 'भदौ', 'bhadau': 'भदौ',
        'ashwin': 'असोज', 'asoj': 'असोज',
        'kartik': 'कात्तिक', 'kattik': 'कात्तिक',
        'mangsir': 'मंसिर', 'mangshir': 'मंसिर',
        'poush': 'पुस', 'push': 'पुस',
        'magh': 'माघ',
        'falgun': 'फागुन', 'phagun': 'फागुन',
        'chaitra': 'चैत', 'chait': 'चैत'
      };
      const normalizedMonth = month.toLowerCase().trim();
      if (monthMap[normalizedMonth]) {
        month = monthMap[normalizedMonth];
      }

      subject = `${month} महिनाको कर्मचारीको तलब सम्बन्धमा ।`;
      data.recipient = `श्रीमान् कार्यालय प्रमुख ज्यु ,<br/>एन. एम. बी बैंक, दमक, झापा`;
      
      const salaryClaims = meta.salaryClaims || [];
      let totalSalary = 0;
      let totalTds = 0;
      let totalNet = 0;
      
      let salaryRows = '';
      salaryClaims.forEach((claim: any, index: number) => {
        const salary = Number(claim.salary) || 0;
        const tds = Number(claim.tds) || 0;
        const net = Number(claim.netAmount) || 0;
        
        totalSalary += salary;
        totalTds += tds;
        totalNet += net;
        
        salaryRows += `
          <tr>
            <td class="border border-black px-1 py-0.5 text-center">${(index + 1).toString()}</td>
            <td class="border border-black px-1 py-0.5 whitespace-nowrap">${claim.name || ''}</td>
            <td class="border border-black px-1 py-0.5 text-center">${salary ? salary.toLocaleString('en-US') : ''}</td>
            <td class="border border-black px-1 py-0.5 text-center">${tds ? tds.toLocaleString('en-US') : ''}</td>
            <td class="border border-black px-1 py-0.5 text-center font-bold">${net ? net.toLocaleString('en-US') : ''}</td>
            <td class="border border-black px-1 py-0.5 text-center">${claim.accountNo || ''}</td>
            <td class="border border-black px-1 py-0.5 text-center">${claim.panNo || ''}</td>
          </tr>
        `;
      });
      
      const verbalTotal = numberToNepaliWords(totalNet);

      body = `
        <p>महोदय,</p>
        <p class="indent-12 text-justify mt-1 leading-snug">
          उपरोक्त सम्बन्धमा यस सोसाइटी इन्टरप्राइजेज प्रा. लि. ले कार्यरत कर्मचारीहरूको <strong>${month}</strong> महिनाको तलब उनीहरूको सम्बन्धित बैंक खातामा जम्मा गर्ने व्यवस्था गरिदिनु हुन हार्दिक अनुरोध गर्दछौं। यस कार्यका लागि, हामीले तल उल्लेखित रकम बराबरको चेक यस <strong>सोसाइटी इन्टरप्राइजेज प्रा. लि. (Reg No.: 619869261)</strong> फमको खाता नं <strong>0790146683900010</strong> को <strong>चेक नम्बर: ${meta.checkNo || '[चेक नम्बर]'}</strong> उपलब्ध गराएका छौं।
        </p>
        <p class="mt-1">तलब रकम र कर्मचारीहरूको विवरण निम्नानुसार छ:</p>
        <table class="w-full border-collapse border border-black my-1 leading-none">
          <thead>
            <tr>
              <th class="border border-black px-1 py-1 font-bold text-center w-8">क्र.सं.</th>
              <th class="border border-black px-1 py-1 font-bold text-center">कर्मचारीको नाम</th>
              <th class="border border-black px-1 py-1 font-bold text-center">तलब</th>
              <th class="border border-black px-1 py-1 font-bold text-center">टी डी एस रकम</th>
              <th class="border border-black px-1 py-1 font-bold text-center">जम्मा हुने रकम</th>
              <th class="border border-black px-1 py-1 font-bold text-center">खाता नम्बर</th>
              <th class="border border-black px-1 py-1 font-bold text-center">प्यान नम्बर</th>
            </tr>
          </thead>
          <tbody>
            ${salaryRows}
            <tr>
              <td colspan="2" class="border border-black px-1 py-1 text-center font-bold">जम्मा :</td>
              <td class="border border-black px-1 py-1 text-center font-bold">${totalSalary.toLocaleString('en-US')}</td>
              <td class="border border-black px-1 py-1 text-center font-bold">${totalTds.toLocaleString('en-US')}</td>
              <td class="border border-black px-1 py-1 text-left font-bold" colspan="3">Rs. ${totalNet.toLocaleString('en-US')}</td>
            </tr>
          </tbody>
        </table>
        <p class="mt-1 font-bold">अक्षेरूपी : ${verbalTotal} रुपैंया मात्र ।</p>
        <p class="mt-1">हामी तपाईंको बैंकको सेवा र सहकार्यको उच्च प्रशंसा गर्दछौं।</p>
      `;
      break;
    }

    case 'Salesman Incentive Claim': {
      hideGenericFooter = true;
      let month = meta.month || '[महिना/वर्ष]';
      
      const englishToNepaliMonth: Record<string, string> = {
        'baishakh': 'वैशाख', 'jestha': 'जेठ', 'ashadh': 'असार', 'shrawan': 'साउन',
        'bhadra': 'भदौ', 'ashwin': 'असोज', 'kartik': 'कात्तिक', 'mangsir': 'मंसिर',
        'poush': 'पुष', 'magh': 'माघ', 'falgun': 'फागुन', 'chaitra': 'चैत',
        'january': 'जनवरी', 'february': 'फेब्रुअरी', 'march': 'मार्च', 'april': 'अप्रिल',
        'may': 'मे', 'june': 'जुन', 'july': 'जुलाई', 'august': 'अगस्त', 'september': 'सेप्टेम्बर',
        'october': 'अक्टोबर', 'november': 'नोभेम्बर', 'december': 'डिसेम्बर'
      };
      
      const lowerMonth = month.toLowerCase().trim();
      for (const [eng, nep] of Object.entries(englishToNepaliMonth)) {
        if (lowerMonth.includes(eng)) {
          month = month.replace(new RegExp(eng, 'ig'), nep);
        }
      }

      const bankName = 'Global IME Bank, Damak Branch';
      const accountName = 'Pradip Acharya';
      const accountNo = '12607010069784';
      
      data.recipient = `श्रीमान् कार्यालय प्रमुख ज्यु ,<br/>स्याकार ट्रेडिङ्ग कम्पनी प्रा.ली.<br/>ज्योतिभवन, कान्तिपथ<br/>काठमाण्डै`;
      subject = `${month} को सेल्सम्यान इन्सेन्टिभ क्लेम पठाएको बारे ।`;
      body = `
        <p>महोदय,</p>
        <p class="indent-12 leading-relaxed text-justify mt-2">
          उपरोक्त सम्बन्धमा यस सोसाइटी इन्टरप्राइजेज प्रा. लि., द्वारा ${month} महिनाको लागि तोकिएको मासिक टार्गेट सफलतापूर्वक हासिल गरिएको व्यहोरा जानकारी गराउन चाहन्छौं । सोही अनुसार, मासिक टार्गेट उपलब्धिको आधारमा प्राप्त हुनुपर्ने सेल्सम्यान इन्सेन्टिभ कुल क्लेम रकम रु. <strong>${nepaliAmount}</strong> (अक्षरेपी <strong>${verbalAmount}</strong> रुपैंया मात्र) भएको र उक्त रकम तल उल्लेख गरिएको खातामा जम्मा गरीदिन हुन अनुरोध गर्दछौं।
        </p>

        <table class="mt-6 mb-8 w-3/4">
          <tr>
            <td class="py-1 w-1/4 whitespace-nowrap">बैंकको नाम :</td>
            <td class="py-1 font-bold pl-2">${bankName}</td>
          </tr>
          <tr>
            <td class="py-1 whitespace-nowrap">खातावालाको नाम:</td>
            <td class="py-1 font-bold pl-2">${accountName}</td>
          </tr>
          <tr>
            <td class="py-1 whitespace-nowrap">खाता नम्बर:</td>
            <td class="py-1 font-bold pl-2">${accountNo}</td>
          </tr>
        </table>

        <p class="mt-4">सहयोग र हौसलाको लागी धन्यवाद ।</p>

        <div class="mt-12 flex justify-end pr-8">
          <div class="text-center">
            <p>सक्सेस भट्टराई</p>
            <p>प्रबन्ध निर्देशक</p>
            <p class="font-bold">सोसाइटी इन्टरप्राइजेज प्रा. लि.</p>
          </div>
        </div>
      `;
      break;
    }

    case 'Transfer Claim Amount to Cash or BG Ledger': {
      hideGenericFooter = true;
      data.recipient = `श्रीमान् कार्यालय प्रमुख ज्यु ,<br/>स्याकार ट्रेडिङ्ग कम्पनी प्रा.ली.<br/>ज्योतिभवन, कान्तिपथ<br/>काठमाण्डै`;
      subject = 'रकम ट्रान्सफर गरीदिने बारे ।';
      const ledger = meta.transferLedger || 'CASH LEDGER';
      body = `
        <p>महोदय,</p>
        <p class="indent-12 leading-relaxed text-justify mt-2">
          उपरोक्त सम्बन्धमा यस सोसाइटी इन्टरप्राइजेज प्रा. लि., दमक हाम्रो कम्पनीको क्लेम खातामा रहेको रकम मध्ये रू <strong>${nepaliAmount} /-</strong> ( अक्षेरूपी <strong>${verbalAmount}</strong> रुपैंया मात्र ) सेल्स सेक्सनको <strong>${ledger}</strong> खातामा ट्रान्सफर गरिदिन हुन अनुरोध गर्दछु।
        </p>
        <p class="leading-relaxed text-justify mt-4">
          हामी विनम्रतापूर्वक यो ट्रान्सफर चाँडो भन्दा चाँडो प्रक्रिया गर्न अनुरोध गर्दछौं र ट्रान्सफर पूरा भएपछि हामीलाई जानकारी गराउन आग्रह गर्दछौं। यदि कुनै अतिरिक्त कागजात वा जानकारी आवश्यक परेमा, कृपया हामीलाई [9801615250/9801615253] मा सम्पर्क गर्नुहोस्।
        </p>

        <div class="mt-24 flex justify-end pr-8">
          <div class="text-center">
            <p>सक्सेस भट्टराई</p>
            <p>प्रबन्ध निर्देशक</p>
            <p class="font-bold">सोसाइटी इन्टरप्राइजेज प्रा. लि.</p>
          </div>
        </div>
      `;
      break;
    }

    case '6 Free Service With Engine Oil Claim': {
      hideGenericFooter = true;
      data.recipient = `श्रीमान् कार्यालय प्रमुख ज्यु ,<br/>स्याकार ट्रेडिङ्ग कम्पनी प्रा .ली .<br/>ज्योति भवन, कान्तिपथ<br/>काठमाण्डै`;
      subject = '6 Free Service with Engine Oil क्लेम पठाएकाे बारे ।';
      
      const claims = meta.engineOilClaims || [];
      const totalAmount = claims.reduce((sum: number, c: any) => sum + (Number(c.amount) || 0), 0);
      const formattedTotal = toNepaliNumber(totalAmount.toFixed(2));
      const verbalTotal = numberToNepaliWords(Math.floor(totalAmount));

      let claimsRows = '';
      if (claims.length > 0) {
        claimsRows = claims.map((c: any, i: number) => `
          <tr>
            <td class="border border-black p-1 text-center">${i + 1}.</td>
            <td class="border border-black p-1">${c.customerName || ''}</td>
            <td class="border border-black p-1">${c.bookNo || ''}</td>
            <td class="border border-black p-1">${c.servicingNo || ''}</td>
            <td class="border border-black p-1">${c.billNo || ''}</td>
            <td class="border border-black p-1 text-right">${c.amount || '0.00'}</td>
          </tr>
        `).join('');
      } else {
        claimsRows = `<tr><td colspan="6" class="border border-black p-2 text-center text-gray-500">No claims added</td></tr>`;
      }

      body = `
        <p>महोदय,</p>
        <p class="indent-12 leading-relaxed text-justify mt-2">
          उपरोक्त सम्बन्धमा यस <strong>सोसाइटी इन्टरप्राइजेज प्रा. लि.,</strong> हामीले ${meta.nepaliStartDate || '[Start Date Nepali]'} गते अर्थात ${meta.englishStartDate || '[Start Date English]'} देखि ${meta.nepaliEndDate || '[End Date Nepali]'} गते अर्थात ${meta.englishEndDate || '[End Date English]'} सम्म, ग्राहकहरूलाई <strong>6 Free Service with Engine Oil</strong> बुक बाट सर्भिसिङ गर्ने ग्राहकहरुलाई बुक अनुसार निःशुल्क Engine Oil प्रदान गरेका छौं। यस अन्तर्गत, कुल क्लेम रकम <strong>रु. ${formattedTotal}/-</strong> ( अक्षेरूपी <strong>${verbalTotal} रुपैंया मात्र</strong> ) भएको र उक्त रकम हाम्रो क्लेम खातामा जम्मा गरीदिन हुनअनुरोध गर्दछौं। सर्भिसिङ गरिएका कुपनहरूको फोटोकपी र अन्य रेकर्ड यस पत्रसँगै संलग्न गरी पठाइएको छ।
        </p>
        <br/>
        <table class="w-full border-collapse border border-black text-sm my-4">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-black p-1 font-bold text-left">S.No</th>
              <th class="border border-black p-1 font-bold text-left">Customer Name</th>
              <th class="border border-black p-1 font-bold text-left">Book No.</th>
              <th class="border border-black p-1 font-bold text-left">Servicing No</th>
              <th class="border border-black p-1 font-bold text-left">Bill No.</th>
              <th class="border border-black p-1 font-bold text-right">Bill Amount</th>
            </tr>
          </thead>
          <tbody>
            ${claimsRows}
            <tr>
              <td colspan="5" class="border border-black p-1 font-bold text-center">Total Claimable Amount</td>
              <td class="border border-black p-1 font-bold text-right">${totalAmount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="mt-20 flex justify-end pr-8">
          <div class="text-center">
            <p>भवदीय,</p>
            <p>सक्सेस भट्टराई</p>
            <p class="font-bold">सोसाइटी इन्टरप्राइजेज प्रा. लि.</p>
            <p>दमक-०५, झापा</p>
          </div>
        </div>
      `;
      break;
    }

    case '2 Years Free Service With Engine Oil and Parts Claim': {
      hideGenericFooter = true;
      data.recipient = `श्रीमान् कार्यालय प्रमुख ज्यु ,<br/>स्याकार ट्रेडिङ्ग कम्पनी प्रा .ली .<br/>ज्योति भवन, कान्तिपथ<br/>काठमाण्डै`;
      subject = '2 Year Free Service with Engine Oil & Parts क्लेम पठाएको बारे ।';

      const claims = meta.engineOilClaims || [];
      const totalAmount = claims.reduce((sum: number, c: any) => sum + (Number(c.amount) || 0), 0);
      const formattedTotal = toNepaliNumber(totalAmount.toFixed(2));
      const verbalTotal = numberToNepaliWords(Math.floor(totalAmount));

      let claimsRows = '';
      if (claims.length > 0) {
        claimsRows = claims.map((c: any, i: number) => `
          <tr>
            <td class="border border-black p-1 text-center">${i + 1}.</td>
            <td class="border border-black p-1">${c.customerName || ''}</td>
            <td class="border border-black p-1">${c.bookNo || ''}</td>
            <td class="border border-black p-1">${c.servicingNo || ''}</td>
            <td class="border border-black p-1">${c.billNo || ''}</td>
            <td class="border border-black p-1 text-right">${c.amount || '0.00'}</td>
          </tr>
        `).join('');
      } else {
        claimsRows = `<tr><td colspan="6" class="border border-black p-2 text-center text-gray-500">No claims added</td></tr>`;
      }

      body = `
        <p>महोदय,</p>
        <p class="indent-12 leading-relaxed text-justify mt-2">
          उपरोक्त सम्बन्धमा यस <strong>सोसाइटी इन्टरप्राइजेज प्रा. लि.,</strong> हामीले ${meta.nepaliStartDate || '[Start Date Nepali]'} गते अर्थात ${meta.englishStartDate || '[Start Date English]'} देखि ${meta.nepaliEndDate || '[End Date Nepali]'} गते अर्थात ${meta.englishEndDate || '[End Date English]'} सम्म, ग्राहकहरूलाई <strong>2 Year Free Service with Engine Oil and Parts</strong> बुक बाट सर्भिसिङ गर्ने ग्राहकहरुलाई बुक अनुसार निःशुल्क Engine Oil र पार्ट्स प्रदान गरेका छौं। यस अन्तर्गत, कुल क्लेम रकम <strong>रु. ${formattedTotal}/-</strong> ( अक्षेरूपी <strong>${verbalTotal} रुपैंया मात्र</strong> ) भएको र उक्त रकम हाम्रो क्लेम खातामा जम्मा गरीदिन हुनअनुरोध गर्दछौं। सर्भिसिङ गरिएका कुपनहरूको फोटोकपी र अन्य रेकर्ड यस पत्रसँगै संलग्न गरी पठाइएको छ।
        </p>
        <br/>
        <table class="w-full border-collapse border border-black text-sm my-4">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-black p-1 font-bold text-left">S.No</th>
              <th class="border border-black p-1 font-bold text-left">Customer Name</th>
              <th class="border border-black p-1 font-bold text-left">Book No.</th>
              <th class="border border-black p-1 font-bold text-left">Servicing No</th>
              <th class="border border-black p-1 font-bold text-left">Bill No.</th>
              <th class="border border-black p-1 font-bold text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${claimsRows}
            <tr>
              <td colspan="5" class="border border-black p-1 font-bold text-center">Total Claimable Amount</td>
              <td class="border border-black p-1 font-bold text-right">${totalAmount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="mt-20 flex justify-end pr-8">
          <div class="text-center">
            <p>भवदीय,</p>
            <p>सक्सेस भट्टराई</p>
            <p class="font-bold">सोसाइटी इन्टरप्राइजेज प्रा. लि.</p>
            <p>दमक-०५, झापा</p>
          </div>
        </div>
      `;
      break;
    }

    case 'Payment Request Letter for Syakar Hire Purchase': {
      hideGenericFooter = true;
      data.recipient = `श्रीमान् कार्यालय प्रमुख ज्यु ,<br/>स्याकार हायर पर्चेज प्रा. लि.<br/>ज्योतिभवन, कान्तिपथ<br/>काठमाण्डै`;
      subject = 'भुक्तानी उपलब्ध गराइदिने बारे ।';

      const amount = Number(meta.investmentAmount) || 0;
      const formattedAmount = toNepaliNumber(amount.toLocaleString('en-US'));
      const verbalAmount = numberToNepaliWords(amount);

      body = `
        <p>महोदय,</p>
        <p class="indent-12 leading-relaxed text-justify mt-2">
          उपरोक्त सम्बन्धमा तहाको डेलिभरी अर्डर नं. <strong>${meta.deliveryOrderNo || '[Delivery Order No]'}</strong> बाट मिति <strong>${meta.dateNepali || '[Date Nepali]'}</strong> मा श्री <strong>${meta.customerName || '[Customer Name]'}</strong> र संस्थाको नाममा लगानी गरीएको तपशिल वमोजिमको <strong>${meta.vehicleModel || '[Vehicle Model]'}</strong> तहाको नाम र ऋणी <strong>${meta.customerName || '[Customer Name]'}</strong> खुलाइ १५ दिन भित्रमा तहाको नाममा नामसारी गरि डिभिजनमा पठाउने हुनाले लगानी वापतको रकम रू <strong>${formattedAmount}/-</strong> ( अक्षरूपी <strong>${verbalAmount} रुपैंया मात्र</strong> ) भुक्त्तानी गरिदिन हुन अनुरोध गर्दछौ । साथै उल्लेखी त रकम सोसाइटी इन्टरप्राइजेज प्रा. लि. को निम्न वमोजिम खाता मा जम्मा गर्न अनुरोध गर्दछौ ।
        </p>
        <div class="mt-4 leading-relaxed">
          <p>बैंकको नाम : <strong>एन एम बी बैंक, दमक शाखा</strong></p>
          <p>खातावालाको नाम: <strong>सोसाइटी इन्टरप्राइजेज प्रा. लि.</strong></p>
          <p>खाता नम्बर: <strong>०७९०१४६६८३९०००१०</strong></p>
        </div>
        
        <div class="mt-4 leading-relaxed">
          <p class="font-bold">तपशिल</p>
          <p>१) चेसीस नं. - ${meta.chassisNo || '[Chassis No]'}</p>
          <p>२) इन्जिन नं. - ${meta.engineNo || '[Engine No]'}</p>
          <p>३) दर्ता नं. - ${meta.registrationNo || '[Registration No]'}</p>
          <p>४) भ्याट बिल नं. - ${meta.vatBillNo || '[Vat Bill No]'}</p>
        </div>
        
        <p class="mt-4">सहयोगको लागी धन्यवाद ।।</p>
        
        <div class="mt-16 flex justify-end pr-8">
          <div class="text-center">
            <p>भीम बाबु भट्टराई</p>
            <p>प्रबन्ध निर्देशक</p>
            <p class="font-bold text-lg">सोसाइटी इन्टरप्राइजेज प्रा. लि.</p>
          </div>
        </div>
      `;
      break;
    }



    default:
      subject = docType;
      body = `<p>हामीलाई निम्न अनुसारको कार्य आवश्यक परेकोले सोही बमोजिम गरिदिनुहुन अनुरोध छ।</p>`;
  }

  let html = `
    ${generateHeader(data, subject, docType)}
    <div class="${docType === 'Bank Salary Deposit Request' ? 'mb-2' : 'mb-8'}">
      ${body}
    </div>
    ${hideGenericFooter ? '' : generateFooter(docType)}
  `;

  if (docType === 'Bank Salary Deposit Request') {
    html = `<div class="text-[14.5px]">${html}</div>`;
  }

  return { subject, html };
}
