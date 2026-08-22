import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signSessionToken } from "@/lib/session";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/login?error=google_auth_failed", req.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", req.url));
  }

  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const origin = req.nextUrl.origin;
  const REDIRECT_URI = `${origin}/api/auth/google/callback`;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return NextResponse.redirect(new URL("/login?error=server_configuration_missing", req.url));
  }

  try {
    // 1. Exchange code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) throw new Error(tokenData.error || "Failed to exchange token");

    // 2. Fetch user profile
    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profileData = await profileResponse.json();
    if (!profileResponse.ok) throw new Error(profileData.error?.message || "Failed to fetch profile");

    const email = profileData.email;
    const name = profileData.name;
    const picture = profileData.picture;

    // 3. Upsert user in database
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        avatarUrl: picture,
      },
      create: {
        email,
        fullName: name,
        avatarUrl: picture,
        phone: `google-${Date.now()}`, // Temporary phone to satisfy unique constraint
      },
    });

    // 4. Issue custom JWT session
    const token = await signSessionToken({ userId: user.id, email: user.email || undefined, phone: user.phone, role: user.role });

    const response = NextResponse.redirect(new URL("/", req.url));
    response.cookies.set("auth_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;

  } catch (err) {
    console.error("Google Auth Callback Error:", err);
    return NextResponse.redirect(new URL("/login?error=google_auth_failed", req.url));
  }
}
