import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signSessionToken } from "@/lib/session";

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");

  // Google returned an error (e.g., user denied consent, redirect_uri_mismatch)
  if (error) {
    console.error("Google OAuth Error:", error, errorDescription);
    const errorMsg = encodeURIComponent(errorDescription || error || "google_auth_failed");
    return NextResponse.redirect(new URL(`/login?error=${errorMsg}`, origin));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=Missing+authorization+code+from+Google", origin));
  }

  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const REDIRECT_URI = `${origin}/api/auth/google/callback`;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.error("Google OAuth not configured. GOOGLE_CLIENT_ID:", !!GOOGLE_CLIENT_ID, "GOOGLE_CLIENT_SECRET:", !!GOOGLE_CLIENT_SECRET);
    return NextResponse.redirect(new URL("/login?error=Google+OAuth+is+not+configured+on+the+server", origin));
  }

  try {
    // 1. Exchange code for access token
    console.log("Google OAuth: Exchanging code for token. Redirect URI:", REDIRECT_URI);
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
    if (!tokenResponse.ok) {
      console.error("Google Token Exchange Error:", JSON.stringify(tokenData));
      const detail = tokenData.error_description || tokenData.error || "Token exchange failed";
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(detail)}`, origin));
    }

    // 2. Fetch user profile
    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profileData = await profileResponse.json();
    if (!profileResponse.ok) {
      console.error("Google Profile Fetch Error:", JSON.stringify(profileData));
      const detail = profileData.error?.message || "Failed to fetch Google profile";
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(detail)}`, origin));
    }

    const email = profileData.email;
    const name = profileData.name;
    const picture = profileData.picture;

    if (!email) {
      return NextResponse.redirect(new URL("/login?error=Google+account+has+no+email+address", origin));
    }

    // 3. Upsert user in database
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        avatarUrl: picture,
        fullName: name || undefined,
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

    const response = NextResponse.redirect(new URL("/", origin));
    response.cookies.set("auth_session", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;

  } catch (err: any) {
    console.error("Google Auth Callback Error:", err?.message || err);
    const errorMsg = encodeURIComponent(err?.message || "Authentication failed. Please try again.");
    return NextResponse.redirect(new URL(`/login?error=${errorMsg}`, origin));
  }
}
