import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/section";
import { resources } from "@/content/site";

export const metadata: Metadata = {
  title: "Resources",
  description: resources.hero.body,
};

export default function ResourcesPage() {
  return (
    <>
      <PageHero eyebrow={resources.hero.eyebrow} title={resources.hero.title} body={resources.hero.body} />

      <section className="section-pad">
        <div className="container-vt grid gap-6 md:grid-cols-2">
          {resources.items.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="card-lift block h-full rounded-[10px] bg-vt-paper p-8 ring-1 ring-vt-border"
            >
              <h2 className="type-h3 text-vt-ink">{item.title}</h2>
              <p className="mt-3 text-vt-muted">{item.body}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
