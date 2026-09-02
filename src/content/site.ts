/**
 * EDITABLE SITE CONTENT  -  populated from staging flyover transcription
 * See CONTENT_TRANSCRIPTION.md for source mapping.
 */

export { brand, navigation, footer, bookingsUrl } from "./layout";
export { training, type Course } from "./courses";

import { bookingsUrl } from "./layout";

export const offices = [
  {
    region: "Ireland",
    address: "Cunningham House, 130 Francis Street, Dublin 8, Ireland",
    phone: "+353 1 453 9143",
    email: "info@vigitrust.com",
  },
  {
    region: "France",
    address: "75 Avenue Parmentier, 75544 Paris Cedex 11",
    phone: "+33 1 73 02 33 60",
    email: "info@vigitrust.com",
  },
  {
    region: "United States",
    address: "261 Madison Avenue, 9th Floor, New York, NY 10016",
    phone: "+1 212 750 5100",
    email: "info@vigitrust.com",
  },
] as const;

export const home = {
  hero: {
    eyebrow: null as string | null,
    title: "VIGIONE",
    body: [
      "Prepare for, validate & maintain continuous compliance.",
      "Award-winning SaaS helping organisations in 120+ countries strengthen governance, risk, and compliance with clarity and confidence.",
    ],
    primaryCta: { label: "Book A Demo", href: bookingsUrl },
    secondaryCta: { label: "View Solutions", href: "/#solutions" },
    image: "/images/heroes/office-sm.webp",
  },
  about: {
    eyebrow: "About Us",
    title: "Your Trusted Partner In Governance, Risk & Compliance",
    paragraphs: [
      "For over two decades, VigiTrust has helped organisations in 120+ countries simplify Governance, Risk, and Compliance (GRC).",
      "Our flagship platform VigiOne� provides a unified framework to assess, monitor, and manage compliance maturity across regulations like ISO 27001, PCI DSS, GDPR, CCPA, and more.",
      "We combine interactive eLearning, real-time reporting, and practical methodology so teams can prepare for, validate & maintain continuous compliance.",
    ],
    cards: [
      {
        title: "VigiOne� Platform",
        body: "Centralised governance, risk, and compliance management  -  mapping your organisation's controls and policies across multiple standards.",
      },
      {
        title: "Security Awareness Program",
        body: "Customised cybersecurity and compliance training to promote a culture of security and empower teams to stay audit-ready.",
      },
    ],
  },
  stats: [
    { value: "120+", label: "Countries" },
    { value: "100k+", label: "Learners" },
    { value: "200+", label: "Learning modules" },
    { value: "20+", label: "Years" },
  ],
  whyUs: {
    eyebrow: "Why Us",
    title: "Why Leading Industries Choose Vigitrust",
    items: [
      {
        title: "Hospitality & Franchises",
        body: "Protect guest data, ensure global compliance, and maintain brand trust. VigiOne helps hotels, resorts, and hospitality groups meet PCI DSS, GDPR, and data protection standards through continuous monitoring and risk management.",
      },
      {
        title: "Advisory Board",
        body: "Connect with VigiTrust�s Global Advisory Board  -  a worldwide network of cyber leaders, regulators, and practitioners sharing threat insight, regulatory trends, and peer best practice across industries and regions.",
      },
      {
        title: "MSSP",
        body: "Enable your clients to achieve continuous compliance with scalable, multi-tenant oversight. VigiTrust equips MSSPs with the tools to deliver managed assessments, automated evidence collection, and real-time compliance reporting  -  simplifying service delivery across diverse industries.",
      },
    ],
  },
  midCta: {
    title: "Ready To Simplify Compliance?",
    body: "Book a free demo today and see how VigiTrust helps your organisation prepare for, validate & maintain continuous compliance.",
    cta: { label: "Book A Demo", href: bookingsUrl },
    image: "/images/heroes/team-sm.webp",
  },
  solutions: {
    eyebrow: "Our Solutions",
    title: "End-To-End Compliance & Risk Management Solutions",
    body: "With VigiOne and a library of 200+ learning modules, VigiTrust helps organisations worldwide prepare for, validate & maintain continuous compliance with confidence.",
    items: [
      { title: "VigiOne GRC Platform", href: "/platform" },
      { title: "GRC Training Program", href: "/training" },
      { title: "Advisory Board", href: "/advisory-board" },
    ],
    image: "/images/heroes/datacenter-web.webp",
  },
};

export const testimonials = [
  {
    quote:
      "VigiOne transformed our audit process  -  we cut evidence collection time by over 50% and sailed through our ISO 27001 re-certification. The combination of the platform and the eLearning programme has made compliance something the whole business actually understands.",
    name: "Marta Hughes",
    role: "CISO, Meridian Finance (UK)",
  },
  {
    quote:
      "The training library is fantastic: bite-sized modules, practical scenarios, and clear reporting so we can prove awareness during audits. Our staff completion rate jumped to 92% in three months and phishing susceptibility dropped significantly.",
    name: "David Nguyen",
    role: "Head of Compliance, Greenway Health Systems (US)",
  },
];

