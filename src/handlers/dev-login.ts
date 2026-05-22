import { NextResponse } from "next/server";
import { DEV_SESSION_COOKIE } from "../auth.js";

export async function devLoginHandler(request: Request): Promise<NextResponse> {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "not available in production" }, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as {
    email?: string;
  } | null;

  const email = body?.email?.trim();
  if (!email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  const response = NextResponse.json({
    ok: true,
    email,
    explanation: {
      what_happened: `Set cookie "${DEV_SESSION_COOKIE}" = "${email}"`,
      production_equivalent:
        "oauth2-proxy sets an encrypted _oauth2_proxy cookie, " +
        "then forwards X-Auth-Request-Email header to the app. " +
        "The app never sees the raw cookie — only the header.",
    },
  });

  response.cookies.set({
    name: DEV_SESSION_COOKIE,
    value: email,
    httpOnly: false,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}

export async function devLogoutHandler(request: Request): Promise<NextResponse> {
  const isDev = process.env.NODE_ENV !== "production";

  if (isDev) {
    const response = NextResponse.redirect(new URL("/dev-login", request.url), 303);
    response.cookies.set({
      name: DEV_SESSION_COOKIE,
      value: "",
      path: "/",
      expires: new Date(0),
    });
    return response;
  }

  const host = request.headers.get("x-forwarded-host") ?? new URL(request.url).host;
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  return NextResponse.redirect(`${proto}://${host}/oauth2/sign_out`, 303);
}
