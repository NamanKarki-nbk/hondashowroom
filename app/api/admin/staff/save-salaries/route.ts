import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { salaries } = body;

    if (!Array.isArray(salaries)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    // Update salaries in background
    for (const claim of salaries) {
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

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error saving salaries:', error);
    return NextResponse.json({ error: 'Failed to save salaries' }, { status: 500 });
  }
}
