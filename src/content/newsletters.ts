/** Per-route newsletter copy shown above the site footer. */
export type NewsletterCopy = {
  title: string;
  body: string;
};

export const defaultNewsletter: NewsletterCopy = {
  title: "Stay ahead in compliance",
  body: "Subscribe for VigiTrust updates on VigiOne, eLearning, frameworks, and global risk trends.",
};

const exact: Record<string, NewsletterCopy> = {
  "/": {
    title: "Get compliance insights that matter",
    body: "Subscribe for practical updates on continuous compliance, VigiOne releases, and programmes helping teams prepare for, validate & maintain readiness.",
  },
  "/platform": {
    title: "Follow the VigiOne product journey",
    body: "Subscribe for platform releases, GRC workflow tips, and demos that show how organisations and assessors work in one connected system.",
  },
  "/platform/organisations": {
    title: "Operational compliance, in your inbox",
    body: "Get guidance for compliance teams using VigiOne day to day  -  evidence, dashboards, and continuous monitoring practices.",
  },
  "/platform/assessors": {
    title: "Assessor workflow updates",
    body: "Subscribe for assessor-focused tips on multi-client oversight, evidence review, and delivering consistent assessment outcomes.",
  },
  "/platform/assessment-360": {
    title: "Assessment 360 briefings",
    body: "Stay informed on Assessment 360 capabilities, scoring models, and standards-aligned assessment design.",
  },
  "/training": {
    title: "New courses and learning paths",
    body: "Subscribe for catalogue updates across 200+ learning modules, bulk-seat offers, and Security Awareness as a Service news.",
  },
  "/training/in-person": {
    title: "Workshop dates and invitations",
    body: "Get notified about upcoming instructor-led sessions in Dublin, Paris, New York, and virtual hybrid formats.",
  },
  "/advisory-board": {
    title: "Advisory Board invitations & briefings",
    body: "Subscribe for summit invitations, regional dinners, and leadership briefings from the VigiTrust Global Advisory Board community.",
  },
  "/events": {
    title: "Event alerts first",
    body: "Be first to hear about advisory summits, networking dinners, and regional cyber leadership gatherings.",
  },
  "/about": {
    title: "Company news from VigiTrust",
    body: "Subscribe for company milestones, leadership updates, and stories from our work across 120+ countries.",
  },
  "/blog": {
    title: "Insights from the VigiTrust newsroom",
    body: "Get new articles on GRC, cyber accountability, and regulatory change delivered as they publish.",
  },
  "/resources": {
    title: "Resource hub updates",
    body: "Subscribe when we publish new frameworks, guides, and learning resources for compliance teams.",
  },
  "/pillars-of-security": {
    title: "5 Pillars Framework updates",
    body: "Follow methodology updates, boardroom accountability content, and practical applications of the 5 Pillars of Security.",
  },
  "/contact": {
    title: "Prefer email updates?",
    body: "Subscribe for product and programme news while our team responds to your enquiry.",
  },
  "/demo": {
    title: "Before your demo",
    body: "Subscribe for short primers on VigiOne so you arrive ready with the right questions for your walkthrough.",
  },
  "/checkout": {
    title: "Learning programme updates",
    body: "After checkout, stay subscribed for new modules, renewals guidance, and enterprise seat options.",
  },
};

export function newsletterForPath(pathname: string): NewsletterCopy {
  if (exact[pathname]) return exact[pathname];
  if (pathname.startsWith("/training/")) {
    return {
      title: "Keep building cyber skills",
      body: "Subscribe for related courses, learning paths, and Security Awareness as a Service updates from VigiTrust.",
    };
  }
  if (pathname.startsWith("/blog/")) {
    return {
      title: "More from the newsroom",
      body: "Subscribe so you never miss the next VigiTrust article on GRC, risk, and cyber leadership.",
    };
  }
  if (pathname.startsWith("/platform/")) {
    return {
      title: "VigiOne platform updates",
      body: "Subscribe for feature releases and practical guidance for teams running compliance on VigiOne.",
    };
  }
  return defaultNewsletter;
}
