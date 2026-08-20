"use server";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";
import { generateNepaliTemplate, DocCategory, TemplateData } from "@/lib/letterTemplates";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export async function getLetters() {
  return await prisma.letter.findMany({
    orderBy: [
      { fiscalYear: 'desc' },
      { seqNumber: 'desc' }
    ]
  });
}

export async function getLetter(letterNo: string) {
  return await prisma.letter.findUnique({
    where: { letterNo }
  });
}

export async function saveNewLetter(data: { docType: DocCategory, recipient: string, metadata: any }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  // Simplified fiscal year calculation
  const fiscalYear = month >= 6 ? `${year}/${year + 1}` : `${year - 1}/${year}`;

  const lastLetter = await prisma.letter.findFirst({
    where: { fiscalYear },
    orderBy: { seqNumber: 'desc' }
  });

  const seqNumber = lastLetter ? lastLetter.seqNumber + 1 : 1;
  const letterNo = `${fiscalYear}-${seqNumber.toString().padStart(5, '0')}`;

  const templateData: TemplateData = {
    letterNo,
    date: now,
    recipient: data.recipient,
    metadata: data.metadata || {}
  };

  const { subject, html } = generateNepaliTemplate(data.docType, templateData);

  const letter = await prisma.letter.create({
    data: {
      letterNo,
      seqNumber,
      fiscalYear,
      docType: data.docType,
      recipient: data.recipient,
      subject,
      metadata: data.metadata,
      nepaliBody: html,
      date: now
    }
  });

  return letter;
}

export async function getLatestRemainingBalance() {
  try {
    const lastLetter = await prisma.letter.findFirst({
      where: {
        docType: 'Vehicle Purchase Cash Incentive Claim'
      },
      orderBy: {
        date: 'desc'
      }
    });
    
    if (lastLetter && lastLetter.metadata) {
      const metadata = typeof lastLetter.metadata === 'string' 
        ? JSON.parse(lastLetter.metadata) 
        : lastLetter.metadata as any;
        
      return metadata.finalRemainingBalance || 0;
    }
    return 0;
  } catch (err) {
    console.error("Failed to fetch latest remaining balance", err);
    return 0;
  }
}
