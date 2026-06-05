import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/features/projects/types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow">
      {/* Gradient cover */}
      <div className="relative flex h-40 items-center justify-center bg-[linear-gradient(135deg,var(--brand-from),var(--brand-via),var(--brand-to))]">
        <span className="text-5xl" aria-hidden>
          {project.emoji}
        </span>
        {project.featured && (
          <Badge variant="glass" className="absolute right-3 top-3">
            Featured
          </Badge>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-tight">{project.title}</h3>
          <div className="flex shrink-0 items-center gap-1">
            {project.repoUrl && (
              <Link
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} source code`}
                className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Github className="size-4" />
              </Link>
            )}
            {project.liveUrl && (
              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} live demo`}
                className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <ArrowUpRight className="size-4" />
              </Link>
            )}
          </div>
        </div>

        <p className="mt-2 flex-1 text-sm text-muted-foreground">
          {project.description}
        </p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li key={tag}>
              <Badge variant="outline">{tag}</Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
