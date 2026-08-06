import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { NewsletterCta } from "@/components/layout/newsletter-cta";
import { brand, footer } from "@/content/layout";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <NewsletterCta />

      <div className="border-t border-vt-border bg-[color:var(--background)]">
        <div className="container-wide grid gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr] lg:gap-20 lg:px-10 lg:py-20">
          <div>
            <BrandLogo />
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-vt-muted">{footer.blurb}</p>
          </div>
          {footer.columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-vt-ink">{column.title}</h3>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}-${link.href}`}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-vt-muted transition duration-200 hover:text-vt-ink"
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
          <div className="container-wide flex flex-col gap-2 px-5 py-5 text-[13px] text-vt-muted sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
            <p>
              © {year} {brand.name}. All rights reserved.
            </p>
            <p>Governance, risk, and compliance software.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
