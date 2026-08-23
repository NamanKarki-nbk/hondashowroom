import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyOtpHash } from "@/lib/auth";
import { verifySessionToken } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const session = await verifySessionToken(token);
    if (!session?.userId) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
    }

    const { identifier, code, type } = await req.json();

    if (!identifier || !code) {
      return NextResponse.json({ error: "Identifier and code are required" }, { status: 400 });
    }

    let formattedIdentifier = identifier;
    if (type === "whatsapp") {
      let digits = identifier.replace(/\D/g, '');
      if (digits.length === 10) {
        digits = `977${digits}`;
      }
      formattedIdentifier = digits;
    }

    // Find the latest OTP for this identifier
    const latestOtp = await prisma.otpVerification.findFirst({
      where: { identifier: formattedIdentifier },
      orderBy: { createdAt: "desc" }
    });

    if (!latestOtp) {
      return NextResponse.json({ error: "No OTP request found for this identifier" }, { status: 404 });
    }

    if (latestOtp.expiresAt < new Date()) {
      return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 });
    }

    // Verify Hash
    const isValid = await verifyOtpHash(code, latestOtp.hashedOtp);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid OTP code" }, { status: 401 });
    }

    // Update the verification status in the database
    await prisma.user.update({
      where: { id: session.userId },
      data: { isVerified: true }
    });
    
    // Also update the associated customer record if it exists
    await prisma.customer.updateMany({
      where: { userId: session.userId },
      data: { isVerified: true }
    });

    // Delete OTP record to prevent reuse
    await prisma.otpVerification.delete({ where: { id: latestOtp.id } });

    return NextResponse.json({ success: true, message: "Contact verified successfully" });

  } catch (error: any) {
    console.error("Error in verify-contact: ", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
