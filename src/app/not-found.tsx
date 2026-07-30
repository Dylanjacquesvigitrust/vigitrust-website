import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section className="section-pad">
      <div className="container-vt max-w-xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-vt-red">404</p>
        <h1 className="brand-display mt-3 text-4xl text-vt-ink">This page isn’t here</h1>
        <p className="mt-4 text-vt-muted">
          The link may be outdated, or the page may have moved. Head home or book a demo instead.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/">Back home</Button>
          <Button href="/demo" variant="ghost">
            Book a Demo
          </Button>
        </div>
      </div>
    </section>
  );
}
