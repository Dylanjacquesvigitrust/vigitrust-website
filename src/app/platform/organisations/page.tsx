import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { PageHero, SectionHeading } from "@/components/ui/section";
import { ProductShot } from "@/components/ui/visuals";
import { bookingsUrl } from "@/content/layout";
import { platform } from "@/content/site";

export const metadata: Metadata = {
  title: "VigiOne for Organisations",
  description: platform.organisations.body,
};

export default function OrganisationsPage() {
  const content = platform.organisations;

  return (
    <>
      <PageHero eyebrow={content.eyebrow} title={content.title} body={content.body}>
        <Button href={bookingsUrl} size="lg">
          Book A Demo
        </Button>
      </PageHero>

      <section className="section-pad">
        <div className="container-vt">
          <SectionHeading title={content.featuresHeading} align="center" />
          <div className="mt-12 grid items-center gap-12 lg:grid-cols-2">
            <SectionHeading title={content.features[0].title} body={content.features[0].body} />
            <ProductShot
              src="/images/product/assessment-template-sm.webp"
              alt="VigiOne assessment templates for organisations"
            />
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {content.features.slice(1).map((feature) => (
              <article key={feature.title} className="h-full rounded-[10px] bg-vt-paper p-7 ring-1 ring-vt-border">
                <h3 className="type-h3 text-vt-ink">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-vt-muted">{feature.body}</p>
              </article>
            ))}
          </div>
          <div className="mt-14">
            <ProductShot
              src="/images/product/five-pillars-sm.webp"
              alt="5 Pillars of Security risk analysis in VigiOne"
              className="mx-auto max-w-5xl"
            />
          </div>
          <div className="mt-12 flex justify-center">
            <Button href={bookingsUrl} size="lg">
              See VigiOne in action
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
