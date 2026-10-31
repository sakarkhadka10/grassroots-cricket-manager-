import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const AUTH_PATHS = ["/login", "/register"] as const;

function isAuthPath(pathname: string) {
  return AUTH_PATHS.some((path) => pathname === path);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });
  const hasValidSession = Boolean(token?.sub);

  if (isAuthPath(pathname)) {
    if (hasValidSession) {
      return NextResponse.redirect(new URL("/auth/redirect", request.url));
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/app")) {
    if (!hasValidSession) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/app/:path*", "/login", "/register"],
};
