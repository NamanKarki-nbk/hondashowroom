import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

// Convert base64 data URL to buffer and mime type
function parseBase64Image(dataUrl: string) {
  const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 string');
  }
  return {
    mimeType: matches[1],
    buffer: Buffer.from(matches[2], 'base64')
  };
}

export async function POST(req: Request) {
  try {
    const { frontImage, backImage, documentType } = await req.json();

    if (!frontImage) {
      return NextResponse.json({ error: 'Missing image' }, { status: 400 });
    }

    const front = parseBase64Image(frontImage);
    const back = backImage ? parseBase64Image(backImage) : null;

    const messages: any[] = [
      {
        role: 'user',
        content: [
          { type: 'text', text: getPromptForDocType(documentType) },
          { type: 'file', data: front.buffer, mediaType: front.mimeType }
        ]
      }
    ];

    if (back) {
      messages[0].content.push({ type: 'file', data: back.buffer, mediaType: back.mimeType });
    }

    let schema;
    if (documentType === 'CITIZENSHIP') {
      schema = z.object({
        documentNumber: z.string().describe("Citizenship Certificate Number (e.g., 04-02-72-01532)"),
        fullName: z.string().describe("Full Name in uppercase"),
        dobAd: z.string().describe("Date of birth in AD (YYYY-MM-DD)"),
        gender: z.string().describe("Gender (MALE, FEMALE, OTHER)"),
        address: z.string().describe("Permanent Address (District and Municipality)"),
        fatherName: z.string().optional().describe("Father's Name")
      });
    } else if (documentType === 'LICENSE') {
      schema = z.object({
        documentNumber: z.string().describe("D.L.No. (e.g., 01-01-00379851)"),
        fullName: z.string().describe("Name in uppercase"),
        dobAd: z.string().describe("D.O.B in AD (YYYY-MM-DD)"),
        citizenshipNumber: z.string().describe("Citizenship No."),
        category: z.string().optional().describe("License Category (e.g., A, B)"),
        address: z.string().optional().describe("Address")
      });
    } else if (documentType === 'NATIONAL_ID') {
      schema = z.object({
        documentNumber: z.string().describe("National Identity Number / NIN"),
        fullName: z.string().describe("Name in uppercase"),
        dobAd: z.string().describe("Date of birth in AD (YYYY-MM-DD)"),
        dobBs: z.string().describe("Date of birth in BS (YYYY-MM-DD)"),
        gender: z.string().describe("Gender (MALE, FEMALE)"),
        address: z.string().optional().describe("Address")
      });
    } else {
      return NextResponse.json({ error: 'Invalid document type' }, { status: 400 });
    }

    const result = await generateObject({
      model: google('gemini-3.6-flash'),
      schema: schema,
      messages: messages,
    });

    return NextResponse.json(result.object);
  } catch (error) {
    console.error('OCR Extraction Error:', error);
    return NextResponse.json({ error: 'extraction_failed' }, { status: 500 });
  }
}

function getPromptForDocType(type: string) {
  if (type === 'CITIZENSHIP') {
    return 'This is a Nepali Citizenship Certificate. Extract the requested fields from the English text, which is primarily on the back of the card. Read carefully and ensure exact matching of document numbers.';
  }
  if (type === 'LICENSE') {
    return 'This is a Nepali Driving License. Extract the requested fields from the front of the card. Ensure the document number (D.L.No.) and Citizenship No. are exactly as written. Convert D.O.B. to YYYY-MM-DD format.';
  }
  return 'This is a Nepal National ID card. Extract the requested fields. Convert dates to YYYY-MM-DD format.';
}
