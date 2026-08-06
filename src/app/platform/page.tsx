import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section";
import { ProductShot } from "@/components/ui/visuals";
import { bookingsUrl } from "@/content/layout";
import { platform } from "@/content/site";

export const metadata: Metadata = {
  title: "VigiOne Platform",
  description:
    "Unify governance, risk and compliance with VigiOne  -  built for organisations and assessors.",
};

export default function PlatformPage() {
  return (
    <>
      <section className="hero-wash border-b border-vt-border">
        <div className="container-wide px-5 pb-12 pt-16 sm:px-8 lg:px-10 lg:pb-16 lg:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="type-eyebrow text-vt-red">{platform.overview.eyebrow}</p>
            <h1 className="type-display mt-4 text-balance text-vt-ink">{platform.overview.title}</h1>
            <div className="mx-auto mt-6 max-w-2xl space-y-3 type-body-lg text-vt-slate">
              {platform.overview.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href={bookingsUrl} size="lg">
                Book A Demo
              </Button>
              <Button href="/platform/organisations" variant="ghost" size="lg">
                For Organisations
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            </div>
          </div>

          <div className="mx-auto mt-14 max-w-5xl">
            <ProductShot
              src="/images/product/dashboard-1-sm.webp"
              alt="VigiOne platform dashboard"
              priority
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
            <div className="mt-8 rounded-2xl border border-vt-border border-l-[3px] border-l-vt-red bg-vt-mist p-6 sm:p-7">
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

      <section className="section-pad bg-vt-mist">
        <div className="container-vt">
          <div className="max-w-3xl">
            <h2 className="type-h2 text-vt-ink">{platform.bothSides.title}</h2>
            <p className="mt-4 type-body-lg text-vt-slate">{platform.bothSides.body}</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {[platform.bothSides.organisations, platform.bothSides.assessors].map((card) => (
              <a
                key={card.title}
                href={card.href}
                className="panel card-lift group block p-8 sm:p-9"
              >
                <h3 className="type-h3 text-vt-ink">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-vt-slate">{card.body}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-vt-red">
                  Learn more
                  <ArrowRight className="size-3.5 transition duration-200 group-hover:translate-x-0.5" aria-hidden />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-vt-paper">
        <div className="container-vt">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading title={platform.capabilities.title} className="max-w-2xl" />
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <Button href={bookingsUrl} size="md">
                Book A Demo
              </Button>
              <Button href="/platform/assessment-360" variant="ghost" size="md">
                Assessment 360
              </Button>
            </div>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {platform.capabilities.items.map((item) => (
              <article key={item.title} className="panel-quiet p-7 sm:p-8">
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
        </div>
      </section>

      <section className="section-pad bg-vt-mist">
        <div className="container-vt">
          <SectionHeading
            eyebrow="Modules"
            title="Everything required to run continuous compliance"
            className="max-w-2xl"
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {platform.modules.map((mod) => (
              <article key={mod.name} className="panel p-6">
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
          <div className="mt-10 flex flex-wrap gap-2">
            {platform.frameworks.map((f) => (
              <span
                key={f}
                className="rounded-xl border border-vt-border bg-vt-paper px-3.5 py-2 text-xs font-semibold text-vt-navy"
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
