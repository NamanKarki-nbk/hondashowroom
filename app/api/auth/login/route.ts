import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { signSessionToken } from "@/lib/session";
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.passwordHash) {
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
  } catch (error: any) {
    console.error("Error in login: ", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
