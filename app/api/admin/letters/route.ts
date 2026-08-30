import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateNepaliTemplate, DocCategory } from '@/lib/letterTemplates';
import { getNepaliFiscalYear } from '@/lib/nepaliTranslator';
import { logActivity } from "@/lib/activityLogger";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/session";
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const docType = searchParams.get('docType');

    const where = docType ? { docType } : {};

    const letters = await prisma.letter.findMany({
      where,
      orderBy: [
        { fiscalYear: 'desc' },
        { seqNumber: 'desc' }
      ]
    });

    return NextResponse.json(letters);
  } catch (error) {
    console.error('Error fetching letters:', error);
    return NextResponse.json({ error: 'Failed to fetch letters' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { docType, recipient, metadata } = body;

    if (!docType || !recipient) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Determine current fiscal year using our accurate Nepali mapping
    const now = new Date();
    const fiscalYear = getNepaliFiscalYear(now);

    // Get the next sequence number for this fiscal year
    const lastLetter = await prisma.letter.findFirst({
      where: { fiscalYear },
      orderBy: { seqNumber: 'desc' }
    });

    const seqNumber = lastLetter ? lastLetter.seqNumber + 1 : 1;
    const letterNo = `${fiscalYear}-${seqNumber.toString().padStart(5, '0')}`;

    // Generate formal Nepali body
    const templateData = {
      letterNo,
      date: now,
      recipient,
      metadata: metadata || {}
    };

    const { subject, html } = generateNepaliTemplate(docType as DocCategory, templateData);

    const letter = await prisma.letter.create({
      data: {
        letterNo,
        seqNumber,
        fiscalYear,
        docType,
        recipient,
        subject,
        metadata,
        nepaliBody: html,
        date: now
      }
    });

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    await logActivity({
      userId: session?.userId || session?.id || "system",
      action: "CREATE",
      entity: "Letter",
      entityId: letter.id,
      details: {
        letterNo: letter.letterNo,
        docType: letter.docType,
        recipient: letter.recipient,
        subject: letter.subject,
      },
    });

    if (docType === 'Bank Salary Deposit Request' && metadata.salaryClaims) {
      // Auto-save salaries for future use
      for (const claim of metadata.salaryClaims) {
        if (claim.id && claim.salary !== undefined) {
          const salaryVal = Number(claim.salary);
          if (!isNaN(salaryVal)) {
            await prisma.staff.update({
              where: { id: claim.id },
              data: { lastSalary: salaryVal }
            }).catch(e => console.error('Error auto-saving salary:', e));
          }
        }
      }
    }

    return NextResponse.json(letter, { status: 201 });
  } catch (error) {
    console.error('Error creating letter:', error);
    return NextResponse.json({ error: 'Failed to create letter' }, { status: 500 });
  }
}
