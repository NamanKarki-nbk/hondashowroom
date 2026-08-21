import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/session";

// Define exactly which paths this middleware applies to
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes, we handle auth inside them directly)
     * 
     * We will apply logic specifically for /admin paths inside the function.
     */
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // We are only strictly protecting /admin routes for now
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

      // Check if user is the hardcoded Admin or has ADMIN role
      const allowedEmails = ["successbhattarai1998@gmail.com", "admin@honda.com"];
      if (payload.role !== "ADMIN" && (!payload.email || !allowedEmails.includes(payload.email))) {
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

  // If user is trying to access /login but is already authenticated
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

  // Allow all other routes to pass through (but session is technically available)
  return NextResponse.next();
}
