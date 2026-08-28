import { randomBytes } from "crypto";
import type Stripe from "stripe";
import { prisma } from "@/lib/db";
import { sendManagerLicencesAddedEmail, sendManagerSetupEmail } from "@/lib/email";
import {
  createGroup,
  enrollGroupInCourse,
  isReachConfigured,
  ReachApiError,
} from "@/lib/reach360";
import { getStripe } from "@/lib/stripe";
import {
  buildReachGroupName,
  getTrainingProductBySlug,
  getTrainingProductByStripePriceId,
  type TrainingProduct,
} from "@/lib/training-products";

const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type ParsedTrainingLineItem = {
  product: TrainingProduct;
  quantity: number;
  stripePriceId: string;
};

function paymentIntentId(session: Stripe.Checkout.Session): string | null {
  if (!session.payment_intent) return null;
  return typeof session.payment_intent === "string"
    ? session.payment_intent
    : session.payment_intent.id;
}

function purchaserEmail(session: Stripe.Checkout.Session): string {
  return (
    session.customer_email ??
    session.customer_details?.email ??
    session.metadata?.customer_email ??
    ""
  )
    .trim()
    .toLowerCase();
}

async function resolvePurchaserEmail(session: Stripe.Checkout.Session): Promise<string> {
  const direct = purchaserEmail(session);
  if (direct) return direct;

  const customerId =
    typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;
  if (!customerId) return "";

  try {
    const stripe = getStripe();
    const customer = await stripe.customers.retrieve(customerId);
    if (!customer.deleted && typeof customer.email === "string" && customer.email.trim()) {
      return customer.email.trim().toLowerCase();
    }
  } catch (error) {
    console.warn("[training-provision] Could not load Stripe customer email", customerId, error);
  }

  return "";
}

function generateInviteToken(): string {
  return randomBytes(32).toString("hex");
}

/** Fetch Stripe Checkout line items and map training products by Price ID. */
export async function parseTrainingLineItems(
  sessionId: string,
): Promise<ParsedTrainingLineItem[]> {
  const stripe = getStripe();
  const items: ParsedTrainingLineItem[] = [];

  let startingAfter: string | undefined;
  for (;;) {
    const page = await stripe.checkout.sessions.listLineItems(sessionId, {
      limit: 100,
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    });

    for (const line of page.data) {
      const priceId =
        typeof line.price === "string" ? line.price : line.price?.id ?? null;
      if (!priceId) continue;

      const product = getTrainingProductByStripePriceId(priceId);
      if (!product) continue;

      const quantity = line.quantity ?? 1;
      if (quantity < 1) continue;

      items.push({ product, quantity, stripePriceId: priceId });
    }

    if (!page.has_more || !page.data.length) break;
    startingAfter = page.data[page.data.length - 1]?.id;
  }

  return items;
}

async function ensureReachGroup(
  customerId: string,
  companyName: string | null | undefined,
  product: TrainingProduct,
): Promise<{ groupId: string; groupName: string }> {
  const existing = await prisma.reachGroupMapping.findUnique({
    where: {
      customerId_courseSlug: { customerId, courseSlug: product.slug },
    },
  });
  if (existing) {
    return { groupId: existing.reachGroupId, groupName: existing.reachGroupName };
  }

  const groupName = buildReachGroupName(companyName, product.title);
  const group = await createGroup(groupName);

  await prisma.reachGroupMapping.create({
    data: {
      customerId,
      courseSlug: product.slug,
      reachGroupId: group.id,
      reachGroupName: groupName,
    },
  });

  await enrollGroupInCourse(product.reachCourseId, group.id);

  return { groupId: group.id, groupName };
}

