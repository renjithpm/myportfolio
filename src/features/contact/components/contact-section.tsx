import Link from "next/link";
import { Github, Linkedin, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";

import { siteConfig, socialLinks } from "@/constants/site";
import type { SocialIcon } from "@/types";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "@/features/contact/components/contact-form";

const iconMap: Record<SocialIcon, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Github,
  mail: Mail,
};

export function ContactSection() {
  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Let's build something great"
      description="Have a project, a role or just an idea? My inbox is always open."
    >
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <div className="flex h-full flex-col gap-6">
            <Card className="bg-card/40">
              <CardContent className="space-y-5 p-6">
                <Link
                  href={`mailto:${siteConfig.author.email}`}
                  className="flex items-center gap-3 text-sm transition-colors hover:text-primary"
                >
                  <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="size-5" />
                  </span>
                  {siteConfig.author.email}
                </Link>
                <Link
                  href={`tel:${siteConfig.author.phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-3 text-sm transition-colors hover:text-primary"
                >
                  <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Phone className="size-5" />
                  </span>
                  {siteConfig.author.phone}
                </Link>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MapPin className="size-5" />
                  </span>
                  {siteConfig.author.location} · Open to remote
                </div>
              </CardContent>
            </Card>

            <div>
              <p className="mb-3 text-sm font-medium">Find me online</p>
              <ul className="flex items-center gap-2">
                {socialLinks.map((social) => {
                  const Icon = iconMap[social.icon];
                  return (
                    <li key={social.label}>
                      <Link
                        href={social.href}
                        aria-label={social.label}
                        target={social.href.startsWith("http") ? "_blank" : undefined}
                        rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="inline-flex size-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      >
                        <Icon className="size-5" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <Card>
            <CardContent className="p-6 sm:p-8">
              <ContactForm />
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}
