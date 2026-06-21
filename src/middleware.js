// src/middleware.js
import { NextResponse } from "next/server";

// Protected route patterns and their required roles
const protectedRoutes = {
  "/tenant": ["tenant"],
  "/owner": ["owner"],
  "/admin": ["admin"],
  "/payment/checkout": ["tenant"],
  "/payment/success": ["tenant"],
};

// Matches a single dynamic property id segment, e.g. /properties/64f1...
// but NOT the public listing page itself (/properties or /properties/).
const PROPERTY_DETAILS_PATTERN = /^\/properties\/[^/]+\/?$/;

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const userCookie = request.cookies.get("user")?.value;

  // ── Property Details page: private, but open to ANY logged-in role ──────
  // (Tenant / Owner / Admin can all view a property's details — only the
  // /properties listing itself stays public.)
  if (PROPERTY_DETAILS_PATTERN.test(pathname)) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Check if route needs protection
  const protectedBase = Object.keys(protectedRoutes).find((base) =>
    pathname.startsWith(base)
  );

  if (protectedBase) {
    // Not logged in
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check role from cookie
    if (userCookie) {
      try {
        const user = JSON.parse(decodeURIComponent(userCookie));
        const requiredRoles = protectedRoutes[protectedBase];

        if (!requiredRoles.includes(user.role)) {
          return NextResponse.redirect(
            new URL("/unauthorized", request.url)
          );
        }
      } catch {
        // Invalid cookie — redirect to login
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
  }

  // Redirect logged-in users away from auth pages
  if ((pathname === "/login" || pathname === "/register") && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/tenant/:path*",
    "/owner/:path*",
    "/admin/:path*",
    "/payment/:path*",
    "/properties/:path*",
    "/login",
    "/register",
  ],
};