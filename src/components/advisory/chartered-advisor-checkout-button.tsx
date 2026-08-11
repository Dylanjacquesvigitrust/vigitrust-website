"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { withBasePath } from "@/lib/paths";
import { cn } from "@/lib/utils";

type Props = {
  children?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "ghost" | "white" | "soft" | "navy" | "header";
};

/** Starts a Stripe Checkout Session for the €599 Chartered Advisor annual membership. */
export function CharteredAdvisorCheckoutButton({
  children = "Become a Chartered Advisor",
  className,
  size = "md",
  variant = "primary",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(withBasePath("/api/checkout/chartered-advisor"), {
        method: "POST",
      });
      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Could not start checkout.");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className={cn(className?.includes("w-full") && "w-full")}>
      <Button
        type="button"
        size={size}
        variant={variant}
        className={className}
        disabled={loading}
        onClick={startCheckout}
      >
        {loading ? "Redirecting to Stripe…" : children}
      </Button>
      {error ? <p className="mt-2 text-center text-xs text-vt-red">{error}</p> : null}
    </div>
  );
}
