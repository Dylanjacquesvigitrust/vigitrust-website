/**
 * Maps site course slugs to Stripe Price IDs.
 * Tax is calculated by Stripe Tax at checkout (not a flat VAT rate).
 *
 * Licence-controlled courses are defined in training-products.ts.
 */
import {
  getTrainingProductBySlug,
  TRAINING_PRODUCTS,
} from "@/lib/training-products";

export const STRIPE_PRODUCT_GDPR_FUNDAMENTALS =
  process.env.STRIPE_PRODUCT_GDPR_FUNDAMENTALS ?? "prod_V9LrFs3pewMJwz";

export const STRIPE_PRICE_GDPR_FUNDAMENTALS =
  process.env.STRIPE_PRICE_GDPR_FUNDAMENTALS ?? "price_1U939NHa2NVkmBhF2xEAHTG4";

const COURSE_PRICE_IDS: Record<string, string> = Object.fromEntries(
  TRAINING_PRODUCTS.map((p) => [p.slug, p.stripePriceId]),
);

export function getStripePriceIdForSlug(slug: string): string | undefined {
  return COURSE_PRICE_IDS[slug] ?? getTrainingProductBySlug(slug)?.stripePriceId;
}

export function usesStripeCatalogPrice(slug: string): boolean {
  return Boolean(getStripePriceIdForSlug(slug));
}

