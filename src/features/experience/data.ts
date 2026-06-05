export interface ExperienceItem {
  readonly role: string;
  readonly company: string;
  readonly period: string;
  readonly description: string;
  readonly highlights: readonly string[];
}

export const experience: readonly ExperienceItem[] = [
  {
    role: "Senior Full-Stack Developer",
    company: "dbiz.ai",
    period: "Jan 2026 — Present",
    description:
      "Working on Aldar Properties, a large-scale enterprise real-estate platform serving customers across the UAE. Building full-stack solutions with Next.js, NestJS, Azure, Generative AI, and enterprise-grade cloud architecture.",
    highlights: [
      "Architected property reservation and booking workflows using Next.js and NestJS",
      "Built KYC verification and document processing pipelines for regulatory compliance",
      "Integrated multiple payment gateways with secure transaction handling and audit trails",
      "Implemented AI-powered automation using Claude AI Agents and MCP (Model Context Protocol)",
      "Leveraged Azure App Services, AD B2C, Blob Storage, Key Vault, and API Management",
      "Accelerated development and testing using Claude Code and AI-assisted engineering workflows",
    ],
  },
  {
    role: "Project Engineer",
    company: "C-DAC (Centre for Development of Advanced Computing)",
    period: "Oct 2022 — Jan 2026",
    description:
      "Contributed to India's national emergency response platform, delivering mission-critical applications used across 28 states and supporting millions of citizens.",
    highlights: [
      "Developed 10+ full-stack modules using React.js, Node.js, PostgreSQL, and WebSockets",
      "Optimized systems handling 50,000+ emergency calls daily with sub-100ms response times",
      "Built real-time vehicle tracking for 1,000+ emergency vehicles using WebSocket technology",
      "Integrated GIS mapping solutions to improve emergency dispatch operations",
      "Implemented JWT, Keycloak RBAC, and two-factor authentication for government systems",
      "Reduced API latency by 60% using Redis caching and database optimization",
      "Received Best Performance Award (2025) for contributions to mission-critical platforms",
    ],
  },
  {
    role: "Associate Software Developer",
    company: "Zesty Beanz Technologies",
    period: "Dec 2020 — Oct 2022",
    description:
      "Developed enterprise web applications, eCommerce platforms, and Odoo ERP integrations while collaborating closely with UI/UX and backend teams.",
    highlights: [
      "Built React.js storefronts and admin dashboards integrated with Odoo ERP",
      "Created reusable component libraries that improved UI performance by 40%",
      "Developed Node.js middleware services for real-time order and inventory synchronization",
      "Customized 10+ Odoo ERP modules across Finance, Inventory, and HR domains",
      "Delivered full-stack solutions for multiple client deployments using Agile methodologies",
      "Worked extensively with REST APIs, React.js, JavaScript, and enterprise business workflows",
    ],
  },
] as const;