/** Countries offered on checkout, with ISO codes Stripe Tax expects. */
export const CHECKOUT_COUNTRIES = [
  { code: "IE", label: "Ireland" },
  { code: "GB", label: "United Kingdom" },
  { code: "FR", label: "France" },
  { code: "DE", label: "Germany" },
  { code: "ES", label: "Spain" },
  { code: "NL", label: "Netherlands" },
  { code: "BE", label: "Belgium" },
  { code: "IT", label: "Italy" },
  { code: "PT", label: "Portugal" },
  { code: "US", label: "United States" },
  { code: "CA", label: "Canada" },
  { code: "AU", label: "Australia" },
] as const;

const LABEL_TO_CODE: Record<string, string> = Object.fromEntries([
  ...CHECKOUT_COUNTRIES.map((c) => [c.label.toLowerCase(), c.code]),
  ...CHECKOUT_COUNTRIES.map((c) => [c.code.toLowerCase(), c.code]),
]);

/** Accepts ISO code (FR) or legacy label (France). */
export function toStripeCountryCode(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  if (/^[A-Za-z]{2}$/.test(raw)) return raw.toUpperCase();
  return LABEL_TO_CODE[raw.toLowerCase()] ?? null;
}
