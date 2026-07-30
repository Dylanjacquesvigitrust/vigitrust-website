"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatEuro, useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { training } from "@/content/courses";
import { withBasePath } from "@/lib/paths";

function CourseThumb({ slug, image, title }: { slug: string; image?: string; title: string }) {
  const courseImage = training.courses.find((c) => c.slug === slug)?.image;
  const src = withBasePath(courseImage || image || "/images/courses/quiz.webp");

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={title}
      width={64}
      height={64}
      className="size-full object-cover"
      loading="lazy"
    />
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, vat, total, updateQuantity, removeItem, clear } = useCart();
  const [couponOpen, setCouponOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [agree, setAgree] = useState(false);

  const empty = items.length === 0;

  const orderLines = useMemo(
    () =>
      items.map((i) => {
        const course = training.courses.find((c) => c.slug === i.slug);
        return {
          ...i,
          image: course?.image ?? i.image,
          lineTotal: i.price * i.quantity,
        };
      }),
    [items],
  );

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!agree || empty) return;
    setSubmitted(true);
    clear();
  }

  if (submitted) {
    return (
      <section className="section-pad">
        <div className="container-vt max-w-xl rounded-2xl bg-white p-8 text-center ring-1 ring-vt-border sm:p-12">
          <h1 className="brand-display text-3xl text-vt-ink">Order received</h1>
          <p className="mt-3 text-vt-muted">
            Thanks  -  your purchase request was captured. In production this connects to Stripe /
            your payment gateway. A specialist will also follow up at the email you provided.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button href="/training">Continue shopping</Button>
            <Button href="/" variant="ghost">
              Back home
            </Button>
          </div>
        </div>
      </section>
    );
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
                    defaultValue="Ireland"
                    className="w-full rounded-md bg-[#f3f3f3] px-3 py-2.5 text-vt-ink ring-1 ring-vt-border"
                  >
                    <option>Ireland</option>
                    <option>United Kingdom</option>
                    <option>France</option>
                    <option>United States</option>
                    <option>Other</option>
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
                    <dt className="text-vt-muted">Subtotal</dt>
                    <dd className="font-semibold">{formatEuro(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-vt-muted">VAT (23%)</dt>
                    <dd className="font-semibold">{formatEuro(vat)}</dd>
                  </div>
                  <div className="flex justify-between text-base">
                    <dt className="font-bold text-vt-ink">Total</dt>
                    <dd className="font-bold text-vt-ink">{formatEuro(total)}</dd>
                  </div>
                </dl>
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
                <label className="mt-4 flex items-center gap-3 text-sm text-vt-slate">
                  <input type="radio" name="payment" defaultChecked className="size-4 accent-vt-red" />
                  Credit / Debit Card
                </label>
                <p className="mt-3 text-xs text-vt-muted">
                  Card capture is simulated in this build. Connect Stripe (or your gateway) for live
                  charges. Test mode reference from staging: card 4242 4242 4242 4242.
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
                <Button type="submit" size="lg" className="mt-6 w-full" disabled={!agree}>
                  Place order
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
