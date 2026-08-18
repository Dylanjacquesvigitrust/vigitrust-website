import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { createCmsItem, removeCmsItem } from "@/lib/cms";
import { isCmsKind } from "@/lib/cms-types";
import { isDatabaseConfigured } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }

  let body: { kind?: string; payload?: Record<string, unknown> };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const kind = body.kind ?? "";
  if (!isCmsKind(kind) || !body.payload) {
    return NextResponse.json({ error: "Invalid content type." }, { status: 400 });
  }

  try {
    const created = await createCmsItem(kind, body.payload);
    return NextResponse.json({ ok: true, slug: created.slug }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not add item.";
    const status = message.includes("required") || message.includes("already") ? 400 : 500;
    if (status === 500) console.error("[cms] create failed:", error);
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const kind = searchParams.get("kind") ?? "";
  const slug = searchParams.get("slug")?.trim() ?? "";

  if (!isCmsKind(kind) || !slug) {
    return NextResponse.json({ error: "Missing item to remove." }, { status: 400 });
  }

  try {
    await removeCmsItem(kind, slug);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[cms] remove failed:", error);
    return NextResponse.json({ error: "Could not remove item." }, { status: 500 });
  }
}
