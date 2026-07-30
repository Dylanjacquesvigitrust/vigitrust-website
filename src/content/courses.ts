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
  topics?: string[];
  modules?: { name: string; price: string; topics: string[] }[];
  bulkDeals?: { quantity: string; discount: string; price: string }[];
};

export const training = {
  hero: {
    eyebrow: "Training & Certifications",
    title: "VigiTrust eLearning and Information Security Awareness",
    body: "A key component of VigiTrust Solutions are the various Cyber Security Awareness programs delivered through eLearning using a LMS (Learning Management System). Training and awareness are closely integrated into the VigiTrust compliance portals, and now supports around 100,000 users across more than 80 countries with considerable growth forecast.",
  },
  saaas: {
    title: "VigiOne  -  Security Awareness as a Service (SAaaS)",
    body: "VigiOne Security Awareness as a Service is a highly configurable solution for organizations to provide their staff and stakeholders with access to a modular online LMS. The VigiTrust eLearning repository has over 50 modules. Considerable discounts apply for additional users and topics selected.",
  },
  catalogueHeading: "SAaaS Key Subject Areas",
  catalogueSub: "Select the key subject areas below for more information on the course levels, content and options.",
  courses: [
    {
      slug: "vigiquiz",
      title: "VigiQuiz",
      priceLabel: "€2,500.00  -  €7,250.00",
      cta: "Select options" as const,
      summary: "Interactive knowledge checks and scenario quizzes to reinforce awareness topics and surface knowledge gaps quickly.",
      image: "/images/courses/quiz.webp",
      level: "Assessment",
    },
    {
      slug: "secure-coding",
      title: "Secure Coding",
      priceLabel: "€100.00",
      priceFrom: 100,
      cta: "Buy Now" as const,
      summary:
        "Hackers use techniques such as Code Injection, Cross Site Scripting and Cross Site Request Forgery. This course examines how software vulnerabilities are exploited and provides a detailed look at the OWASP Top 10.",
      image: "/images/courses/coding.webp",
      level: "Intermediate",
      topics: ["OWASP Top Ten", "Code Injection", "XSS", "CSRF", "Secure SDLC"],
    },
    {
      slug: "gdpr-fundamentals",
      title: "GDPR Fundamentals",
      priceLabel: "€27.50",
      priceFrom: 27.5,
      cta: "Buy Now" as const,
      summary: "Essential privacy and data protection awareness covering GDPR fundamentals, obligations, and the cost of non-compliance.",
      image: "/images/courses/gdpr.webp",
      level: "Fundamentals",
      topics: ["GDPR principles", "Lawful basis", "Data subject rights", "Breach awareness"],
    },
    {
      slug: "ccpa-fundamentals",
      title: "CCPA Fundamentals",
      priceLabel: "€27.50",
      priceFrom: 27.5,
      cta: "Buy Now" as const,
      summary:
        "The California Consumer Privacy Act (CCPA) enhances privacy rights and consumer protection for residents of California. This course covers the fundamentals of CCPA, the data it protects, business obligations, and the cost of non-compliance.",
      image: "/images/courses/ccpa.webp",
      level: "Fundamentals",
    },
    {
      slug: "vendor-risk-management",
      title: "Vendor Risk Management",
      priceLabel: "€27.50",
      priceFrom: 27.5,
      cta: "Buy Now" as const,
      summary:
        "Interactive overview of Vendor Risk Management basics and good practices  -  including the importance of vendor information risk management, the VRM programme, tools, definitions, and roles and responsibilities.",
      image: "/images/courses/vendor.webp",
      level: "Fundamentals",
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
    },
    {
      slug: "introduction-to-hipaa",
      title: "Introduction To HIPAA",
      priceLabel: "€100.00",
      priceFrom: 100,
      cta: "Buy Now" as const,
      summary: "Introduction to HIPAA requirements for protecting health information and supporting compliance programmes.",
      image: "/images/courses/hipaa.webp",
      level: "Introduction",
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
    },
    {
      slug: "data-protection-privacy",
      title: "Data Protection & Privacy",
      priceLabel: "€7.50  -  €27.50",
      cta: "Select options" as const,
      summary:
        "No matter what you do in life, having an understanding of Data Protection regulation is important. These courses start with the basic contents of Data Protection, why compliance is important for you and your organization, and what you need to do to ensure compliance. They outline best practices for protecting data at work and in personal life, then cover more technical requirements such as EU GDPR and the EU US Privacy Shield.",
      image: "/images/courses/privacy.webp",
      level: "Multi-level",
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
      title: "Payment Card Security & PCI",
      priceLabel: "€25.00  -  €75.00",
      cta: "Select options" as const,
      summary: "Help teams understand payment card security obligations and how PCI DSS shapes day-to-day practice across merchants and brands.",
      image: "/images/courses/pci.webp",
      level: "Multi-level",
    },
    {
      slug: "email-phishing-ransomware",
      title: "Email, Phishing And Ransomware",
      priceLabel: "€7.50  -  €27.50",
      cta: "Select options" as const,
      summary: "Recognise phishing and ransomware threats delivered over email, and build safer habits across the workforce.",
      image: "/images/courses/phishing.webp",
      level: "Multi-level",
    },
  ] satisfies Course[],
};
