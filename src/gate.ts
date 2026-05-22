import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { PROXY_EMAIL_HEADERS, DEV_SESSION_COOKIE } from "./auth.js";

/**
 * Server-component auth gate. Call at the top of any page that requires auth.
 * Returns the authenticated email, or redirects to dev-login / home.
 */
export async function requireAuth(devLoginPath = "/dev-login"): Promise<string> {
  const isDev = process.env.NODE_ENV !== "production";

  if (isDev) {
    const cookieStore = await cookies();
    const devCookie = cookieStore.get(DEV_SESSION_COOKIE);
    if (devCookie?.value) return devCookie.value;
    redirect(devLoginPath);
  }

  const headerStore = await headers();
  for (const h of PROXY_EMAIL_HEADERS) {
    const email = headerStore.get(h);
    if (email) return email;
  }

  redirect("/");
}
