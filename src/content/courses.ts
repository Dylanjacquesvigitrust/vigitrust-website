/** Course catalogue - shared by training pages and cart (client-safe). */

export type Course = {
  slug: string;
  title: string;
  priceLabel: string;
  priceFrom?: number;
  cta: "Add to basket" | "Select options" | "Buy Now";
  summary: string;
  image: string;
  level?: string;
  category?: string;
  duration?: string;
  skills?: string[];
  learningOutcomes?: string[];
  audience?: string;
  description?: string;
  rating?: number;
  learnersLabel?: string;
  topics?: string[];
  modules?: { name: string; price: string; topics: string[] }[];
  bulkDeals?: { quantity: string; discount: string; price: string }[];
};

export type CourseDetails = Course & {
  category: string;
  duration: string;
  skills: string[];
  learningOutcomes: string[];
  audience: string;
  description: string;
  rating: number;
  learnersLabel: string;
};

export function courseDetails(course: Course): CourseDetails {
  const skills =
    course.skills ??
    course.topics?.slice(0, 5) ??
    ["Security awareness", "Compliance fundamentals", "Risk reduction"];

  return {
    ...course,
    category: course.category ?? "Security Awareness",
    duration: course.duration ?? (course.modules ? "2-6 hours" : "45-90 mins"),
    skills,
    learningOutcomes: course.learningOutcomes ?? [
      `Explain the purpose and scope of ${course.title}`,
      "Apply practical controls and behaviours in day-to-day work",
      "Recognise common risks and escalate issues appropriately",
      "Support organisational readiness for audits and assessments",
    ],
    audience:
      course.audience ??
      "Employees, managers, and compliance stakeholders who need practical, role-ready awareness.",
    description:
      course.description ??
      `${course.summary} Designed for self-paced learning with clear outcomes, scenario-based examples, and completion tracking suitable for audit evidence.`,
    rating: course.rating ?? 4.7,
    learnersLabel: course.learnersLabel ?? "1,200+ learners",
  };
}

