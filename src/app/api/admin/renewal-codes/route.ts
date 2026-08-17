import { RenewalCodeStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { isDatabaseConfigured } from "@/lib/db";
import { searchRenewalCodes, serializeRenewalCode } from "@/lib/renewal-codes";

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