export const platform = {
  overview: {
    eyebrow: "Global Compliance. Simplified.",
    title: "Unify Governance, Risk & Compliance With VIGIONE",
    body: [
      "VigiOne is the operating system for continuous compliance  -  one workspace where controls, evidence, assessments, and reporting stay connected.",
      "Built for organisations and assessors who need shared visibility, fewer hand-offs, and a clearer path from readiness to validation.",
    ],
    image: "/images/heroes/security-sm.webp",
  },
  complexity: {
    eyebrow: "Governance & Compliance",
    title: "Reduce Complexity Across Your Compliance Process",
    lead: "VigiOne helps organizations take control of compliance with a single, connected platform built for complexity.",
    body: [
      "Managing compliance is often fragmented. Spread across spreadsheets, emails, and disconnected tools. Controls are tracked in one place, evidence in another, and progress somewhere else entirely. Keeping everything aligned takes time, creates inefficiencies, and increases the risk of gaps.",
      "And because compliance is continuous, this complexity only grows over time.",
    ],
    calloutTitle: "VigiOne Was Built By Security And Compliance Professionals Who Understand These Challenges Firsthand.",
    calloutBody:
      "Not as observers, but from real, day-to-day experience. VigiOne brings everything together into a single, unified system. It replaces scattered processes with a clear structure.",
  },
  bothSides: {
    title: "One Platform. Built For Both Sides Of Compliance",
    body: "VigiOne brings organisations and assessors together in one connected platform. By giving both sides access to the right information at the right time, it reduces friction, improves visibility, and helps compliance work move forward with greater clarity and confidence.",
    organisations: {
      title: "For Organisations",
      body: "Know where you stand - at any moment. By connecting your compliance activities into one platform, you gain clarity, reduce risk, and maintain control as requirements evolve.",
      href: "/platform/organisations",
    },
    assessors: {
      title: "For Assessors",
      body: "Navigate complex client environments with confidence. By connecting your assessment workflows, you gain the visibility and control needed to deliver consistent, high-quality outcomes.",
      href: "/platform/assessors",
    },
  },
  capabilities: {
    title: "Everything You Need To Manage Compliance Effectively",
    items: [
      {
        title: "ELearning & Awareness",
        body: "Deliver structured, role-based training with built-in certifications to ensure teams understand and support compliance requirements across the organisation.",
      },
      {
        title: "Centralised Dashboard & Reporting",
        body: "Gain real-time visibility into compliance status, progress, and key metrics through interactive dashboards, reports, and alerts.",
      },
      {
        title: "Self-Assessments (SAQs)",
        body: "Guide teams through structured self-assessments with built-in questionnaires and workflows that simplify data collection and validation.",
      },
    ],
    image: "/images/heroes/datacenter-web.webp",
  },
  modules: [
    { name: "VigiCheck", items: ["Audit", "Self-Assessment", "Survey", "Checklists"] },
    { name: "VigiFile", items: ["Risk Register", "IT Asset Register", "Evidence Library", "Policies & Procedures", "Regulations & Standards"] },
    { name: "VigiPlan", items: ["Accreditation Plan", "Breach / Incident Plan", "Task Allocation", "Continuity Plan", "Milestone Tracking"] },
    { name: "VigiScan", items: ["Vulnerability Scan", "Web App Scan", "Data Classification & Discovery", "Continuous Monitoring"] },
    { name: "VigiTrack", items: ["Dashboards", "Alerts", "Reports", "Objectives / Targets"] },
    { name: "VigiClass", items: ["eLearning", "Multimedia", "Awareness", "Blended Learning"] },
  ],
  frameworks: ["PCI DSS", "GDPR", "ISO 27001", "HIPAA", "CCPA", "Vendor Risk Management", "Third-Party Risk", "Cybersecurity Awareness"],
  organisations: {
    eyebrow: "VigiOne For Organisations",
    title: "Built For The Operational Reality Of Organisational Compliance",
    body: "Organisational compliance becomes difficult when responsibility is spread across teams, evidence is fragmented, and key activities rely on manual follow-up. VigiOne gives organisations the structure, visibility, and coordination needed to manage compliance with clarity and control.",
    featuresHeading: "Key Features",
    features: [
      {
        title: "Multi-Framework Compliance",
        body: "Map controls and policies across ISO 27001, PCI DSS, GDPR, CCPA and more  -  with templates you can create, customise, and manage in one place.",
      },
      {
        title: "SAQ & Assessment Management",
        body: "Guide teams through structured self-assessments and questionnaires. Standardise how information is collected, validated, and reported across your organisation.",
      },
      {
        title: "Built-In ELearning & Awareness",
        body: "Deliver consistent, role-based training across your organisation. Ensure employees understand their responsibilities with tracked completion and certifications.",
      },
      {
        title: "Centralised Documentation",
        body: "Keep evidence, policies, and workflows coordinated so compliance activities no longer rely on manual follow-up across disconnected tools.",
      },
    ],
  },
  assessors: {
    eyebrow: "VigiOne For Assessors",
    title: "Built To Streamline And Scale Your Assessment Workflows",
    body: "Managing multiple clients, assessments, and deadlines can quickly become complex and time-intensive. VigiOne gives assessors a more structured way to manage engagements  -  improving visibility, reducing manual effort, and helping you deliver consistent, high-quality assessments at scale.",
    features: [
      {
        title: "Increased Productivity",
        body: "Improve efficiency across your assessment workflows. With a more structured and automated approach, assessors can increase productivity and reduce time spent on manual coordination.",
      },
      {
        title: "Centralised Evidence Review",
        body: "Access and review client-submitted evidence in one secure location. Reduce time spent chasing documentation and streamline the validation process.",
      },
      {
        title: "Scalable Assessment Management",
        body: "Easily manage a growing portfolio of clients with clear status, task management, and consistent delivery quality.",
      },
    ],
  },
  assessment360: {
    eyebrow: "Assessment 360",
    title: "Build, manage and distribute custom compliance & risk assessments",
    body: "Assessment 360 is VigiOne�s flexible assessment builder  -  create proprietary frameworks, map recognised standards, collect evidence, score maturity, and publish executive-ready reports from one platform.",
    sectionEyebrow: "One platform. Any framework.",
    sectionTitle: "What Assessment 360 does",
    sectionBody: [
      "Assessment 360 lets you design assessments that match how your organisation actually works, while staying aligned to the standards your stakeholders expect.",
      "Build unlimited custom frameworks with domain and control hierarchies, guidance notes, and a reusable question library. Import at scale via CSV, assign work to teams, and drive completion with automated reminders.",
      "Collect evidence against each control, apply scoring and maturity models with risk weighting, then report progress through live dashboards and export to PDF or Excel for boards, auditors, and clients.",
      "Whether you are running PCI DSS, ISO 27001, GDPR, NIST CSF, DORA, NIS2, vendor due diligence, or your own proprietary programme, Assessment 360 keeps every assessment on one connected platform.",
    ],
    image: "/images/product/assessment-360.png",
    tagline: "One Platform � Any Framework � Any Assessment",
    featuresTitle: "Assessment builder features",
    features: [
      "Create unlimited custom frameworks",
      "Domain & control hierarchy",
      "Custom question library",
      "Guidance notes",
      "Evidence collection",
      "Scoring & maturity models",
      "Risk weighting",
      "CSV bulk import",
      "Assign assessments",
      "Automated reminders",
      "Dashboard reporting",
      "Export to PDF & Excel",
    ],
    categories: [
      {
        title: "Cybersecurity",
        items: [
          "NIST CSF",
          "NIST 800-53",
          "CIS Controls",
          "CIS Benchmarks",
          "ISO/IEC 27001",
          "ISO/IEC 27002",
          "ISO 22301",
          "SOC 2",
          "PCI DSS",
          "PCI PIN",
          "SWIFT CSP",
          "CSA CCM",
          "Cyber Essentials",
          "Cyber Essentials Plus",
        ],
      },
      {
        title: "Privacy & Data Protection",
        items: ["GDPR", "CCPA/CPRA", "HIPAA", "ISO 27701"],
      },
      {
        title: "Risk & Governance",
        items: [
          "ISO 31000",
          "COSO ERM",
          "COBIT",
          "Enterprise Risk Management",
          "Third-Party Risk",
          "Vendor Due Diligence",
          "Operational Risk",
          "Business Continuity",
          "Disaster Recovery",
        ],
      },
      {
        title: "Industry & Regulatory",
        items: [
          "DORA",
          "NIS2",
          "FFIEC",
          "GLBA",
          "SOX",
          "FCA Requirements",
          "APRA CPS 234",
          "MAS TRM",
          "Digital Operational Resilience",
        ],
      },
      {
        title: "ESG & Corporate",
        items: [
          "ESG",
          "Corporate Governance",
          "Sustainability Assessments",
          "Internal Audit",
          "Policy Compliance",
          "Health & Safety",
          "HR Compliance",
          "Supplier Assessments",
        ],
      },
    ],
    highlights: [
      {
        title: "Design assessments your way",
        body: "Create fully tailored assessments that reflect how your organisation operates, not only how frameworks are written on paper.",
      },
      {
        title: "Align to any standard",
        body: "Map controls and questions to recognised frameworks across cybersecurity, privacy, risk, regulation, and ESG.",
      },
      {
        title: "Evidence to executive report",
        body: "Collect proof, score maturity, track progress, and export board-ready reporting without leaving VigiOne.",
      },
    ],
  },
};

