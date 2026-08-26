import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createAdminNotification } from '@/lib/notifications';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.customerName || !data.phone || !data.bikeModel || !data.date || !data.timeSlot) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const booking = await prisma.testRideBooking.create({
      data: {
        name: data.customerName,
        phone: data.phone,
        modelName: data.bikeModel,
        preferredDate: new Date(data.date),
        timeSlot: data.timeSlot || null,
        notes: data.notes || null,
      }
    });

    await createAdminNotification({
      type: 'TEST_RIDE',
      title: 'New Test Ride Booking',
      message: `${data.customerName} booked a test ride for ${data.bikeModel} on ${new Date(data.date).toLocaleDateString()}.`,
      link: '/admin/crm/test-rides'
    });

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error('Test ride booking error:', error);
    return NextResponse.json({ error: 'Failed to book test ride' }, { status: 500 });
  }
}
