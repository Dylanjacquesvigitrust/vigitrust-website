import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Clock, MapPin, Users } from "lucide-react";
import { AdminAddWorkshopForm, AdminRemoveButton } from "@/components/admin/content-forms";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section";
import { SiteImage } from "@/components/ui/site-image";
import { getPublishedWorkshops } from "@/lib/cms";
import { inPersonTraining } from "@/content/site";

export const metadata: Metadata = {
  title: "In-person Training",
  description: inPersonTraining.hero.body,
};

export default async function InPersonTrainingPage() {
  const workshops = await getPublishedWorkshops();
  return (
    <>
      <section className="relative overflow-hidden navy-surface py-16 md:py-24">
        <div className="absolute inset-0 network-grid opacity-20" aria-hidden />
        <div className="container-vt relative px-5 sm:px-8 lg:px-10">
          <p className="type-eyebrow text-vt-cyan">{inPersonTraining.hero.eyebrow}</p>
          <h1 className="type-display mt-3 max-w-3xl text-balance text-white">
            {inPersonTraining.hero.title}
          </h1>
          <p className="mt-5 max-w-2xl type-body-lg text-vt-on-dark/90">{inPersonTraining.hero.body}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href={inPersonTraining.hero.primaryCta.href} size="lg">
              {inPersonTraining.hero.primaryCta.label}
            </Button>
            <Button href={inPersonTraining.hero.secondaryCta.href} variant="secondary" size="lg">
              {inPersonTraining.hero.secondaryCta.label}
            </Button>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-vt">
          <SectionHeading
            title={inPersonTraining.workshops.title}
            body={inPersonTraining.workshops.body}
          />
          <div className="mt-8">
            <AdminAddWorkshopForm />
          </div>
          {workshops.length === 0 ? (
            <div className="mt-10 rounded-[12px] bg-vt-mist p-8 ring-1 ring-vt-border sm:p-10">
              <h3 className="type-h3 text-vt-ink">{inPersonTraining.workshops.emptyTitle}</h3>
              <p className="mt-3 max-w-2xl text-vt-slate">{inPersonTraining.workshops.emptyBody}</p>
              <div className="mt-6">
                <Button href={inPersonTraining.workshops.emptyCta.href}>
                  {inPersonTraining.workshops.emptyCta.label}
                </Button>
              </div>
            </div>
          ) : (
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {workshops.map((workshop) => (
              <article
                key={workshop.id}
                className="card-lift relative flex h-full flex-col overflow-hidden rounded-[12px] bg-vt-paper ring-1 ring-vt-border"
              >
                <AdminRemoveButton kind="workshop" slug={workshop.id} label={workshop.title} />
                {workshop.image ? (
                  <div className="relative aspect-[16/9]">
                    <SiteImage
                      src={workshop.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width:1024px) 100vw, 50vw"
                    />
                  </div>
                ) : null}
                <div className="flex flex-1 flex-col p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-vt-mist px-3 py-1 text-xs font-semibold text-vt-azure">
                    <MapPin className="size-3.5" aria-hidden />
                    {workshop.city}
                  </span>
                  <span className="type-eyebrow text-vt-muted">{workshop.format}</span>
                </div>
                <h3 className="type-h3 mt-4 text-vt-ink">{workshop.title}</h3>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-vt-muted">
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-4 text-vt-azure" aria-hidden />
                    {workshop.dates}
                  </span>
                  <span>{workshop.duration}</span>
                  <span className="flex items-center gap-1.5">
                    <Users className="size-4 text-vt-azure" aria-hidden />
                    {workshop.seats}
                  </span>
                </div>
                <ul className="mt-5 flex flex-1 flex-wrap gap-2">
                  {workshop.topics.map((topic) => (
                    <li
                      key={topic}
                      className="rounded-full border border-vt-border bg-vt-mist px-3 py-1 text-xs font-medium text-vt-slate"
                    >
                      {topic}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Button href="/contact?intent=in-person-training#contact-form" variant="ghost" size="sm">
                    Reserve a seat
                  </Button>
                </div>
                </div>
              </article>
            ))}
          </div>
          )}
        </div>
      </section>

      <section className="border-y border-vt-border bg-vt-mist section-pad">
        <div className="container-vt grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading
              title={inPersonTraining.agenda.title}
              body={inPersonTraining.agenda.body}
            />
          </div>
          <ol className="space-y-4">
            {inPersonTraining.agenda.sessions.map((session) => (
              <li
                key={session.time}
                className="flex gap-4 rounded-[10px] bg-vt-paper p-5 ring-1 ring-vt-border"
              >
                <span className="type-meta shrink-0 font-semibold tabular-nums text-vt-red">
                  {session.time}
                </span>
                <div>
                  <h3 className="font-semibold text-vt-ink">{session.title}</h3>
                  <p className="mt-1 text-sm text-vt-muted">{session.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-vt">
          <SectionHeading title={inPersonTraining.audience.title} align="center" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {inPersonTraining.audience.items.map((item) => (
              <article
                key={item.title}
                className="rounded-[10px] bg-vt-paper p-6 ring-1 ring-vt-border"
              >
                <h3 className="type-h3 text-vt-ink">{item.title}</h3>
                <p className="mt-2 text-sm text-vt-muted">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-vt-border bg-vt-paper section-pad">
        <div className="container-vt grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionHeading title={inPersonTraining.included.title} />
          <ul className="space-y-3">
            {inPersonTraining.included.items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-vt-muted">
                <Check className="mt-0.5 size-4 shrink-0 text-vt-red" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="navy-surface section-pad">
        <div className="container-vt grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <SectionHeading
              title={inPersonTraining.corporate.title}
              body={inPersonTraining.corporate.body}
              tone="dark"
            />
            <div className="mt-6">
              <Button href={inPersonTraining.corporate.cta.href} variant="secondary" size="lg">
                {inPersonTraining.corporate.cta.label}
              </Button>
            </div>
          </div>
          <div className="grid gap-4">
            {inPersonTraining.relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="card-lift group flex items-center justify-between rounded-[10px] bg-white/6 p-6 ring-1 ring-white/12"
              >
                <div>
                  <h3 className="font-semibold text-white group-hover:text-vt-cyan">{link.label}</h3>
                  <p className="mt-1 text-sm text-vt-on-dark/75">{link.description}</p>
                </div>
                <ArrowRight className="size-5 shrink-0 text-vt-cyan" aria-hidden />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