export const about = {
  hero: {
    eyebrow: "About Vigitrust",
    title: "Award-winning Integrated Risk Management since 2003",
    body: "VigiTrust is an award-winning provider of Integrated Risk Management (IRM) SaaS solutions to clients in 120 countries in the hospitality, retail, transportation, higher education, government, healthcare, and eCommerce industries.",
  },
  story:
    "VigiTrust solutions allow clients and partners to prepare for, validate, and maintain compliance with legal and industry frameworks and regulations on data privacy, information governance, and compliance. VigiOne enables organizations to achieve and maintain compliance with frameworks including PCI DSS, ISO 27001, PHI/HIPAA, GDPR, and corporate governance.",
  highlights: [
    {
      title: "VigiOne",
      body: "Unified platform for compliance programmes spanning PCI DSS, ISO 27001, PHI/HIPAA, GDPR, and corporate governance.",
    },
    {
      title: "5 Pillars of Security Framework�",
      body: "A simple, industry-agnostic methodology to map cyber risk, implement strategy, and demonstrate accountability to regulators, governing bodies, and law enforcement agencies.",
    },
    {
      title: "Global Advisory Board",
      body: "Experts, regulators, researchers, and practitioners meeting worldwide to explore threats, innovation, and compliance trends.",
    },
    {
      title: "The Cyber Elephant In The Boardroom",
      body: "The book by CEO Mathieu Gorge delivers strategies and best practices for today�s cybersecurity issues and guidance for the next decade of risks  -  with the 5 Pillars Framework� as the foundational tool.",
    },
  ],
  leadership: {
    eyebrow: "Leadership",
    title: "Founded by Mathieu Gorge",
    name: "Mathieu Gorge",
    role: "Founder & CEO",
    body: "Mathieu Gorge founded VigiTrust in 2003 and has led its growth into an award-winning IRM platform serving organisations in 120+ countries. A recognised voice in cybersecurity governance, he is the author of The Cyber Elephant In The Boardroom and chairs the VigiTrust Global Advisory Board.",
    image: "/images/people/mathieu-gorge-formal-sm.webp",
  },
};

