import Link from "next/link";
import { ArrowRight, Building2, Hotel, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section";
import { HeroOrbit } from "@/components/ui/visuals";
import { home, testimonials } from "@/content/site";

const industryIcons = [Hotel, Users, Building2];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden navy-surface">
        <div className="absolute inset-0 network-grid opacity-50" aria-hidden />
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(ellipse_at_70%_40%,rgba(196,30,58,0.12),transparent_55%)] lg:block" aria-hidden />
        <div className="container-vt relative grid items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-10 lg:py-28">
          <div>
            <p className="type-eyebrow text-vt-cyan">Integrated risk management</p>
            <h1 className="type-display mt-4 tracking-[-0.045em] text-white">{home.hero.title}</h1>
            <div className="mt-6 max-w-xl space-y-3 text-[1.0625rem] leading-relaxed text-vt-on-dark/85">
              {home.hero.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="mt-9 flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <Button href={home.hero.primaryCta.href} size="lg">
                {home.hero.primaryCta.label}
              </Button>
              <Button href={home.hero.secondaryCta.href} variant="secondary" size="lg">
                {home.hero.secondaryCta.label}
                <ArrowRight className="size-4 opacity-80" aria-hidden />
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <HeroOrbit />
          </div>
        </div>
      </section>

      <section className="border-b border-vt-border bg-vt-paper">
        <div className="container-vt grid grid-cols-2 gap-px bg-vt-border sm:grid-cols-4">
          {home.stats.map((stat) => (
            <div key={stat.label} className="bg-vt-paper px-5 py-8 sm:px-6 sm:py-10">
              <div className="text-2xl font-semibold tracking-[-0.03em] text-vt-navy sm:text-3xl">
                {stat.value}
              </div>
              <div className="type-meta mt-1.5 text-vt-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad bg-vt-paper">
        <div className="container-vt">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <SectionHeading eyebrow={home.about.eyebrow} title={home.about.title} />
            <div className="space-y-5">
              {home.about.paragraphs.map((p) => (
                <p key={p.slice(0, 28)} className="text-[1.0625rem] leading-relaxed text-vt-slate">
                  {p}
                </p>
              ))}
              <div className="grid gap-0 border-t border-vt-border pt-8 sm:grid-cols-2 sm:gap-8">
                {home.about.cards.map((card) => (
                  <div key={card.title} className="border-b border-vt-border py-6 sm:border-0 sm:py-0">
                    <h3 className="type-h3 text-vt-ink">{card.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-vt-muted">{card.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-vt-mist">
        <div className="container-vt">
          <SectionHeading
            eyebrow={home.whyUs.eyebrow}
            title={home.whyUs.title}
            align="center"
          />
          <div className="mt-14 grid gap-px overflow-hidden rounded-[6px] border border-vt-border bg-vt-border lg:grid-cols-3">
            {home.whyUs.items.map((item, i) => {
              const Icon = industryIcons[i] ?? Users;
              return (
                <article key={item.title} className="bg-vt-paper p-8 sm:p-9">
                  <span className="mb-5 inline-flex size-9 items-center justify-center rounded-[4px] border border-vt-border bg-vt-mist text-vt-navy">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <h3 className="type-h3 text-vt-ink">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-vt-slate">{item.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-pad bg-vt-paper">
        <div className="container-vt">
          <SectionHeading eyebrow="Testimonials" title="What our clients say" />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {testimonials.map((t) => (
              <blockquote
                key={t.name}
                className="flex h-full flex-col border-l-2 border-vt-red pl-6 sm:pl-8"
              >
                <p className="flex-1 text-[1.0625rem] leading-relaxed text-vt-ink">“{t.quote}”</p>
                <footer className="mt-6">
                  <div className="text-sm font-semibold text-vt-navy">{t.name}</div>
                  <div className="type-meta mt-0.5 text-vt-muted">{t.role}</div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="navy-surface">
        <div className="container-vt px-5 py-20 text-center sm:px-8 lg:px-10 lg:py-24">
          <h2 className="type-h2 text-white">{home.midCta.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-vt-on-dark/80">
            {home.midCta.body}
          </p>
          <div className="mt-8">
            <Button href={home.midCta.cta.href} size="lg">
              {home.midCta.cta.label}
            </Button>
          </div>
        </div>
      </section>

      <section id="solutions" className="section-pad bg-vt-paper">
        <div className="container-vt">
          <div className="max-w-2xl">
            <SectionHeading eyebrow={home.solutions.eyebrow} title={home.solutions.title} />
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-vt-slate">{home.solutions.body}</p>
          </div>
          <div className="mt-12 divide-y divide-vt-border border-y border-vt-border">
            {home.solutions.items.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group flex items-center justify-between gap-6 py-6 transition hover:bg-vt-mist/80"
              >
                <div className="flex items-center gap-4">
                  <span className="inline-flex size-9 items-center justify-center rounded-[4px] border border-vt-border text-vt-navy transition group-hover:border-vt-red/30 group-hover:text-vt-red">
                    <Shield className="size-4" aria-hidden />
                  </span>
                  <h3 className="type-h3 text-vt-ink group-hover:text-vt-navy">{item.title}</h3>
                </div>
                <ArrowRight className="size-4 text-vt-muted transition group-hover:translate-x-0.5 group-hover:text-vt-red" aria-hidden />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
