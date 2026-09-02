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
  const [isTrainingLicence, setIsTrainingLicence] = useState(false);
  const [managerStatus, setManagerStatus] = useState<"pending" | "active" | null>(null);
  const [managerSetupUrl, setManagerSetupUrl] = useState<string | null>(null);
  const [managerLoginUrl, setManagerLoginUrl] = useState<string | null>(null);

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
          isTrainingLicence?: boolean;
          managerStatus?: "pending" | "active" | null;
          managerSetupUrl?: string | null;
          managerLoginUrl?: string | null;
        };
        if (!cancelled && response.ok && data.paid) {
          setConfirmed(true);
          setEmail(data.email ?? null);
          setIsTrainingLicence(Boolean(data.isTrainingLicence));
          setManagerStatus(data.managerStatus ?? null);
          setManagerSetupUrl(data.managerSetupUrl ?? null);
          setManagerLoginUrl(data.managerLoginUrl ?? null);
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

        {confirmed && isTrainingLicence ? (
          <div className="mt-4 space-y-4 text-left">
            <p className="text-center text-vt-muted">
              Your training licences are ready
              {email ? ` for ${email}` : ""}. Stripe will email your payment receipt separately.
            </p>
            <div className="rounded-2xl bg-vt-mist/70 p-5 ring-1 ring-vt-border">
              <p className="text-sm font-semibold text-vt-ink">Set up your manager account</p>
              <p className="mt-2 text-sm text-vt-muted">
                Create a password to assign employees and track training progress. Bookmark this page
                or complete setup now — you will need it to manage licences.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                {managerStatus === "pending" && managerSetupUrl ? (
                  <Button href={managerSetupUrl} className="w-full sm:w-auto">
                    Create manager password
                  </Button>
                ) : null}
                {managerStatus === "active" && managerLoginUrl ? (
                  <Button href={managerLoginUrl} className="w-full sm:w-auto">
                    Open manager portal
                  </Button>
                ) : null}
                {!managerSetupUrl && managerStatus !== "active" ? (
                  <Button href="/manager/login/" className="w-full sm:w-auto">
                    Continue to manager login
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-vt-muted">
            Your payment was processed securely by Stripe.
            {confirmed && email
              ? " Stripe will email your payment receipt separately."
              : ""}
          </p>
        )}

        {sessionId ? (
          <p className="mt-6 text-xs text-vt-muted">Order reference: {sessionId}</p>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button href="/training" variant={isTrainingLicence ? "ghost" : "primary"}>
            Continue shopping
          </Button>
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
