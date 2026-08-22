import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const origin = req.nextUrl.origin;
  const REDIRECT_URI = `${origin}/api/auth/google/callback`;

  if (!GOOGLE_CLIENT_ID) {
    return NextResponse.json({ error: "Google OAuth is not configured. Missing GOOGLE_CLIENT_ID in environment variables." }, { status: 500 });
  }

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.append("client_id", GOOGLE_CLIENT_ID);
  url.searchParams.append("redirect_uri", REDIRECT_URI);
  url.searchParams.append("response_type", "code");
  url.searchParams.append("scope", "email profile");
  url.searchParams.append("access_type", "offline");
  url.searchParams.append("prompt", "consent");

  return NextResponse.redirect(url.toString());
}