export const training = {
  hero: {
    eyebrow: "Training & Certifications",
    title: "eLearning catalogue",
    body: "Browse VigiTrust’s Security Awareness as a Service catalogue  -  modular courses used by 100,000+ learners worldwide. Build role-ready skills across privacy, payment security, and cyber hygiene.",
  },
  saaas: {
    title: "Security Awareness as a Service (SAaaS)",
    body: "A configurable LMS experience with 200+ learning modules. Assign topics by role, track completion, and scale seats with volume discounts.",
  },
  catalogueHeading: "Explore courses",
  catalogueSub: "Clear outcomes, practical skills, and flexible seat purchasing for your organisation.",
  courses: [
    {
      slug: "gdpr-fundamentals",
      title: "GDPR Fundamentals",
      priceLabel: "€27.50",
      priceFrom: 27.5,
      cta: "Buy Now" as const,
      summary:
        "Essential privacy and data protection awareness covering GDPR fundamentals, obligations, and the cost of non-compliance.",
      description:
        "A clear, practical introduction to GDPR for people who handle personal data. Learners leave understanding principles, lawful bases, subject rights, and what good day-to-day behaviour looks like.",
      image: "/images/courses/gdpr.webp",
      level: "Fundamentals",
      category: "Privacy",
      duration: "60 mins",
      topics: ["GDPR principles", "Lawful basis", "Data subject rights", "Breach awareness"],
      skills: ["GDPR principles", "Lawful basis", "Data subject rights", "Breach awareness"],
      learningOutcomes: [
        "Explain GDPR principles in plain language",
        "Recognise when personal data processing needs a lawful basis",
        "Respond appropriately to data subject rights requests",
        "Know when and how to escalate a suspected breach",
      ],
      audience: "All staff who process EU personal data, plus managers and privacy champions.",
      rating: 4.8,
      learnersLabel: "18,000+ learners",
    },
    {
      slug: "payment-card-security-pci",
      title: "Introduction to Payment Card Security",
      priceLabel: "€25.00",
      priceFrom: 25,
      cta: "Buy Now" as const,
      summary:
        "Help teams understand payment card security obligations and how everyday handling of cardholder data protects customers and the business.",
      description:
        "A clear introduction to payment card security for people who handle or support card payments. Learners leave understanding why card data matters, common risks, and practical behaviours that keep transactions safer.",
      image: "/images/courses/pci.webp",
      level: "Introduction",
      category: "Payment Security",
      duration: "45-60 mins",
      topics: [
        "Why payment security matters",
        "Cardholder data basics",
        "Common risks",
        "Safe handling habits",
      ],
      skills: [
        "Payment security basics",
        "Cardholder data handling",
        "Risk awareness",
        "Safe day-to-day practice",
      ],
      learningOutcomes: [
        "Explain why payment card security matters in plain language",
        "Recognise cardholder data and common handling risks",
        "Apply safer habits when supporting card payments",
        "Know when to escalate a suspected payment security issue",
      ],
      audience: "Retail, hospitality, finance, and operations teams in card-accepting businesses.",
      rating: 4.7,
    },
    {
      slug: "introduction-to-pci-dss",
      title: "Introduction to PCI DSS",
      priceLabel: "€50.00",
      priceFrom: 50,
      cta: "Buy Now" as const,
      summary:
        "Give teams a clear grounding in PCI DSS — what the standard is for, who it applies to, and how it shapes day-to-day payment security practice.",
      description:
        "A practical introduction to the Payment Card Industry Data Security Standard (PCI DSS) for people who support card payments or compliance programmes. Learners leave understanding what PCI DSS is designed to protect, how merchant and service-provider obligations fit together, and what good baseline behaviour looks like around cardholder data environments.",
      image: "/images/courses/pci.webp",
      level: "Introduction",
      category: "Payment Security",
      duration: "60-90 mins",
      topics: [
        "What PCI DSS is and why it exists",
        "Cardholder data and the CDE",
        "Roles and responsibilities",
        "Core control themes",
      ],
      skills: [
        "PCI DSS overview",
        "Scope awareness",
        "Merchant responsibilities",
        "Compliance fundamentals",
      ],
      learningOutcomes: [
        "Explain PCI DSS in plain language and why organisations must take it seriously",
        "Recognise cardholder data environments and common scope considerations",
        "Describe the main roles involved in a PCI programme",
        "Identify everyday practices that support PCI DSS requirements",
      ],
      audience:
        "Compliance, operations, retail, hospitality, and IT teams supporting card-accepting businesses.",
      rating: 4.8,
    },
    {
      slug: "cybersecurity-fundamentals",
      title: "Cybersecurity Fundamentals",
      priceLabel: "€50.00",
      priceFrom: 50,
      cta: "Buy Now" as const,
      summary:
        "Understand everyday security threats you and your organisation face, and how to protect information and systems from unauthorised use.",
      description:
        "As an employee, you are responsible for following proper procedures to protecting information and systems from unauthorized use and reporting suspicious activity or any compromise of sensitive information.\n\nThis course will help you understand the everyday security threats you and your organisation face and how to counter them.\n\nThe course consists of 12 short lessons, each one covering a different aspect of information security. Some lessons include a self-test question or other activities. You are required to complete each question or activity before continuing to the next section. A short test is included at the end of the course.",
      image: "/images/courses/cloud.webp",
      level: "Fundamentals",
      category: "Cybersecurity",
      duration: "12 short lessons",
      topics: [
        "Everyday security threats",
        "Protecting information and systems",
        "Reporting suspicious activity",
        "Practical countermeasures",
      ],
      skills: [
        "Security awareness",
        "Threat recognition",
        "Safe handling of sensitive information",
        "Incident reporting",
      ],
      learningOutcomes: [
        "Recognise everyday security threats facing you and your organisation",
        "Follow proper procedures to protect information and systems",
        "Report suspicious activity or compromise of sensitive information",
        "Apply practical countermeasures covered across the 12 lessons",
      ],
      audience: "All employees responsible for protecting organisational information and systems.",
      rating: 4.7,
    },
    {
      slug: "secure-coding",
      title: "Secure Coding",
      priceLabel: "€100.00",
      priceFrom: 100,
      cta: "Buy Now" as const,
      summary:
        "Hackers use techniques such as Code Injection, Cross Site Scripting and Cross Site Request Forgery. This course examines how software vulnerabilities are exploited and provides a detailed look at the OWASP Top 10.",
      description:
        "Give developers and technical stakeholders a practical tour of how common application attacks work  -  and how secure coding habits prevent them. Ideal for engineering teams supporting PCI, ISO 27001, or product security programmes.",
      image: "/images/courses/coding.webp",
      level: "Intermediate",
      category: "Application Security",
      duration: "2 hours",
      topics: ["OWASP Top Ten", "Code Injection", "XSS", "CSRF", "Secure SDLC"],
      skills: ["OWASP Top 10", "Secure SDLC", "Injection prevention", "XSS / CSRF controls"],
      learningOutcomes: [
        "Describe how common web vulnerabilities are exploited",
        "Map OWASP Top 10 risks to day-to-day coding decisions",
        "Apply defensive patterns against injection, XSS, and CSRF",
        "Support secure development practices inside your team",
      ],
      audience: "Software engineers, QA, and technical product owners.",
      rating: 4.6,
    },
  ] satisfies Course[],
};
