import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const yearStr = searchParams.get('year');
    const monthStr = searchParams.get('month');

    if (!yearStr || !monthStr) {
      return NextResponse.json({ error: 'Year and month are required' }, { status: 400 });
    }

    const year = parseInt(yearStr, 10);
    // JS months are 0-indexed, so month=8 means August.
    // We expect monthStr to be 1-indexed (e.g., 8 for August).
    const month = parseInt(monthStr, 10) - 1; 

    // Define start and end of the month in local time (or UTC depending on how data is saved).
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

    // 1. Fetch Sales Transactions (Deliveries)
    const sales = await prisma.salesTransaction.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        customer: true,
        vehicle: true,
      }
    });

    // 2. Fetch Test Rides
    const testRides = await prisma.testRideBooking.findMany({
      where: {
        preferredDate: {
          gte: startDate,
          lte: endDate,
        },
      }
    });

    // 3. Fetch Service Bookings
    const services = await prisma.serviceBooking.findMany({
      where: {
        preferredDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        customer: true,
      }
    });

    // Format all events into a unified array
    const events = [
      ...sales.map(s => ({
        id: s.id,
        type: 'DELIVERY',
        date: s.createdAt.toISOString(),
        title: `${s.invoiceNo} - ${s.customer.fullName}`,
        subtitle: s.vehicle.modelName,
        status: 'Confirmed'
      })),
      ...testRides.map(t => ({
        id: t.id,
        type: 'TEST_RIDE',
        date: t.preferredDate.toISOString(),
        title: `Test Ride: ${t.name}`,
        subtitle: t.modelName,
        status: t.status
      })),
      ...services.map(s => ({
        id: s.id,
        type: 'SERVICE',
        date: s.preferredDate.toISOString(),
        title: `Service: ${s.customer.fullName}`,
        subtitle: s.serviceType,
        status: 'Scheduled'
      }))
    ];

    return NextResponse.json(events);
  } catch (error) {
    console.error('Fetch calendar error:', error);
    return NextResponse.json({ error: 'Failed to fetch calendar events' }, { status: 500 });
  }
}
