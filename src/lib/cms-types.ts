import type { Course } from "@/content/courses";

export type CmsKind = "post" | "event" | "course" | "workshop";

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  category: "News" | "Blog";
  excerpt: string;
  image: string;
  body?: string;
};

export type CmsEvent = {
  id: string;
  title: string;
  dateLabel: string;
  location: string;
  theme: string | null;
  category: "Advisory" | "Networking";
  timing: "upcoming" | "past";
  image?: string;
};

export type CmsWorkshop = {
  id: string;
  city: string;
  format: string;
  title: string;
  dates: string;
  duration: string;
  seats: string;
  topics: string[];
  image?: string;
};

export function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug || `item-${Date.now()}`;
}

export function isCmsKind(value: string): value is CmsKind {
  return value === "post" || value === "event" || value === "course" || value === "workshop";
}

export type { Course };
