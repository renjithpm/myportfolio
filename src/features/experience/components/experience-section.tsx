import { Check } from "lucide-react";

import { Section } from "@/components/layout/section";
import { StaggerGroup, MotionItem } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { experience } from "@/features/experience/data";

export function ExperienceSection() {
  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title="Where I've made an impact"
      description="A track record of shipping reliable products and helping teams move faster."
      containerClassName="max-w-4xl"
    >
      <StaggerGroup className="relative">
        {/* Timeline rail */}
        <span
          aria-hidden
          className="absolute left-[7px] top-2 bottom-2 w-px bg-border sm:left-[9px]"
        />
        <ol className="space-y-10">
          {experience.map((item) => (
            <MotionItem key={`${item.company}-${item.period}`}>
              <li className="relative pl-8 sm:pl-12">
                <span
                  aria-hidden
                  className="absolute left-0 top-1.5 size-4 rounded-full border-2 border-primary bg-background sm:size-5"
                />
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h3 className="text-lg font-semibold">{item.role}</h3>
                  <span className="text-primary">·</span>
                  <span className="font-medium text-muted-foreground">
                    {item.company}
                  </span>
                </div>
                <Badge variant="secondary" className="mt-2">
                  {item.period}
                </Badge>
                <p className="mt-3 text-sm text-muted-foreground">
                  {item.description}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {item.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </li>
            </MotionItem>
          ))}
        </ol>
      </StaggerGroup>
    </Section>
  );
}
