/** Shared brand tokens for layout chrome (safe for client bundles). */
export const brand = {
  name: "VigiTrust",
  product: "VigiOne",
  tagline: "Global Compliance. Simplified.",
  email: "info@vigitrust.com",
  logo: "/brand/vigitrust-logo.png",
  mark: "/brand/vigitrust-logo.png",
} as const;

export const navigation = {
  primary: [
    {
      label: "Company",
      href: "/about",
      children: [
        { label: "About VigiTrust", href: "/about", description: "Our mission and global reach" },
        { label: "Advisory Board", href: "/advisory-board", description: "Global cyber leadership network" },
        { label: "Events", href: "/events", description: "Summits, dinners, and community gatherings" },
      ],
    },
    {
      label: "VigiOne Platform",
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
          label: "PCI DSS Training",
          href: "/training/payment-card-security-pci",
          description: "Payment card security courses",
        },
        { label: "GDPR Training", href: "/training/gdpr-fundamentals", description: "Privacy and data protection" },
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
        { label: "Blog & News", href: "/blog", description: "Insights and announcements" },
        { label: "5 Pillars Framework", href: "/pillars-of-security", description: "Award-winning methodology" },
      ],
    },
    {
      label: "Contact",
      href: "/contact",
    },
  ],
  cta: { label: "Book A Demo", href: "/demo" },
};

export const footer = {
  blurb:
    "VigiTrust provides award-winning solutions in Governance, Risk, and Compliance. With over 20 years of expertise and clients in 120+ countries, we empower organisations to prepare, validate, and maintain continuous compliance through our VigiOne platform, eLearning, and advisory services.",
  columns: [
    {
      title: "Quicklinks",
      links: [
        { label: "Home", href: "/" },
        { label: "About us", href: "/about" },
        { label: "Solutions", href: "/platform" },
        { label: "Events", href: "/events" },
        { label: "Contact Us", href: "/contact" },
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
  newsletter: {
    title: "Stay Ahead In Compliance",
    body: "Subscribe to get insights, news, and resources on VigiOne, eLearning, and global frameworks.",
  },
} as const;
