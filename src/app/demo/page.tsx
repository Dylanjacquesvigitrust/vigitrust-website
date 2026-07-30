import type { Metadata } from "next";
import { DemoForm } from "@/components/forms/demo-form";
import { PageHero } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Book a Demo",
  description: "Request a tailored VigiOne demo for your organisation’s frameworks and assessment model.",
};

export default function DemoPage() {
  return (
    <>
      <PageHero
        eyebrow="Book a Demo"
        title="See VigiOne with your use cases"
        body="Share a few details and we’ll schedule a walkthrough tailored to your frameworks, assessment model, and training needs."
      />
      <section className="section-pad">
        <div className="container-vt max-w-3xl">
          <div className="rounded-[14px] bg-vt-paper p-8 shadow-[var(--shadow-soft)] ring-1 ring-vt-border sm:p-10">
            <DemoForm />
          </div>
        </div>
      </section>
    </>
  );
}