export async function provisionAllocationReach(
  allocationId: string,
  customerId: string,
  companyName: string | null | undefined,
  product: TrainingProduct,
): Promise<void> {
  await prisma.courseLicenceAllocation.update({
    where: { id: allocationId },
    data: { provisioningStatus: "provisioning", provisioningError: null },
  });

  try {
    if (!isReachConfigured()) {
      throw new ReachApiError("REACH360_API_KEY is not configured.", 0);
    }

    const { groupId, groupName } = await ensureReachGroup(customerId, companyName, product);

    await prisma.courseLicenceAllocation.update({
      where: { id: allocationId },
      data: {
        reachGroupId: groupId,
        reachGroupName: groupName,
        provisioningStatus: "provisioned",
        provisioningError: null,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Reach provisioning failed.";
    await prisma.courseLicenceAllocation.update({
      where: { id: allocationId },
      data: {
        provisioningStatus: "failed",
        provisioningError: message,
      },
    });
    console.error("[training-provision] Reach failed for allocation", allocationId, error);
  }
}

/**
 * Idempotent: provisions training licences from a paid Checkout Session.
 * Returns true if training products were found and processed.
 */
export async function provisionTrainingPurchase(
  session: Stripe.Checkout.Session,
): Promise<{ processed: boolean; purchaseId?: string }> {
  if (session.payment_status !== "paid") {
    return { processed: false };
  }

  const email = await resolvePurchaserEmail(session);
  if (!email) {
    console.warn("[training-provision] No purchaser email on session", session.id);
    return { processed: false };
  }

  const trainingLines = await parseTrainingLineItems(session.id);
  if (!trainingLines.length) {
    return { processed: false };
  }

  const existingPurchase = await prisma.trainingPurchase.findUnique({
    where: { stripeCheckoutSessionId: session.id },
    include: {
      customer: true,
      allocations: true,
    },
  });
  if (existingPurchase) {
    console.info("[training-provision] Purchase already provisioned — retrying Reach if needed", session.id);
    for (const allocation of existingPurchase.allocations) {
      if (allocation.provisioningStatus === "provisioned") continue;
      const product = getTrainingProductBySlug(allocation.courseSlug);
      if (!product) continue;
      await provisionAllocationReach(
        allocation.id,
        existingPurchase.customerId,
        existingPurchase.customer.companyName,
        product,
      );
    }
    return { processed: true, purchaseId: existingPurchase.id };
  }

  const companyName = session.metadata?.customer_company?.trim() || null;
  const firstName = session.metadata?.customer_first_name?.trim() || null;
  const lastName = session.metadata?.customer_last_name?.trim() || null;
  const stripeCustomerId =
    typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;

  const purchase = await prisma.$transaction(async (tx) => {
    let customer = await tx.customer.findFirst({
      where: { billingEmail: email },
    });

    if (!customer) {
      customer = await tx.customer.create({
        data: {
          billingEmail: email,
          companyName,
          stripeCustomerId,
        },
      });
    } else if (companyName && !customer.companyName) {
      customer = await tx.customer.update({
        where: { id: customer.id },
        data: { companyName, stripeCustomerId: stripeCustomerId ?? customer.stripeCustomerId },
      });
    }

    const trainingPurchase = await tx.trainingPurchase.create({
      data: {
        customerId: customer.id,
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: paymentIntentId(session),
        amountTotal: session.amount_total ?? undefined,
        currency: session.currency ?? "eur",
        purchaserEmail: email,
        purchaserFirstName: firstName,
        purchaserLastName: lastName,
      },
    });

    for (const line of trainingLines) {
      await tx.courseLicenceAllocation.create({
        data: {
          customerId: customer.id,
          purchaseId: trainingPurchase.id,
          courseSlug: line.product.slug,
          courseTitle: line.product.title,
          reachCourseId: line.product.reachCourseId,
          quantityPurchased: line.quantity,
          quantityAssigned: 0,
          provisioningStatus: "pending",
        },
      });
    }

    let manager = await tx.managerAccount.findUnique({ where: { email } });
    if (!manager) {
      const inviteToken = generateInviteToken();
      manager = await tx.managerAccount.create({
        data: {
          customerId: customer.id,
          email,
          firstName,
          lastName,
          inviteToken,
          inviteExpiresAt: new Date(Date.now() + INVITE_TTL_MS),
          status: "pending",
        },
      });
    } else if (manager.customerId !== customer.id) {
      // Same email, link to this customer if not already associated elsewhere
      await tx.managerAccount.update({
        where: { id: manager.id },
        data: { customerId: customer.id },
      });
    } else if (manager.status === "pending" && !manager.inviteToken) {
      const inviteToken = generateInviteToken();
      manager = await tx.managerAccount.update({
        where: { id: manager.id },
        data: {
          inviteToken,
          inviteExpiresAt: new Date(Date.now() + INVITE_TTL_MS),
        },
      });
    }

    return { trainingPurchase, customer, manager, isNewManager: manager.status === "pending" };
  });

  const allocations = await prisma.courseLicenceAllocation.findMany({
    where: { purchaseId: purchase.trainingPurchase.id },
  });

  for (const allocation of allocations) {
    const product = trainingLines.find((l) => l.product.slug === allocation.courseSlug)?.product;
    if (!product) continue;
    await provisionAllocationReach(
      allocation.id,
      purchase.customer.id,
      purchase.customer.companyName,
      product,
    );
  }

  const managerRecord = await prisma.managerAccount.findUnique({
    where: { email },
  });

  if (managerRecord?.inviteToken && managerRecord.status === "pending") {
    const emailResult = await sendManagerSetupEmail({
      to: email,
      firstName: managerRecord.firstName ?? firstName ?? undefined,
      inviteToken: managerRecord.inviteToken,
      courses: trainingLines.map((l) => ({
        title: l.product.title,
        quantity: l.quantity,
      })),
      orderRef: session.id,
    });
    if (!emailResult.sent) {
      console.error("[training-provision] Manager setup email failed:", emailResult.reason, { email });
    }
  } else if (managerRecord?.status === "active") {
    const emailResult = await sendManagerLicencesAddedEmail({
      to: email,
      firstName: managerRecord.firstName ?? firstName ?? undefined,
      courses: trainingLines.map((l) => ({
        title: l.product.title,
        quantity: l.quantity,
      })),
      orderRef: session.id,
    });
    if (!emailResult.sent) {
      console.error("[training-provision] Licences added email failed:", emailResult.reason, { email });
    }
  }

  console.info("[training-provision] Complete", {
    sessionId: session.id,
    purchaseId: purchase.trainingPurchase.id,
    lines: trainingLines.map((l) => ({ slug: l.product.slug, qty: l.quantity })),
  });

  return { processed: true, purchaseId: purchase.trainingPurchase.id };
}
