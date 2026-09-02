"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { useCart } from "@/components/cart/cart-provider";
import { courseDetails, type Course } from "@/content/courses";

export function CoursePurchasePanel({ course }: { course: Course }) {
  const details = courseDetails(course);
  const { count } = useCart();
  const hasModules = Boolean(course.modules?.length);
  const [moduleName, setModuleName] = useState(course.modules?.[0]?.name ?? "");

  const selected = useMemo(() => {
    if (!hasModules) {
      return {
        price: course.priceFrom ?? (Number(course.priceLabel.replace(/[^\d.]/g, "")) || 0),
        label: course.priceLabel,
        topics: course.topics ?? details.skills,
      };
    }
    const mod = course.modules!.find((m) => m.name === moduleName) ?? course.modules![0];
    return {
      price: Number(mod.price.replace(/[^\d.]/g, "")),
      label: mod.price,
      topics: mod.topics,
    };
  }, [course, details.skills, hasModules, moduleName]);

  return (
    <aside className="sticky top-24 rounded-[6px] border border-vt-border bg-vt-paper p-6 shadow-[var(--shadow-sm)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-vt-muted">Enroll</p>
      <p className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-vt-navy">{selected.label}</p>
      {hasModules ? (
        <p className="mt-1 text-sm text-vt-muted">Full range: {course.priceLabel}</p>
      ) : null}

      {hasModules ? (
        <div className="mt-5">
          <label className="mb-1.5 block text-sm font-medium text-vt-slate" htmlFor="module">
            Module level
          </label>
          <select
            id="module"
            value={moduleName}
            onChange={(e) => setModuleName(e.target.value)}
            className="input-field"
          >
            {course.modules!.map((m) => (
              <option key={m.name} value={m.name}>
                {m.name}  -  {m.price}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="mt-6 space-y-3">
        <AddToCartButton
          slug={course.slug}
          label={hasModules ? "Add module to basket" : "Add to basket"}
          module={hasModules ? moduleName : undefined}
          price={selected.price}
          priceLabel={selected.label}
          className="w-full"
        />
        {count > 0 ? (
          <Link
            href="/checkout"
            className="inline-flex w-full items-center justify-center rounded-[8px] border border-vt-border px-4 py-2.5 text-sm font-semibold text-vt-navy transition duration-200 hover:bg-vt-mist"
          >
            Go to checkout
          </Link>
        ) : null}
      </div>

      <ul className="mt-6 space-y-2 border-t border-vt-border pt-5 text-sm text-vt-slate">
        <li>Self-paced online learning</li>
        <li>Completion tracking for audit evidence</li>
        <li>Volume discounts available for teams</li>
      </ul>

      {course.bulkDeals ? (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-vt-ink">Bulk seats</h3>
          <table className="mt-3 w-full text-left text-sm">
            <thead>
              <tr className="border-b border-vt-border text-vt-muted">
                <th className="py-2 font-medium">Quantity</th>
                <th className="py-2 font-medium">Discount</th>
                <th className="py-2 font-medium">Price</th>
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
            1 year subscription prices. For 500+ seats contact info@vigitrust.com.
          </p>
        </div>
      ) : null}

      {selected.topics.length ? (
        <div className="mt-6 border-t border-vt-border pt-5">
          <h3 className="font-semibold text-vt-ink">Includes</h3>
          <ul className="mt-3 space-y-2">
            {selected.topics.slice(0, 6).map((t) => (
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
