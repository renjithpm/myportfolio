import type { Project } from "@/features/projects/types";

export const projects: readonly Project[] = [
  {
    title: "Aldar Properties Platform",
    description:
      "Enterprise real-estate platform serving customers across the UAE — real-time property reservations, KYC verification, and secure multi-gateway payments. Integrated Generative & agentic AI (Claude + MCP) for document processing and customer support.",
    tags: ["Next.js", "NestJS", "Azure", "Claude AI", "PostgreSQL"],
    emoji: "🏙️",
    featured: true,
  },
  {
    title: "National Emergency Response Platform",
    description:
      "India's national emergency-response system at C-DAC, live across 28 states and serving millions of citizens. Engineered to handle 50,000+ emergency calls per day at sub-100ms response times under high concurrency.",
    tags: ["React.js", "Node.js", "PostgreSQL", "Redis", "Keycloak"],
    emoji: "🚨",
    featured: true,
  },
  {
    title: "Real-Time Vehicle Tracking",
    description:
      "WebSocket-powered dispatch system tracking 1,000+ emergency vehicles with 15-second location updates, integrating GIS mapping (Leaflet, OpenLayers) to cut average response times from 12 to under 8 minutes.",
    tags: ["WebSockets", "Socket.IO", "Leaflet", "OpenLayers"],
    emoji: "🛰️",
  },
  {
    title: "eCommerce & Odoo ERP Suite",
    description:
      "React.js storefronts and admin dashboards integrated with Odoo ERP via REST APIs, with Node.js middleware for real-time order and inventory sync — improving UI responsiveness by 40% across client deployments.",
    tags: ["React.js", "Node.js", "Odoo ERP", "REST APIs"],
    emoji: "🛒",
  },
] as const;
