import { RenewalCodeStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { isDatabaseConfigured } from "@/lib/db";
import {
  createManualRenewalCode,
  searchRenewalCodes,
  serializeRenewalCode,
} from "@/lib/renewal-codes";

export const runtime = "nodejs";

const VALID_STATUSES = new Set<string>(Object.values(RenewalCodeStatus));

export async function GET(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? undefined;
  const statusParam = searchParams.get("status") ?? undefined;
  const status =
    statusParam && VALID_STATUSES.has(statusParam)
      ? (statusParam as RenewalCodeStatus)
      : undefined;

  try {
    const records = await searchRenewalCodes({ q, status });
    return NextResponse.json({
      codes: records.map(serializeRenewalCode),
      total: records.length,
    });
  } catch (error) {
    console.error("[admin renewal-codes] search failed:", error);
    return NextResponse.json({ error: "Could not load renewal codes." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }

  let body: {
    customerEmail?: string;
    externalReferenceId?: string | null;
    code?: string | null;
    productType?: string | null;
    stripeCheckoutSessionId?: string | null;
    stripePaymentIntentId?: string | null;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  try {
    const created = await createManualRenewalCode({
      customerEmail: body.customerEmail ?? "",
      externalReferenceId: body.externalReferenceId,
      code: body.code,
      productType: body.productType,
      stripeCheckoutSessionId: body.stripeCheckoutSessionId,
      stripePaymentIntentId: body.stripePaymentIntentId,
    });
    return NextResponse.json({ code: serializeRenewalCode(created) }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create renewal code.";
    const status = message.includes("already") || message.includes("required") || message.includes("16")
      ? 400
      : 500;
    if (status === 500) {
      console.error("[admin renewal-codes] create failed:", error);
    }
    return NextResponse.json({ error: message }, { status });
  }
}
