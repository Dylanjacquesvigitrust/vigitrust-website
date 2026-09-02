import type { Metadata } from "next";
import {
  Building2,
  Database,
  HardDrive,
  Network,
  Siren,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section";
import { SiteImage } from "@/components/ui/site-image";
import { pillars } from "@/content/site";

export const metadata: Metadata = {
  title: "5 Pillars of Security",
  description: pillars.hero.body,
};

const pillarIcons = [Building2, Users, Database, Network, Siren];

export default function PillarsOfSecurityPage() {
  return (
    <>
      <section className="relative overflow-hidden hero-wash border-b border-vt-border py-16 md:py-24">
        <div className="container-vt max-w-4xl px-5 sm:px-8 lg:px-10">
          <p className="type-eyebrow mb-3 text-vt-red">{pillars.hero.eyebrow}</p>
          <h1 className="type-display max-w-3xl text-balance text-vt-ink">{pillars.hero.title}</h1>
          <p className="mt-5 max-w-2xl type-body-lg text-vt-slate">{pillars.hero.body}</p>

          <div className="mt-12 border-t border-vt-border pt-10">
            <SectionHeading eyebrow={pillars.about.eyebrow} title={pillars.about.title} />
            <div className="mt-6 space-y-4">
              {pillars.about.paragraphs.map((p) => (
                <p key={p.slice(0, 40)} className="type-body-lg text-vt-slate">
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-8">
              <Button href={pillars.about.surveyCta.href} size="lg">
                {pillars.about.surveyCta.label}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-vt-border bg-vt-mist section-pad">
        <div className="container-vt grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="type-eyebrow text-vt-red">From the CEO</p>
            <h2 className="type-h2 mt-3 text-vt-ink">{pillars.book.title}</h2>
            <p className="mt-5 type-body-lg text-vt-slate">{pillars.book.body}</p>
            <div className="mt-8">
              <Button href={pillars.book.href} variant="ghost">
                {pillars.book.cta}
              </Button>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-[14px] bg-white shadow-[var(--shadow-md)] ring-1 ring-vt-border lg:mx-0 lg:max-w-none">
            <SiteImage
              src={pillars.book.image}
              alt={`${pillars.book.title} book cover`}
              width={720}
              height={900}
              className="h-auto w-full object-contain"
              sizes="(max-width:1024px) 90vw, 360px"
            />
          </div>
        </div>
      </section>

      <section className="section-pad" id="understand">
        <div className="container-vt">
          <SectionHeading
            eyebrow="Understand the framework"
            title="Understand the 5 Pillars"
            body="Five practical lenses for organising security risk management across tangible assets, people, data, infrastructure, and crisis readiness."
            align="center"
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {pillars.pillars.map((pillar, index) => {
              const Icon = pillarIcons[index] ?? HardDrive;
              return (
                <article
                  key={pillar.title}
                  className={`rounded-[14px] bg-vt-paper p-7 ring-1 ring-vt-border ${
                    index === 4 ? "lg:col-span-2 xl:col-span-1" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex size-11 items-center justify-center rounded-full bg-vt-red-soft text-vt-red ring-1 ring-vt-border">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="type-eyebrow text-vt-muted">{pillar.number}</span>
                  </div>
                  <h3 className="type-h3 mt-5 text-vt-ink">{pillar.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-vt-slate">{pillar.body}</p>
                  <ul className="mt-5 space-y-2">
                    {pillar.items.map((item) => (
                      <li key={item} className="text-sm text-vt-ink">
                        <span className="mr-2 text-vt-red">·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 border-t border-vt-border pt-4 text-xs leading-relaxed text-vt-muted">
                    Responsibility: {pillar.responsibility}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-vt-border bg-vt-mist section-pad">
        <div className="container-vt max-w-4xl space-y-8">
          {pillars.insights.map((insight) => (
            <article key={insight.title} className="rounded-[12px] bg-vt-paper p-7 ring-1 ring-vt-border sm:p-8">
              <h2 className="type-h3 text-vt-ink">{insight.title}</h2>
              <p className="mt-4 leading-relaxed text-vt-slate">{insight.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="navy-surface section-pad">
        <div className="container-vt max-w-3xl text-center">
          <p className="type-eyebrow text-vt-cyan">Next step</p>
          <h2 className="type-h2 mt-3 text-white">{pillars.vigione.title}</h2>
          <p className="mt-5 type-body-lg text-white/90">{pillars.vigione.body}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href={pillars.vigione.cta.href} size="lg">
              {pillars.vigione.cta.label}
            </Button>
            <Button href={pillars.vigione.secondaryCta.href} variant="secondary" size="lg">
              {pillars.vigione.secondaryCta.label}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
