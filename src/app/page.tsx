import Link from "next/link";
import { ArrowRight, Building2, Hotel, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductShot } from "@/components/ui/visuals";
import { home, testimonials } from "@/content/site";

const industryIcons = [Hotel, Users, Building2];

export default function HomePage() {
  const [heroLead, heroSupport] = home.hero.body;

  return (
    <>
      {/* Vanta-style light hero: value prop first, product below */}
      <section className="hero-wash relative overflow-hidden">
        <div className="container-wide px-5 pb-10 pt-14 sm:px-8 sm:pt-20 lg:px-10 lg:pt-24">
          <div className="mx-auto max-w-4xl text-center">
            <p className="type-eyebrow text-vt-red">{home.hero.title}</p>
            <h1 className="type-display mt-5 text-balance text-vt-ink">{heroLead}</h1>
            <p className="mx-auto mt-6 max-w-2xl type-body-lg text-vt-slate">{heroSupport}</p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href={home.hero.primaryCta.href} size="lg">
                {home.hero.primaryCta.label}
              </Button>
              <Button href={home.hero.secondaryCta.href} variant="ghost" size="lg">
                {home.hero.secondaryCta.label}
                <ArrowRight className="size-4 opacity-70" aria-hidden />
              </Button>
            </div>
          </div>

          <div className="relative mx-auto mt-14 max-w-5xl lg:mt-16">
            <div
              className="pointer-events-none absolute -inset-x-10 -bottom-8 -top-6 rounded-[40px] bg-[radial-gradient(ellipse_at_center,rgba(47,111,143,0.12),transparent_70%)]"
              aria-hidden
            />
            <ProductShot
              src="/images/product/dashboard-1-sm.webp"
              alt="VigiOne platform dashboard"
              priority
              className="relative shadow-[var(--shadow-soft)]"
            />
          </div>
        </div>
      </section>

      {/* Trust / outcomes strip */}
      <section className="border-y border-vt-border bg-[color:var(--background)]">
        <div className="container-wide px-5 py-10 sm:px-8 lg:px-10">
          <p className="text-center type-meta text-vt-muted">
            Trusted by organisations preparing for continuous compliance worldwide
          </p>
          <dl className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-6">
            {home.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <dd className="text-3xl font-semibold tracking-[-0.04em] text-vt-ink sm:text-4xl">
                  {stat.value}
                </dd>
                <dt className="mt-1.5 type-meta text-vt-muted">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* About — split editorial */}
      <section className="section-pad bg-[color:var(--background)]">
        <div className="container-vt">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="type-eyebrow text-vt-red">{home.about.eyebrow}</p>
              <h2 className="type-h2 mt-3 text-balance text-vt-ink">{home.about.title}</h2>
            </div>
            <div className="lg:col-span-7">
              <div className="space-y-5">
                {home.about.paragraphs.map((p) => (
                  <p key={p.slice(0, 28)} className="type-body-lg text-vt-slate">
                    {p}
                  </p>
                ))}
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {home.about.cards.map((card) => (
                  <div key={card.title} className="panel-quiet p-6">
                    <h3 className="type-h3 text-vt-ink">{card.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-vt-muted">{card.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions — “It’s all here” product feature grid */}
      <section id="solutions" className="section-pad bg-vt-mist">
        <div className="container-vt">
          <div className="max-w-2xl">
            <p className="type-eyebrow text-vt-red">{home.solutions.eyebrow}</p>
            <h2 className="type-h2 mt-3 text-balance text-vt-ink">{home.solutions.title}</h2>
            <p className="mt-4 type-body-lg text-vt-slate">{home.solutions.body}</p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {home.solutions.items.map((item, index) => (
              <Link
                key={item.title}
                href={item.href}
                className="panel card-lift group flex min-h-[220px] flex-col p-7 sm:p-8"
              >
                <span className="inline-flex size-8 items-center justify-center rounded-lg bg-vt-red-soft text-sm font-semibold text-vt-red">
                  {index + 1}
                </span>
                <h3 className="type-h3 mt-6 text-vt-ink">{item.title}</h3>
                <span className="mt-auto inline-flex items-center gap-2 pt-10 text-sm font-semibold text-vt-red">
                  Learn more
                  <ArrowRight className="size-3.5 transition duration-200 group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-vt-border bg-vt-paper shadow-[var(--shadow-sm)]">
            <ProductShot
              src="/images/product/dashboard-2-sm.webp"
              alt="VigiOne compliance analytics"
              className="rounded-none border-0 shadow-none ring-0"
            />
          </div>
        </div>
      </section>

      {/* Why Us — audience cards like Vanta “Built for you” */}
      <section className="section-pad bg-[color:var(--background)]">
        <div className="container-vt">
          <div className="mx-auto max-w-2xl text-center">
            <p className="type-eyebrow text-vt-red">{home.whyUs.eyebrow}</p>
            <h2 className="type-h2 mt-3 text-balance text-vt-ink">{home.whyUs.title}</h2>
          </div>
          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {home.whyUs.items.map((item, i) => {
              const Icon = industryIcons[i] ?? Users;
              return (
                <article key={item.title} className="panel-quiet flex h-full flex-col p-7 sm:p-8">
                  <span className="mb-5 inline-flex size-10 items-center justify-center rounded-xl bg-vt-mist text-vt-navy ring-1 ring-vt-border">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="type-h3 text-vt-ink">{item.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-vt-slate">{item.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Proof / testimonials — large quotes */}
      <section className="section-pad bg-vt-mist">
        <div className="container-vt">
          <p className="type-eyebrow text-vt-red">Proof</p>
          <h2 className="type-h2 mt-3 max-w-xl text-balance text-vt-ink">What our clients say</h2>
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {testimonials.map((t) => (
              <blockquote key={t.name} className="panel flex h-full flex-col p-7 sm:p-9">
                <p className="flex-1 text-lg leading-relaxed tracking-[-0.02em] text-vt-ink">
                  “{t.quote}”
                </p>
                <footer className="mt-8 border-t border-vt-border pt-6">
                  <div className="text-sm font-semibold text-vt-ink">{t.name}</div>
                  <div className="type-meta mt-0.5 text-vt-muted">{t.role}</div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA — navy band, restrained */}
      <section className="navy-surface">
        <div className="container-vt flex flex-col items-start justify-between gap-8 px-5 py-16 sm:px-8 lg:flex-row lg:items-center lg:px-10 lg:py-20">
          <div className="max-w-xl">
            <h2 className="type-h2 text-white">{home.midCta.title}</h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-vt-on-dark/80">
              {home.midCta.body}
            </p>
          </div>
          <Button href={home.midCta.cta.href} size="lg" className="shrink-0">
            {home.midCta.cta.label}
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      </section>
    </>
  );
}