export const advisory = {
  hero: {
    badge: "Executive Cyber Leadership Network",
    titleBefore: "Join a Global Network of",
    titleAccent: "Cybersecurity, Risk & Compliance Leaders",
    lead: "Connect with CISOs, board members, regulators, security leaders and compliance executives from more than 30 countries through the VigiTrust Global Advisory Board.",
    primaryCta: { label: "Become a Chartered Advisor", href: "/contact?intent=chartered-advisor#contact-form" },
    secondaryCta: { label: "Explore Membership Options", href: "#membership" },
    stats: [
      { label: "1300+ Members" },
      { label: "30+ Countries" },
      { label: "Dublin | New York | Paris" },
      { label: "Annual Executive Summit" },
    ],
  },
  socialProof: {
    title: "Trusted by Leaders from the World's Most Recognised Organisations",
    logos: [
      "AWS",
      "Microsoft",
      "Google",
      "Goldman Sachs",
      "Allianz",
      "Mastercard",
      "PwC",
      "EY",
      "Palo Alto Networks",
    ],
  },
  whyJoin: {
    title: "Why Leaders Choose the Advisory Board",
    body: "A curated community built for executives who shape cybersecurity strategy at the highest levels.",
    items: [
      {
        title: "Expand Your Network",
        body: "Connect with peers facing similar governance, cybersecurity and compliance challenges.",
      },
      {
        title: "Stay Ahead of Regulation",
        body: "Gain insight into evolving cybersecurity, privacy and governance requirements.",
      },
      {
        title: "Influence Industry Direction",
        body: "Contribute to research, discussion and strategic initiatives shaping the future of cyber governance.",
      },
    ],
  },
  benefits: {
    title: "What Members Receive",
    items: [
      { title: "Annual Executive Summit", body: "Included with Chartered Advisor membership." },
      { title: "Quarterly Executive Roundtables", body: "Small-group discussions with peers." },
      { title: "Research Briefings", body: "Exclusive intelligence and analysis." },
      { title: "Member Directory", body: "Connect with leaders globally." },
      { title: "Speaking Opportunities", body: "Apply to present and share expertise." },
      { title: "Continuous Professional Hours", body: "Certificates for participation." },
    ],
  },
  membership: {
    title: "Membership",
    body: "Select the level of engagement that aligns with your leadership role and strategic objectives.",
    tiers: [
      {
        id: "community",
        name: "Community Member",
        price: "�120",
        period: "/year",
        description: "For professionals who want to stay connected to the advisory community.",
        features: [
          "Advisory community access",
          "Monthly newsletter & insights",
          "Selected webinars",
          "Quarterly research summaries",
          "Member event discounts",
        ],
        cta: { label: "Join Community", href: "/contact?intent=community-member#contact-form" },
        featured: false,
        badge: null as string | null,
      },
      {
        id: "chartered",
        name: "Chartered Advisor",
        price: "�599",
        period: "/year",
        description: "Designed for cybersecurity, risk and compliance leaders seeking deeper engagement.",
        features: [
          "Annual Summit ticket included",
          "All webinars & executive briefings",
          "Quarterly executive roundtables",
          "Member directory & peer networking",
          "Speaker applications",
          "CPH certificates",
          "Leadership community access",
        ],
        cta: { label: "Become a Chartered Advisor", href: "/contact?intent=chartered-advisor#contact-form" },
        featured: true,
        badge: "Most Popular",
        globalNote: {
          label: "Reduced rates for emerging markets",
          href: "#global-participation",
        },
      },
      {
        id: "executive",
        name: "Executive Circle",
        price: "�2,499",
        period: "/year",
        description: "For senior leaders who want privileged access, curated peer connections and strategic influence.",
        features: [
          "Everything in Chartered Advisor",
          "Executive dinners",
          "Closed-door leadership forums",
          "Regulatory briefings",
          "Curated peer introductions",
          "Research steering group participation",
          "Featured leadership profile",
        ],
        cta: { label: "Request Invitation", href: "/contact?intent=executive-circle#contact-form" },
        featured: false,
        badge: "Invitation Only",
      },
    ],
  },
  globalParticipation: {
    badge: "Global Participation Programme",
    title: "Building a Truly Global Cyber Leadership Community",
    body: "To encourage participation from emerging cybersecurity markets, VigiTrust offers reduced-rate memberships through its Global Participation Programme for qualifying professionals.",
    countries: ["India", "South Africa", "Kenya", "Nigeria", "Tanzania", "Philippines", "Indonesia"],
    note: "Ensuring diverse global representation strengthens the collective intelligence of our advisory community and broadens access to executive-level peer networks.",
    cta: { label: "Apply for Global Participation", href: "/contact?intent=global-participation#contact-form" },
  },
  leadership: {
    title: "Global Leadership",
    founder: {
      initials: "MG",
      name: "Mathieu Gorge",
      role: "Founder & CEO",
      org: "VigiTrust",
      bio: "A recognised authority in cybersecurity governance, Mathieu founded VigiTrust to unite senior leaders in shaping responsible, resilient and globally informed cyber risk strategies.",
      image: "/images/people/mathieu-gorge-portrait-sm.webp",
    },
    regionalDirectors: [
      { initials: "SO", name: "Sarah O'Brien", role: "Regional Director, EMEA", region: "Europe" },
      { initials: "JC", name: "James Chen", role: "Regional Director, APAC", region: "Asia-Pacific" },
      { initials: "DW", name: "David Williams", role: "Regional Director, Americas", region: "North America" },
      { initials: "AO", name: "Amara Okonkwo", role: "Regional Director, Africa", region: "Africa" },
    ],
  },
  finalCta: {
    title: "Ready to Join the Conversation Shaping Cybersecurity Governance?",
    body: "Take your place among the world's most respected cyber, risk and compliance leaders.",
    primaryCta: { label: "Become a Chartered Advisor", href: "/contact?intent=chartered-advisor#contact-form" },
    secondaryCta: { label: "Schedule a Conversation", href: "/contact?intent=advisory-conversation#contact-form" },
  },
};

