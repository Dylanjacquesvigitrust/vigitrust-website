"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { withBasePath } from "@/lib/paths";

function SetupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) {
      setError("Invalid setup link.");
      return;
    }
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirm") ?? "");
    if (password !== confirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(withBasePath("/api/manager/setup"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Setup failed.");
      router.push("/manager/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Setup failed.");
      setLoading(false);
    }
  }

  return (
    <section className="section-pad">
      <div className="container-vt max-w-md rounded-2xl bg-white p-8 ring-1 ring-vt-border">
        <p className="type-eyebrow text-vt-red">Manager portal</p>
        <h1 className="brand-display mt-2 text-2xl text-vt-ink">Set up your account</h1>
        <p className="mt-2 text-sm text-vt-muted">Create a password to manage your training licences.</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              className="w-full rounded-md bg-vt-mist px-3 py-2 ring-1 ring-vt-border"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="confirm">
              Confirm password
            </label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              required
              minLength={8}
              className="w-full rounded-md bg-vt-mist px-3 py-2 ring-1 ring-vt-border"
            />
          </div>
          {error ? <p className="text-sm text-vt-red">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={loading || !token}>
            {loading ? "Saving…" : "Create account"}
          </Button>
        </form>
      </div>
    </section>
  );
}

export default function ManagerSetupPage() {
  return (
    <Suspense fallback={<div className="section-pad text-center text-vt-muted">Loading…</div>}>
      <SetupForm />
    </Suspense>
  );
}
