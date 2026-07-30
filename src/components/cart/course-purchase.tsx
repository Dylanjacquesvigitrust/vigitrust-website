"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { SiteImage } from "@/components/ui/site-image";
import type { Course } from "@/content/courses";

export function CoursePurchasePanel({ course }: { course: Course }) {
  const hasModules = Boolean(course.modules?.length);
  const [moduleName, setModuleName] = useState(course.modules?.[0]?.name ?? "");

  const selected = useMemo(() => {
    if (!hasModules) {
      return {
        price: course.priceFrom ?? (Number(course.priceLabel.replace(/[^\d.]/g, "")) || 0),
        label: course.priceLabel,
        topics: course.topics ?? [],
      };
    }
    const mod = course.modules!.find((m) => m.name === moduleName) ?? course.modules![0];
    return {
      price: Number(mod.price.replace(/[^\d.]/g, "")),
      label: mod.price,
      topics: mod.topics,
    };
  }, [course, hasModules, moduleName]);

  return (
    <aside className="sticky top-28 rounded-2xl bg-white p-7 shadow-xl shadow-vt-navy/10 ring-1 ring-vt-border">
      <p className="text-sm font-semibold uppercase tracking-wide text-vt-muted">Price</p>
      <p className="mt-1 text-3xl font-bold text-vt-price">{selected.label}</p>
      <p className="mt-1 text-sm text-vt-muted">{course.priceLabel}</p>

      {hasModules ? (
        <div className="mt-5">
          <label className="mb-1.5 block text-sm font-medium text-vt-slate" htmlFor="module">
            Modules
          </label>
          <select
            id="module"
            value={moduleName}
            onChange={(e) => setModuleName(e.target.value)}
            className="w-full rounded-md bg-[#f3f3f3] px-3 py-2.5 ring-1 ring-vt-border"
          >
            {course.modules!.map((m) => (
              <option key={m.name} value={m.name}>
                {m.name}  -  {m.price}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="mt-2 text-sm text-[#7030a0] hover:underline"
            onClick={() => setModuleName(course.modules![0].name)}
          >
            Clear
          </button>
        </div>
      ) : null}

      <div className="mt-6">
        <AddToCartButton
          slug={course.slug}
          label="Add to basket"
          module={hasModules ? moduleName : undefined}
          price={selected.price}
          priceLabel={selected.label}
          className="w-full !bg-[#7030a0] !text-white hover:!bg-[#5a2680]"
        />
      </div>

      <Link
        href="/checkout"
        className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-vt-border px-4 py-2.5 text-sm font-semibold text-vt-navy hover:bg-vt-mist"
      >
        Go to checkout
      </Link>

      {course.bulkDeals ? (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-vt-ink">Bulk deal</h3>
          <table className="mt-3 w-full text-left text-sm">
            <thead>
              <tr className="border-b border-vt-border text-vt-muted">
                <th className="py-2 font-medium">Quantity</th>
                <th className="py-2 font-medium">Discount</th>
                <th className="py-2 font-medium">Discounted price</th>
              </tr>
            </thead>
            <tbody>
              {course.bulkDeals.map((row) => (
                <tr key={row.quantity} className="border-b border-vt-border/70 text-vt-slate">
                  <td className="py-2">{row.quantity}</td>
                  <td className="py-2">{row.discount}</td>
                  <td className="py-2 font-semibold">{row.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-vt-muted">
            1 year subscription prices. Customers needing more than 500 seats should contact
            info@vigitrust.com.
          </p>
        </div>
      ) : null}

      {selected.topics.length ? (
        <div className="mt-8 border-t border-vt-border pt-6">
          <h3 className="font-semibold text-vt-ink">This module covers</h3>
          <ul className="mt-3 space-y-2">
            {selected.topics.map((t) => (
              <li key={t} className="flex gap-2 text-sm text-vt-slate">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-vt-red" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}

export function CourseGallery({ course }: { course: Course }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-vt-border">
      <div className="relative aspect-[16/9]">
        <SiteImage src={course.image} alt={course.title} fill className="object-cover" sizes="(max-width:1024px) 100vw, 60vw" />
      </div>
      <div className="space-y-5 p-7 sm:p-8">
        <h1 className="brand-display text-3xl text-vt-ink">{course.title}</h1>
        <p className="text-base leading-relaxed text-vt-slate">{course.summary}</p>
        {course.modules ? (
          <div>
            <h2 className="brand-display text-2xl text-vt-ink">Course levels</h2>
            <div className="mt-4 space-y-4">
              {course.modules.map((mod) => (
                <div key={mod.name} className="rounded-xl bg-vt-mist p-5 ring-1 ring-vt-border">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-vt-navy">{mod.name}</h3>
                    <span className="font-bold text-vt-price">{mod.price}</span>
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {mod.topics.map((t) => (
                      <li key={t} className="flex gap-2 text-sm text-vt-slate">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-vt-red" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
