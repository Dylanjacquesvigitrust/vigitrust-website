"use client";

import { useState } from "react";
import { Calendar, MapPin } from "lucide-react";

export type PastEvent = {
  id: string;
  title: string;
  dateLabel: string;
  location: string;
  theme: string | null;
  category: string;
};

export function EventsFilter({
  filters,
  pastEvents,
}: {
  filters: readonly string[];
  pastEvents: PastEvent[];
}) {
  const [active, setActive] = useState(filters[0] ?? "All");

  const filtered = pastEvents.filter((event) => {
    if (active === "All") return true;
    return event.category === active;
  });

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter events">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            role="tab"
            aria-selected={active === filter}
            onClick={() => setActive(filter)}
            className={`rounded-[6px] px-4 py-2 text-sm font-semibold transition ${
              active === filter
                ? "bg-vt-navy text-white"
                : "bg-vt-paper text-vt-muted ring-1 ring-vt-border hover:text-vt-ink"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5">
        {filtered.map((event) => (
          <article
            key={event.id}
            className="grid overflow-hidden rounded-[14px] bg-vt-paper ring-1 ring-vt-border md:grid-cols-[7.5rem_1fr]"
          >
            <div className="flex flex-row items-center gap-3 bg-vt-navy px-5 py-4 text-white md:flex-col md:items-start md:justify-center md:px-6 md:py-8">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-vt-cyan">
                {event.dateLabel.split(" ")[0]}
              </span>
              <span className="text-2xl font-bold leading-none md:text-3xl">
                {event.dateLabel.match(/\d+/)?.[0] ?? ""}
              </span>
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-[4px] bg-vt-red-soft px-2.5 py-1 text-xs font-semibold text-vt-red">
                  {event.category}
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm text-vt-muted">
                  <Calendar className="size-3.5" aria-hidden />
                  {event.dateLabel}
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm text-vt-muted">
                  <MapPin className="size-3.5" aria-hidden />
                  {event.location}
                </span>
              </div>
              <h3 className="type-h3 mt-3 text-vt-ink">{event.title}</h3>
              {event.theme ? <p className="mt-2 text-sm font-medium text-vt-azure">{event.theme}</p> : null}
            </div>
          </article>
        ))}
        {filtered.length === 0 ? (
          <p className="rounded-[10px] bg-vt-paper p-8 text-center text-vt-muted ring-1 ring-vt-border">
            No events in this category yet.
          </p>
        ) : null}
      </div>
    </>
  );
}
