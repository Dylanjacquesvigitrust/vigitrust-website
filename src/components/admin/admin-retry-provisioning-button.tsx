"use client";

import { useState } from "react";
import { withBasePath } from "@/lib/paths";

export function AdminRetryProvisioningButton({ allocationId }: { allocationId: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onRetry() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(withBasePath("/api/admin/training/retry"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ allocationId }),
      });
      const data = (await res.json()) as {
        error?: string;
        provisioningStatus?: string;
        provisioningError?: string | null;
      };
      if (!res.ok) throw new Error(data.error ?? "Retry failed.");
      setMessage(
        data.provisioningError
          ? `Failed: ${data.provisioningError}`
          : `Status: ${data.provisioningStatus ?? "ok"}`,
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Retry failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => void onRetry()}
        disabled={loading}
        className="text-xs font-semibold text-vt-red hover:underline disabled:opacity-50"
      >
        {loading ? "Retrying…" : "Retry Reach"}
      </button>
      {message ? <p className="text-xs text-vt-muted">{message}</p> : null}
    </div>
  );
}
