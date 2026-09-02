/** Shared brand tokens for layout chrome (safe for client bundles). */
export const brand = {
  name: "VigiTrust",
  product: "VigiOne",
  tagline: "Global Compliance. Simplified.",
  email: "info@vigitrust.com",
  logo: "/brand/vigitrust-logo.png",
  mark: "/brand/vigitrust-icon.png",
} as const;

/** Microsoft Bookings — all “Book a Demo” CTAs should use this. */
export const bookingsUrl =
  "https://outlook.office.com/book/VigiTrustScheduling@vigitrust.com/?ismsaljsauthenabled";

export const navigation = {
  primary: [
    {
      label: "Solutions",
      href: "/platform",
      children: [
        { label: "Platform", href: "/platform", description: "Unified GRC for continuous compliance" },
        {
          label: "For Organisations",
          href: "/platform/organisations",
          description: "Operational compliance for your teams",
        },
        { label: "For Assessors", href: "/platform/assessors", description: "Scale assessments with clarity" },
        {
          label: "Assessment 360",
          href: "/platform/assessment-360",
          description: "Flexible assessments, standards-aligned",
        },
      ],
    },
    {
      label: "Training & Certifications",
      href: "/training",
      children: [
        { label: "eLearning Catalogue", href: "/training", description: "Browse courses and add to basket" },
        {
          label: "In-Person Training",
          href: "/training/in-person",
          description: "Instructor-led workshops worldwide",
        },
      ],
    },
    {
      label: "Resources",
      href: "/resources",
      children: [
        { label: "About VigiTrust", href: "/about", description: "Our mission and global reach" },
        { label: "Events", href: "/events", description: "Summits, dinners, and community gatherings" },
        { label: "Advisory Board", href: "/advisory-board", description: "Global cyber leaders and peer network" },
        { label: "Blog & News", href: "/blog", description: "Insights and announcements" },
        { label: "5 Pillars Framework", href: "/pillars-of-security", description: "Award-winning methodology" },
      ],
    },
  ],
  cta: { label: "Contact Us", href: "/contact#contact-form" },
};

export const footer = {
  blurb:
    "VigiTrust provides award-winning solutions in Governance, Risk, and Compliance. With over 20 years of expertise and clients in 120+ countries, we empower organisations to prepare for, validate & maintain continuous compliance through our VigiOne platform and eLearning programmes.",
  columns: [
    {
      title: "Quicklinks",
      links: [
        { label: "Home", href: "/" },
        { label: "About us", href: "/about" },
        { label: "VigiOne Platform", href: "/platform" },
        { label: "Advisory Board", href: "/advisory-board" },
        { label: "Events", href: "/events" },
        { label: "Contact Us", href: "/contact#contact-form" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "VigiOne Platform Overview", href: "/platform" },
        { label: "eLearning & Training", href: "/training" },
        { label: "5 Pillars Framework", href: "/pillars-of-security" },
        { label: "In-person Training", href: "/training/in-person" },
        { label: "News", href: "/blog" },
        { label: "Blog", href: "/blog" },
      ],
    },
  ],
} as const;
