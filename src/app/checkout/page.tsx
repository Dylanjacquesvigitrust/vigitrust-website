"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatEuro, useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { SiteImage } from "@/components/ui/site-image";
import { useCatalog } from "@/components/catalog/catalog-provider";
import { withBasePath } from "@/lib/paths";

function CourseThumb({ slug, image, title }: { slug: string; image?: string; title: string }) {
  const { courses } = useCatalog();
  const courseImage = courses.find((c) => c.slug === slug)?.image;
  const src = courseImage || image || "/images/courses/quiz.webp";

  return (
    <SiteImage
      src={src}
      alt={title}
      width={64}
      height={64}
      className="size-full object-cover"
    />
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, total, updateQuantity, removeItem } = useCart();
  const { courses } = useCatalog();
  const [couponOpen, setCouponOpen] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const empty = items.length === 0;

  const orderLines = useMemo(
    () =>
      items.map((i) => {
        const course = courses.find((c) => c.slug === i.slug);
        return {
          ...i,
          image: course?.image ?? i.image,
          lineTotal: i.price * i.quantity,
        };
      }),
    [courses, items],
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!agree || empty || loading) return;

    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);

    try {
      const response = await fetch(withBasePath("/api/checkout"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            slug: item.slug,
            module: item.module,
            quantity: item.quantity,
          })),
          customer: {
            email: String(form.get("email") ?? ""),
            phone: String(form.get("phone") ?? ""),
            firstName: String(form.get("firstName") ?? ""),
            lastName: String(form.get("lastName") ?? ""),
            company: String(form.get("company") ?? "") || undefined,
            country: String(form.get("country") ?? ""),
            address: String(form.get("address") ?? ""),
            city: String(form.get("city") ?? ""),
            county: String(form.get("county") ?? "") || undefined,
            postcode: String(form.get("postcode") ?? ""),
          },
        }),
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Could not start checkout.");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <section className="bg-[#f5f5f5] py-10 sm:py-14">
      <div className="container-vt px-5 sm:px-8 lg:px-10">
        <p className="text-sm text-vt-muted">Home / Checkout</p>
        <h1 className="brand-display mt-2 text-3xl text-vt-ink sm:text-4xl">Checkout</h1>

        {empty ? (
          <div className="mt-10 rounded-2xl bg-white p-10 text-center ring-1 ring-vt-border">
            <p className="text-lg text-vt-ink">Your basket is empty.</p>
            <p className="mt-2 text-vt-muted">
              Browse the eLearning catalogue and add courses to your basket.
            </p>
            <Button href="/training" className="mt-6">
              View courses
            </Button>
          </div>
        ) : (
          <form className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]" onSubmit={onSubmit}>
            <div className="rounded-2xl bg-white p-6 sm:p-8 ring-1 ring-vt-border">
              <h2 className="text-xl font-bold text-vt-ink">Billing details</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Email Address" name="email" type="email" required />
                <Field label="Phone" name="phone" type="tel" required />
                <Field label="First Name" name="firstName" required />
                <Field label="Last Name" name="lastName" required />
                <div className="sm:col-span-2">
                  <Field label="Company Name (optional)" name="company" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-vt-slate" htmlFor="country">
                    Country / Region <span className="text-vt-red">*</span>
                  </label>
                  <select
                    id="country"
                    name="country"
                    required
                    defaultValue="IE"
                    className="w-full rounded-md bg-[#f3f3f3] px-3 py-2.5 text-vt-ink ring-1 ring-vt-border"
                  >
                    <option value="IE">Ireland</option>
                    <option value="GB">United Kingdom</option>
                    <option value="FR">France</option>
                    <option value="DE">Germany</option>
                    <option value="ES">Spain</option>
                    <option value="NL">Netherlands</option>
                    <option value="BE">Belgium</option>
                    <option value="IT">Italy</option>
                    <option value="PT">Portugal</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Street address" name="address" required />
                </div>
                <Field label="Town / City" name="city" required />
                <Field label="County" name="county" />
                <Field label="Eircode / Postcode" name="postcode" required />
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl bg-white p-6 ring-1 ring-vt-border sm:p-7">
                <h2 className="text-xl font-bold text-vt-ink">Your order</h2>
                <ul className="mt-5 divide-y divide-vt-border">
                  {orderLines.map((item) => (
                    <li key={`${item.slug}-${item.module ?? ""}`} className="flex gap-3 py-4">
                      <div className="relative size-16 shrink-0 overflow-hidden rounded bg-vt-mist">
                        <CourseThumb slug={item.slug} image={item.image} title={item.title} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-vt-ink">{item.title}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          <label className="flex items-center gap-2 text-sm text-vt-muted">
                            Qty
                            <input
                              type="number"
                              min={1}
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(item.slug, Number(e.target.value) || 1, item.module)
                              }
                              className="w-16 rounded border border-vt-border px-2 py-1"
                            />
                          </label>
                          <button
                            type="button"
                            className="text-sm text-vt-red hover:underline"
                            onClick={() => removeItem(item.slug, item.module)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <p className="shrink-0 font-semibold text-vt-price">
                        {formatEuro(item.lineTotal)}
                      </p>
                    </li>
                  ))}
                </ul>
                <dl className="mt-4 space-y-2 border-t border-vt-border pt-4 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-vt-muted">Subtotal (ex-VAT)</dt>
                    <dd className="font-semibold">{formatEuro(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-vt-muted">VAT</dt>
                    <dd className="font-semibold text-vt-muted">Calculated at checkout</dd>
                  </div>
                  <div className="flex justify-between text-base">
                    <dt className="font-bold text-vt-ink">Total due today</dt>
                    <dd className="font-bold text-vt-ink">{formatEuro(total)}+</dd>
                  </div>
                </dl>
                <p className="mt-2 text-xs text-vt-muted">
                  Final VAT is applied by Stripe Tax based on your billing address.
                </p>
              </div>

              <div className="rounded-2xl border border-dashed border-vt-border bg-white p-5">
                <button
                  type="button"
                  className="text-sm font-semibold text-vt-red hover:underline"
                  onClick={() => setCouponOpen((v) => !v)}
                >
                  Have a coupon? Click here to enter your coupon code
                </button>
                {couponOpen ? (
                  <div className="mt-3 flex gap-2">
                    <input
                      name="coupon"
                      placeholder="Coupon code"
                      className="flex-1 rounded-md bg-[#f3f3f3] px-3 py-2 ring-1 ring-vt-border"
                    />
                    <Button type="button" variant="ghost">
                      Apply
                    </Button>
                  </div>
                ) : null}
              </div>

              <div className="rounded-2xl bg-white p-6 ring-1 ring-vt-border">
                <h3 className="font-bold text-vt-ink">Payment</h3>
                <p className="mt-3 text-sm text-vt-slate">
                  You will be redirected to Stripe to pay securely by card. Test card:{" "}
                  <span className="font-mono text-vt-ink">4242 4242 4242 4242</span>.
                </p>
                <label className="mt-5 flex items-start gap-3 text-sm text-vt-slate">
                  <input
                    type="checkbox"
                    className="mt-1 size-4 accent-vt-red"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    required
                  />
                  <span>
                    I have read and agree to the website{" "}
                    <Link href="/contact" className="text-vt-red underline">
                      terms and conditions
                    </Link>
                  </span>
                </label>
                {error ? (
                  <p className="mt-4 rounded-lg border border-vt-red/30 bg-vt-red-soft px-3 py-2 text-sm text-vt-red">
                    {error}
                  </p>
                ) : null}
                <Button type="submit" size="lg" className="mt-6 w-full" disabled={!agree || loading}>
                  {loading ? "Redirecting to Stripe…" : "Pay with Stripe"}
                </Button>
                <button
                  type="button"
                  className="mt-3 w-full text-sm text-vt-muted hover:text-vt-navy"
                  onClick={() => router.push("/training")}
                >
                  ← Return to catalogue
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-vt-slate" htmlFor={name}>
        {label} {required ? <span className="text-vt-red">*</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-md bg-[#f3f3f3] px-3 py-2.5 text-vt-ink ring-1 ring-vt-border focus:ring-2 focus:ring-vt-red"
      />
    </div>
  );
}
