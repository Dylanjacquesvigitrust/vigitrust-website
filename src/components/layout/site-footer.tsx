import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { NewsletterCta } from "@/components/layout/newsletter-cta";
import { brand, footer } from "@/content/layout";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <NewsletterCta />

      <div className="border-t border-vt-border bg-vt-paper">
        <div className="container-vt grid gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr] lg:px-10 lg:py-16">
          <div>
            <BrandLogo />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-vt-muted">{footer.blurb}</p>
          </div>
          {footer.columns.map((column) => (
            <div key={column.title}>
              <h3 className="type-eyebrow text-vt-muted">{column.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}-${link.href}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-vt-slate transition hover:text-vt-navy"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-vt-border">
          <div className="container-vt flex flex-col gap-2 px-5 py-4 text-xs text-vt-muted sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
            <p>
              © {year} {brand.name}. All rights reserved.
            </p>
            <p className="text-vt-muted/80">Governance, risk, and compliance software.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
