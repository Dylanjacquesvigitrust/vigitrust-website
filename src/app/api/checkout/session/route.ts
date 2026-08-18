import { NextResponse } from "next/server";
import {
  createRenewalCodeFromCheckoutSession,
  getRenewalCodeByCheckoutSessionId,
  serializeRenewalCode,
} from "@/lib/renewal-codes";
import { isDatabaseConfigured } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id")?.trim();

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id." }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed." }, { status: 403 });
    }

    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Renewal codes are not configured." }, { status: 503 });
    }

    let record = await getRenewalCodeByCheckoutSessionId(sessionId);

    // Fallback if the webhook was delayed or failed — idempotent create.
    if (!record) {
      try {
        record = await createRenewalCodeFromCheckoutSession(session);
      } catch (error) {
        console.error("[checkout session] renewal code create failed:", error);
        return NextResponse.json(
          {
            error: "Renewal code not found yet. It may take a moment after payment.",
            pending: true,
          },
          { status: 404 },
        );
      }
    }

    return NextResponse.json({
      renewalCode: serializeRenewalCode(record),
      email: session.customer_email ?? session.customer_details?.email ?? null,
    });
  } catch (error) {
    console.error("[checkout session] failed:", error);
    return NextResponse.json({ error: "Could not load checkout session." }, { status: 500 });
  }
}
