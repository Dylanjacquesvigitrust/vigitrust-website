import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { PageHero, SectionHeading } from "@/components/ui/section";
import { offices } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact VigiTrust in Dublin, New York, or Paris  -  or send a message to our team.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let’s talk about your compliance programme"
        body="Reach our teams in Dublin, New York, and Paris  -  or send a message and a specialist will respond within one business day."
      />

      <section className="section-pad">
        <div className="container-vt grid gap-6 lg:grid-cols-3">
          {offices.map((office) => (
            <article key={office.region} className="rounded-[10px] bg-vt-paper p-6 ring-1 ring-vt-border">
              <h2 className="type-h3 text-vt-navy">{office.region}</h2>
              <p className="mt-3 text-sm text-vt-muted">{office.address}</p>
              <p className="mt-3 text-sm font-semibold text-vt-ink">{office.phone}</p>
              <a className="mt-1 block text-sm text-vt-red hover:underline" href={`mailto:${office.email}`}>
                {office.email}
              </a>
            </article>
          ))}
        </div>

        <div className="container-vt mt-12">
          <div className="grid overflow-hidden rounded-[14px] bg-vt-paper shadow-[var(--shadow-soft)] ring-1 ring-vt-border lg:grid-cols-[0.9fr_1.1fr]">
            <div className="bg-vt-mist p-8 sm:p-10">
              <SectionHeading
                title="Send us a message"
                body="Tell us a little about your organisation, your challenges, or what you’d like to explore. We typically respond within one business day."
              />
            </div>
            <div className="p-8 sm:p-10">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
