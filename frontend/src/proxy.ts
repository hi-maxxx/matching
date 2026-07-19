import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ログインが必須のパスをここに追加していく
const PUBLIC_PATHS = ["/login", "/register"];

export default function proxy(request: NextRequest) {
  console.log("proxy 実行", request.nextUrl.pathname);
  const token = request.cookies.get("access_token");
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  if(!token && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if(token && isPublic) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
