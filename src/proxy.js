// src/proxy.js
import { NextResponse } from "next/server";

const protectedRoutes = {
  "/tenant": ["tenant"],
  "/owner": ["owner"],
  "/admin": ["admin"],
  "/payment/checkout": ["tenant"],
  "/payment/success": ["tenant"],
};

export default function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const userCookie = request.cookies.get("user")?.value;

  console.log(
    "[PROXY]",
    "path:", pathname,
    "| hasToken:", !!token,
    "| redirect:", request.nextUrl.searchParams.get("redirect")
  );

  // Role-protected areas
  const protectedBase = Object.keys(protectedRoutes).find((base) =>
    pathname.startsWith(base)
  );

  if (protectedBase) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (userCookie) {
      try {
        const user = JSON.parse(decodeURIComponent(userCookie));
        const requiredRoles = protectedRoutes[protectedBase];
        if (!requiredRoles.includes(user.role)) {
          return NextResponse.redirect(new URL("/unauthorized", request.url));
        }
      } catch {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
  }

  // Logged-in users on /login or /register → honor ?redirect=
  if ((pathname === "/login" || pathname === "/register") && token) {
    const redirectParam = request.nextUrl.searchParams.get("redirect");
    const target =
      redirectParam &&
      redirectParam.startsWith("/") &&
      !redirectParam.startsWith("//")
        ? redirectParam
        : "/";

    return NextResponse.redirect(new URL(target, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/tenant/:path*",
    "/owner/:path*",
    "/admin/:path*",
    "/payment/:path*",
    "/login",
    "/register",
  ],
};