// src/lib/content.ts
// Single source of truth for all Nuovance AI site copy.
// Edit text here — components should only map over this data.
// NOTE: contact phone/emails are placeholders until confirmed.

/* ---------- Types ---------- */

export interface CapabilityGroup {
  category: string;
  description?: string;
  items: string[];
}

export interface Principle {
  title: string;
  // optional short line if you want to expand each in the UI
  blurb?: string;
}

export interface MethodologyStep {
  step: number;
  title: string;
}

export interface TeamMember {
  name: string;
  role: string;
  responsibilities: string;
}

export interface TechGroup {
  category: string;
  tools: string[];
}

/* ---------- Booking URL (single source of truth for all CTAs) ---------- */
// TODO: replace with your real Cal.com or Calendly link, e.g.
// "https://cal.com/nuovance-ai/strategy-call"
const BOOKING_URL = "BOOKING_URL_PLACEHOLDER";
const BOOKING_CTA_LABEL = "Book a Meeting";

// Falls back to the in-page contact section until a real booking link is set.
export const bookingHref = /^https?:\/\//.test(BOOKING_URL) ? BOOKING_URL : "#contact";

/* ---------- Hero ---------- */

export const hero = {
  eyebrow: "Nuovance AI",
  headline: "Engineering the Future with Artificial Intelligence",
  positioning:
    "We don't simply build software. We engineer intelligent business ecosystems.",
  disciplines: [
    "AI",
    "Automation",
    "Software Engineering",
    "SaaS",
    "Website Design & Development",
    "Digital Transformation",
  ],
  primaryCta: { label: "Schedule a Strategy Consultation", href: bookingHref },
  secondaryCta: { label: "Request a Custom AI Solution", href: "#contact" },
  website: "www.NuovanceAI.com",
};

/* ---------- About / Overview ---------- */

export const about = {
  heading: "About Nuovance AI",
  executiveSummary: [
    "Nuovance AI is an AI, software engineering, and digital transformation company dedicated to helping businesses innovate, automate, and scale through intelligent technology.",
    "We partner with startups, growing businesses, and enterprise organizations to design, develop, and implement AI-powered solutions that improve operational efficiency, automate complex workflows, enhance customer experiences, and accelerate sustainable business growth.",
    "From AI agents and intelligent automation to enterprise software, SaaS platforms, and modern digital experiences, Nuovance AI delivers technology engineered for long-term business success.",
  ],
  overview: [
    "Technology is transforming every industry, but many organizations still struggle with disconnected systems, repetitive manual work, inefficient workflows, and outdated digital processes.",
    "Nuovance AI was founded to solve these challenges through Artificial Intelligence, Automation, Software Engineering, and Digital Innovation.",
    "Our approach combines business strategy with modern engineering to build secure, scalable, and future-ready solutions that create measurable value. We believe technology should simplify business — not complicate it.",
  ],
};

/* ---------- Vision / Mission / Promise ---------- */

export const visionMission = {
  vision:
    "To become one of the world's most trusted AI and software engineering companies by delivering intelligent, innovative, and scalable technology solutions that transform the way businesses operate.",
  mission:
    "To empower organizations through Artificial Intelligence, intelligent automation, and software engineering by building solutions that increase productivity, reduce operational costs, improve customer experiences, and accelerate digital transformation.",
  brandPromise:
    "We build intelligent technology that helps businesses innovate, automate, and grow with confidence.",
};

/* ---------- Philosophy ---------- */

export const philosophy = {
  statement:
    "Technology should empower people — not replace them. Artificial Intelligence should eliminate repetitive work, enhance decision-making, and allow businesses to focus on innovation, creativity, and long-term growth.",
  principles: [
    { title: "Business First" },
    { title: "Innovation with Purpose" },
    { title: "Engineering Excellence" },
    { title: "Long-Term Partnership" },
  ] as Principle[],
};

/* ---------- Core Values ---------- */

