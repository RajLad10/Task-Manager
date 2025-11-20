import { NextResponse } from "next/server";
import { getAuth } from "@/lib/firebaseAdmin";

export async function middleware(req) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  const sessionCookie = req.cookies.get("app_session")?.value;

  const protectedRoutes = [
    "/dashboard",
    "/projects",
    "/tasks"
  ];

  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isProtected && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (sessionCookie) {
    try {
      const auth = getAuth();
      await auth.verifySessionCookie(sessionCookie, true);

      if (isAuthPage) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      return NextResponse.next();
    } catch (error) {
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.set({
        name: "app_session",
        value: "",
        maxAge: 0,
      });
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/tasks/:path*",
    "/login",
    "/register"
  ],
  runtime: "nodejs"
};
