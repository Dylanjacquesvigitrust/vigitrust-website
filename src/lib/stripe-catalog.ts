/**
 * Maps site course slugs to Stripe Price IDs and learner access links.
 * Tax is calculated by Stripe Tax at checkout (not a flat VAT rate).
 */
export const STRIPE_PRODUCT_GDPR_FUNDAMENTALS =
  process.env.STRIPE_PRODUCT_GDPR_FUNDAMENTALS ?? "prod_V9LrFs3pewMJwz";

export const STRIPE_PRICE_GDPR_FUNDAMENTALS =
  process.env.STRIPE_PRICE_GDPR_FUNDAMENTALS ?? "price_1U939NHa2NVkmBhF2xEAHTG4";

const COURSE_PRICE_IDS: Record<string, string> = {
  "gdpr-fundamentals": STRIPE_PRICE_GDPR_FUNDAMENTALS,
};

/** Reach360 (or other LMS) share links sent after purchase. */
export const COURSE_ACCESS_LINKS: Record<string, { title: string; url: string }> = {
  "gdpr-fundamentals": {
    title: "GDPR Fundamentals",
    url:
      process.env.COURSE_LINK_GDPR_FUNDAMENTALS ??
      "https://vigitrust-9067.reach360.com/share/course/6720ac09-68d9-404c-9204-e522ae19af3b",
  },
};

export function getStripePriceIdForSlug(slug: string): string | undefined {
  return COURSE_PRICE_IDS[slug];
}

export function usesStripeCatalogPrice(slug: string): boolean {
  return Boolean(getStripePriceIdForSlug(slug));
}

export function getCourseAccessForSlug(slug: string) {
  return COURSE_ACCESS_LINKS[slug];
}
