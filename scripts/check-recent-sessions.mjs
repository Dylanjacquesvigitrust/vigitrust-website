import { readFileSync } from "fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, "")];
    }),
);

const key = env.STRIPE_SECRET_KEY;
async function stripe(path) {
  const res = await fetch("https://api.stripe.com/v1" + path, {
    headers: { Authorization: "Bearer " + key },
  });
  return res.json();
}

const sessions = await stripe("/checkout/sessions?limit=5");
for (const s of sessions.data || []) {
  console.log(
    JSON.stringify(
      {
        id: s.id,
        status: s.status,
        payment_status: s.payment_status,
        customer_email: s.customer_email,
        customer_details_email: s.customer_details?.email,
        customer: s.customer,
        metadata: s.metadata,
        amount_total: s.amount_total,
        created: new Date(s.created * 1000).toISOString(),
      },
      null,
      2,
    ),
  );
}
