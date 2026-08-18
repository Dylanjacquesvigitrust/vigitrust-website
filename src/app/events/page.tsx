import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bell } from "lucide-react";
import { AdminAddEventForm, AdminRemoveButton } from "@/components/admin/content-forms";
import { Button } from "@/components/ui/button";
import { PageHero, SectionHeading } from "@/components/ui/section";
import { SiteImage } from "@/components/ui/site-image";
import { getPublishedEvents } from "@/lib/cms";
import { events } from "@/content/site";
import { EventsFilter } from "./events-filter";

export const metadata: Metadata = {
  title: "Events",
  description: events.hero.body,
};

export default async function EventsPage() {
  const allEvents = await getPublishedEvents();
  const upcomingEvents = allEvents.filter((event) => event.timing === "upcoming");
  const pastEvents = allEvents.filter((event) => event.timing !== "upcoming");
  return (
    <>
      <PageHero
        eyebrow={events.hero.eyebrow}
        title={events.hero.title}
        body={events.hero.body}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href={events.upcoming.cta.href} size="lg">
            {events.upcoming.cta.label}
          </Button>
          <Button href="/advisory-board" variant="secondary" size="lg">
            Join the Advisory Board
          </Button>
        </div>
      </PageHero>

      <section className="section-pad">
        <div className="container-vt">
          <AdminAddEventForm />
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-stretch">
          <div className="relative overflow-hidden rounded-[16px] navy-surface p-8 sm:p-10">
            <div className="absolute inset-0 network-grid opacity-15" aria-hidden />
            <div className="relative">
              <p className="type-eyebrow text-vt-cyan">{events.upcoming.title}</p>
              {upcomingEvents.length === 0 ? (
                <>
                  <h2 className="type-h2 mt-3 text-white">{events.upcoming.emptyTitle}</h2>
                  <p className="mt-4 max-w-md text-vt-on-dark/85">{events.upcoming.emptyBody}</p>
                </>
              ) : (
                <div className="mt-5 space-y-4">
                  {upcomingEvents.map((event) => (
                    <article key={event.id} className="relative overflow-hidden rounded-xl bg-white/8 ring-1 ring-white/12">
                      <AdminRemoveButton kind="event" slug={event.id} label={event.title} />
                      {event.image ? (
                        <div className="relative aspect-[16/9]">
                          <SiteImage src={event.image} alt="" fill className="object-cover" sizes="480px" />
                        </div>
                      ) : null}
                      <div className="p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-vt-cyan">
                        {event.dateLabel}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-white">{event.title}</h3>
                      <p className="mt-1 text-sm text-vt-on-dark/80">{event.location}</p>
                      {event.theme ? <p className="mt-2 text-sm text-vt-cyan">{event.theme}</p> : null}
                      </div>
                    </article>
                  ))}
                </div>
              )}
              <div className="mt-8">
                <Button href={events.upcoming.cta.href} size="lg">
                  <Bell className="size-4" aria-hidden />
                  {events.upcoming.cta.label}
                </Button>
              </div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {[
              { label: "Advisory summits", body: "Two-day immersive gatherings for global cyber leaders." },
              { label: "Executive dinners", body: "Intimate peer networking in key world cities." },
              { label: "Regional briefings", body: "Focused sessions on regulation, risk, and resilience." },
            ].map((item) => (
              <article
                key={item.label}
                className="rounded-[12px] bg-vt-paper p-6 ring-1 ring-vt-border"
              >
                <h3 className="type-h3 text-vt-ink">{item.label}</h3>
                <p className="mt-2 text-sm text-vt-muted">{item.body}</p>
              </article>
            ))}
          </div>
          </div>
        </div>
      </section>

      <section className="border-y border-vt-border bg-vt-mist section-pad">
        <div className="container-vt">
          <SectionHeading
            eyebrow="Archive"
            title="Past events"
            body="A record of recent advisory summits and networking gatherings from the VigiTrust community."
          />
          <EventsFilter filters={events.filters} pastEvents={pastEvents} />
        </div>
      </section>

      <section className="navy-surface section-pad">
        <div className="container-vt">
          <SectionHeading
            eyebrow="Explore further"
            title="Stay connected with the community"
            tone="dark"
            align="center"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {events.relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="card-lift group flex h-full flex-col rounded-[12px] bg-white/6 p-8 ring-1 ring-white/12"
              >
                <h3 className="type-h3 text-white group-hover:text-vt-cyan">{link.label}</h3>
                <p className="mt-3 flex-1 text-sm text-vt-on-dark/80">{link.description}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-vt-cyan">
                  Learn more
                  <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
