import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero, SectionHeading } from "@/components/ui/section";
import { SiteImage } from "@/components/ui/site-image";
import { bookingsUrl } from "@/content/layout";
import { platform } from "@/content/site";

export const metadata: Metadata = {
  title: "Assessment 360",
  description: platform.assessment360.body,
};

export default function Assessment360Page() {
  const content = platform.assessment360;

  return (
    <>
      <PageHero eyebrow={content.eyebrow} title={content.title} body={content.body}>
        <Button href={bookingsUrl} size="lg">
          Book A Demo
        </Button>
      </PageHero>

      <section className="section-pad bg-vt-paper">
        <div className="container-vt">
          <SectionHeading
            eyebrow={content.sectionEyebrow}
            title={content.sectionTitle}
            body={content.sectionBody[0]}
            align="center"
          />
          <div className="mx-auto mt-6 max-w-3xl space-y-4 text-center">
            {content.sectionBody.slice(1).map((p) => (
              <p key={p.slice(0, 36)} className="leading-relaxed text-vt-muted">
                {p}
              </p>
            ))}
          </div>
          <div className="mt-12">
            <figure className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl bg-vt-paper shadow-[var(--shadow-soft)] ring-1 ring-vt-border">
              <SiteImage
                src="/images/product/assessment-360.png"
                alt="VigiOne Assessment 360 framework and builder overview"
                width={2400}
                height={1598}
                priority
                unoptimized
                className="h-auto w-full object-contain"
              />
            </figure>
          </div>
          <p className="mt-6 text-center text-sm font-semibold tracking-wide text-vt-azure">
            {content.tagline}
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-vt">
          <SectionHeading title={content.featuresTitle} align="center" />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 rounded-[10px] bg-vt-paper p-5 ring-1 ring-vt-border"
              >
                <Check className="mt-0.5 size-4 shrink-0 text-vt-red" aria-hidden />
                <span className="text-sm font-medium text-vt-ink">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-vt-border bg-vt-mist section-pad">
        <div className="container-vt">
          <SectionHeading
            eyebrow="Framework coverage"
            title="Any standard your programme needs"
            body="Map proprietary controls to recognised frameworks across cybersecurity, privacy, risk, regulation, and ESG."
            align="center"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {content.categories.map((category) => (
              <article key={category.title} className="rounded-[12px] bg-vt-paper p-6 ring-1 ring-vt-border">
                <h3 className="type-h3 text-vt-ink">{category.title}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-[4px] bg-vt-mist px-2.5 py-1 text-xs font-medium text-vt-slate ring-1 ring-vt-border"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="navy-surface">
        <div className="section-pad container-vt">
          <div className="grid gap-6 lg:grid-cols-3">
            {content.highlights.map((item) => (
              <article key={item.title} className="h-full rounded-[10px] bg-white/6 p-7 ring-1 ring-white/12">
                <div className="mb-4 h-8 w-1 rounded-full bg-vt-red" aria-hidden />
                <h3 className="type-h3 text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-vt-on-dark/80">{item.body}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Button href={bookingsUrl} size="lg">
              Book A Demo
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
