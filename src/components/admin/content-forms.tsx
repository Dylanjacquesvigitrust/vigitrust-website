"use client";

import { FormEvent, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/components/admin/admin-provider";
import { Button } from "@/components/ui/button";
import type { CmsKind } from "@/lib/cms-types";

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-vt-border px-3 py-2 text-sm outline-none ring-vt-navy/20 focus:ring-2";

function fileFromForm(data: FormData): File | undefined {
  const value = data.get("imageFile");
  return value instanceof File && value.size > 0 ? value : undefined;
}

async function postContent(kind: CmsKind, payload: Record<string, unknown>, file?: File) {
  const body = new FormData();
  body.set("kind", kind);
  body.set("payload", JSON.stringify(payload));
  if (file) body.set("file", file);

  const response = await fetch("/api/admin/content", { method: "POST", body });
  const data = (await response.json()) as { error?: string };
  if (!response.ok) throw new Error(data.error ?? "Could not add item.");
}

async function deleteContent(kind: CmsKind, slug: string) {
  const response = await fetch(
    `/api/admin/content?kind=${encodeURIComponent(kind)}&slug=${encodeURIComponent(slug)}`,
    { method: "DELETE" },
  );
  const data = (await response.json()) as { error?: string };
  if (!response.ok) throw new Error(data.error ?? "Could not remove item.");
}

function ImageUploadField({ required }: { required?: boolean }) {
  return (
    <label className="sm:col-span-2 text-left text-xs font-semibold uppercase tracking-wider text-vt-muted">
      Image
      <input
        name="imageFile"
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        required={required}
        className={fieldClass}
      />
    </label>
  );
}

export function AdminRemoveButton({
  kind,
  slug,
  label,
}: {
  kind: CmsKind;
  slug: string;
  label: string;
}) {
  const { isAdmin } = useAdmin();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  if (!isAdmin) return null;

  async function onRemove(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (!window.confirm(`Remove ${label}?`)) return;
    setBusy(true);
    try {
      await deleteContent(kind, slug);
      router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Could not remove item.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={(event) => void onRemove(event)}
      disabled={busy}
      className="absolute right-2 top-2 z-30 rounded-md bg-white/95 px-2 py-1 text-[11px] font-semibold text-vt-red shadow-sm ring-1 ring-vt-border disabled:opacity-60"
    >
      {busy ? "Removing…" : "Remove"}
    </button>
  );
}

function AdminPanel({ title, children }: { title: string; children: ReactNode }) {
  const { isAdmin } = useAdmin();
  if (!isAdmin) return null;

  return (
    <div className="mb-8 rounded-2xl bg-vt-mist p-4 ring-1 ring-vt-border sm:p-5">
      <p className="text-sm font-semibold text-vt-ink">{title}</p>
      {children}
    </div>
  );
}

export function AdminAddPostForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    setError(null);
    try {
      await postContent(
        "post",
        {
          title: String(data.get("title") ?? ""),
          category: String(data.get("category") ?? "Blog"),
          date: String(data.get("date") ?? ""),
          excerpt: String(data.get("excerpt") ?? ""),
          body: String(data.get("body") ?? ""),
        },
        fileFromForm(data),
      );
      form.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add post.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminPanel title="Add blog or news">
      <form onSubmit={onSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-left text-xs font-semibold uppercase tracking-wider text-vt-muted">
          Title
          <input name="title" required className={fieldClass} />
        </label>
        <label className="text-left text-xs font-semibold uppercase tracking-wider text-vt-muted">
          Type
          <select name="category" className={fieldClass} defaultValue="Blog">
            <option value="Blog">Blog</option>
            <option value="News">News</option>
          </select>
        </label>
        <label className="sm:col-span-2 text-left text-xs font-semibold uppercase tracking-wider text-vt-muted">
          Date
          <input name="date" type="date" className={fieldClass} />
        </label>
        <ImageUploadField required />
        <label className="sm:col-span-2 text-left text-xs font-semibold uppercase tracking-wider text-vt-muted">
          Excerpt
          <textarea name="excerpt" required rows={2} className={fieldClass} />
        </label>
        <label className="sm:col-span-2 text-left text-xs font-semibold uppercase tracking-wider text-vt-muted">
          Body (optional)
          <textarea name="body" rows={4} className={fieldClass} />
        </label>
        {error ? <p className="sm:col-span-2 text-sm text-vt-red">{error}</p> : null}
        <div className="sm:col-span-2">
          <Button type="submit" disabled={busy}>
            {busy ? "Adding…" : "Add post"}
          </Button>
        </div>
      </form>
    </AdminPanel>
  );
}

export function AdminAddEventForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    setError(null);
    try {
      await postContent(
        "event",
        {
          title: String(data.get("title") ?? ""),
          dateLabel: String(data.get("dateLabel") ?? ""),
          location: String(data.get("location") ?? ""),
          theme: String(data.get("theme") ?? ""),
          category: String(data.get("category") ?? "Advisory"),
          timing: String(data.get("timing") ?? "past"),
        },
        fileFromForm(data),
      );
      form.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add event.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminPanel title="Add event">
      <form onSubmit={onSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="sm:col-span-2 text-left text-xs font-semibold uppercase tracking-wider text-vt-muted">
          Title
          <input name="title" required className={fieldClass} />
        </label>
        <label className="text-left text-xs font-semibold uppercase tracking-wider text-vt-muted">
          Date
          <input name="dateLabel" required placeholder="May 21-22, 2026" className={fieldClass} />
        </label>
        <label className="text-left text-xs font-semibold uppercase tracking-wider text-vt-muted">
          Location
          <input name="location" required placeholder="Dublin" className={fieldClass} />
        </label>
        <label className="text-left text-xs font-semibold uppercase tracking-wider text-vt-muted">
          Category
          <select name="category" className={fieldClass} defaultValue="Advisory">
            <option value="Advisory">Advisory</option>
            <option value="Networking">Networking</option>
          </select>
        </label>
        <label className="text-left text-xs font-semibold uppercase tracking-wider text-vt-muted">
          Timing
          <select name="timing" className={fieldClass} defaultValue="upcoming">
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </label>
        <label className="sm:col-span-2 text-left text-xs font-semibold uppercase tracking-wider text-vt-muted">
          Theme (optional)
          <input name="theme" className={fieldClass} />
        </label>
        <ImageUploadField />
        {error ? <p className="sm:col-span-2 text-sm text-vt-red">{error}</p> : null}
        <div className="sm:col-span-2">
          <Button type="submit" disabled={busy}>
            {busy ? "Adding…" : "Add event"}
          </Button>
        </div>
      </form>
    </AdminPanel>
  );
}

export function AdminAddCourseForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const price = Number(data.get("price") ?? 0);
    setBusy(true);
    setError(null);
    try {
      await postContent(
        "course",
        {
          title: String(data.get("title") ?? ""),
          priceFrom: price,
          priceLabel: `€${price.toFixed(2)}`,
          summary: String(data.get("summary") ?? ""),
          category: String(data.get("category") ?? "Security Awareness"),
          duration: String(data.get("duration") ?? "45-90 mins"),
        },
        fileFromForm(data),
      );
      form.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add course.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminPanel title="Add course">
      <form onSubmit={onSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-left text-xs font-semibold uppercase tracking-wider text-vt-muted">
          Title
          <input name="title" required className={fieldClass} />
        </label>
        <label className="text-left text-xs font-semibold uppercase tracking-wider text-vt-muted">
          Price (€)
          <input name="price" type="number" min="1" step="0.01" required className={fieldClass} />
        </label>
        <label className="text-left text-xs font-semibold uppercase tracking-wider text-vt-muted">
          Category
          <input name="category" placeholder="Security Awareness" className={fieldClass} />
        </label>
        <label className="text-left text-xs font-semibold uppercase tracking-wider text-vt-muted">
          Duration
          <input name="duration" placeholder="45-90 mins" className={fieldClass} />
        </label>
        <ImageUploadField required />
        <label className="sm:col-span-2 text-left text-xs font-semibold uppercase tracking-wider text-vt-muted">
          Summary
          <textarea name="summary" required rows={3} className={fieldClass} />
        </label>
        {error ? <p className="sm:col-span-2 text-sm text-vt-red">{error}</p> : null}
        <div className="sm:col-span-2">
          <Button type="submit" disabled={busy}>
            {busy ? "Adding…" : "Add course"}
          </Button>
        </div>
      </form>
    </AdminPanel>
  );
}

export function AdminAddWorkshopForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    setError(null);
    try {
      await postContent(
        "workshop",
        {
          title: String(data.get("title") ?? ""),
          city: String(data.get("city") ?? ""),
          format: String(data.get("format") ?? "In-person"),
          dates: String(data.get("dates") ?? ""),
          duration: String(data.get("duration") ?? ""),
          seats: String(data.get("seats") ?? ""),
          topics: String(data.get("topics") ?? ""),
        },
        fileFromForm(data),
      );
      form.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add training.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminPanel title="Add in-person training">
      <form onSubmit={onSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="sm:col-span-2 text-left text-xs font-semibold uppercase tracking-wider text-vt-muted">
          Title
          <input name="title" required className={fieldClass} />
        </label>
        <label className="text-left text-xs font-semibold uppercase tracking-wider text-vt-muted">
          City
          <input name="city" required placeholder="Dublin" className={fieldClass} />
        </label>
        <label className="text-left text-xs font-semibold uppercase tracking-wider text-vt-muted">
          Format
          <input name="format" placeholder="In-person" className={fieldClass} />
        </label>
        <label className="text-left text-xs font-semibold uppercase tracking-wider text-vt-muted">
          Dates
          <input name="dates" required placeholder="Sep 16-17, 2026" className={fieldClass} />
        </label>
        <label className="text-left text-xs font-semibold uppercase tracking-wider text-vt-muted">
          Duration
          <input name="duration" placeholder="2 days" className={fieldClass} />
        </label>
        <label className="text-left text-xs font-semibold uppercase tracking-wider text-vt-muted">
          Seats
          <input name="seats" placeholder="18 seats" className={fieldClass} />
        </label>
        <label className="text-left text-xs font-semibold uppercase tracking-wider text-vt-muted">
          Topics
          <input name="topics" placeholder="ISO 27001, Evidence, Board reporting" className={fieldClass} />
        </label>
        <ImageUploadField />
        {error ? <p className="sm:col-span-2 text-sm text-vt-red">{error}</p> : null}
        <div className="sm:col-span-2">
          <Button type="submit" disabled={busy}>
            {busy ? "Adding…" : "Add training"}
          </Button>
        </div>
      </form>
    </AdminPanel>
  );
}
