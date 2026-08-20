/**
 * Utility functions for translating common English text to formal Nepali for official letters.
 */

// Mapping of English numbers to Nepali numerals
const nepaliNumbers: { [key: string]: string } = {
  '0': '०',
  '1': '१',
  '2': '२',
  '3': '३',
  '4': '४',
  '5': '५',
  '6': '६',
  '7': '७',
  '8': '८',
  '9': '९',
};

/**
 * Converts English numbers in a string to Nepali numerals.
 */
export function toNepaliNumber(num: string | number): string {
  const numStr = num.toString();
  return numStr.split('').map(char => nepaliNumbers[char] || char).join('');
}

// English to Nepali Month Mapping for AD dates
const nepaliMonths: { [key: string]: string } = {
  'January': 'जनवरी',
  'February': 'फेब्रुअरी',
  'March': 'मार्च',
  'April': 'अप्रिल',
  'May': 'मई',
  'June': 'जुन',
  'July': 'जुलाई',
  'August': 'अगस्ट',
  'September': 'सेप्टेम्बर',
  'October': 'अक्टोबर',
  'November': 'नोभेम्बर',
  'December': 'डिसेम्बर'
};

/**
 * Formats a Date object into a Nepali localized date string (AD).
 * Example: '१२ जनवरी २०२४'
 */
export function formatNepaliDate(date: Date): string {
  const day = toNepaliNumber(date.getDate());
  const year = toNepaliNumber(date.getFullYear());
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const month = nepaliMonths[monthNames[date.getMonth()]];
  return `${day} ${month} ${year}`;
}

// Standard Formal Terms mapping for generic replacements if needed
export const nepaliTerms = {
  salutation: 'श्री',
  subject: 'विषय:',
  regards: 'भवदीय,',
  date: 'मिति:',
  refNo: 'पत्र संख्या:',
  dispatchNo: 'चलानी नं.:',
};

/**
 * Common translation dictionary for specific document fields
 */
export const docFieldTranslations: Record<string, string> = {
  'Vehicle Repair Payment Request': 'सवारी मर्मत भुक्तानी अनुरोध',
  'Institutional Supply & Fleet Billing': 'संस्थागत आपूर्ति तथा फ्लिट बिलिङ',
  'Electronic Cheque Clearing (ECC)': 'विद्युतीय चेक क्लियरिङ (ECC)',
  'Customer Delivery Orders (DO)': 'ग्राहक डेलिभरी अर्डर (DO)',
  'Tax Clearance & Audit Documentation': 'कर चुक्ता तथा अडिट कागजात',
  'Staff Salary & Payroll Statements': 'कर्मचारी तलब तथा पेरोल विवरण',
  'Company Valuation & Asset Reports': 'कम्पनी मूल्याङ्कन तथा सम्पत्ति रिपोर्ट'
};

const nepaliWords1to99 = [
  "शून्य", "एक", "दुई", "तीन", "चार", "पाँच", "छ", "सात", "आठ", "नौ", "दश",
  "एघार", "बाह्र", "तेह्र", "चौध", "पन्ध्र", "सोह्र", "सत्र", "अठार", "उन्नाइस", "बीस",
  "एक्काइस", "बाइस", "तेइस", "चौबीस", "पच्चीस", "छब्बीस", "सत्ताइस", "अठ्ठाइस", "उन्नान्तीस", "तीस",
  "एकतीस", "बत्तीस", "तेत्तीस", "चौंतीस", "पैंतीस", "छत्तीस", "सैंतीस", "अडतीस", "उन्नानचालीस", "चालीस",
  "एकचालीस", "बयालीस", "त्रियालीस", "चवालीस", "पैंतालीस", "छयालीस", "सतचालीस", "अडचालीस", "उन्नानपचास", "पचास",
  "एकाउन्न", "बाउन्न", "त्रिपन्न", "चउन्न", "पचपन्न", "छपन्न", "सन्ताउन्न", "अन्ठाउन्न", "उनान्साठी", "साठी",
  "एकसट्ठी", "बयसट्ठी", "त्रिसट्ठी", "चौंसट्ठी", "पैंसट्ठी", "छयसट्ठी", "सतसट्ठी", "अठसट्ठी", "उनान्सत्तरी", "सत्तरी",
  "एकहत्तर", "बहत्तर", "त्रिहत्तर", "चौहत्तर", "पचहत्तर", "छयहत्तर", "सतहत्तर", "अठहत्तर", "उनानासी", "असी",
  "एकासी", "बयासी", "त्रियासी", "चौरासी", "पचासी", "छयासी", "सतासी", "अठासी", "उनान्नब्बे", "नब्बे",
  "एकान्नब्बे", "बयानब्बे", "त्रियान्नब्बे", "चौरान्नब्बे", "पञ्चान्नब्बे", "छयान्नब्बे", "सन्तान्नब्बे", "अन्ठान्नब्बे", "उनान्सय"
];

export function numberToNepaliWords(num: number): string {
  if (num === 0) return "शून्य";

  let words = "";

  if (Math.floor(num / 10000000) > 0) {
    words += numberToNepaliWords(Math.floor(num / 10000000)) + " करोड ";
    num %= 10000000;
  }

  if (Math.floor(num / 100000) > 0) {
    words += numberToNepaliWords(Math.floor(num / 100000)) + " लाख ";
    num %= 100000;
  }

  if (Math.floor(num / 1000) > 0) {
    words += numberToNepaliWords(Math.floor(num / 1000)) + " हजार ";
    num %= 1000;
  }

  if (Math.floor(num / 100) > 0) {
    words += numberToNepaliWords(Math.floor(num / 100)) + " सय ";
    num %= 100;
  }

  if (num > 0) {
    words += nepaliWords1to99[Math.floor(num)];
  }

  return words.trim();
}

/**
 * Computes the Nepali Fiscal Year given an AD Date based on mapping
 */
export function getNepaliFiscalYear(date: Date): string {
  const time = date.getTime();
  if (time >= new Date('2026-07-17').getTime() && time <= new Date('2027-07-16').getTime()) return '2083।84';
  if (time >= new Date('2025-07-16').getTime() && time < new Date('2026-07-17').getTime()) return '2082।83';
  if (time >= new Date('2024-07-16').getTime() && time < new Date('2025-07-16').getTime()) return '2081।82';
  
  // Fallback estimation
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const isNewFY = month > 6 || (month === 6 && day >= 16);
  const startBS = year + 57 - (isNewFY ? 0 : 1);
  const endBS = startBS + 1;
  return `${startBS}।${endBS.toString().slice(2)}`;
}
