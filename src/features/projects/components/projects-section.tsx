import Link from "next/link";
import { Github } from "lucide-react";

import { Section } from "@/components/layout/section";
import { StaggerGroup, MotionItem, Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { projects } from "@/features/projects/data";
import { ProjectCard } from "@/features/projects/components/project-card";

export function ProjectsSection() {
  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="Selected work"
      description="A few projects I'm proud of — spanning web platforms, mobile apps and developer tooling."
    >
        <StaggerGroup className="grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <MotionItem key={project.title} className={project.featured ? "sm:col-span-2" : undefined}>
              <ProjectCard project={project} />
            </MotionItem>
          ))}
        </StaggerGroup>

      <Reveal delay={0.1} className="mt-10 flex justify-center">
        <Button asChild variant="outline" size="lg">
          <Link href="https://github.com/renjithpm" target="_blank" rel="noopener noreferrer">
            <Github />
            See more on GitHub
          </Link>
        </Button>
      </Reveal>
    </Section>
  );
}
