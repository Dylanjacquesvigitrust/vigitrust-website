import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PageHero, SectionHeading } from "@/components/ui/section";
import { about, offices } from "@/content/site";

export const metadata: Metadata = {
  title: "About VigiTrust",
  description: about.hero.body,
};

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow={about.hero.eyebrow} title={about.hero.title} body={about.hero.body}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/demo" size="lg">
            Book A Demo
          </Button>
          <Button href="/advisory-board" variant="secondary" size="lg">
            Advisory Board
          </Button>
        </div>
      </PageHero>

      <section className="section-pad">
        <div className="container-vt grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-vt-mist ring-1 ring-vt-border">
            <Image
              src={about.leadership.image}
              alt={about.leadership.name}
              fill
              className="object-cover object-[center_20%]"
              sizes="(max-width:1024px) 100vw, 45vw"
              priority
            />
          </div>
          <div>
            <SectionHeading
              eyebrow={about.leadership.eyebrow}
              title={about.leadership.title}
            />
            <p className="mt-2 text-sm font-semibold text-vt-azure">
              {about.leadership.name} · {about.leadership.role}
            </p>
            <p className="mt-5 type-body-lg text-vt-muted">{about.leadership.body}</p>
            <p className="mt-6 leading-relaxed text-vt-muted">{about.story}</p>
          </div>
        </div>

        <div className="container-vt mt-14 max-w-5xl">
          <div className="grid gap-6 sm:grid-cols-2">
            {about.highlights.map((item) => (
              <article key={item.title} className="h-full rounded-[10px] bg-vt-paper p-7 ring-1 ring-vt-border">
                <h2 className="type-h3 text-vt-ink">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-vt-muted">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-vt-paper section-pad">
        <div className="container-vt">
          <SectionHeading eyebrow="Global presence" title="Dublin · New York · Paris" align="center" />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {offices.map((office) => (
              <article key={office.region} className="rounded-[10px] bg-vt-mist p-7 ring-1 ring-vt-border">
                <h3 className="type-h3 text-vt-navy">{office.region}</h3>
                <p className="mt-3 text-sm text-vt-muted">{office.address}</p>
                <p className="mt-3 text-sm font-semibold text-vt-ink">{office.phone}</p>
                <a href={`mailto:${office.email}`} className="mt-1 block text-sm text-vt-red hover:underline">
                  {office.email}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
