import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createAdminNotification } from '@/lib/notifications';

export async function GET() {
  try {
    const bookings = await prisma.amcBooking.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(bookings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // basic validation
    if (!body.fullName || !body.phone || !body.planTitle) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const booking = await prisma.amcBooking.create({
      data: {
        fullName: body.fullName,
        phone: body.phone,
        email: body.email || null,
        vehicleModel: body.vehicleModel || null,
        vehicleRegNo: body.vehicleRegNo || null,
        planTitle: body.planTitle,
        status: "PENDING",
        remarks: body.remarks || null,
      }
    });

    await createAdminNotification({
      type: 'AMC_BOOKING',
      title: 'New AMC Booking Request',
      message: `${body.fullName} wants to purchase the ${body.planTitle} plan.`,
      link: '/admin/cms/amc'
    });
    
    return NextResponse.json(booking);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, remarks } = body;
    
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const booking = await prisma.amcBooking.update({
      where: { id },
      data: {
        status,
        remarks,
      }
    });
    
    return NextResponse.json(booking);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    await prisma.amcBooking.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
