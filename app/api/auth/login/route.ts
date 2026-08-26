import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { signSessionToken } from "@/lib/session";
import { withErrorHandler, BusinessException } from "@/lib/api-handler";

async function loginHandler(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    throw new BusinessException("Missing required fields");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.passwordHash) {
    // Note: returning 401 via NextResponse directly for auth errors is fine,
    // or we can throw BusinessException which maps to 400. We'll return 401 directly here.
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@honda.com";
  
  if (!user.isVerified && user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    return NextResponse.json({ error: "Please complete OTP verification before logging in.", isVerified: false }, { status: 403 });
  }

  const token = await signSessionToken({ userId: user.id, email: user.email || undefined, phone: user.phone, role: user.role });
  
  const response = NextResponse.json({ success: true, message: "Logged in successfully", userId: user.id, isVerified: user.isVerified });
  
  response.cookies.set("auth_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });

  return response;
}

export const POST = withErrorHandler(loginHandler);
