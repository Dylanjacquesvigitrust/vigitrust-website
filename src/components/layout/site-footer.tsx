import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { NewsletterCta } from "@/components/layout/newsletter-cta";
import { brand, footer } from "@/content/layout";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <NewsletterCta />

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
