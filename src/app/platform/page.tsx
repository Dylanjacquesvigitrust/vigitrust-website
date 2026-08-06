import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section";
import { ProductShot } from "@/components/ui/visuals";
import { platform } from "@/content/site";

export const metadata: Metadata = {
  title: "VigiOne Platform",
  description:
    "Unify governance, risk and compliance with VigiOne  -  built for organisations and assessors.",
};

export default function PlatformPage() {
  return (
    <>
      <section className="relative overflow-hidden navy-surface">
        <div className="absolute inset-0 network-grid opacity-40" aria-hidden />
        <div className="container-vt relative px-5 pb-12 pt-16 sm:px-8 lg:px-10 lg:pb-16 lg:pt-24">
          <div className="max-w-3xl">
            <p className="type-eyebrow mb-3 text-vt-cyan">{platform.overview.eyebrow}</p>
            <h1 className="type-display text-balance text-white">{platform.overview.title}</h1>
            <div className="mt-5 max-w-2xl space-y-3 text-[1.0625rem] leading-relaxed text-vt-on-dark/80">
              {platform.overview.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
              <Button href="/demo" size="lg">
                Book A Demo
              </Button>
              <Button href="/platform/organisations" variant="secondary" size="lg">
                For Organisations
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            </div>
          </div>

          <div className="mt-12 lg:mt-14">
            <ProductShot
              src="/images/product/dashboard-1-sm.webp"
              alt="VigiOne platform dashboard"
              priority
              className="mx-auto max-w-5xl"
            />
          </div>
        </div>
      </section>

      <section className="section-pad bg-vt-paper">
        <div className="container-vt grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow={platform.complexity.eyebrow}
              title={platform.complexity.title}
              body={platform.complexity.lead}
            />
            <div className="mt-6 space-y-4">
              {platform.complexity.body.map((p) => (
                <p key={p.slice(0, 24)} className="leading-relaxed text-vt-slate">
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-8 border-l-2 border-vt-red bg-vt-mist/80 p-6 sm:p-7">
              <h3 className="type-h3 text-vt-ink">{platform.complexity.calloutTitle}</h3>
              <p className="mt-3 text-sm leading-relaxed text-vt-slate">
                {platform.complexity.calloutBody}
              </p>
            </div>
          </div>
          <ProductShot
            src="/images/product/dashboard-2-sm.webp"
            alt="VigiOne compliance analytics widgets"
          />
        </div>
      </section>

      <section className="navy-surface">
        <div className="section-pad container-vt">
          <div className="max-w-3xl">
            <h2 className="type-h2 text-white">{platform.bothSides.title}</h2>
            <p className="mt-4 leading-relaxed text-vt-on-dark/80">{platform.bothSides.body}</p>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-[6px] border border-white/10 bg-white/10 md:grid-cols-2">
            {[platform.bothSides.organisations, platform.bothSides.assessors].map((card) => (
              <a
                key={card.title}
                href={card.href}
                className="group block bg-vt-navy p-8 transition hover:bg-vt-navy-mid sm:p-9"
              >
                <h3 className="type-h3 text-white">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-vt-on-dark/75">{card.body}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white">
                  Learn more
                  <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" aria-hidden />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-vt-mist">
        <div className="container-vt">
          <SectionHeading title={platform.capabilities.title} align="center" />
          <div className="mt-12 grid gap-px overflow-hidden rounded-[6px] border border-vt-border bg-vt-border lg:grid-cols-3">
            {platform.capabilities.items.map((item) => (
              <article key={item.title} className="bg-vt-paper p-8 text-left">
                <h3 className="type-h3 text-vt-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-vt-slate">{item.body}</p>
              </article>
            ))}
          </div>
          <div className="mt-12">
            <ProductShot
              src="/images/product/elearning-menu-sm.webp"
              alt="VigiOne eLearning and awareness modules"
            />
          </div>
          <div className="mt-10 flex flex-col justify-center gap-2.5 sm:flex-row">
            <Button href="/demo" size="lg">
              Book A Demo
            </Button>
            <Button href="/platform/assessment-360" variant="ghost" size="lg">
              Assessment 360
            </Button>
          </div>
        </div>
      </section>

      <section className="section-pad bg-vt-paper">
        <div className="container-vt">
          <SectionHeading
            eyebrow="Modules"
            title="Everything required to run continuous compliance"
            align="center"
          />
          <div className="mt-12 grid gap-0 border-t border-vt-border sm:grid-cols-2 lg:grid-cols-3">
            {platform.modules.map((mod) => (
              <article
                key={mod.name}
                className="border-b border-vt-border p-6 sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0"
              >
                <h3 className="type-h3 text-vt-ink">{mod.name}</h3>
                <ul className="mt-4 space-y-2">
                  {mod.items.map((item) => (
                    <li key={item} className="text-sm text-vt-muted">
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {platform.frameworks.map((f) => (
              <span
                key={f}
                className="rounded-[4px] border border-vt-border bg-vt-mist px-3 py-1.5 text-xs font-semibold text-vt-navy"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
