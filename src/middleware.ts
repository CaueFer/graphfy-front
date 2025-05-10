"use server";
import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const res = NextResponse.next();

  const cookie = request.cookies.get("token");

  if (!cookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return res;
}

export const config = {
  matcher: ["/chat/:path*", "/chat"],
};
