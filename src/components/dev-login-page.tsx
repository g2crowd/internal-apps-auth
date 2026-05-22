"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DEV_SESSION_COOKIE } from "../auth.js";

export interface DevLoginProps {
  /** Where to redirect after login. Defaults to "/" */
  redirectTo?: string;
  /** Preset users shown as quick-select buttons */
  presets?: Array<{ label: string; email: string }>;
  /** API route path for the dev login handler. Defaults to "/api/dev-login" */
  loginEndpoint?: string;
}

const DEFAULT_PRESETS = [
  { label: "Default dev user", email: "dev@g2.com" },
  { label: "Test user", email: "test@g2.com" },
  { label: "Admin user", email: "admin@g2.com" },
];

export default function DevLoginPage({
  redirectTo = "/",
  presets = DEFAULT_PRESETS,
  loginEndpoint = "/api/dev-login",
}: DevLoginProps) {
  const router = useRouter();
  const [email, setEmail] = useState(presets[0]?.email ?? "dev@g2.com");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
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

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        <h1 className="text-xl font-semibold">Dev Login</h1>
        <p className="mt-2 text-sm text-zinc-400">
          In production, <code className="text-zinc-300">oauth2-proxy</code> handles
          Google OAuth and sets the{" "}
          <code className="text-zinc-300">X-Auth-Request-Email</code> header on
          every request. The app never sees credentials — only the verified email.
        </p>
        <p className="mt-2 text-sm text-zinc-400">
          This form simulates that flow by setting a{" "}
          <code className="text-zinc-300">{DEV_SESSION_COOKIE}</code> cookie. The
          server reads the cookie and treats it like the proxy header.
        </p>
      </section>

      <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-400">
          Simulated proxy headers
        </h2>

        <form onSubmit={handleLogin} className="mt-4 space-y-4">
          <div>
            <label htmlFor="dev-email" className="block text-sm font-medium text-zinc-300">
              X-Auth-Request-Email
            </label>
            <input
              id="dev-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              placeholder="you@example.com"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.email}
                type="button"
                onClick={() => setEmail(preset.email)}
                className={`rounded-md border px-3 py-1.5 text-xs transition ${
                  email === preset.email
                    ? "border-zinc-500 bg-zinc-700 text-zinc-100"
                    : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200"
          >
            Set session cookie
          </button>
        </form>
      </section>

      {error && (
        <section className="rounded-lg border border-red-900/50 bg-red-950/30 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </section>
      )}

      {result && (
        <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-400">
            What happened
          </h2>
          <pre className="mt-3 overflow-x-auto rounded-md bg-zinc-950 p-4 text-xs text-zinc-300">
            {JSON.stringify(result, null, 2)}
          </pre>
          <p className="mt-3 text-sm text-green-400">
            Redirecting to dashboard…
          </p>
        </section>
      )}

      <section className="rounded-lg border border-dashed border-zinc-700 bg-zinc-900/50 p-6">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
          Production flow (for reference)
        </h2>
        <ol className="mt-3 space-y-2 text-sm text-zinc-500">
          <li>
            <span className="font-mono text-zinc-400">1.</span> Browser hits the app
          </li>
          <li>
            <span className="font-mono text-zinc-400">2.</span> Traefik{" "}
            <code className="text-zinc-400">forwardAuth</code> calls oauth2-proxy
          </li>
          <li>
            <span className="font-mono text-zinc-400">3.</span> No valid{" "}
            <code className="text-zinc-400">_oauth2_proxy</code> cookie → redirect
            to Google
          </li>
          <li>
            <span className="font-mono text-zinc-400">4.</span> Google authenticates
            → callback to{" "}
            <code className="text-zinc-400">auth.apps.g2.com/oauth2/callback</code>
          </li>
          <li>
            <span className="font-mono text-zinc-400">5.</span> oauth2-proxy sets
            encrypted cookie, redirects back
          </li>
          <li>
            <span className="font-mono text-zinc-400">6.</span> Next request:
            forwardAuth succeeds, proxy adds{" "}
            <code className="text-zinc-400">X-Auth-Request-Email</code> header
          </li>
          <li>
            <span className="font-mono text-zinc-400">7.</span> App reads header —
            never sees cookies or credentials
          </li>
        </ol>
      </section>
    </div>
  );
}
