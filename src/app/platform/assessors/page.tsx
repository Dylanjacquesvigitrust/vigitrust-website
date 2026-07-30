import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { PageHero, SectionHeading } from "@/components/ui/section";
import { ProductShot } from "@/components/ui/visuals";
import { platform } from "@/content/site";

export const metadata: Metadata = {
  title: "VigiOne for Assessors",
  description: platform.assessors.body,
};

export default function AssessorsPage() {
  const content = platform.assessors;

  return (
    <>
      <PageHero eyebrow={content.eyebrow} title={content.title} body={content.body}>
        <Button href="/demo" size="lg">
          Book A Demo
        </Button>
      </PageHero>

      <section className="section-pad">
        <div className="container-vt">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.15fr]">
            <SectionHeading
              eyebrow="Built for assessors"
              title="Scale assessments without losing clarity"
              body="Collaborate with client teams, collect evidence remotely, and keep every engagement audit-ready."
            />
            <ProductShot
              src="/images/product/assessment-template-sm.webp"
              alt="VigiOne assessment templates for assessors"
            />
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {content.features.map((feature) => (
              <article key={feature.title} className="h-full rounded-[10px] bg-vt-paper p-7 ring-1 ring-vt-border">
                <h2 className="type-h3 text-vt-ink">{feature.title}</h2>
                <p className="mt-3 leading-relaxed text-vt-muted">{feature.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
