import type { Metadata } from "next";
import Link from "next/link";
import {
  Award,
  BookOpen,
  Calendar,
  Check,
  Globe,
  MapPin,
  MessageSquare,
  Mic,
  Users,
} from "lucide-react";
import { CharteredAdvisorCheckoutButton } from "@/components/advisory/chartered-advisor-checkout-button";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section";
import { SiteImage } from "@/components/ui/site-image";
import { advisory } from "@/content/site";

export const metadata: Metadata = {
  title: "Global Advisory Board",
  description: advisory.hero.lead,
};

const whyJoinIcons = [Users, BookOpen, Globe];
const benefitIcons = [Calendar, MessageSquare, BookOpen, Users, Mic, Award];

export default function AdvisoryBoardPage() {
  return (
    <>
      <section className="relative overflow-hidden hero-wash border-b border-vt-border py-16 md:py-24">
        <div className="container-wide relative px-5 sm:px-8 lg:px-10">
          <span className="inline-flex items-center gap-2 rounded-xl border border-vt-border bg-vt-paper px-3.5 py-1.5 type-eyebrow text-vt-navy shadow-[var(--shadow-xs)]">
            <Globe className="size-3.5" aria-hidden />
            {advisory.hero.badge}
          </span>

          <h1 className="type-display mt-6 max-w-4xl text-balance text-vt-ink">
            {advisory.hero.titleBefore}{" "}
            <span className="text-vt-red">{advisory.hero.titleAccent}</span>
          </h1>

          <p className="mt-5 max-w-2xl type-body-lg text-vt-slate">{advisory.hero.lead}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CharteredAdvisorCheckoutButton size="lg">
              {advisory.hero.primaryCta.label}
            </CharteredAdvisorCheckoutButton>
            <Button href={advisory.hero.secondaryCta.href} variant="ghost" size="lg">
              {advisory.hero.secondaryCta.label}
            </Button>
          </div>

          <div className="mt-12 grid gap-4 border-t border-vt-border pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {advisory.hero.stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <span className="size-1.5 shrink-0 rounded-[2px] bg-vt-red" aria-hidden />
                <span className="text-sm font-medium text-vt-slate sm:text-base">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-vt-border bg-vt-mist section-pad">
        <div className="container-vt">
          <SectionHeading title={advisory.socialProof.title} align="center" />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {advisory.socialProof.logos.map((logo) => (
              <div
                key={logo}
                className="flex h-24 items-center justify-center rounded-[10px] bg-vt-paper px-6 ring-1 ring-vt-border transition hover:ring-vt-azure/40"
              >
                <span className="text-sm font-semibold tracking-tight text-vt-muted">{logo}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad" id="why-join">
        <div className="container-vt">
          <SectionHeading
            title={advisory.whyJoin.title}
            body={advisory.whyJoin.body}
            align="center"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {advisory.whyJoin.items.map((item, i) => {
              const Icon = whyJoinIcons[i] ?? Users;
              return (
                <article
                  key={item.title}
                  className="card-lift flex h-full flex-col rounded-[10px] bg-vt-paper p-8 ring-1 ring-vt-border"
                >
                  <span className="mb-5 inline-flex size-12 items-center justify-center rounded-[8px] border border-vt-border bg-vt-mist text-vt-azure">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="type-h3 text-vt-ink">{item.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-vt-muted">{item.body}</p>
                  <div className="mt-6 h-px w-12 bg-vt-red/50" aria-hidden />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-vt-border bg-vt-mist section-pad" id="benefits">
        <div className="container-vt">
          <SectionHeading title={advisory.benefits.title} align="center" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {advisory.benefits.items.map((item, i) => {
              const Icon = benefitIcons[i] ?? Award;
              return (
                <article
                  key={item.title}
                  className="card-lift rounded-[10px] bg-vt-paper p-7 ring-1 ring-vt-border"
                >
                  <span className="mb-4 inline-flex size-10 items-center justify-center rounded-[6px] bg-vt-mist text-vt-azure">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <h3 className="type-h3 text-vt-ink">{item.title}</h3>
                  <p className="mt-2 text-sm text-vt-muted">{item.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-pad" id="membership">
        <div className="container-vt">
          <SectionHeading
            title={advisory.membership.title}
            body={advisory.membership.body}
            align="center"
          />
          <div className="mt-12 grid items-start gap-6 lg:grid-cols-3 lg:gap-8">
            {advisory.membership.tiers.map((tier) => (
              <article
                key={tier.id}
                className={`card-lift relative flex h-full flex-col rounded-[12px] bg-vt-paper ring-1 ring-vt-border ${
                  tier.featured
                    ? "shadow-[0_4px_32px_-8px_rgba(196,30,58,0.15)] ring-vt-red/35 lg:scale-[1.03]"
                    : ""
                }`}
              >
                {tier.featured ? (
                  <div className="absolute inset-x-0 top-0 h-1 rounded-t-[12px] bg-vt-red" aria-hidden />
                ) : null}
                <div className="flex flex-1 flex-col p-8">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="type-h3 text-vt-ink">{tier.name}</h3>
                    {tier.badge ? (
                      <span
                        className={`shrink-0 rounded-[6px] px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-wide ${
                          tier.featured
                            ? "border border-vt-red/40 bg-vt-red-soft text-vt-red"
                            : "border border-vt-border bg-vt-mist text-vt-muted"
                        }`}
                      >
                        {tier.badge}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className={`text-3xl font-bold ${tier.featured ? "text-vt-red" : "text-vt-ink"}`}>
                      {tier.price}
                    </span>
                    <span className="text-vt-muted">{tier.period}</span>
                  </div>
                  <p className="mt-4 text-sm text-vt-muted">{tier.description}</p>
                  <ul className="mt-8 flex-1 space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-vt-muted">
                        <Check
                          className={`mt-0.5 size-4 shrink-0 ${tier.featured ? "text-vt-red" : "text-vt-azure"}`}
                          aria-hidden
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    {tier.id === "chartered" ? (
                      <CharteredAdvisorCheckoutButton
                        variant="primary"
                        className="w-full"
                      >
                        {tier.cta.label}
                      </CharteredAdvisorCheckoutButton>
                    ) : (
                      <Button
                        href={tier.cta.href}
                        variant={tier.featured ? "primary" : "ghost"}
                        className="w-full"
                      >
                        {tier.cta.label}
                      </Button>
                    )}
                    {"globalNote" in tier && tier.globalNote ? (
                      <Link
                        href={tier.globalNote.href}
                        className="mt-3 flex items-center justify-center gap-1.5 text-center text-[0.6875rem] text-vt-muted transition hover:text-vt-azure"
                      >
                        <Globe className="size-3.5" aria-hidden />
                        <span>
                          {tier.globalNote.label} - <strong className="text-vt-azure">Global Participation</strong>
                        </span>
                      </Link>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="relative overflow-hidden border-y border-vt-border bg-vt-mist section-pad"
        id="global-participation"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(123,168,176,0.2),transparent)]"
          aria-hidden
        />
        <div className="container-vt relative">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-vt-border bg-vt-paper px-3.5 py-1.5 type-eyebrow text-vt-azure">
              <Globe className="size-3.5" aria-hidden />
              {advisory.globalParticipation.badge}
            </span>
            <SectionHeading
              className="mt-6"
              title={advisory.globalParticipation.title}
              body={advisory.globalParticipation.body}
              align="center"
            />
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {advisory.globalParticipation.countries.map((country) => (
              <span
                key={country}
                className="card-lift rounded-[6px] border border-vt-border bg-vt-paper px-4 py-2 text-sm font-medium text-vt-ink"
              >
                {country}
              </span>
            ))}
          </div>
          <div className="mx-auto mt-10 max-w-2xl text-center">
            <p className="text-vt-muted">{advisory.globalParticipation.note}</p>
            <div className="mt-6">
              <Button href={advisory.globalParticipation.cta.href} size="lg">
                {advisory.globalParticipation.cta.label}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad" id="leadership">
        <div className="container-vt">
          <SectionHeading title={advisory.leadership.title} align="center" />
          <article className="card-lift mx-auto mt-10 max-w-3xl overflow-hidden rounded-[12px] bg-vt-paper ring-1 ring-vt-border">
            <div className="grid sm:grid-cols-[14rem_1fr]">
              <div className="relative min-h-[16rem] bg-vt-mist sm:min-h-full">
                <SiteImage
                  src={advisory.leadership.founder.image}
                  alt={advisory.leadership.founder.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width:640px) 100vw, 224px"
                />
              </div>
              <div className="p-8 sm:p-10">
                <p className="type-eyebrow text-vt-red">{advisory.leadership.founder.role}</p>
                <h3 className="type-h3 mt-1 text-vt-ink">{advisory.leadership.founder.name}</h3>
                <p className="mt-1 text-sm font-medium text-vt-azure">{advisory.leadership.founder.org}</p>
                <p className="mt-4 text-sm leading-relaxed text-vt-muted">{advisory.leadership.founder.bio}</p>
              </div>
            </div>
          </article>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {advisory.leadership.regionalDirectors.map((director) => (
              <article
                key={director.name}
                className="card-lift rounded-[10px] bg-vt-paper p-6 ring-1 ring-vt-border"
              >
                <div className="mb-4 flex size-14 items-center justify-center rounded-[10px] border border-vt-border bg-vt-mist text-sm font-bold text-vt-azure">
                  {director.initials}
                </div>
                <h4 className="font-semibold text-vt-ink">{director.name}</h4>
                <p className="mt-1 text-sm text-vt-azure">{director.role}</p>
                <p className="type-meta mt-2 uppercase tracking-wide text-vt-muted">{director.region}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden section-pad">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(123,168,176,0.2),transparent)]"
          aria-hidden
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-vt-red/40 to-transparent" aria-hidden />
        <div className="container-vt relative mx-auto max-w-3xl text-center">
          <h2 className="type-h2 text-balance text-vt-ink">{advisory.finalCta.title}</h2>
          <p className="mt-4 type-body-lg text-vt-muted">{advisory.finalCta.body}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CharteredAdvisorCheckoutButton size="lg">
              {advisory.finalCta.primaryCta.label}
            </CharteredAdvisorCheckoutButton>
            <Button href={advisory.finalCta.secondaryCta.href} variant="ghost" size="lg">
              {advisory.finalCta.secondaryCta.label}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
