import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { PROXY_EMAIL_HEADER, DEV_SESSION_COOKIE } from "./auth.js";
/**
 * Server-component auth gate. Call at the top of any page that requires auth.
 * Returns the authenticated email, or redirects to dev-login / home.
 */
export async function requireAuth(devLoginPath = "/dev-login") {
    const isDev = process.env.NODE_ENV !== "production";
    if (isDev) {
        const cookieStore = await cookies();
        const devCookie = cookieStore.get(DEV_SESSION_COOKIE);
        if (devCookie?.value)
            return devCookie.value;
        redirect(devLoginPath);
    }
    const headerStore = await headers();
    const email = headerStore.get(PROXY_EMAIL_HEADER);
    if (email)
        return email;
    redirect("/");
}
//# sourceMappingURL=gate.js.map