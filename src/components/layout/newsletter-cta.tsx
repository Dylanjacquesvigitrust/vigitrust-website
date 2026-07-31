"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { newsletterForPath } from "@/content/newsletters";

export function NewsletterCta() {
  const pathname = usePathname();
  const copy = newsletterForPath(pathname);

  return (
    <section className="relative overflow-hidden navy-surface">
      <div className="absolute inset-0 network-grid opacity-20" aria-hidden />
      <div className="container-vt relative grid gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:px-10 lg:py-16">
        <div>
          <h2 className="type-h2 text-balance text-white">{copy.title}</h2>
          <p className="mt-3 max-w-xl text-vt-on-dark/85">{copy.body}</p>
        </div>
        <form
          className="flex flex-col gap-3 sm:flex-row"
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
            placeholder="Email"
            className="h-11 flex-1 rounded-[6px] border-0 bg-vt-paper px-4 text-vt-ink placeholder:text-vt-muted"
          />
          <Button type="submit" size="lg">
            Sign Up
          </Button>
        </form>
      </div>
    </section>
  );
}
