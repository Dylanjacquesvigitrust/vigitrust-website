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
    body: "Browse VigiTrust’s Security Awareness as a Service catalogue  -  modular courses used by 100,000+ learners worldwide. Build role-ready skills across privacy, payment security, cloud, and cyber hygiene.",
  },
  saaas: {
    title: "Security Awareness as a Service (SAaaS)",
    body: "A configurable LMS experience with 200+ learning modules. Assign topics by role, track completion, and scale seats with volume discounts.",
  },
  catalogueHeading: "Explore courses",
  catalogueSub: "Coursera-style learning paths with clear outcomes, skills, and flexible pricing  -  including multi-level programmes.",
  courses: [
    {
      slug: "vigiquiz",
      title: "VigiQuiz",
      priceLabel: "€2,500.00  -  €7,250.00",
      cta: "Select options" as const,
      summary:
        "Interactive knowledge checks and scenario quizzes to reinforce awareness topics and surface knowledge gaps quickly.",
      description:
        "VigiQuiz turns awareness into measurable competence. Deploy scenario-based quizzes across your workforce, identify weak spots by topic or team, and reinforce learning before audits or phishing seasons.",
      image: "/images/courses/quiz.webp",
      level: "Assessment",
      category: "Assessment",
      duration: "Configurable",
      skills: ["Knowledge checks", "Scenario testing", "Gap analysis", "Completion reporting"],
      learningOutcomes: [
        "Measure workforce understanding across key cyber topics",
        "Identify teams that need targeted follow-up training",
        "Generate evidence of awareness testing for stakeholders",
        "Refresh knowledge with repeatable quiz campaigns",
      ],
      audience: "Security, HR, and compliance teams running organisation-wide awareness programmes.",
      rating: 4.8,
      learnersLabel: "Enterprise programmes",
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
      slug: "ccpa-fundamentals",
      title: "CCPA Fundamentals",
      priceLabel: "€27.50",
      priceFrom: 27.5,
      cta: "Buy Now" as const,
      summary:
        "The California Consumer Privacy Act (CCPA) enhances privacy rights and consumer protection for residents of California. This course covers the fundamentals of CCPA, the data it protects, business obligations, and the cost of non-compliance.",
      description:
        "Build CCPA literacy across customer-facing and data teams. Cover consumer rights, business obligations, and practical examples of compliant handling of California resident data.",
      image: "/images/courses/ccpa.webp",
      level: "Fundamentals",
      category: "Privacy",
      duration: "60 mins",
      skills: ["CCPA rights", "Consumer requests", "Business obligations", "Privacy notices"],
      audience: "Teams supporting US consumers, especially California residents.",
      rating: 4.7,
    },
    {
      slug: "vendor-risk-management",
      title: "Vendor Risk Management",
      priceLabel: "€27.50",
      priceFrom: 27.5,
      cta: "Buy Now" as const,
      summary:
        "Interactive overview of Vendor Risk Management basics and good practices  -  including the importance of vendor information risk management, the VRM programme, tools, definitions, and roles and responsibilities.",
      description:
        "Help procurement, security, and business owners share a common language for third-party risk. Learn programme structure, roles, and practical habits that keep vendor oversight continuous.",
      image: "/images/courses/vendor.webp",
      level: "Fundamentals",
      category: "Third-Party Risk",
      duration: "75 mins",
      skills: ["Vendor due diligence", "Risk tiers", "Contract controls", "Ongoing monitoring"],
      audience: "Procurement, infosec, compliance, and business relationship owners.",
      rating: 4.7,
    },
    {
      slug: "social-media-best-practices",
      title: "Social Media Best Practices",
      priceLabel: "€27.50",
      priceFrom: 27.5,
      cta: "Buy Now" as const,
      summary:
        "Social networking can present serious security risks if used carelessly. Learn practical best practices to protect yourself and your organisation online.",
      image: "/images/courses/social.webp",
      level: "Fundamentals",
      category: "Awareness",
      duration: "45 mins",
      skills: ["Online hygiene", "Privacy settings", "Brand protection", "Social engineering awareness"],
      audience: "All employees, especially customer-facing and marketing teams.",
      rating: 4.5,
    },
    {
      slug: "introduction-to-secure-printing",
      title: "Introduction To Secure Printing",
      priceLabel: "€50.00",
      priceFrom: 50,
      cta: "Buy Now" as const,
      summary: "Understand secure printing risks and controls to prevent document leakage in the workplace.",
      image: "/images/courses/printing.webp",
      level: "Introduction",
      category: "Physical & Workplace",
      duration: "40 mins",
      skills: ["Print security", "Document handling", "Clear desk habits"],
      audience: "Office staff and facilities teams handling sensitive print jobs.",
      rating: 4.4,
    },
    {
      slug: "introduction-to-hipaa",
      title: "Introduction To HIPAA",
      priceLabel: "€100.00",
      priceFrom: 100,
      cta: "Buy Now" as const,
      summary:
        "Introduction to HIPAA requirements for protecting health information and supporting compliance programmes.",
      description:
        "Orient healthcare and partner staff to HIPAA expectations around PHI, privacy, and security  -  with practical examples of compliant handling.",
      image: "/images/courses/hipaa.webp",
      level: "Introduction",
      category: "Healthcare",
      duration: "90 mins",
      skills: ["PHI handling", "HIPAA Privacy Rule", "Security basics", "Incident awareness"],
      audience: "Healthcare staff, partners, and vendors who may access PHI.",
      rating: 4.6,
    },
    {
      slug: "cloud-computing-fundamentals",
      title: "Cloud Computing Fundamentals",
      priceLabel: "€50.00",
      priceFrom: 50,
      cta: "Buy Now" as const,
      summary: "Foundational awareness of cloud computing security responsibilities and common risk scenarios.",
      image: "/images/courses/cloud.webp",
      level: "Fundamentals",
      category: "Cloud Security",
      duration: "70 mins",
      skills: ["Shared responsibility", "Cloud risks", "Access control basics", "Data residency awareness"],
      audience: "Business and technical staff adopting or managing cloud services.",
      rating: 4.6,
    },
    {
      slug: "data-protection-privacy",
      title: "Data Protection & Privacy",
      priceLabel: "€7.50  -  €27.50",
      cta: "Select options" as const,
      summary:
        "No matter what you do in life, having an understanding of Data Protection regulation is important. These courses start with the basic contents of Data Protection, why compliance is important for you and your organization, and what you need to do to ensure compliance. They outline best practices for protecting data at work and in personal life, then cover more technical requirements such as EU GDPR and the EU US Privacy Shield.",
      description:
        "A multi-level privacy pathway  -  from everyday do’s and don’ts through to GDPR-focused intermediate content. Assign the right tier by role and scale seats with bulk pricing.",
      image: "/images/courses/privacy.webp",
      level: "Multi-level",
      category: "Privacy",
      duration: "1-4 hours",
      skills: ["Data protection basics", "Privacy by design", "GDPR", "Protecting personal data"],
      learningOutcomes: [
        "Apply practical data protection habits at work",
        "Explain core privacy principles to colleagues",
        "Progress from introduction to GDPR-level topics as needed",
        "Support organisational privacy programmes with consistent messaging",
      ],
      audience: "All staff, with intermediate modules for privacy and compliance roles.",
      rating: 4.8,
      learnersLabel: "22,000+ learners",
      modules: [
        {
          name: "Introduction",
          price: "€7.50",
          topics: [
            "Data protection basic concepts",
            "Why data protection is important",
            "Data protection do’s and don’ts",
            "Course Test",
          ],
        },
        {
          name: "Fundamentals",
          price: "€15.00",
          topics: [
            "Data Protection Principles",
            "Legal Grounds for Data Processing",
            "The Consent Principle",
            "Privacy By Design",
            "Protecting Personal Data",
            "Course Test",
          ],
        },
        {
          name: "Intermediate",
          price: "€27.50",
          topics: ["EU GDPR", "EU US Privacy Shield", "Course Test"],
        },
      ],
      bulkDeals: [
        { quantity: "1  -  15", discount: "0%", price: "€7.50" },
        { quantity: "16  -  30", discount: "20%", price: "€6.00" },
        { quantity: "31  -  50", discount: "33.34%", price: "€5.00" },
        { quantity: "51  -  250", discount: "46.66%", price: "€4.00" },
        { quantity: "251  -  500", discount: "60%", price: "€3.00" },
      ],
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
      slug: "email-phishing-ransomware",
      title: "Email, Phishing And Ransomware",
      priceLabel: "€7.50  -  €27.50",
      cta: "Select options" as const,
      summary:
        "Recognise phishing and ransomware threats delivered over email, and build safer habits across the workforce.",
      description:
        "One of the highest-ROI awareness topics. Teach people to spot phishing, report fast, and understand how ransomware campaigns start.",
      image: "/images/courses/phishing.webp",
      level: "Multi-level",
      category: "Awareness",
      duration: "45-120 mins",
      skills: ["Phishing detection", "Safe email habits", "Ransomware awareness", "Incident reporting"],
      audience: "All employees  -  especially high-risk roles like finance and executive assistants.",
      rating: 4.9,
      learnersLabel: "40,000+ learners",
      modules: [
        {
          name: "Introduction",
          price: "€7.50",
          topics: ["What phishing looks like", "Red flags", "How to report", "Course test"],
        },
        {
          name: "Fundamentals",
          price: "€15.00",
          topics: ["Social engineering tactics", "Ransomware basics", "Safe habits", "Course test"],
        },
        {
          name: "Intermediate",
          price: "€27.50",
          topics: ["Advanced lures", "Business email compromise", "Response playbooks", "Course test"],
        },
      ],
    },
  ] satisfies Course[],
};
