/**
 * Server-component auth gate. Call at the top of any page that requires auth.
 * Returns the authenticated email, or redirects to dev-login / home.
 */
export declare function requireAuth(devLoginPath?: string): Promise<string>;
//# sourceMappingURL=gate.d.ts.map