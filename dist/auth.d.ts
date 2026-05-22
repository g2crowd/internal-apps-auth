export declare const PROXY_EMAIL_HEADERS: readonly ["x-authentik-email", "x-auth-request-email"];
export declare const PROXY_EMAIL_HEADER: "x-authentik-email";
export declare const DEV_SESSION_COOKIE = "g2_dev_session";
export interface Session {
    email: string;
}
export interface AuthConfig {
    /**
     * Verify a Bearer token and return the associated email.
     * If your app doesn't use API tokens, omit this.
     */
    verifyToken?: (token: string) => Promise<string | null>;
}
/**
 * Get the authenticated user from the request.
 *
 * Production: reads X-Auth-Request-Email header set by oauth2-proxy.
 * Dev: reads the dev session cookie (set via the dev login form).
 * Returns null if no session is found.
 */
export declare function getSession(request: Request): Session | null;
/**
 * Authenticate API requests. Checks (in order):
 * 1. Dev cookie (non-production)
 * 2. Proxy header (browser requests via oauth2-proxy)
 * 3. Bearer token (if verifyToken provided)
 */
export declare function getApiAuth(request: Request, config?: AuthConfig): Promise<Session | null>;
//# sourceMappingURL=auth.d.ts.map