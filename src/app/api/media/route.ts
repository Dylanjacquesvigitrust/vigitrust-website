import { NextResponse } from "next/server";
import { getImageOverride, normalizeImageSlot } from "@/lib/site-images";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slot = normalizeImageSlot(searchParams.get("slot") ?? "");

  if (!slot.startsWith("/")) {
    return NextResponse.json({ error: "Missing image slot." }, { status: 400 });
  }

  try {
    const record = await getImageOverride(slot);
    if (!record) {
      return NextResponse.json({ error: "Image not found." }, { status: 404 });
    }

    return new NextResponse(Buffer.from(record.data), {
      headers: {
        "Content-Type": record.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("[media] failed:", error);
    return NextResponse.json({ error: "Could not load image." }, { status: 500 });
  }
}
