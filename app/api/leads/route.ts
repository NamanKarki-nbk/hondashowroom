import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createAdminNotification } from '@/lib/notifications';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, interestedIn, remarks, source } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        phone,
        interestedIn,
        remarks,
        source: source || 'Website Contact Form',
        status: 'NEW' as any
      }
    });

    const isQuotation = source === 'Quotation Requested';
    const isBooking = source && source.includes('Booking');

    let type = 'NEW_LEAD';
    let title = 'New Contact Inquiry';
    let actionText = 'submitted an inquiry about';

    if (isQuotation) {
      type = 'DIGITAL_QUOTATION';
      title = 'New Digital Quotation Request';
      actionText = 'requested a quotation for';
    } else if (isBooking) {
      type = 'VEHICLE_BOOKING';
      title = 'New Vehicle Booking';
      actionText = 'booked a';
    }

    await createAdminNotification({
      type: type as any,
      title,
      message: `${name} ${actionText} ${interestedIn || 'Honda vehicle'}.`,
      link: isQuotation ? '/admin/crm/quotations' : '/admin/crm/leads'
    });

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
