"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { withBasePath } from "@/lib/paths";

export default function ManagerLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [setupUrl, setSetupUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recoverLoading, setRecoverLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSetupUrl(null);
    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch(withBasePath("/api/manager/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Login failed.");
      router.push("/manager/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
      setLoading(false);
    }
  }

  async function onRecoverSetup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setRecoverLoading(true);
    setError(null);
    setSetupUrl(null);
    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch(withBasePath("/api/manager/resend-setup"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("recoverEmail") }),
      });
      const data = (await res.json()) as {
        error?: string;
        setupUrl?: string;
        alreadyActive?: boolean;
      };
      if (!res.ok) throw new Error(data.error ?? "Could not find setup link.");
      setSetupUrl(data.setupUrl ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not find setup link.");
    } finally {
      setRecoverLoading(false);
    }
  }

  return (
    <section className="section-pad">
      <div className="container-vt max-w-md rounded-2xl bg-white p-8 ring-1 ring-vt-border">
        <p className="type-eyebrow text-vt-red">Manager portal</p>
        <h1 className="brand-display mt-2 text-2xl text-vt-ink">Sign in</h1>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-md bg-vt-mist px-3 py-2 ring-1 ring-vt-border"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-md bg-vt-mist px-3 py-2 ring-1 ring-vt-border"
            />
          </div>
          {error ? <p className="text-sm text-vt-red">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <div className="mt-8 border-t border-vt-border pt-6">
          <h2 className="text-sm font-semibold text-vt-ink">Need to create a password?</h2>
          <p className="mt-1 text-sm text-vt-muted">
            Enter the email used at checkout to open your on-site account setup link.
          </p>
          <form className="mt-4 space-y-3" onSubmit={onRecoverSetup}>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="recoverEmail">
                Purchase email
              </label>
              <input
                id="recoverEmail"
                name="recoverEmail"
                type="email"
                required
                className="w-full rounded-md bg-vt-mist px-3 py-2 ring-1 ring-vt-border"
              />
            </div>
            <Button type="submit" variant="ghost" className="w-full" disabled={recoverLoading}>
              {recoverLoading ? "Looking up…" : "Get setup link"}
            </Button>
          </form>
          {setupUrl ? (
            <div className="mt-4 rounded-lg bg-vt-mist/70 p-3 text-sm">
              <p className="font-semibold text-vt-ink">Your setup link is ready</p>
              <a href={setupUrl} className="mt-2 block break-all font-semibold text-vt-red hover:underline">
                {setupUrl}
              </a>
              <div className="mt-3">
                <Button href={setupUrl} className="w-full">
                  Create password
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