export type EventCategory = "Advisory" | "Networking";

export const events = {
  hero: {
    eyebrow: "Events",
    title: "Where global cyber leaders connect in person",
    body: "Executive summits, regional roundtables, and curated networking events across Dublin, New York, Paris, and partner cities worldwide.",
  },
  upcoming: {
    title: "Upcoming Events",
    emptyTitle: "No upcoming events scheduled",
    emptyBody:
      "Our next advisory summit and regional gatherings are being finalised. Register your interest to receive early access to invitations and agenda previews.",
    cta: { label: "Get notified", href: "/contact?intent=events-notify#contact-form" },
  },
  filters: ["All", "Advisory", "Networking"] as const,
  pastEvents: [
    {
      id: "dublin-2025",
      title: "VigiTrust Global Advisory Board Annual Dublin Meeting 2025",
      dateLabel: "May 21-22, 2025",
      location: "Custom House Quay, Dublin",
      theme: "Geopolitical Storms: Preparing Cyber Defences for Global Risks",
      category: "Advisory" as EventCategory,
    },
    {
      id: "south-africa-2025",
      title: "VigiTrust Global Advisory Board Event  -  South Africa 2025",
      dateLabel: "2025",
      location: "Cape Town, South Africa",
      theme: "A Global Conversation in the Cape",
      category: "Advisory" as EventCategory,
    },
    {
      id: "lisbon-2024",
      title: "VigiTrust Global Advisory Board Networking Dinner in Lisbon",
      dateLabel: "Jul 1, 2024",
      location: "Lisbon, Portugal",
      theme: null as string | null,
      category: "Networking" as EventCategory,
    },
    {
      id: "dublin-2024",
      title: "Annual VigiTrust Global Advisory Board in Dublin",
      dateLabel: "May 22-23, 2024",
      location: "Custom House Quay, Dublin",
      theme: "Cyber Checkmate 2024: Security Strategies on the Digital Chessboard",
      category: "Advisory" as EventCategory,
    },
  ],
  relatedLinks: [
    { label: "Global Advisory Board", href: "/advisory-board", description: "Membership tiers, benefits, and leadership network." },
    { label: "In-person Training", href: "/training/in-person", description: "Instructor-led workshops in Dublin, Paris, New York, and virtual hybrid formats." },
  ],
};

