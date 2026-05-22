export const PROXY_EMAIL_HEADER = "x-auth-request-email";
export const DEV_SESSION_COOKIE = "g2_dev_session";
function isDev() {
    return process.env.NODE_ENV !== "production";
}
function getEmailFromProxy(request) {
    return request.headers.get(PROXY_EMAIL_HEADER) ?? null;
}
function getDevCookieEmail(request) {
    const cookieHeader = request.headers.get("cookie") ?? "";
    const match = cookieHeader.match(new RegExp(`${DEV_SESSION_COOKIE}=([^;]+)`));
    if (!match)
        return null;
    return decodeURIComponent(match[1]);
}
/**
 * Get the authenticated user from the request.
 *
 * Production: reads X-Auth-Request-Email header set by oauth2-proxy.
 * Dev: reads the dev session cookie (set via the dev login form).
 * Returns null if no session is found.
 */
export function getSession(request) {
    if (isDev()) {
        const email = getDevCookieEmail(request);
        if (!email)
            return null;
        return { email };
    }
    const email = getEmailFromProxy(request);
    if (!email)
        return null;
    return { email };
}
/**
 * Authenticate API requests. Checks (in order):
 * 1. Dev cookie (non-production)
 * 2. Proxy header (browser requests via oauth2-proxy)
 * 3. Bearer token (if verifyToken provided)
 */
export async function getApiAuth(request, config) {
    if (isDev()) {
        const email = getDevCookieEmail(request);
        if (email)
            return { email };
    }
    const proxyEmail = getEmailFromProxy(request);
    if (proxyEmail)
        return { email: proxyEmail };
    if (config?.verifyToken) {
        const authHeader = request.headers.get("authorization");
        if (authHeader?.startsWith("Bearer ")) {
            const token = authHeader.slice(7);
            const email = await config.verifyToken(token);
            if (email)
                return { email };
        }
    }
    return null;
}
//# sourceMappingURL=auth.js.map