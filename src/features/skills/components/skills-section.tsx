import { Section } from "@/components/layout/section";
import { StaggerGroup, MotionItem } from "@/components/motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { skillGroups } from "@/features/skills/data";

export function SkillsSection() {
  return (
    <Section
      id="skills"
      eyebrow="Skills"
      title="My technical toolkit"
      description="The technologies I reach for to design, build and ship products across the stack."
    >
<StaggerGroup className="grid gap-6 sm:grid-cols-2">
            {skillGroups.map((group) => (
            <MotionItem key={group.category}>
              <Card className="h-full transition-colors hover:border-primary/40">
                <CardContent className="p-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">
                    {group.category}
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <li key={skill}>
                        <Badge variant="secondary" className="text-sm">
                          {skill}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </MotionItem>
          ))}
        </StaggerGroup>
    </Section>
  );
}
