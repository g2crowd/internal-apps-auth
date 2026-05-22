"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DEV_SESSION_COOKIE } from "../auth.js";
const DEFAULT_PRESETS = [
    { label: "Default dev user", email: "dev@g2.com" },
    { label: "Test user", email: "test@g2.com" },
    { label: "Admin user", email: "admin@g2.com" },
];
export default function DevLoginPage({ redirectTo = "/", presets = DEFAULT_PRESETS, loginEndpoint = "/api/dev-login", }) {
    const router = useRouter();
    const [email, setEmail] = useState(presets[0]?.email ?? "dev@g2.com");
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    async function handleLogin(e) {
        e.preventDefault();
        setError(null);
        setResult(null);
        const res = await fetch(loginEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) {
            setError(data.error ?? "Login failed");
            return;
        }
        setResult(data);
        setTimeout(() => router.push(redirectTo), 1500);
    }
    return (_jsxs("div", { className: "mx-auto max-w-lg space-y-6", children: [_jsxs("section", { className: "rounded-lg border border-zinc-800 bg-zinc-900 p-6", children: [_jsx("h1", { className: "text-xl font-semibold", children: "Dev Login" }), _jsxs("p", { className: "mt-2 text-sm text-zinc-400", children: ["In production, ", _jsx("code", { className: "text-zinc-300", children: "oauth2-proxy" }), " handles Google OAuth and sets the", " ", _jsx("code", { className: "text-zinc-300", children: "X-Auth-Request-Email" }), " header on every request. The app never sees credentials \u2014 only the verified email."] }), _jsxs("p", { className: "mt-2 text-sm text-zinc-400", children: ["This form simulates that flow by setting a", " ", _jsx("code", { className: "text-zinc-300", children: DEV_SESSION_COOKIE }), " cookie. The server reads the cookie and treats it like the proxy header."] })] }), _jsxs("section", { className: "rounded-lg border border-zinc-800 bg-zinc-900 p-6", children: [_jsx("h2", { className: "text-sm font-medium uppercase tracking-wide text-zinc-400", children: "Simulated proxy headers" }), _jsxs("form", { onSubmit: handleLogin, className: "mt-4 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "dev-email", className: "block text-sm font-medium text-zinc-300", children: "X-Auth-Request-Email" }), _jsx("input", { id: "dev-email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "mt-1 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500", placeholder: "you@example.com" })] }), _jsx("div", { className: "flex flex-wrap gap-2", children: presets.map((preset) => (_jsx("button", { type: "button", onClick: () => setEmail(preset.email), className: `rounded-md border px-3 py-1.5 text-xs transition ${email === preset.email
                                        ? "border-zinc-500 bg-zinc-700 text-zinc-100"
                                        : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"}`, children: preset.label }, preset.email))) }), _jsx("button", { type: "submit", className: "w-full rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200", children: "Set session cookie" })] })] }), error && (_jsx("section", { className: "rounded-lg border border-red-900/50 bg-red-950/30 p-4", children: _jsx("p", { className: "text-sm text-red-400", children: error }) })), result && (_jsxs("section", { className: "rounded-lg border border-zinc-800 bg-zinc-900 p-6", children: [_jsx("h2", { className: "text-sm font-medium uppercase tracking-wide text-zinc-400", children: "What happened" }), _jsx("pre", { className: "mt-3 overflow-x-auto rounded-md bg-zinc-950 p-4 text-xs text-zinc-300", children: JSON.stringify(result, null, 2) }), _jsx("p", { className: "mt-3 text-sm text-green-400", children: "Redirecting to dashboard\u2026" })] })), _jsxs("section", { className: "rounded-lg border border-dashed border-zinc-700 bg-zinc-900/50 p-6", children: [_jsx("h2", { className: "text-sm font-medium uppercase tracking-wide text-zinc-500", children: "Production flow (for reference)" }), _jsxs("ol", { className: "mt-3 space-y-2 text-sm text-zinc-500", children: [_jsxs("li", { children: [_jsx("span", { className: "font-mono text-zinc-400", children: "1." }), " Browser hits the app"] }), _jsxs("li", { children: [_jsx("span", { className: "font-mono text-zinc-400", children: "2." }), " Traefik", " ", _jsx("code", { className: "text-zinc-400", children: "forwardAuth" }), " calls oauth2-proxy"] }), _jsxs("li", { children: [_jsx("span", { className: "font-mono text-zinc-400", children: "3." }), " No valid", " ", _jsx("code", { className: "text-zinc-400", children: "_oauth2_proxy" }), " cookie \u2192 redirect to Google"] }), _jsxs("li", { children: [_jsx("span", { className: "font-mono text-zinc-400", children: "4." }), " Google authenticates \u2192 callback to", " ", _jsx("code", { className: "text-zinc-400", children: "auth.apps.g2.com/oauth2/callback" })] }), _jsxs("li", { children: [_jsx("span", { className: "font-mono text-zinc-400", children: "5." }), " oauth2-proxy sets encrypted cookie, redirects back"] }), _jsxs("li", { children: [_jsx("span", { className: "font-mono text-zinc-400", children: "6." }), " Next request: forwardAuth succeeds, proxy adds", " ", _jsx("code", { className: "text-zinc-400", children: "X-Auth-Request-Email" }), " header"] }), _jsxs("li", { children: [_jsx("span", { className: "font-mono text-zinc-400", children: "7." }), " App reads header \u2014 never sees cookies or credentials"] })] })] })] }));
}
//# sourceMappingURL=dev-login-page.js.map