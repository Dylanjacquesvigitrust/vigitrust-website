import { Prisma } from "@prisma/client";
import { training, type Course } from "@/content/courses";
import { blog, events } from "@/content/site";
import { isDatabaseConfigured, prisma } from "@/lib/db";
import {
  slugify,
  type BlogPost,
  type CmsEvent,
  type CmsKind,
  type Course as CmsCourse,
} from "@/lib/cms-types";

type CmsRow = {
  kind: string;
  slug: string;
  status: string;
  payload: Prisma.JsonValue;
};

const seedPosts: BlogPost[] = blog.posts.map((post) => ({
  ...post,
  category: post.category === "News" ? "News" : "Blog",
}));

const seedEvents: CmsEvent[] = events.pastEvents.map((event) => ({
  ...event,
  timing: "past",
}));

const seedCourses: Course[] = training.courses;

function asRecord(value: Prisma.JsonValue): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

async function loadRows(kind: CmsKind): Promise<CmsRow[]> {
  if (!isDatabaseConfigured()) return [];
  try {
    return await prisma.cmsEntry.findMany({ where: { kind } });
  } catch (error) {
    console.error("[cms] load failed:", error);
    return [];
  }
}

function mergeItems<T extends { slug?: string; id?: string }>(
  seed: T[],
  rows: CmsRow[],
  getId: (item: T) => string,
  fromPayload: (payload: Prisma.JsonValue, slug: string) => T | null,
): T[] {
  const bySlug = new Map(rows.map((row) => [row.slug, row]));
  const result: T[] = [];

  for (const item of seed) {
    const id = getId(item);
    const overlay = bySlug.get(id);
    if (overlay?.status === "hidden") continue;
    if (overlay?.status === "published") {
      const next = fromPayload(overlay.payload, id);
      result.push(next ?? item);
      continue;
    }
    result.push(item);
  }

  for (const row of rows) {
    if (row.status !== "published") continue;
    if (seed.some((item) => getId(item) === row.slug)) continue;
    const next = fromPayload(row.payload, row.slug);
    if (next) result.push(next);
  }

  return result;
}

function parsePost(payload: Prisma.JsonValue, slug: string): BlogPost | null {
  const data = asRecord(payload);
  const title = String(data.title ?? "").trim();
  if (!title) return null;
  return {
    slug,
    title,
    date: String(data.date ?? new Date().toISOString().slice(0, 10)),
    category: data.category === "News" ? "News" : "Blog",
    excerpt: String(data.excerpt ?? ""),
    image: String(data.image ?? "/images/heroes/team-sm.webp"),
    body: typeof data.body === "string" && data.body.trim() ? data.body : undefined,
  };
}

function parseEvent(payload: Prisma.JsonValue, slug: string): CmsEvent | null {
  const data = asRecord(payload);
  const title = String(data.title ?? "").trim();
  if (!title) return null;
  return {
    id: slug,
    title,
    dateLabel: String(data.dateLabel ?? ""),
    location: String(data.location ?? ""),
    theme: typeof data.theme === "string" && data.theme.trim() ? data.theme : null,
    category: data.category === "Networking" ? "Networking" : "Advisory",
    timing: data.timing === "upcoming" ? "upcoming" : "past",
  };
}

function parseCourse(payload: Prisma.JsonValue, slug: string): Course | null {
  const data = asRecord(payload);
  const title = String(data.title ?? "").trim();
  if (!title) return null;
  const priceFrom =
    typeof data.priceFrom === "number"
      ? data.priceFrom
      : Number(data.priceFrom ?? 0) || undefined;
  const priceLabel =
    String(data.priceLabel ?? "").trim() ||
    (typeof priceFrom === "number" ? `€${priceFrom.toFixed(2)}` : "Price on request");

  return {
    slug,
    title,
    priceLabel,
    priceFrom,
    cta: "Buy Now",
    summary: String(data.summary ?? ""),
    image: String(data.image ?? "/images/courses/quiz.webp"),
    level: String(data.level ?? "All levels"),
    category: String(data.category ?? "Security Awareness"),
    duration: String(data.duration ?? "45-90 mins"),
    description: typeof data.description === "string" ? data.description : undefined,
  };
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const rows = await loadRows("post");
  return mergeItems(seedPosts, rows, (post) => post.slug, parsePost).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export async function getPublishedPost(slug: string): Promise<BlogPost | null> {
  const posts = await getPublishedPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getPublishedEvents(): Promise<CmsEvent[]> {
  const rows = await loadRows("event");
  return mergeItems(seedEvents, rows, (event) => event.id, parseEvent);
}

export async function getPublishedCourses(): Promise<Course[]> {
  const rows = await loadRows("course");
  return mergeItems(seedCourses, rows, (course) => course.slug, parseCourse);
}

export async function getPublishedCourse(slug: string): Promise<Course | null> {
  const courses = await getPublishedCourses();
  return courses.find((course) => course.slug === slug) ?? null;
}

function seedHas(kind: CmsKind, slug: string): boolean {
  if (kind === "post") return seedPosts.some((item) => item.slug === slug);
  if (kind === "event") return seedEvents.some((item) => item.id === slug);
  return seedCourses.some((item) => item.slug === slug);
}

export async function createCmsItem(kind: CmsKind, payload: Record<string, unknown>) {
  const slug =
    String(payload.slug ?? payload.id ?? "").trim() || slugify(String(payload.title ?? ""));
  if (!slug) throw new Error("A title is required.");

  let parsed: BlogPost | CmsEvent | Course | null = null;
  if (kind === "post") parsed = parsePost(payload as Prisma.JsonValue, slug);
  if (kind === "event") parsed = parseEvent(payload as Prisma.JsonValue, slug);
  if (kind === "course") parsed = parseCourse(payload as Prisma.JsonValue, slug);
  if (!parsed) throw new Error("That item is missing required fields.");

  const existing = await prisma.cmsEntry.findUnique({
    where: { kind_slug: { kind, slug } },
  });
  if (existing?.status === "published" || (!existing && seedHas(kind, slug))) {
    throw new Error("An item with that name already exists.");
  }

  return prisma.cmsEntry.upsert({
    where: { kind_slug: { kind, slug } },
    create: { kind, slug, status: "published", payload: parsed as Prisma.InputJsonValue },
    update: { status: "published", payload: parsed as Prisma.InputJsonValue },
  });
}

export async function removeCmsItem(kind: CmsKind, slug: string) {
  if (seedHas(kind, slug)) {
    return prisma.cmsEntry.upsert({
      where: { kind_slug: { kind, slug } },
      create: { kind, slug, status: "hidden", payload: {} },
      update: { status: "hidden" },
    });
  }

  try {
    await prisma.cmsEntry.delete({ where: { kind_slug: { kind, slug } } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return;
    }
    throw error;
  }
}

export type { CmsCourse };
