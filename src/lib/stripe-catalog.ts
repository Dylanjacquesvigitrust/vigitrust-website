/**
 * Maps site course slugs to Stripe Price IDs.
 * Tax is calculated by Stripe Tax at checkout (not a flat VAT rate).
 */
export const STRIPE_PRODUCT_GDPR_FUNDAMENTALS =
  process.env.STRIPE_PRODUCT_GDPR_FUNDAMENTALS ?? "prod_V9LrFs3pewMJwz";

export const STRIPE_PRICE_GDPR_FUNDAMENTALS =
  process.env.STRIPE_PRICE_GDPR_FUNDAMENTALS ?? "price_1U939NHa2NVkmBhF2xEAHTG4";

export const STRIPE_PRODUCT_PCI_INTRO =
  process.env.STRIPE_PRODUCT_PCI_INTRO ?? "prod_VBeS2GKAaC3eGm";

export const STRIPE_PRICE_PCI_INTRO =
  process.env.STRIPE_PRICE_PCI_INTRO ?? "price_1UBHA3Ha2NVkmBhFs8E9Eirq";

export const STRIPE_PRODUCT_PCI_DSS_INTRO =
  process.env.STRIPE_PRODUCT_PCI_DSS_INTRO ?? "prod_VBekLlG6IWMmNl";

export const STRIPE_PRICE_PCI_DSS_INTRO =
  process.env.STRIPE_PRICE_PCI_DSS_INTRO ?? "price_1UBHRBHa2NVkmBhFxH58dRi5";

const COURSE_PRICE_IDS: Record<string, string> = {
  "gdpr-fundamentals": STRIPE_PRICE_GDPR_FUNDAMENTALS,
  "payment-card-security-pci": STRIPE_PRICE_PCI_INTRO,
  "introduction-to-pci-dss": STRIPE_PRICE_PCI_DSS_INTRO,
};

export function getStripePriceIdForSlug(slug: string): string | undefined {
  return COURSE_PRICE_IDS[slug];
}

export function usesStripeCatalogPrice(slug: string): boolean {
  return Boolean(getStripePriceIdForSlug(slug));
}
