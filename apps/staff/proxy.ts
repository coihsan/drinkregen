import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getSessionCookie } from "better-auth/cookies";
import { LOGIN_PATH, POST_LOGIN_PATH, STAFF_PREFIX } from "./types/path.types";

const SESSION_COOKIE = "better-auth.session_token";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  const { pathname } = request.nextUrl;

  if (!pathname.startsWith(STAFF_PREFIX)) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);

  const isLoginPage = pathname === LOGIN_PATH;

  if (!sessionCookie) {
    if (isLoginPage) return NextResponse.next();
    return redirectToLogin(request);
  }

  const sessionRes = await fetch(
    new URL("/api/auth/get-session", request.url),
    {
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
    },
  );

  if (!sessionRes.ok) {
    return redirectToLogin(request);
  }

  const sessionData = await sessionRes.json();
  const role: string | undefined = sessionData?.user?.role;

  if (!role || role === "STAFF") {
    const response = redirectToLogin(request);
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  if (isLoginPage) {
    return NextResponse.redirect(new URL(POST_LOGIN_PATH, request.url));
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL(LOGIN_PATH, request.url);
  loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/staff",
    "/staff/create-new",
    "/staff/settings",
    "/admin",
    "/activity-logs",
    "/settings",
    "/info",
    "/division"
  ],
};
