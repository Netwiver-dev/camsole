import { NextResponse } from "next/server";

export function middleware(request) {
  // this no-op middleware forces Next.js to emit middleware-manifest.json
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],  // adjust or remove if you don’t need path matching
};
