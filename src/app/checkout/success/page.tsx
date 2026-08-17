"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";

type RenewalCodePayload = {
  id: string;
  code: string;
  codeFormatted: string;
  status: string;
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clear } = useCart();
  const [renewalCode, setRenewalCode] = useState<RenewalCodePayload | null>(null);
  const [loadingCode, setLoadingCode] = useState(Boolean(sessionId));
  const [codeError, setCodeError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      clear();
    }
  }, [sessionId, clear]);

  const loadRenewalCode = useCallback(async () => {
    if (!sessionId) return;

    setLoadingCode(true);
    setCodeError(null);

    try {
      const response = await fetch(
        `/api/checkout/session?session_id=${encodeURIComponent(sessionId)}`,
      );
      const data = (await response.json()) as {
        renewalCode?: RenewalCodePayload;
        error?: string;
        pending?: boolean;
      };

      if (!response.ok) {
        setCodeError(data.error ?? "Could not load your renewal code.");
        return;
      }

      if (data.renewalCode) {
        setRenewalCode(data.renewalCode);
      }
    } catch {
      setCodeError("Could not load your renewal code.");
    } finally {
      setLoadingCode(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;
    void loadRenewalCode();
  }, [sessionId, loadRenewalCode]);

  useEffect(() => {
    if (!sessionId || renewalCode) return;

    const retryTimer = window.setInterval(() => {
      void loadRenewalCode();
    }, 4000);

    return () => window.clearInterval(retryTimer);
  }, [sessionId, renewalCode, loadRenewalCode]);

  async function copyCode() {
    if (!renewalCode) return;
    try {
      await navigator.clipboard.writeText(renewalCode.code);
    } catch {
      // Clipboard may be unavailable in some browsers.
    }
  }

  return (
    <section className="section-pad">
      <div className="container-vt max-w-xl rounded-2xl bg-white p-8 text-center ring-1 ring-vt-border sm:p-12">
        <p className="type-eyebrow text-vt-red">Payment complete</p>
        <h1 className="brand-display mt-3 text-3xl text-vt-ink">Thank you for your order</h1>
        <p className="mt-3 text-vt-muted">
          Your payment was processed securely by Stripe. Use the renewal code below on the
          VigiTrust platform to activate your access.
        </p>

        {sessionId ? (
          <div className="mt-8 rounded-xl bg-vt-mist p-6 text-left ring-1 ring-vt-border">
            <p className="text-xs font-semibold uppercase tracking-wider text-vt-muted">
              Your renewal code
            </p>
            {loadingCode && !renewalCode ? (
              <p className="mt-3 text-sm text-vt-muted">Generating your code…</p>
            ) : renewalCode ? (
              <>
                <p className="brand-display mt-3 text-2xl tracking-[0.12em] text-vt-navy sm:text-3xl">
                  {renewalCode.codeFormatted}
                </p>
                <p className="mt-2 text-xs text-vt-muted">
                  Save this code — you will need it to complete setup on the other platform.
                </p>
                <button
                  type="button"
                  onClick={() => void copyCode()}
                  className="mt-4 text-sm font-semibold text-vt-red hover:underline"
                >
                  Copy code
                </button>
              </>
            ) : (
              <>
                <p className="mt-3 text-sm text-vt-muted">
                  {codeError ?? "Your code is still being prepared."}
                </p>
                <button
                  type="button"
                  onClick={() => void loadRenewalCode()}
                  className="mt-3 text-sm font-semibold text-vt-red hover:underline"
                >
                  Refresh
                </button>
              </>
            )}
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button href="/training">Continue shopping</Button>
          <Button href="/" variant="ghost">
            Back home
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <section className="section-pad">
          <div className="container-vt max-w-xl text-center text-vt-muted">Loading…</div>
        </section>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
