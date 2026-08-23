import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateNumericOtp, hashOtp } from "@/lib/auth";
import { sendEmailOtp } from "@/lib/mailer";

// Simple in-memory rate limiting map
// Key: identifier, Value: Array of timestamps
const rateLimitMap = new Map<string, number[]>();

export async function POST(req: NextRequest) {
  try {
    const { identifier, type } = await req.json();

    if (!identifier || !type || type !== "email") {
      return NextResponse.json({ error: "Invalid request parameters. Only 'email' type is supported." }, { status: 400 });
    }

    // Backend Admin Restriction: Prevent public admin registration
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@honda.com";
    
    if (identifier.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json({ error: "Admin accounts cannot be registered or accessed via public OTP. Please use the secure admin portal." }, { status: 403 });
    }

    // Rate limiting logic: Max 3 requests per minute
    const now = Date.now();
    const timestamps = rateLimitMap.get(identifier) || [];
    const validTimestamps = timestamps.filter(ts => now - ts < 60000); // last 1 minute
    
    if (validTimestamps.length >= 3) {
      return NextResponse.json({ error: "Too many requests. Please wait a minute before requesting another OTP." }, { status: 429 });
    }
    
    validTimestamps.push(now);
    rateLimitMap.set(identifier, validTimestamps);

    // We only support email, so no formatting needed
    const formattedIdentifier = identifier.toLowerCase();

    // Generate and hash OTP
    const otp = generateNumericOtp(6);
    const hashedOtp = await hashOtp(otp);

    // Store in DB
    const expiresAt = new Date(Date.now() + 15 * 60000); // 15 mins
    await prisma.otpVerification.create({
      data: {
        identifier: formattedIdentifier,
        hashedOtp,
        expiresAt,
      },
    });

    // Send OTP via Email
    const success = await sendEmailOtp(formattedIdentifier, otp);
    if (!success) {
      return NextResponse.json({ error: "Failed to send Email OTP. Check server configuration." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: `OTP sent successfully via ${type}` });

  } catch (error: any) {
    console.error("Error in send-otp: ", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
