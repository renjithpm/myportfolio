import * as React from "react";
import Link from "next/link";
import { Github, Linkedin, Mail, Twitter, type LucideIcon } from "lucide-react";

import { navLinks, siteConfig, socialLinks } from "@/constants/site";
import type { SocialIcon } from "@/types";

const iconMap: Record<SocialIcon, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  mail: Mail,
};

/**
 * Site footer: brand summary, quick navigation, social links and copyright.
 * Server Component — no interactivity required.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-6 py-14 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link href="#hero" className="text-lg font-semibold tracking-tight">
              {siteConfig.name}
              <span className="text-primary">.</span>
            </Link>
            <p className="mt-3 text-sm text-pretty text-muted-foreground">
              {siteConfig.author.role}. Building fast, accessible products for
              the web and mobile.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3">
            <span className="text-sm font-medium">Navigate</span>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium">Connect</span>
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
                      className="inline-flex size-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <Icon className="size-5" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>Built with Next.js, TypeScript &amp; Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}
