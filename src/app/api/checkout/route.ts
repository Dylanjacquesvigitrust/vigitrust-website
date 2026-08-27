import { NextResponse } from "next/server";
import type Stripe from "stripe";
import {
  type CheckoutCustomer,
  type CheckoutLineItem,
  eurosToCents,
  validateCart,
} from "@/lib/checkout";
import { toStripeCountryCode } from "@/lib/countries";
import { getSiteUrl, getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

type CheckoutBody = {
  items: CheckoutLineItem[];
  customer: CheckoutCustomer;
};

function isCustomer(value: unknown): value is CheckoutCustomer {
  if (!value || typeof value !== "object") return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c.email === "string" &&
    typeof c.phone === "string" &&
    typeof c.firstName === "string" &&
    typeof c.lastName === "string" &&
    typeof c.country === "string" &&
    typeof c.address === "string" &&
    typeof c.city === "string" &&
    typeof c.postcode === "string"
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutBody;

    if (!Array.isArray(body.items) || !isCustomer(body.customer)) {
      return NextResponse.json({ error: "Invalid checkout payload." }, { status: 400 });
    }

    const country = toStripeCountryCode(body.customer.country);
    if (!country) {
      return NextResponse.json(
        { error: "Please select a valid billing country." },
        { status: 400 },
      );
    }

    const cart = await validateCart(body.items);
    const stripe = getStripe();
    const siteUrl = getSiteUrl();

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cart.lines.map((line) => {
      if (line.stripePriceId) {
        return {
          price: line.stripePriceId,
          quantity: line.quantity,
        };
      }

      return {
        price_data: {
          currency: "eur",
          unit_amount: eurosToCents(line.unitPrice),
          tax_behavior: "exclusive",
          product_data: {
            name: line.title,
            tax_code: "txcd_10000000",
            metadata: {
              slug: line.slug,
              module: line.module ?? "",
            },
          },
        },
        quantity: line.quantity,
      };
    });

    // Prefill a Customer so Stripe Tax has a real address (metadata alone is ignored).
    const customer = await stripe.customers.create({
      email: body.customer.email.trim(),
      name: `${body.customer.firstName.trim()} ${body.customer.lastName.trim()}`.trim(),
      phone: body.customer.phone.trim() || undefined,
      address: {
        line1: body.customer.address.trim(),
        city: body.customer.city.trim(),
        state: body.customer.county?.trim() || undefined,
        postal_code: body.customer.postcode.trim(),
        country,
      },
      metadata: {
        company: body.customer.company?.trim() ?? "",
      },
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customer.id,
      customer_update: {
        address: "auto",
        name: "auto",
      },
      line_items: lineItems,
      automatic_tax: { enabled: true },
      billing_address_collection: "required",
      tax_id_collection: { enabled: true },
      success_url: `${siteUrl}/checkout/success/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/`,
      metadata: {
        customer_first_name: body.customer.firstName.trim(),
        customer_last_name: body.customer.lastName.trim(),
        customer_phone: body.customer.phone.trim(),
        customer_company: body.customer.company?.trim() ?? "",
        customer_country: country,
        customer_address: body.customer.address.trim(),
        customer_city: body.customer.city.trim(),
        customer_county: body.customer.county?.trim() ?? "",
        customer_postcode: body.customer.postcode.trim(),
        cart_slugs: cart.lines.map((l) => l.slug).join(","),
        cart_summary: cart.lines.map((l) => `${l.slug}:${l.quantity}`).join("|"),
        subtotal_eur: String(cart.subtotal),
        tax: "stripe_tax",
      },
      phone_number_collection: { enabled: false },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Could not start Stripe Checkout." }, { status: 500 });
    }

    console.info("[checkout] session created", {
      sessionId: session.id,
      automaticTax: session.automatic_tax,
      amountTax: session.total_details?.amount_tax,
      amountTotal: session.amount_total,
      country,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed.";
    console.error("[checkout]", error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
