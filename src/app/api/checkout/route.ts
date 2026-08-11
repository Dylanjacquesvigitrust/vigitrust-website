import { NextResponse } from "next/server";
import type Stripe from "stripe";
import {
  type CheckoutCustomer,
  type CheckoutLineItem,
  eurosToCents,
  validateCart,
} from "@/lib/checkout";
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

    const cart = validateCart(body.items);
    const stripe = getStripe();
    const siteUrl = getSiteUrl();

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cart.lines.map((line) => ({
      price_data: {
        currency: "eur",
        unit_amount: eurosToCents(line.unitPrice),
        product_data: {
          name: line.title,
          metadata: {
            slug: line.slug,
            module: line.module ?? "",
          },
        },
      },
      quantity: line.quantity,
    }));

    if (cart.vat > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          unit_amount: eurosToCents(cart.vat),
          product_data: {
            name: "VAT (23%)",
          },
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: body.customer.email.trim(),
      line_items: lineItems,
      success_url: `${siteUrl}/checkout/success/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/`,
      metadata: {
        customer_first_name: body.customer.firstName.trim(),
        customer_last_name: body.customer.lastName.trim(),
        customer_phone: body.customer.phone.trim(),
        customer_company: body.customer.company?.trim() ?? "",
        customer_country: body.customer.country.trim(),
        customer_address: body.customer.address.trim(),
        customer_city: body.customer.city.trim(),
        customer_county: body.customer.county?.trim() ?? "",
        customer_postcode: body.customer.postcode.trim(),
        cart_slugs: cart.lines.map((l) => l.slug).join(","),
        cart_summary: cart.lines.map((l) => `${l.slug}:${l.quantity}`).join("|"),
        subtotal_eur: String(cart.subtotal),
        vat_eur: String(cart.vat),
        total_eur: String(cart.total),
      },
      phone_number_collection: { enabled: false },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Could not start Stripe Checkout." }, { status: 500 });
    }

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed.";
    console.error("[checkout]", error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
