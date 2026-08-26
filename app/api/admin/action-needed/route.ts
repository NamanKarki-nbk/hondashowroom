import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const pendingTestRides = await prisma.testRideBooking.count({
      where: { status: "PENDING" }
    });

    const newLeads = await prisma.lead.count({
      where: { status: "NEW", source: { not: "Quotation Requested" } }
    });

    const pendingQuotations = await prisma.lead.count({
      where: { status: "NEW", source: "Quotation Requested" }
    });

    const pendingAmcBookings = await prisma.amcBooking.count({
      where: { status: "PENDING" }
    });

    const pendingServiceBookings = await prisma.serviceBooking.count({
      where: { status: "PENDING" }
    });

    return NextResponse.json({
      success: true,
      pendingTestRides,
      newLeads,
      pendingQuotations,
      pendingAmcBookings,
      pendingServiceBookings
    });
  } catch (error: any) {
    console.error("Error fetching action needed stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
