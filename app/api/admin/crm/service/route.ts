import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activityLogger';
import { verifySessionToken } from '@/lib/session';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where = status && status !== 'ALL' ? { status } : {};

    const serviceBookings = await prisma.serviceBooking.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: true,
      }
    });

    return NextResponse.json(serviceBookings);
  } catch (error) {
    console.error('Failed to fetch service bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch service bookings' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const data = await request.json();
    const { id, status } = data;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 });
    }

    const serviceBooking = await prisma.serviceBooking.update({
      where: { id },
      data: { status }
    });

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value || cookieStore.get('session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    await logActivity({
      userId: session?.userId || session?.id || "system",
      action: "UPDATE",
      entity: "Lead",
      entityId: serviceBooking.id,
      details: {
        serviceType: serviceBooking.serviceType,
        status: serviceBooking.status,
        vehicleNo: serviceBooking.vehicleNo,
      }
    });

    return NextResponse.json(serviceBooking);
  } catch (error) {
    console.error('Failed to update service booking:', error);
    return NextResponse.json({ error: 'Failed to update service booking' }, { status: 500 });
  }
}
