import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createAdminNotification } from '@/lib/notifications';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, phone, vehicleNo, chassisNo, serviceType, preferredDate } = body;

    if (!fullName || !phone || !serviceType || !preferredDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if customer exists by phone
    let customer = await prisma.customer.findUnique({
      where: { phone }
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          fullName,
          phone,
        }
      });
    }

    const booking = await prisma.serviceBooking.create({
      data: {
        customerId: customer.id,
        vehicleNo,
        chassisNo,
        serviceType,
        preferredDate: new Date(preferredDate),
        status: "PENDING"
      }
    });

    await createAdminNotification({
      type: 'SERVICE_BOOKING',
      title: 'New Service Booking',
      message: `${fullName} booked a ${serviceType} service for ${vehicleNo || 'their vehicle'}.`,
      link: '/admin/crm/service'
    });

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    console.error("Error creating service booking:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