export const inPersonTraining = {
  hero: {
    eyebrow: "In-person Training",
    title: "Instructor-led workshops for compliance teams",
    body: "Hands-on, facilitator-led sessions that translate framework requirements into operational practice. Delivered on-site, at VigiTrust hubs, or in virtual hybrid formats for distributed teams.",
    primaryCta: { label: "Request a workshop", href: "/contact?intent=in-person-training#contact-form" },
    secondaryCta: { label: "Book a demo", href: bookingsUrl },
  },
  workshops: {
    title: "Upcoming open workshops",
    body: "Public sessions open to individual practitioners and small teams. Corporate cohorts can request private delivery at any location.",
    emptyTitle: "No open workshops scheduled right now",
    emptyBody: "Request a session for your team, or ask to be notified when the next public workshop is announced.",
    emptyCta: { label: "Request a workshop", href: "/contact?intent=in-person-training#contact-form" },
    items: [],
  },
  agenda: {
    title: "Sample workshop day",
    body: "A typical full-day session balances expert instruction, collaborative exercises, and time to apply concepts to your organisation.",
    sessions: [
      { time: "09:00", title: "Welcome & context setting", detail: "Framework landscape and your compliance objectives." },
      { time: "10:30", title: "Deep-dive modules", detail: "Interactive walkthroughs with real-world scenarios and control mapping." },
      { time: "12:30", title: "Working lunch", detail: "Peer discussion facilitated by VigiTrust instructors." },
      { time: "14:00", title: "Hands-on lab", detail: "Apply VigiOne workflows to evidence collection and gap analysis." },
      { time: "16:00", title: "Action planning", detail: "Leave with a 90-day roadmap tailored to your programme." },
    ],
  },
  audience: {
    title: "Who it's for",
    items: [
      { title: "Compliance & GRC teams", body: "Practitioners responsible for day-to-day framework alignment and audit readiness." },
      { title: "CISOs & security leaders", body: "Executives who need board-ready narratives and measurable programme outcomes." },
      { title: "Internal audit & risk", body: "Teams validating control effectiveness and coordinating with external assessors." },
      { title: "HR & L&D partners", body: "Owners of awareness programmes who need structured, certifiable content." },
    ],
  },
  included: {
    title: "What's included",
    items: [
      "Expert VigiTrust instructors with practitioner backgrounds",
      "Printed and digital course materials",
      "VigiOne sandbox access during the session",
      "Certificate of completion and CPE/CPD hours",
      "Post-workshop follow-up resources and templates",
      "Optional add-on: private team coaching session",
    ],
  },
  corporate: {
    title: "Corporate private workshops",
    body: "Bring a tailored programme to your offices or a VigiTrust hub. We adapt agendas to your frameworks, industry, and team size.",
    cta: { label: "Discuss private delivery", href: "/contact?intent=corporate-workshop#contact-form" },
  },
  relatedLinks: [
    { label: "eLearning Catalogue", href: "/training", description: "Browse self-paced modules and add courses to your basket." },
    { label: "Book a demo", href: bookingsUrl, description: "See VigiOne and training integration in a live walkthrough." },
  ],
};

