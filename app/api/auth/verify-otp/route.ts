import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyOtpHash } from "@/lib/auth";
import { signSessionToken } from "@/lib/session";
export async function POST(req: NextRequest) {
  try {
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

    // Determine if identifier is email or phone
    const isEmail = formattedIdentifier.includes("@");
    
    // Upsert User
    const user = await prisma.user.upsert({
      where: isEmail ? { email: formattedIdentifier } : { phone: formattedIdentifier },
      update: {}, // Don't overwrite existing data
      create: {
        email: isEmail ? formattedIdentifier : null,
        phone: isEmail ? `placeholder-${Date.now()}` : formattedIdentifier, // Phone is required by DB so use a placeholder if email login
      }
    });

    // Delete OTP record to prevent reuse
    await prisma.otpVerification.delete({ where: { id: latestOtp.id } });

    // Generate JWT and set Cookie
    const token = await signSessionToken({ userId: user.id, email: user.email || undefined, phone: user.phone });
    
    const response = NextResponse.json({ success: true, user: { id: user.id, email: user.email, phone: user.phone } });
    
    response.cookies.set("auth_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;

  } catch (error: any) {
    console.error("Error in verify-otp: ", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
