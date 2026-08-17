import { randomBytes } from "crypto";
import { Prisma, type RenewalCode, RenewalCodeStatus } from "@prisma/client";
import type Stripe from "stripe";
import { prisma } from "@/lib/db";

const CODE_LENGTH = 16;
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateRenewalCodeValue(): string {
  const bytes = randomBytes(CODE_LENGTH);
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i += 1) {
    code += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }
  return code;
}

export function formatRenewalCode(code: string): string {
  return code.match(/.{1,4}/g)?.join("-") ?? code;
}

function paymentIntentId(session: Stripe.Checkout.Session): string | null {
  if (!session.payment_intent) return null;
  return typeof session.payment_intent === "string"
    ? session.payment_intent
    : session.payment_intent.id;
}

function customerEmail(session: Stripe.Checkout.Session): string {
  return (
    session.customer_email ??
    session.customer_details?.email ??
    "unknown@customer.vigitrust.com"
  ).trim();
}

function productType(session: Stripe.Checkout.Session): string | null {
  return session.metadata?.product ?? null;
}

async function findExistingRenewalCode(
  session: Stripe.Checkout.Session,
  paymentIntent: string | null,
): Promise<RenewalCode | null> {
  const bySession = await prisma.renewalCode.findUnique({
    where: { stripeCheckoutSessionId: session.id },
  });
  if (bySession) return bySession;

  if (paymentIntent) {
    const byPayment = await prisma.renewalCode.findUnique({
      where: { stripePaymentIntentId: paymentIntent },
    });
    if (byPayment) return byPayment;
  }

  return null;
}

/**
 * Idempotent: one renewal code per Stripe Checkout Session / Payment Intent.
 */
export async function createRenewalCodeFromCheckoutSession(
  session: Stripe.Checkout.Session,
): Promise<RenewalCode> {
  const paymentIntent = paymentIntentId(session);
  const existing = await findExistingRenewalCode(session, paymentIntent);
  if (existing) return existing;

  const email = customerEmail(session);
  const product = productType(session);

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const code = generateRenewalCodeValue();
    try {
      return await prisma.renewalCode.create({
        data: {
          code,
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId: paymentIntent,
          customerEmail: email,
          productType: product,
          status: RenewalCodeStatus.unused,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        const raced = await findExistingRenewalCode(session, paymentIntent);
        if (raced) return raced;
        continue;
      }
      throw error;
    }
  }

  throw new Error("Could not generate a unique renewal code.");
}

export async function getRenewalCodeByCheckoutSessionId(
  checkoutSessionId: string,
): Promise<RenewalCode | null> {
  return prisma.renewalCode.findUnique({
    where: { stripeCheckoutSessionId: checkoutSessionId },
  });
}

export type RenewalCodeSearchParams = {
  q?: string;
  status?: RenewalCodeStatus;
  limit?: number;
};

export async function searchRenewalCodes(params: RenewalCodeSearchParams) {
  const q = params.q?.trim();
  const limit = Math.min(params.limit ?? 100, 250);

  return prisma.renewalCode.findMany({
    where: {
      ...(params.status ? { status: params.status } : {}),
      ...(q
        ? {
            OR: [
              { code: { contains: q, mode: "insensitive" } },
              { customerEmail: { contains: q, mode: "insensitive" } },
              { stripeCheckoutSessionId: { contains: q, mode: "insensitive" } },
              { stripePaymentIntentId: { contains: q, mode: "insensitive" } },
              { externalReferenceId: { contains: q, mode: "insensitive" } },
              { id: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function updateRenewalCode(
  id: string,
  data: {
    externalReferenceId?: string | null;
    status?: RenewalCodeStatus;
  },
): Promise<RenewalCode> {
  return prisma.renewalCode.update({
    where: { id },
    data: {
      ...(data.externalReferenceId !== undefined
        ? { externalReferenceId: data.externalReferenceId || null }
        : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
    },
  });
}

export function serializeRenewalCode(record: RenewalCode) {
  return {
    id: record.id,
    code: record.code,
    codeFormatted: formatRenewalCode(record.code),
    stripeCheckoutSessionId: record.stripeCheckoutSessionId,
    stripePaymentIntentId: record.stripePaymentIntentId,
    customerEmail: record.customerEmail,
    status: record.status,
    externalReferenceId: record.externalReferenceId,
    productType: record.productType,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}
