import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activityLogger';
import { verifySessionToken } from '@/lib/session';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value || cookieStore.get('session')?.value;
    const session = token ? await verifySessionToken(token) : null;

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
          const updatedStaff = await prisma.staff.update({
            where: { id: claim.id },
            data: { lastSalary: salaryVal }
          }).catch(e => {
            console.error('Error auto-saving salary:', e);
            return null;
          });

          if (updatedStaff) {
            await logActivity({
              userId: session?.userId || session?.id || "system",
              action: "UPDATE",
              entity: "Staff",
              entityId: updatedStaff.id,
              details: {
                id: updatedStaff.id,
                name: updatedStaff.name,
                lastSalary: updatedStaff.lastSalary,
              }
            });
          }
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error saving salaries:', error);
    return NextResponse.json({ error: 'Failed to save salaries' }, { status: 500 });
  }
}
