import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { sendCourseAccessEmail } from "@/lib/email";
import { getStripe } from "@/lib/stripe";
import { provisionTrainingPurchase } from "@/lib/training-provision";

export const runtime = "nodejs";

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const email = session.customer_email ?? session.customer_details?.email ?? null;
  const amount = session.amount_total != null ? session.amount_total / 100 : null;
  const tax = session.total_details?.amount_tax != null ? session.total_details.amount_tax / 100 : null;

  console.info("[stripe webhook] checkout.session.completed", {
    sessionId: session.id,
    email,
    amountEur: amount,
    taxEur: tax,
    paymentStatus: session.payment_status,
  });

  if (session.payment_status !== "paid") {
    return;
  }

  const training = await provisionTrainingPurchase(session);

  if (training.processed) {
    console.info("[stripe webhook] training licences provisioned", {
      sessionId: session.id,
      purchaseId: training.purchaseId,
    });
    return;
  }

  const cartSlugs = session.metadata?.cart_slugs ?? "";
  if (!cartSlugs || !email) return;

  const result = await sendCourseAccessEmail({
    to: email,
    firstName: session.metadata?.customer_first_name,
    cartSlugs,
    orderRef: session.id,
  });

  if (!result.sent) {
    console.warn("[stripe webhook] course email not sent:", result.reason);
  }
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[stripe webhook] STRIPE_WEBHOOK_SECRET is not configured.");
    return NextResponse.json({ error: "Webhook secret not configured." }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid webhook signature.";
    console.error("[stripe webhook] signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }
      default:
        console.info("[stripe webhook] unhandled event:", event.type);
    }
  } catch (error) {
    console.error("[stripe webhook] handler error:", error);
    return NextResponse.json({ error: "Webhook handler failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
