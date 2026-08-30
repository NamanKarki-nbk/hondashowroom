import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activityLogger';
import { verifySessionToken } from '@/lib/session';
import { cookies } from 'next/headers';
import { BookingStatus } from '@/app/generated/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where = status && status !== 'ALL' ? { status: status as BookingStatus } : {};

    const testRides = await prisma.testRideBooking.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: true,
        branch: true
      }
    });

    return NextResponse.json(testRides);
  } catch (error) {
    console.error('Failed to fetch test rides:', error);
    return NextResponse.json({ error: 'Failed to fetch test rides' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const data = await request.json();
    const { id, status } = data;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 });
    }

    const testRide = await prisma.testRideBooking.update({
      where: { id },
      data: { status: status as BookingStatus }
    });

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value || cookieStore.get('session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    await logActivity({
      userId: session?.userId || session?.id || "system",
      action: "UPDATE",
      entity: "Lead",
      entityId: testRide.id,
      details: {
        name: testRide.name,
        phone: testRide.phone,
        status: testRide.status,
      }
    });

    return NextResponse.json(testRide);
  } catch (error) {
    console.error('Failed to update test ride:', error);
    return NextResponse.json({ error: 'Failed to update test ride' }, { status: 500 });
  }
}
