import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { isDatabaseConfigured } from "@/lib/db";
import {
  deleteImageOverride,
  mediaUrlForSlot,
  normalizeImageSlot,
  saveImageOverride,
} from "@/lib/site-images";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }

  const form = await request.formData();
  const slot = normalizeImageSlot(String(form.get("slot") ?? ""));
  const file = form.get("file");

  if (!slot.startsWith("/") || !(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Choose an image for this slot." }, { status: 400 });
  }

  try {
    const saved = await saveImageOverride(slot, file);
    return NextResponse.json({
      slot: saved.slot,
      url: mediaUrlForSlot(saved.slot, saved.updatedAt),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save image.";
    const status = message.includes("4MB") || message.includes("JPG") ? 400 : 500;
    if (status === 500) console.error("[admin images] save failed:", error);
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
  const slot = normalizeImageSlot(searchParams.get("slot") ?? "");
  if (!slot.startsWith("/")) {
    return NextResponse.json({ error: "Missing image slot." }, { status: 400 });
  }

  try {
    await deleteImageOverride(slot);
    return NextResponse.json({ ok: true, slot });
  } catch (error) {
    console.error("[admin images] delete failed:", error);
    return NextResponse.json({ error: "Could not reset image." }, { status: 500 });
  }
}
