"use client";

import { useEffect } from "react";

/** Ensures hash targets (e.g. #contact-form) scroll into view after Next.js navigations. */
export function ScrollToHash() {
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;

    const scroll = () => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    scroll();
    const t = window.setTimeout(scroll, 50);
    return () => window.clearTimeout(t);
  }, []);

  return null;
}
