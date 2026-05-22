export interface DevLoginProps {
    /** Where to redirect after login. Defaults to "/" */
    redirectTo?: string;
    /** Preset users shown as quick-select buttons */
    presets?: Array<{
        label: string;
        email: string;
    }>;
    /** API route path for the dev login handler. Defaults to "/api/dev-login" */
    loginEndpoint?: string;
}
export default function DevLoginPage({ redirectTo, presets, loginEndpoint, }: DevLoginProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=dev-login-page.d.ts.map