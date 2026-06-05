import { Award, GraduationCap } from "lucide-react";

import { Section } from "@/components/layout/section";
import { StaggerGroup, MotionItem, Reveal } from "@/components/motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { certifications, education } from "@/features/certifications/data";

export function CertificationsSection() {
  return (
    <Section
      id="certifications"
      eyebrow="Certifications & Education"
      title="Credentials & continuous learning"
      description="Formal training and certifications that back up the work — with a focus on modern AI engineering."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StaggerGroup className="contents">
          {certifications.map((cert) => (
            <MotionItem key={cert.name}>
              <Card className="h-full transition-colors hover:border-primary/40">
                <CardContent className="flex h-full flex-col p-6">
                  <span className="inline-flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Award className="size-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold">{cert.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{cert.issuer}</p>
                  <Badge variant="secondary" className="mt-4 w-fit">
                    {cert.year}
                  </Badge>
                </CardContent>
              </Card>
            </MotionItem>
          ))}
        </StaggerGroup>
      </div>

      <Reveal delay={0.1}>
        <Card className="mt-6 bg-card/40">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="inline-flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <GraduationCap className="size-5" />
              </span>
              <div>
                <h3 className="text-base font-semibold">{education.degree}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {education.institution} · {education.detail}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="w-fit">
              {education.year}
            </Badge>
          </CardContent>
        </Card>
      </Reveal>
    </Section>
  );
}