export const coreValues: string[] = [
  "Innovation",
  "Excellence",
  "Integrity",
  "Transparency",
  "Client Success",
  "Continuous Learning",
  "Security & Reliability",
  "Long-Term Partnership",
];

/* ---------- Capabilities ---------- */

export const capabilities: CapabilityGroup[] = [
  {
    category: "Artificial Intelligence",
    items: [
      "AI Agents",
      "AI Chatbots",
      "Voice AI Assistants",
      "Generative AI Solutions",
      "AI Knowledge Systems",
      "AI Strategy & Consulting",
    ],
  },
  {
    category: "Intelligent Automation",
    items: [
      "Business Process Automation",
      "Workflow Automation",
      "n8n Automation",
      "CRM Automation",
      "ERP Automation",
      "HR Automation",
      "Finance Automation",
      "Sales Automation",
      "Marketing Automation",
      "WhatsApp Automation",
      "Email Automation",
    ],
  },
  {
    category: "SaaS Development",
    description:
      "We design and develop scalable SaaS platforms that help businesses launch digital products, streamline operations, and create recurring revenue models.",
    items: [
      "Multi-Tenant SaaS Platforms",
      "Customer Portals",
      "Subscription Platforms",
      "Admin Dashboards",
      "Business Management Systems",
      "Custom SaaS Products",
    ],
  },
  {
    category: "Software Engineering",
    items: [
      "Enterprise Software",
      "Custom Software Development",
      "Internal Business Systems",
      "CRM Development",
      "ERP Systems",
      "Business Dashboards",
      "Client Portals",
      "Inventory & Management Systems",
    ],
  },
  {
    category: "Website Design & Development",
    description:
      "We create modern, high-performance websites that strengthen brand identity and support business growth.",
    items: [
      "Corporate Websites",
      "Business Websites",
      "Premium Landing Pages",
      "E-commerce Websites",
      "Portfolio Websites",
      "Custom Web Applications",
      "Website Redesign",
      "Website Maintenance",
    ],
  },
  {
    category: "UI/UX Design",
    items: [
      "Product Design",
      "Dashboard UI",
      "Mobile App UI",
      "Website UI",
      "User Experience Research",
      "Wireframing",
      "Prototyping",
      "Design Systems",
    ],
  },
  {
    category: "API Integration & Cloud Solutions",
    items: [
      "API Development",
      "Third-Party Integrations",
      "Payment Gateway Integration",
      "Cloud Deployment",
      "Database Architecture",
      "DevOps Support",
      "Performance Optimization",
    ],
  },
  {
    category: "Digital Growth Solutions",
    items: [
      "AI Content Creation",
      "Social Media Automation",
      "SEO Optimization",
      "Lead Generation Systems",
      "Email Marketing Automation",
      "Analytics & Reporting",
    ],
  },
];

/* ---------- Experience (stats + selected work) ---------- */
/* TODO: replace placeholder stats and projects with real ones before launch. */

export interface StatItem {
  value: string; // e.g. "50+"
  label: string; // e.g. "Projects Delivered"
}

export interface ProjectItem {
  title: string;
  category: string; // e.g. "AI Automation", "SaaS", "Website"
  description: string;
  outcomes: string[]; // measurable results
  stack: string[];
  image?: string; // path under /public/images/work/
  link?: string; // live URL or case study
}

