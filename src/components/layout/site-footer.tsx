import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { brand, footer } from "@/content/layout";
import { Button } from "@/components/ui/button";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <section className="relative overflow-hidden navy-surface">
        <div className="absolute inset-0 network-grid opacity-20" aria-hidden />
        <div className="container-vt relative grid gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:px-10 lg:py-16">
          <div>
            <h2 className="type-h2 text-balance text-white">{footer.newsletter.title}</h2>
            <p className="mt-3 max-w-xl text-vt-on-dark/85">{footer.newsletter.body}</p>
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

      <div className="bg-vt-paper">
        <div className="container-vt grid gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.5fr_1fr_1fr] lg:px-10">
          <div>
            <BrandLogo />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-vt-muted">{footer.blurb}</p>
          </div>
          {footer.columns.map((column) => (
            <div key={column.title}>
              <h3 className="type-eyebrow border-t border-vt-border pt-3 text-vt-muted">{column.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}-${link.href}`}>
                    <Link href={link.href} className="text-sm text-vt-slate transition hover:text-vt-red">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="bg-vt-navy py-3 text-center text-xs text-white/70">
          Copyright © {year}. {brand.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
