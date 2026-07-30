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
        <div className="absolute inset-0 network-grid opacity-20" aria-hidden />
        <div className="container-vt relative px-5 pb-10 pt-12 sm:px-8 lg:px-10 lg:pb-14 lg:pt-16">
          <div className="max-w-3xl">
            <p className="type-eyebrow mb-3 text-vt-cyan">{platform.overview.eyebrow}</p>
            <h1 className="type-display text-balance text-white">{platform.overview.title}</h1>
            <div className="mt-5 max-w-2xl space-y-3 type-body-lg text-vt-on-dark/90">
              {platform.overview.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/demo" size="lg">
                Book A Demo
              </Button>
              <Button href="/platform/organisations" variant="secondary" size="lg">
                For Organisations
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            </div>
          </div>

          <div className="mt-10 lg:mt-12">
            <ProductShot
              src="/images/product/dashboard-1-sm.webp"
              alt="VigiOne platform dashboard"
              priority
              className="mx-auto max-w-6xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.55)]"
            />
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-vt grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow={platform.complexity.eyebrow}
              title={platform.complexity.title}
              body={platform.complexity.lead}
            />
            <div className="mt-6 space-y-4">
              {platform.complexity.body.map((p) => (
                <p key={p.slice(0, 24)} className="leading-relaxed text-vt-muted">
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-8 rounded-[14px] navy-surface p-7 text-white sm:p-8">
              <h3 className="type-h3">{platform.complexity.calloutTitle}</h3>
              <p className="mt-3 text-vt-on-dark/85">{platform.complexity.calloutBody}</p>
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
          <div className="grid gap-6 lg:grid-cols-[1fr_auto_1.1fr] lg:items-center">
            <h2 className="type-h2 text-white">{platform.bothSides.title}</h2>
            <div className="hidden h-20 w-px bg-vt-red lg:block" aria-hidden />
            <p className="leading-relaxed text-vt-on-dark/85">{platform.bothSides.body}</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[platform.bothSides.organisations, platform.bothSides.assessors].map((card) => (
              <a
                key={card.title}
                href={card.href}
                className="card-lift block h-full rounded-[10px] bg-white/6 p-8 ring-1 ring-white/12"
              >
                <h3 className="type-h3 text-white">{card.title}</h3>
                <p className="mt-3 text-vt-on-dark/80">{card.body}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-vt-cyan">
                  Learn more <ArrowRight className="size-4" aria-hidden />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-vt-paper">
        <div className="container-vt">
          <SectionHeading title={platform.capabilities.title} align="center" />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {platform.capabilities.items.map((item) => (
              <article
                key={item.title}
                className="h-full rounded-[10px] bg-vt-mist p-7 text-center ring-1 ring-vt-border"
              >
                <h3 className="type-h3 text-vt-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-vt-muted">{item.body}</p>
              </article>
            ))}
          </div>
          <div className="mt-12">
            <ProductShot
              src="/images/product/elearning-menu-sm.webp"
              alt="VigiOne eLearning and awareness modules"
            />
          </div>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/demo" size="lg">
              Book A Demo
            </Button>
            <Button href="/platform/assessment-360" variant="secondary" size="lg">
              Assessment 360
            </Button>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-vt">
          <SectionHeading
            eyebrow="Modules"
            title="Everything required to run continuous compliance"
            align="center"
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {platform.modules.map((mod) => (
              <article key={mod.name} className="h-full rounded-[10px] bg-vt-paper p-6 ring-1 ring-vt-border">
                <h3 className="type-h3 text-vt-ink">{mod.name}</h3>
                <ul className="mt-4 space-y-2">
                  {mod.items.map((item) => (
                    <li key={item} className="text-sm text-vt-muted">
                      · {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {platform.frameworks.map((f) => (
              <span
                key={f}
                className="rounded-full bg-vt-mist px-4 py-2 text-sm font-semibold text-vt-navy ring-1 ring-vt-border"
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
