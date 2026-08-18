import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { createCmsItem, removeCmsItem } from "@/lib/cms";
import { isCmsKind } from "@/lib/cms-types";
import { isDatabaseConfigured } from "@/lib/db";

export const runtime = "nodejs";

async function parseCreateRequest(request: Request): Promise<{
  kind: string;
  payload: Record<string, unknown>;
  file?: File;
}> {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const kind = String(form.get("kind") ?? "");
    const rawPayload = String(form.get("payload") ?? "{}");
    const payload = JSON.parse(rawPayload) as Record<string, unknown>;
    const file = form.get("file");
    return {
      kind,
      payload,
      file: file instanceof File && file.size > 0 ? file : undefined,
    };
  }

  const body = (await request.json()) as { kind?: string; payload?: Record<string, unknown> };
  return { kind: body.kind ?? "", payload: body.payload ?? {} };
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }

  let kind = "";
  let payload: Record<string, unknown> = {};
  let file: File | undefined;

  try {
    const parsed = await parseCreateRequest(request);
    kind = parsed.kind;
    payload = parsed.payload;
    file = parsed.file;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!isCmsKind(kind)) {
    return NextResponse.json({ error: "Invalid content type." }, { status: 400 });
  }

  try {
    const created = await createCmsItem(kind, payload, file);
    return NextResponse.json({ ok: true, slug: created.slug }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not add item.";
    const status = message.includes("required") || message.includes("already") || message.includes("4MB") || message.includes("JPG")
      ? 400
      : 500;
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