export const blog = {
  hero: {
    eyebrow: "Insights",
    title: "News, analysis, and practical GRC guidance",
    body: "Perspectives from VigiTrust on compliance frameworks, cyber risk, and workforce awareness.",
  },
  posts: [
    {
      slug: "irm-saas-solution-of-the-year-ireland-2025",
      title: "VigiTrust Recognized As IRM SaaS Solution Of The Year  -  Ireland 2025 By FDI Insider",
      date: "2025-06-12",
      category: "News",
      excerpt:
        "We're proud to share that VigiTrust has been named IRM SaaS Solution of the Year  -  Ireland 2025 Winner  -  recognising continuous innovation in integrated risk management.",
      image: "/images/heroes/team-sm.webp",
    },
    {
      slug: "cybrpro-company-to-watch-2025",
      title: "VigiTrust Featured In CYBRPRO As A Revolutionary Risk Management Company To Watch In 2025",
      date: "2025-05-28",
      category: "News",
      excerpt:
        "We are proud to announce that VigiTrust and our CEO, Mathieu Gorge, have been featured among risk management companies to watch.",
      image: "/images/heroes/security-sm.webp",
    },
    {
      slug: "advisory-board-dublin-2025",
      title: "Where Global Minds Meet: Highlights From VigiTrust�s 2025 Annual Advisory Board Event In Dublin",
      date: "2025-05-24",
      category: "News",
      excerpt:
        "VigiTrust welcomes Global Advisory Board members from across the world to its flagship two-day event  -  a vibrant gathering of cybersecurity thought leadership.",
      image: "/images/heroes/office-sm.webp",
    },
    {
      slug: "16-billion-passwords-leaked",
      title: "16 Billion Passwords Leaked: A Wake-Up Call For Every Business",
      date: "2025-05-20",
      category: "Blog",
      excerpt:
        "Apple. Google. Facebook. 16 billion credentials. That�s not a typo  -  it�s a wake-up call for access control, awareness training, and continuous monitoring.",
      image: "/images/courses/phishing.webp",
    },
    {
      slug: "ukraine-cybersecurity-critical-infrastructure",
      title: "Conflicts In Ukraine And Key Challenges Of Cybersecurity And Critical Infrastructure Protection",
      date: "2024-11-12",
      category: "Blog",
      excerpt:
        "The conflict in Ukraine has had a significant impact on global geopolitics and the cybersecurity industry, particularly with regards to cyber-attacks and critical infrastructure protection.",
      image: "/images/heroes/datacenter-web.webp",
    },
    {
      slug: "cybernews-interview-mathieu-gorge",
      title: "Cybernews Interview: Mathieu Gorge, VigiTrust: �The More Information You Share  -  The Bigger Your Risk Surface Is�",
      date: "2024-09-03",
      category: "Blog",
      excerpt:
        "The rapid global digital transformation introduced not only new technologies but also a new approach to working  -  and a larger risk surface.",
      image: "/images/courses/privacy.webp",
    },
  ],
};

export const resources = {
  hero: {
    eyebrow: "Resources",
    title: "Frameworks, kits, and practical tools",
    body: "Explore VigiTrust�s methodology, free learning assets, and materials that help teams operationalise compliance.",
  },
  items: [
    {
      title: "5 Pillars of Security Framework�",
      body: "Map cybersecurity risks, implement strategy, and demonstrate accountability to regulators and boards.",
      href: "/pillars-of-security",
    },
    {
      title: "eLearning Catalogue",
      body: "Browse Security Awareness as a Service courses with transparent pricing.",
      href: "/training",
    },
    {
      title: "PCI DSS & VigiOne",
      body: "Understand how collaborative assessments and evidence workflows support PCI programmes.",
      href: "/platform",
    },
    {
      title: "Blog & News",
      body: "Latest insights from the VigiTrust team and Advisory Board community.",
      href: "/blog",
    },
  ],
};

