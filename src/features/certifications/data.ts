export interface Certification {
  readonly name: string;
  readonly issuer: string;
  readonly year: string;
}

export interface Education {
  readonly degree: string;
  readonly institution: string;
  readonly year: string;
  readonly detail: string;
}

export const certifications: readonly Certification[] = [
  { name: "Claude 101", issuer: "Anthropic", year: "2026" },
  { name: "Claude Code in Action", issuer: "Anthropic", year: "2026" },
  { name: "AI Fluency: Framework & Foundations", issuer: "Anthropic", year: "2026" },
] as const;

export const education: Education = {
  degree: "B.Tech in Computer Science & Engineering",
  institution: "University of Calicut, Kerala, India",
  year: "2017",
  detail: "CGPA: 7.28 / 10",
} as const;
