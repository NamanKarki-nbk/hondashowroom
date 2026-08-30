import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/session";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Define exactly which paths this middleware applies to
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * 
     * We will apply logic specifically for /admin and /api paths inside the function.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

// Initialize Upstash Redis and Ratelimit
// Will only actually connect if UPSTASH_REDIS_REST_URL is set
const redis = process.env.UPSTASH_REDIS_REST_URL 
  ? Redis.fromEnv() 
  : null;

const ratelimit = redis 
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(100, "60 s"),
      analytics: true,
    }) 
  : null;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. API Route Rate Limiting (Using Upstash Free Tier)
  if (pathname.startsWith("/api")) {
    if (ratelimit) {
      const ip = (request as any).ip ?? "127.0.0.1";
      const { success, limit, reset, remaining } = await ratelimit.limit(`ratelimit_${ip}`);

      if (!success) {
        return new NextResponse(
          JSON.stringify({ error: "Too Many Requests" }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString(),
            },
          }
        );
      }
    }

    // Add Caching Headers for Public APIs to reduce Vercel Function Executions
    if (request.method === "GET" && pathname.startsWith("/api/public")) {
      const response = NextResponse.next();
      response.headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=86400");
      return response;
    }
    
    // Allow API request to proceed
    return NextResponse.next();
  }

  // 2. Admin Route Protection
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("auth_session")?.value;

    if (!token) {
      // Not logged in -> Redirect to login
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Verify token
      const payload = await verifySessionToken(token);
      
      if (!payload) {
        // Invalid or expired token -> Redirect to login
        const loginUrl = new URL("/login", request.url);
        // Clear the bad cookie
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete("auth_session");
        return response;
      }

      // Check if user is the hardcoded Admin or has ADMIN/SUPERADMIN role
      const allowedEmails = ["successbhattarai1998@gmail.com", "admin@honda.com"];
      if (!["ADMIN", "SUPERADMIN"].includes(payload.role) && (!payload.email || !allowedEmails.includes(payload.email))) {
        // Logged in, but NOT an admin -> Redirect to Home
        return NextResponse.redirect(new URL("/", request.url));
      }

      // Allow access to /admin
      return NextResponse.next();

    } catch (error) {
      // Any parsing error -> Redirect to login
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Login Page Redirect if Authenticated
  if (pathname === "/login") {
    const token = request.cookies.get("auth_session")?.value;
    if (token) {
      try {
        const payload = await verifySessionToken(token);
        if (payload) {
          // Already logged in, redirect to home
          return NextResponse.redirect(new URL("/", request.url));
        }
      } catch (error) {
        // Invalid token, just let them see the login page
      }
    }
  }

  // Allow all other routes to pass through
  return NextResponse.next();
}
