import { Code2, BrainCircuit, Cloud } from "lucide-react";

import { Section } from "@/components/layout/section";
import { Reveal, StaggerGroup, MotionItem } from "@/components/motion";
import { Card, CardContent } from "@/components/ui/card";

const highlights = [
  {
    icon: Code2,
    title: "Full-Stack Engineering",
    description:
      "End-to-end delivery with Next.js, NestJS, Node.js and PostgreSQL — REST & GraphQL APIs, microservices, WebSockets and real-time systems.",
  },
  {
    icon: BrainCircuit,
    title: "Generative & Agentic AI",
    description:
      "Building intelligent workflows with the Anthropic Claude API, AI agents and MCP (Model Context Protocol) to automate enterprise processes.",
  },
  {
    icon: Cloud,
    title: "Cloud & DevOps",
    description:
      "Cloud-native architecture on Microsoft Azure with CI/CD pipelines, Docker and observability — built to scale under heavy production load.",
  },
];

const stats = [
  { value: "5+", label: "Years experience" },
  { value: "28", label: "Indian states served" },
  { value: "50K+", label: "Daily transactions" },
  { value: "<100ms", label: "API latency" },
];

export function AboutSection() {
  return (
    <Section
      id="about"
      eyebrow="About me"
      title="Engineering scalable platforms for enterprise & government"
      description="I'm a Senior Full-Stack Developer who has delivered mission-critical systems — from a national emergency-response platform serving millions to AI-powered enterprise real-estate applications across the UAE."
    >
      <div className="grid gap-6 md:grid-cols-3">
        <StaggerGroup className="contents">
          {highlights.map((item) => (
            <MotionItem key={item.title}>
              <Card className="h-full transition-colors hover:border-primary/40">
                <CardContent className="p-6">
                  <span className="inline-flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <item.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </MotionItem>
          ))}
        </StaggerGroup>
      </div>

      <Reveal delay={0.1}>
        <dl className="mt-12 grid grid-cols-2 gap-6 rounded-xl border border-border bg-card/40 p-8 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block text-3xl font-semibold text-gradient sm:text-4xl">
                  {stat.value}
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}
