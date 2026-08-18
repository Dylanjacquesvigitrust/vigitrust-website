import { Prisma } from "@prisma/client";
import { prisma, isDatabaseConfigured } from "@/lib/db";
import { mediaUrlForSlot, type ImageOverrideMap } from "@/lib/image-slots";

export type { ImageOverrideMap } from "@/lib/image-slots";
export { mediaUrlForSlot, normalizeImageSlot } from "@/lib/image-slots";

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

export async function listImageOverrideUrls(): Promise<ImageOverrideMap> {
  if (!isDatabaseConfigured()) return {};

  try {
    const rows = await prisma.siteImageOverride.findMany({
      select: { slot: true, updatedAt: true },
    });
    return Object.fromEntries(rows.map((row) => [row.slot, mediaUrlForSlot(row.slot, row.updatedAt)]));
  } catch (error) {
    console.error("[site images] list failed:", error);
    return {};
  }
}

export async function getImageOverride(slot: string) {
  if (!isDatabaseConfigured()) return null;
  return prisma.siteImageOverride.findUnique({ where: { slot } });
}

export async function saveImageOverride(slot: string, file: File) {
  if (!isDatabaseConfigured()) {
    throw new Error("Database is not configured.");
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Use a JPG, PNG, WebP, GIF, or SVG image.");
  }

  if (file.size > MAX_BYTES) {
    throw new Error("Images must be 4MB or smaller.");
  }

  const data = new Uint8Array(await file.arrayBuffer());

  return prisma.siteImageOverride.upsert({
    where: { slot },
    create: { slot, contentType: file.type, data },
    update: { contentType: file.type, data },
  });
}

export async function deleteImageOverride(slot: string) {
  if (!isDatabaseConfigured()) {
    throw new Error("Database is not configured.");
  }

  try {
    await prisma.siteImageOverride.delete({ where: { slot } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return;
    }
    throw error;
  }
}
