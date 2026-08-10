"use server";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// English to Nepali Digits
const engToNepDigits: Record<string, string> = {
  "0": "०", "1": "१", "2": "२", "3": "३", "4": "४",
  "5": "५", "6": "६", "7": "७", "8": "८", "9": "९",
};

function convertToNepaliDigits(numStr: string | number): string {
  return String(numStr)
    .split("")
    .map((char) => engToNepDigits[char] || char)
    .join("");
}

// Convert Number to Nepali Words
const units = ["", "एक", "दुई", "तीन", "चार", "पाँच", "छ", "सात", "आठ", "नौ", "दश",
  "एघार", "बाह्र", "तेह्र", "चौध", "पन्ध्र", "सोह्र", "सत्र", "अठार", "उन्नाइस"];
const tens = ["", "दश", "बीस", "तीस", "चालीस", "पचास", "साठी", "सत्तरी", "असी", "नब्बे"];

function numberToNepaliWords(num: number): string {
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
    if (num < 20) {
      words += units[num];
    } else {
      words += tens[Math.floor(num / 10)];
      if (num % 10 > 0) {
        words += " " + units[num % 10];
      }
    }
  }

  return words.trim();
}

export type LetterData = {
  letterType: string;
  recipientName: string;
  recipientDesignation: string;
  recipientBranch: string;
  amount: number;
  reason: string;
  dateStr: string;
};

export async function generateLetterContent(data: LetterData) {
  const nepaliAmount = convertToNepaliDigits(data.amount);
  const verbalAmount = numberToNepaliWords(data.amount);
  
  let content = `श्रीमान् ${data.recipientDesignation || "शाखा प्रबन्धक"} ज्यू,\n${data.recipientBranch || ""}\n\n`;
  content += `विषय: ${data.letterType}\n\n`;
  content += `महोदय,\n`;
  
  if (data.letterType === "Amount Transfer Request" || data.letterType === "रकम भुक्तानी / ट्रान्सफर अनुरोध") {
    content += `उपरोक्त सम्बन्धमा, त्यस शाखा कार्यालयबाट हाम्रो नाममा भुक्तानी हुनुपर्ने रकम रु. ${nepaliAmount} (अक्षरेपी ${verbalAmount} रुपैयाँ मात्र) ${data.reason ? data.reason + " बापत" : ""} हाम्रो खातामा ट्रान्सफर गरिदिनुहुन अनुरोध गर्दछौं।\n`;
  } else {
    content += `हामीलाई निम्न अनुसारको कार्य आवश्यक परेकोले सोही बमोजिम गरिदिनुहुन अनुरोध छ।\nविवरण: ${data.reason}\n`;
    if (data.amount > 0) {
      content += `रकम: रु. ${nepaliAmount} (अक्षरेपी ${verbalAmount} रुपैयाँ मात्र)\n`;
    }
  }
  
  content += `\nधन्यवाद,\n\nभवदीय,\nSociety Enterprises Pvt. Ltd.`;
  
  return content;
}

export async function saveLetter(data: LetterData, generatedContent: string) {
  const refNo = `REF-${Date.now()}`;
  
  const letter = await prisma.officialLetter.create({
    data: {
      referenceNo: refNo,
      letterType: data.letterType,
      recipientName: data.recipientName,
      recipientDesignation: data.recipientDesignation,
      recipientBranch: data.recipientBranch,
      amountNpr: data.amount,
      nepaliContent: generatedContent,
      createdBy: "ADMIN", // Placeholder for actual auth
    }
  });

  return letter;
}
