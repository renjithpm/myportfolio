import type { NavLink, SiteConfig, SocialLink } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Renjith PM",
  title: "Renjith PM — Senior Full-Stack Developer",
  description:
    "Renjith PM is a Senior Full-Stack Developer with 5+ years building scalable, cloud-native web applications with Next.js, NestJS, TypeScript, PostgreSQL and Azure — integrating Generative AI, agentic AI and the Anthropic Claude API into enterprise platforms.",
  url: "https://renjithpm.dev",
  ogImage: "/og.png",
  author: {
    name: "Renjith PM",
    role: "Senior Full-Stack Developer",
    email: "renjithpmani@gmail.com",
    phone: "+91 79024 89554",
    location: "Kerala, India",
  },
  keywords: [
    "Renjith PM",
    "Senior Full-Stack Developer",
    "Full Stack Engineer",
    "Next.js",
    "NestJS",
    "React",
    "Node.js",
    "TypeScript",
    "PostgreSQL",
    "Microsoft Azure",
    "Generative AI",
    "Agentic AI",
    "Anthropic Claude API",
    "MCP",
    "Portfolio",
  ],
} as const;

/** Primary in-page navigation. */
export const navLinks: readonly NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Certifications", href: "#certifications" },
  { label: "Courses", href: "/learn" },
  { label: "Contact", href: "#contact" },
] as const;

export const socialLinks: readonly SocialLink[] = [
  { label: "GitHub", href: "https://github.com/renjithpm", icon: "github" },
  { label: "LinkedIn", href: "https://linkedin.com/in/renjithpm", icon: "linkedin" },
  { label: "Email", href: `mailto:${siteConfig.author.email}`, icon: "mail" },
] as const;
