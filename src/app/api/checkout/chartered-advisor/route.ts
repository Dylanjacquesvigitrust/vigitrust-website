import { NextResponse } from "next/server";
import { eurosToCents } from "@/lib/checkout";
import { getSiteUrl, getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

/** Annual Chartered Advisor membership — matches Advisory Board pricing. */
export const CHARTERED_ADVISOR_PRICE_EUR = 599;

export async function POST() {
  try {
    const stripe = getStripe();
    const siteUrl = getSiteUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: eurosToCents(CHARTERED_ADVISOR_PRICE_EUR),
            tax_behavior: "exclusive",
            product_data: {
              name: "Chartered Advisor Membership",
              description:
                "Annual VigiTrust Global Advisory Board membership — summit access, webinars, roundtables, and peer network.",
              tax_code: "txcd_10000000",
            },
          },
          quantity: 1,
        },
      ],
      automatic_tax: { enabled: true },
      billing_address_collection: "required",
      tax_id_collection: { enabled: true },
      customer_creation: "always",
      success_url: `${siteUrl}/checkout/success/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/advisory-board/#membership`,
      metadata: {
        product: "chartered-advisor",
        product_name: "Chartered Advisor Membership",
        amount_eur: String(CHARTERED_ADVISOR_PRICE_EUR),
        period: "annual",
        tax: "stripe_tax",
      },
      allow_promotion_codes: true,
    });

    if (!session.url) {
      return NextResponse.json({ error: "Could not start Stripe Checkout." }, { status: 500 });
    }

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed.";
    console.error("[chartered-advisor checkout]", error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
