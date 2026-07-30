import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Hotel, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section";
import { HeroOrbit } from "@/components/ui/visuals";
import { home, testimonials } from "@/content/site";

const industryIcons = [Hotel, Shield, Building2];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <Image
          src={home.hero.image}
          alt=""
          fill
          priority
          quality={75}
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(8,24,40,0.92)_0%,rgba(11,31,51,0.9)_55%,rgba(11,31,51,0.88)_100%)]" />
        <div className="absolute inset-0 network-grid opacity-20" aria-hidden />
        <div className="container-vt relative grid items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:px-10 lg:py-28">
          <div>
            <h1 className="type-display tracking-[0.06em] text-white">{home.hero.title}</h1>
            <div className="mt-6 max-w-xl space-y-3 type-body-lg text-white/95">
              {home.hero.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href={home.hero.primaryCta.href} size="lg">
                {home.hero.primaryCta.label}
              </Button>
              <Button href={home.hero.secondaryCta.href} variant="secondary" size="lg">
                {home.hero.secondaryCta.label}
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <HeroOrbit />
          </div>
        </div>
      </section>

      <section className="section-pad bg-vt-paper">
        <div className="container-vt">
          <SectionHeading eyebrow={home.about.eyebrow} title={home.about.title} />
          <div className="mt-6 max-w-4xl space-y-4">
            {home.about.paragraphs.map((p) => (
              <p key={p.slice(0, 28)} className="type-body-lg text-vt-slate">
                {p}
              </p>
            ))}
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {home.about.cards.map((card) => (
              <article
                key={card.title}
                className="rounded-[10px] bg-vt-mist p-7 ring-1 ring-vt-border"
              >
                <h3 className="type-h3 text-vt-ink">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-vt-slate">{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 lg:px-10">
        <div className="container-vt grid gap-6 rounded-[14px] bg-vt-navy p-6 shadow-[var(--shadow-soft)] sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
          {home.stats.map((stat) => (
            <div key={stat.label} className="text-center lg:text-left">
              <div className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{stat.value}</div>
              <div className="type-meta mt-1 text-vt-cyan">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad bg-vt-mist">
        <div className="container-vt">
          <SectionHeading
            eyebrow={home.whyUs.eyebrow}
            title={home.whyUs.title}
            align="center"
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {home.whyUs.items.map((item, i) => {
              const Icon = industryIcons[i] ?? Shield;
              return (
                <article
                  key={item.title}
                  className="h-full rounded-[10px] bg-vt-paper p-7 ring-1 ring-vt-border"
                >
                  <span className="mb-5 inline-flex size-11 items-center justify-center rounded-full bg-vt-red-soft text-vt-red ring-1 ring-vt-border">
                    <Icon className="size-5" aria-hidden />
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
          <SectionHeading eyebrow="Testimonials" title="What Our Clients Say" />
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {testimonials.map((t) => (
              <blockquote
                key={t.name}
                className="flex h-full flex-col rounded-[10px] bg-vt-mist p-7 ring-1 ring-vt-border"
              >
                <p className="flex-1 leading-relaxed text-vt-ink">“{t.quote}”</p>
                <footer className="mt-6 border-t border-vt-border pt-4">
                  <div className="font-semibold text-vt-red">{t.name}</div>
                  <div className="type-meta text-vt-muted">{t.role}</div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden navy-surface">
        <div className="absolute inset-0 network-grid opacity-15" aria-hidden />
        <div className="container-vt relative px-5 py-16 text-center sm:px-8 lg:px-10 lg:py-20">
          <h2 className="type-h2 text-white">{home.midCta.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
            {home.midCta.body}
          </p>
          <div className="mt-8">
            <Button href={home.midCta.cta.href} size="lg">
              {home.midCta.cta.label}
            </Button>
          </div>
        </div>
      </section>

      <section id="solutions" className="section-pad bg-vt-mist">
        <div className="container-vt">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto_1.1fr] lg:items-center">
            <SectionHeading
              eyebrow={home.solutions.eyebrow}
              title={home.solutions.title}
            />
            <div className="hidden h-24 w-px bg-vt-border lg:block" aria-hidden />
            <p className="type-body-lg text-vt-slate">{home.solutions.body}</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {home.solutions.items.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group card-lift flex h-full flex-col items-center rounded-[10px] bg-vt-paper px-6 py-10 text-center ring-1 ring-vt-border"
              >
                <span className="mb-5 inline-flex size-14 items-center justify-center rounded-full bg-vt-red-soft text-vt-red ring-1 ring-vt-border">
                  <Shield className="size-5" aria-hidden />
                </span>
                <h3 className="type-h3 text-vt-ink group-hover:text-vt-red">{item.title}</h3>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-vt-azure">
                  Explore <ArrowRight className="size-3.5" aria-hidden />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
