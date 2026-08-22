import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const pendingTestRides = await prisma.testRideBooking.count({
      where: { status: "PENDING" }
    });

    const newLeads = await prisma.lead.count({
      where: { status: "NEW" }
    });

    return NextResponse.json({
      success: true,
      pendingTestRides,
      newLeads
    });
  } catch (error: any) {
    console.error("Error fetching action needed stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
