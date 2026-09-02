"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { withBasePath } from "@/lib/paths";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clear } = useCart();
  const [confirmed, setConfirmed] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [isBulkOrder, setIsBulkOrder] = useState(false);

  useEffect(() => {
    if (sessionId) {
      clear();
    }
  }, [sessionId, clear]);

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;

    async function confirmPayment() {
      try {
        const response = await fetch(
          withBasePath(`/api/checkout/session?session_id=${encodeURIComponent(sessionId!)}`),
        );
        const data = (await response.json()) as {
          paid?: boolean;
          email?: string | null;
          isBulkOrder?: boolean;
        };
        if (!cancelled && response.ok && data.paid) {
          setConfirmed(true);
          setEmail(data.email ?? null);
          setIsBulkOrder(Boolean(data.isBulkOrder));
        }
      } catch {
        // Success page still shows a thank-you even if confirmation fetch fails.
      }
    }

    void confirmPayment();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <section className="section-pad">
      <div className="container-vt max-w-xl rounded-2xl bg-white p-8 text-center ring-1 ring-vt-border sm:p-12">
        <p className="type-eyebrow text-vt-red">Payment complete</p>
        <h1 className="brand-display mt-3 text-3xl text-vt-ink">Thank you for your order</h1>
        <p className="mt-3 text-vt-muted">
          Your payment was processed securely by Stripe.
          {confirmed && isBulkOrder
            ? " A member of the VigiTrust team will be in touch shortly to provide your course access and walk you through how to get started."
            : confirmed && email
              ? ` We have sent your course access link to ${email}. Please check your inbox (and spam folder).`
              : ""}
        </p>

        {sessionId ? (
          <p className="mt-6 text-xs text-vt-muted">Order reference: {sessionId}</p>
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
