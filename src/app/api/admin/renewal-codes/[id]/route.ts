import { RenewalCodeStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { isDatabaseConfigured } from "@/lib/db";
import { serializeRenewalCode, updateRenewalCode } from "@/lib/renewal-codes";

export const runtime = "nodejs";

const VALID_STATUSES = new Set<string>(Object.values(RenewalCodeStatus));

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }

  const { id } = await context.params;

  let body: { externalReferenceId?: string | null; status?: string };
  try {
    body = (await request.json()) as { externalReferenceId?: string | null; status?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (
    body.status !== undefined &&
    !VALID_STATUSES.has(body.status)
  ) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  try {
    const updated = await updateRenewalCode(id, {
      ...(body.externalReferenceId !== undefined
        ? { externalReferenceId: body.externalReferenceId }
        : {}),
      ...(body.status !== undefined ? { status: body.status as RenewalCodeStatus } : {}),
    });
    return NextResponse.json({ code: serializeRenewalCode(updated) });
  } catch (error) {
    console.error("[admin renewal-codes] update failed:", error);
    return NextResponse.json({ error: "Could not update renewal code." }, { status: 500 });
  }
}
