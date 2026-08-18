"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
        body: JSON.stringify({ username, password }),
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
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <label className="block text-left">
        <span className="text-sm font-medium text-vt-ink">Username</span>
        <input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="mt-1.5 w-full rounded-lg border border-vt-border px-3 py-2 text-sm outline-none ring-vt-navy/20 focus:ring-2"
          autoComplete="username"
          required
        />
      </label>
      <label className="block text-left">
        <span className="text-sm font-medium text-vt-ink">Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
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
  );
}
