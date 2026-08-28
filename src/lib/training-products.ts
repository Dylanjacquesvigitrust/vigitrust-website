/**
 * Training licence products: one Stripe Price = one licence for one course.
 * Quantity on the Checkout line item = number of licences purchased.
 */
export type TrainingProduct = {
  slug: string;
  title: string;
  stripePriceId: string;
  reachCourseId: string;
};

const GDPR_REACH_COURSE_ID =
  process.env.REACH_COURSE_GDPR_FUNDAMENTALS ?? "6720ac09-68d9-404c-9204-e522ae19af3b";

const GDPR_STRIPE_PRICE =
  process.env.STRIPE_PRICE_GDPR_FUNDAMENTALS ?? "price_1U939NHa2NVkmBhF2xEAHTG4";

/** Licence-controlled courses — extend this map when adding new courses. */
export const TRAINING_PRODUCTS: TrainingProduct[] = [
  {
    slug: "gdpr-fundamentals",
    title: "GDPR Fundamentals",
    stripePriceId: GDPR_STRIPE_PRICE,
    reachCourseId: GDPR_REACH_COURSE_ID,
  },
];

const BY_SLUG = new Map(TRAINING_PRODUCTS.map((p) => [p.slug, p]));
const BY_PRICE_ID = new Map(TRAINING_PRODUCTS.map((p) => [p.stripePriceId, p]));

export function isTrainingLicenceSlug(slug: string): boolean {
  return BY_SLUG.has(slug);
}

export function getTrainingProductBySlug(slug: string): TrainingProduct | undefined {
  return BY_SLUG.get(slug);
}

export function getTrainingProductByStripePriceId(priceId: string): TrainingProduct | undefined {
  return BY_PRICE_ID.get(priceId);
}

export function buildReachGroupName(companyName: string | null | undefined, courseTitle: string): string {
  const company = companyName?.trim() || "Customer";
  return `${company} – ${courseTitle}`;
}
