import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { parseTrainingLineItems, provisionTrainingPurchase } from "@/lib/training-provision";

export const runtime = "nodejs";

/** Confirms a paid Checkout Session and idempotently provisions training licences. */
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

    const trainingLines = await parseTrainingLineItems(sessionId, session);
    const provision = await provisionTrainingPurchase(session);

    const email =
      session.customer_email ??
      session.customer_details?.email ??
      session.metadata?.customer_email ??
      null;

    return NextResponse.json({
      paid: true,
      email,
      amountTotal: session.amount_total != null ? session.amount_total / 100 : null,
      amountTax: session.total_details?.amount_tax != null ? session.total_details.amount_tax / 100 : null,
      currency: session.currency,
      isTrainingLicence: trainingLines.length > 0 || provision.processed,
      managerEmailSent: provision.managerEmailSent ?? false,
      managerEmailError: provision.managerEmailError ?? null,
    });
  } catch (error) {
    console.error("[checkout session] failed:", error);
    return NextResponse.json({ error: "Could not load checkout session." }, { status: 500 });
  }
}
