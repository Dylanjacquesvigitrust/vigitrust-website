"use client";

import { useEffect } from "react";
import { bookingsUrl } from "@/content/layout";

/** Legacy /demo route — send visitors to Microsoft Bookings. */
export default function DemoPage() {
  useEffect(() => {
    window.location.replace(bookingsUrl);
  }, []);

  return (
    <section className="section-pad">
      <div className="container-vt max-w-lg text-center">
        <p className="type-eyebrow text-vt-red">Book a Demo</p>
        <h1 className="type-h2 mt-3 text-vt-ink">Opening scheduling…</h1>
        <p className="mt-4 text-vt-slate">
          If you are not redirected,{" "}
          <a
            href={bookingsUrl}
            className="font-semibold text-vt-red underline underline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            schedule online here
          </a>
          .
        </p>
      </div>
    </section>
  );
}
