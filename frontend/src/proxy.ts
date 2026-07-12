import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ログインが必須のパスをここに追加していく
const PROTECTED_PATHS = ["/profile", "/matching", "/chat"];

export default function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token");
  const isProtected = PROTECTED_PATHS.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/matching/:path*", "/chat/:path*"],
};
