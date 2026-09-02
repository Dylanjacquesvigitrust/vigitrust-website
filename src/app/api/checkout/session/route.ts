import { NextResponse } from "next/server";
import { resolveOrderLines, totalOrderQuantity } from "@/lib/email";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

/** Confirms a paid Checkout Session for the success page. */
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

    const lines = await resolveOrderLines({
      cartSummary: session.metadata?.cart_summary,
      cartSlugs: session.metadata?.cart_slugs,
    });
    const totalQty = totalOrderQuantity(lines);

    return NextResponse.json({
      paid: true,
      email: session.customer_email ?? session.customer_details?.email ?? null,
      amountTotal: session.amount_total != null ? session.amount_total / 100 : null,
      amountTax: session.total_details?.amount_tax != null ? session.total_details.amount_tax / 100 : null,
      currency: session.currency,
      isBulkOrder: totalQty > 1,
    });
  } catch (error) {
    console.error("[checkout session] failed:", error);
    return NextResponse.json({ error: "Could not load checkout session." }, { status: 500 });
  }
}