export const experience = {
  heading: "Experience & Expertise",
  subheading:
    "Building Intelligent Technology Solutions with Proven Expertise",
  intro: [
    "Nuovance AI is backed by 2+ years of professional experience in Artificial Intelligence, intelligent automation, software engineering, SaaS development, and digital transformation.",
    "Our experience spans the complete technology lifecycle — from business analysis and solution architecture to software development, AI implementation, deployment, and long-term technical support.",
    "We have worked on a wide range of AI and software projects, delivering intelligent solutions tailored to the unique needs of startups, growing businesses, and enterprise organizations.",
  ],
  commitment:
    "Every project is built with a strong focus on quality, security, scalability, and long-term partnership. Our objective is not only to deliver technology but to help businesses transform the way they operate, compete, and grow in an AI-driven world.",
  highlights: [
    "2+ Years of Professional Experience",
    "AI & Automation Specialists",
    "Business-First Technology Solutions",
    "Enterprise-Grade Software Development",
    "Custom SaaS & Web Development",
    "Scalable Digital Transformation Solutions",
  ],
  stats: [
    { value: "2+", label: "Years of Professional Experience" },
    { value: "XX+", label: "Projects & Workflows Delivered" }, // TODO
    { value: "XX+", label: "Clients Served" }, // TODO
    { value: "12+", label: "Industries Supported" },
  ] as StatItem[],
  projects: [
   
    {
      title: "AI UGC Video Production & Social Media Management",
      category: "AI Content & Digital Growth",
      description:
        "End-to-end social media management powered by AI-generated UGC-style video — producing high-quality, on-brand short-form content at scale for client accounts, from concept and scripting to final edited output.",
      outcomes: [
        "Consistent high-volume publishing without traditional filming costs",
        "UGC-style videos produced with structured AI video workflows (Google Veo)",
        "Full pipeline: ideation → generation → editing → publishing",
        // TODO: add a real metric if available, e.g. "X videos/month delivered"
      ],
      stack: ["Google Veo", "AI Video Workflows", "ffmpeg", "Content Automation"],
      image: "/images/work/ugc-video.png",
      link: "",
    },
    {
      title: "Business Process Automation with n8n",
      category: "Intelligent Automation",
      description:
        "Automated a client's repetitive manual business process end-to-end using n8n — connecting their tools into a single workflow that runs without human intervention.",
      outcomes: [
        "Eliminated hours of repetitive manual work per week",
        "Reduced human error with a fully automated, monitored workflow",
        "Connected previously siloed tools into one pipeline",
        // TODO: name the specific process + a metric if the client allows
      ],
      stack: ["n8n", "API Integrations", "Workflow Automation"],
      image: "/images/work/n8n-automation.png",
      link: "",
    },
  ] as ProjectItem[],
};

/* ---------- Business Outcomes ---------- */

export const businessOutcomes: string[] = [
  "Reduce manual work",
  "Improve operational efficiency",
  "Increase productivity",
  "Lower operational costs",
  "Improve customer experiences",
  "Accelerate digital transformation",
  "Build scalable technology platforms",
  "Enable data-driven decision-making",
  "Support long-term business growth",
];

/* ---------- Industries ---------- */

export const industries: string[] = [
  "Healthcare",
  "Finance",
  "E-commerce",
  "Real Estate",
  "Education",
  "Manufacturing",
  "Logistics",
  "Hospitality",
  "Marketing Agencies",
  "Professional Services",
  "Startups",
  "Enterprise Organizations",
];

/* ---------- Methodology ---------- */

export const methodology: MethodologyStep[] = [
  { step: 1, title: "Discovery & Consultation" },
  { step: 2, title: "Business Analysis" },
  { step: 3, title: "Solution Strategy" },
  { step: 4, title: "Solution Architecture" },
  { step: 5, title: "UI/UX Design" },
  { step: 6, title: "Development" },
  { step: 7, title: "Testing & Quality Assurance" },
  { step: 8, title: "Deployment" },
  { step: 9, title: "Training" },
  { step: 10, title: "Ongoing Support & Optimization" },
];

/* ---------- Leadership ---------- */

export const leadership: TeamMember[] = [
  {
    name: "Shahid Malik",
    role: "Founder & Chief Executive Officer (CEO)",
    responsibilities:
      "Responsible for company vision, strategic planning, business development, partnerships, client success, and organizational growth.",
  },
  {
    name: "Mahshar Raza",
    role: "Co-Founder & Chief Technology Officer (CTO)",
    responsibilities:
      "Leads software engineering, AI architecture, automation development, technical operations, and product innovation.",
  },
  {
    name: "Mehar Afreen",
    role: "Head of Content & Creative Strategy",
    responsibilities:
      "Responsible for creative direction, content strategy, brand storytelling, campaign planning, copywriting, and marketing communications.",
  },
  {
    name: "Md Reza",
    role: "Social Media Platform Manager",
    responsibilities:
      "Leads social media strategy, content publishing, audience engagement, analytics, and digital brand growth.",
  },
  {
    name: "Shanawaz Haq",
    role: "Content Production & Distribution Specialist",
    responsibilities:
      "Creates high-quality digital content, prepares marketing assets, coordinates publishing workflows, and manages content distribution across multiple platforms.",
  },
];

