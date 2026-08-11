"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clear } = useCart();

  useEffect(() => {
    if (sessionId) {
      clear();
    }
  }, [sessionId, clear]);

  return (
    <section className="section-pad">
      <div className="container-vt max-w-xl rounded-2xl bg-white p-8 text-center ring-1 ring-vt-border sm:p-12">
        <p className="type-eyebrow text-vt-red">Payment complete</p>
        <h1 className="brand-display mt-3 text-3xl text-vt-ink">Thank you for your order</h1>
        <p className="mt-3 text-vt-muted">
          Your payment was processed securely by Stripe. You will receive a confirmation email shortly
          with next steps for course access.
        </p>
        {sessionId ? (
          <p className="mt-4 text-xs text-vt-muted">Reference: {sessionId}</p>
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
