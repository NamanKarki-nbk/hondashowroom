import { NextRequest, NextResponse } from "next/server";

// Debug endpoint to verify Google OAuth configuration on the hosted site
// Access: GET /api/auth/google/debug
export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const REDIRECT_URI = `${origin}/api/auth/google/callback`;

  return NextResponse.json({
    configured: {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? `${process.env.GOOGLE_CLIENT_ID.slice(0, 10)}...` : "❌ NOT SET",
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "✅ Set (hidden)" : "❌ NOT SET",
      JWT_SECRET: process.env.JWT_SECRET ? "✅ Set (hidden)" : "❌ NOT SET",
      DATABASE_URL: process.env.DATABASE_URL ? "✅ Set (hidden)" : "❌ NOT SET",
    },
    redirect_uri: REDIRECT_URI,
    origin: origin,
    node_env: process.env.NODE_ENV,
    instructions: {
      step1: "Go to https://console.cloud.google.com/apis/credentials",
      step2: "Click on your OAuth 2.0 Client ID",
      step3: `Add this EXACT redirect URI: ${REDIRECT_URI}`,
      step4: "Also add to 'Authorized JavaScript origins': " + origin,
      step5: "Save and wait 5 minutes for changes to propagate",
    }
  });
}