export const pillars = {
  hero: {
    eyebrow: "Methodology",
    title: "5 Pillars of Security",
    body: "An award-winning, industry-agnostic framework to map cybersecurity risk, organise security roles, and demonstrate cyber accountability.",
  },
  about: {
    eyebrow: "About the framework",
    title: "About the 5 Pillars of Security Framework�",
    paragraphs: [
      "Mathieu Gorge, CEO of VigiTrust, developed the award-winning 5 Pillars of Security Framework� in 2008 to help medium to large sized organisations understand the security risk environment and effectively organise their security risk management roles and protocols. A decade later the Framework remains just as relevant.",
      "The Framework accommodates escalating cybersecurity threats as organisations increasingly move towards cloud-based platforms. Its flexibility also makes it easy to apply to changes in regulation, such as the introduction of the GDPR in May 2018.",
      "In recognition of this, VigiTrust was named Leading Integrated Risk Management Solution Provider of the Year, Republic of Ireland 2020 for the 5 Pillars of Security Framework� by Acquisition International.",
    ],
    surveyCta: {
      label: "Take the 5 Pillars of Security Survey",
      href: "/contact?intent=5-pillars-survey#contact-form",
    },
  },
  book: {
    title: "The Cyber Elephant in the Boardroom",
    body: "Mathieu Gorge�s book is aimed at board members, C-Suite, and key decision-makers faced with cyber accountability challenges. It is based on the award-winning 5 Pillars of Security Framework�: a simple, effective, industry-agnostic, timeless methodology allowing enterprises and small businesses to map cybersecurity risks, implement a cybersecurity strategy, and demonstrate cyber accountability to regulators, governing bodies, and law enforcement agencies.",
    href: "https://mathieugorge.com/book/",
    cta: "Learn more about the book",
  },
  help: {
    title: "How can the 5 Pillars of Security Framework� help you?",
    body: "This page covers what you need to know about the 5 Pillars of Security Framework�, and provides a clear path to apply it to your organisation�s Governance, Risk Management and Compliance programme.",
  },
  pillars: [
    {
      number: "01",
      title: "Physical Security",
      body: "Physical Security relates to everything that is tangible in your organisation.",
      items: ["Access to Buildings", "Physical Assets", "IT Hardware", "Vehicle Fleet"],
      responsibility: "Operations Manager, Security Staff",
    },
    {
      number: "02",
      title: "People Security",
      body: "Humans typically present the greatest threat to an organisation�s security, be it through human error or by malicious intent. People Security is about mitigating risk by monitoring and controlling the access and flow of people.",
      items: [
        "Permanent & Contract Staff",
        "Partners",
        "3rd Party Employees",
        "Visitors",
        "Special Events Security",
      ],
      responsibility: "HR, Security Staff",
    },
    {
      number: "03",
      title: "Data Security",
      body: "Data can be both an asset and a liability. Whether it is the Intellectual Property (IP) of your organisation, or the personal data of employees and customers protected by privacy regulations such as the GDPR, it needs to be handled with care. Appropriate data protection policies and procedures must be implemented to manage data storage, processing and compliance.",
      items: ["Trade Secrets", "Employee Data", "Database", "Customer Data"],
      responsibility: "HR, IT Teams & Managers",
    },
    {
      number: "04",
      title: "Infrastructure Security",
      body: "Infrastructure Security refers to the intangible assets of your organisation, where data is stored and controlled. These must be protected to prevent security breaches and leaks.",
      items: ["Networks", "Remote Sites", "Application Security", "Website", "Intranet"],
      responsibility: "IT Team & Managers",
    },
    {
      number: "05",
      title: "Crisis Management",
      body: "Effective Crisis Management depends on an organisation�s ability to be prepared for any eventuality. Policies and protocols must be continuously tested and revised to mitigate exposure.",
      items: [
        "Documentation & Work Procedures",
        "Emergency Response Plans",
        "Business Continuity Plans",
        "Disaster Recovery Plans",
      ],
      responsibility: "Operations Manager, IT Team & HR",
    },
  ],
  insights: [
    {
      title: "Why was the 5 Pillars of Security Framework first developed?",
      body: "The 5 Pillars of Security Framework gives you a simple roadmap for compliance. It was developed in 2008 to demystify the complex technical and legal landscape of global regulation. Take PCI, HIPAA or EU data protection, for instance. Even the most security-aware professionals needed a way to understand these environments in plain English. We identified five common denominators  -  the 5 pillars of security that remain relevant today.",
    },
    {
      title: "How has the security landscape changed since 2008?",
      body: "From a tech perspective, the attack surface has increased many times over as everything moved online  -  new threats, new types of attacks, and new assets to protect. From a legal perspective, organisations face a host of new regulations and standards such as privacy laws in the US and the GDPR in Europe. Rather than GRC alone, the industry now emphasises Integrated Risk Management. That focus on integration is precisely what the 5 Pillars was introduced to do in 2008.",
    },
    {
      title: "What is the biggest security threat, and how can the 5 Pillars help?",
      body: "The biggest security threat for your organisation is not knowing your security ecosystem. Where is your data, and how does it flow? Who are the stakeholders, and what regulations and standards apply? The 5 Pillars Framework gives you a series of easy, non-technical questions to help understand and protect that ecosystem.",
    },
    {
      title: "How does VigiTrust use the 5 Pillars Framework?",
      body: "Our customers have found the framework to be a successful foundation for security and compliance programmes. It underpins everything VigiTrust offers, from consultation and eLearning through to VigiOne, our single-platform Integrated Risk Management solution.",
    },
  ],
  vigione: {
    title: "Is VigiOne for you?",
    body: "If you�re an enterprise organisation, VigiOne enables you to manage compliance in one place. It works just as well for smaller companies. VigiOne is modular, so you can focus on a single regulation or standard if that is all you need. It is designed to be versatile and straightforward to deploy.",
    cta: { label: "Book A Demo", href: bookingsUrl },
    secondaryCta: { label: "Explore VigiOne", href: "/platform" },
  },
};

