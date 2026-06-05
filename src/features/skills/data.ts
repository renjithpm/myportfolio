export interface SkillGroup {
  readonly category: string;
  readonly skills: readonly string[];
}

export const skillGroups: readonly SkillGroup[] = [
  {
    category: "Frontend",
    skills: ["Next.js", "React.js", "TypeScript", "JavaScript (ES6+)", "Redux", "Material UI", "SCSS"],
  },
  {
    category: "Backend",
    skills: ["NestJS", "Node.js", "Express.js", "GraphQL", "REST APIs", "WebSockets", "Microservices"],
  },
  {
    category: "Databases",
    skills: ["PostgreSQL", "MongoDB", "Redis", "Query Optimization", "Connection Pooling"],
  },
  {
    category: "Cloud & DevOps",
    skills: ["Microsoft Azure", "Docker", "GitHub Actions", "GitLab CI", "Azure DevOps", "CI/CD"],
  },
  {
    category: "AI & Automation",
    skills: ["Generative AI", "Agentic AI", "Claude AI Agents", "MCP", "Anthropic Claude API", "Claude Code"],
  },
  {
    category: "Security & Auth",
    skills: ["Keycloak", "JWT", "RBAC", "OAuth 2.0", "Two-Factor Auth", "KYC Workflows"],
  },
] as const;
