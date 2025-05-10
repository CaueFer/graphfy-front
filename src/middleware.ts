"use server";
import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get("token");

  if (!cookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/chat/:path*", "/chat"],
};