/* ---------- Technology Ecosystem ---------- */

export const techEcosystem: TechGroup[] = [
  {
    category: "Artificial Intelligence",
    tools: ["OpenAI", "Anthropic Claude", "Google Gemini", "DeepSeek"],
  },
  { category: "Automation", tools: ["n8n", "Make"] },
  {
    category: "Software Development",
    tools: ["React", "Next.js", "Node.js", "Python", "FastAPI"],
  },
  { category: "Mobile Development", tools: ["Flutter", "React Native"] },
  {
    category: "Databases",
    tools: ["PostgreSQL", "MongoDB", "Supabase", "Firebase"],
  },
  {
    category: "Cloud Infrastructure",
    tools: ["AWS", "Google Cloud", "Cloudflare", "Docker"],
  },
];

/* ---------- Engagement Models ---------- */

export const engagementModels: string[] = [
  "Project-Based Development",
  "Dedicated Development Team",
  "Technology Consulting",
  "Monthly Retainer",
  "Long-Term Digital Transformation Partnership",
];

/* ---------- Why Choose Nuovance ---------- */

export const whyChooseUs: string[] = [
  "AI-First Engineering",
  "Enterprise-Grade Quality",
  "Custom-Built Solutions",
  "Secure & Scalable Architecture",
  "Transparent Communication",
  "Dedicated Project Ownership",
  "Long-Term Technology Partnership",
  "Focus on Measurable Business Results",
];

/* ---------- Contact ---------- */
/* TODO: replace all XXXXX placeholders with real values before launch. */

export const contact = {
  headline: "Let's Build the Future Together",
  intro:
    "Whether you're looking to automate business operations, launch a SaaS product, develop enterprise software, or build a modern digital platform, Nuovance AI is ready to become your trusted technology partner.",
  website: "www.NuovanceAI.com",
  bookingUrl: BOOKING_URL,
  bookingCtaLabel: BOOKING_CTA_LABEL,
  emails: {
    general: "hello@NuovanceAI.com",
    sales: "sales@NuovanceAI.com",
    support: "support@NuovanceAI.com",
    partnerships: "partners@NuovanceAI.com",
    careers: "careers@NuovanceAI.com",
  },
  phone: "+91 9304666904", // TODO
  whatsapp: "+91 9304666904", // TODO
  office: "India",
  businessHours: [
    "Monday – Friday: 9:00 AM – 6:00 PM (IST)",
    "Saturday: 10:00 AM – 4:00 PM (IST)",
  ],
  social: {
    handle: "@NuovanceAI",
    platforms: ["LinkedIn", "Facebook", "Instagram", "X", "YouTube", "GitHub"],
  },
};

/* ---------- Consultation Process (optional section) ---------- */

export const consultationProcess: string[] = [
  "Discovery Consultation",
  "Business Requirement Analysis",
  "Technology Recommendation",
  "Solution Architecture",
  "Project Proposal",
  "Development & Testing",
  "Deployment",
  "Long-Term Support",
];

/* ---------- Closing ---------- */

export const closing = {
  brand: "Nuovance AI",
  tagline: "Engineering the Future with Artificial Intelligence",
  motto: "Innovate. Automate. Transform.",
  statement:
    "Nuovance AI is more than a technology company — we are a strategic partner helping organizations unlock the power of Artificial Intelligence, intelligent automation, software engineering, SaaS platforms, and digital transformation. Together, we build intelligent businesses for the future.",
};
