"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { withBasePath } from "@/lib/paths";

export default function ManagerLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
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

  async function onResendSetup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResendLoading(true);
    setError(null);
    setSuccess(null);
    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch(withBasePath("/api/manager/resend-setup"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("resendEmail") }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to resend setup email.");
      setSuccess("Setup email sent. Check your inbox and spam folder.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend setup email.");
    } finally {
      setResendLoading(false);
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
          {success ? <p className="text-sm text-green-700">{success}</p> : null}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <div className="mt-8 border-t border-vt-border pt-6">
          <h2 className="text-sm font-semibold text-vt-ink">First time here?</h2>
          <p className="mt-1 text-sm text-vt-muted">
            After purchasing training licences, you should receive a setup email. If it did not arrive,
            request a new one below.
          </p>
          <form className="mt-4 space-y-3" onSubmit={onResendSetup}>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="resendEmail">
                Purchase email
              </label>
              <input
                id="resendEmail"
                name="resendEmail"
                type="email"
                required
                className="w-full rounded-md bg-vt-mist px-3 py-2 ring-1 ring-vt-border"
              />
            </div>
            <Button type="submit" variant="ghost" className="w-full" disabled={resendLoading}>
              {resendLoading ? "Sending…" : "Resend setup email"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
