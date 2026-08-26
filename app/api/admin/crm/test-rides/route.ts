import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where = status && status !== 'ALL' ? { status } : {};

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
      data: { status }
    });

    return NextResponse.json(testRide);
  } catch (error) {
    console.error('Failed to update test ride:', error);
    return NextResponse.json({ error: 'Failed to update test ride' }, { status: 500 });
  }
}
