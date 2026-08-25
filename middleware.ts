import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = (request.headers.get("host") ?? url.host).toLowerCase();
  const proto = (request.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "")).toLowerCase();
  let changed = false;

  if (host.startsWith("www.")) {
    url.host = host.slice(4);
    changed = true;
  }

  if (proto === "http" || url.protocol === "http:") {
    url.protocol = "https:";
    changed = true;
  }

  if (changed) {
    url.protocol = "https:";
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
