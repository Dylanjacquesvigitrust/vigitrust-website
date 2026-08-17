"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Login failed.");
        return;
      }

      router.push("/admin/renewal-codes");
      router.refresh();
    } catch {
      setError("Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section-pad">
      <div className="container-vt max-w-md rounded-2xl bg-white p-8 ring-1 ring-vt-border">
        <p className="type-eyebrow text-vt-red">Admin</p>
        <h1 className="brand-display mt-2 text-2xl text-vt-ink">Renewal codes</h1>
        <p className="mt-2 text-sm text-vt-muted">Enter your admin access token to continue.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block text-left">
            <span className="text-sm font-medium text-vt-ink">Access token</span>
            <input
              type="password"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              className="mt-1.5 w-full rounded-lg border border-vt-border px-3 py-2 text-sm outline-none ring-vt-navy/20 focus:ring-2"
              autoComplete="current-password"
              required
            />
          </label>
          {error ? <p className="text-sm text-vt-red">{error}</p> : null}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </section>
  );
}
