"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { newsletterForPath } from "@/content/newsletters";

export function NewsletterCta() {
  const pathname = usePathname();
  const copy = newsletterForPath(pathname);

  return (
    <section className="border-t border-vt-border bg-vt-mist">
      <div className="container-vt grid gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:px-10 lg:py-20">
        <div>
          <p className="type-eyebrow text-vt-red">Newsletter</p>
          <h2 className="type-h2 mt-3 text-balance text-vt-ink">{copy.title}</h2>
          <p className="mt-3 max-w-xl text-[1.0625rem] leading-relaxed text-vt-slate">{copy.body}</p>
        </div>
        <form
          className="flex flex-col gap-2.5 sm:flex-row"
          action="mailto:info@vigitrust.com"
          method="get"
          aria-label="Newsletter signup"
        >
          <label className="sr-only" htmlFor="newsletter-email">
            Email
          </label>
          <input
            id="newsletter-email"
            name="body"
            type="email"
            required
            placeholder="Work email"
            className="input-field h-11 flex-1"
          />
          <Button type="submit" size="lg" variant="navy">
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}
