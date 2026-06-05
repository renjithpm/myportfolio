"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Download, Github, Linkedin, Mail, Sparkles, type LucideIcon } from "lucide-react";

import { siteConfig, socialLinks } from "@/constants/site";
import type { SocialIcon } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fadeInUp, staggerContainer } from "@/components/motion";

const iconMap: Record<SocialIcon, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Github,
  mail: Mail,
};

const techStack = [
  "Next.js",
  "NestJS",
  "TypeScript",
  "PostgreSQL",
  "Azure",
  "Claude AI",
];

export function HeroSection() {
  return (
    <section
      id="hero"
      className="bg-grid relative flex min-h-svh items-center overflow-hidden pt-16"
    >
      {/* Ambient brand glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--brand-via),transparent_60%)] opacity-20 blur-3xl"
      />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={fadeInUp}>
            <Badge variant="glass" className="mb-6">
              <Sparkles className="text-primary" />
              Available for new opportunities
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            Hi, I&apos;m {siteConfig.author.name.split(" ")[0]}.
            <br />
            <span className="text-gradient">I build intelligent platforms.</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mt-6 max-w-xl text-lg text-pretty text-muted-foreground sm:text-xl"
          >
            {siteConfig.author.role} with 5+ years building scalable, cloud-native
            applications with Next.js, NestJS, TypeScript and Azure — integrating
            Generative &amp; agentic AI into enterprise platforms.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button asChild variant="gradient" size="lg">
              <Link href="#projects">
                View my work
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/resume.pdf" target="_blank">
                <Download />
                Download CV
              </Link>
            </Button>
          </motion.div>

          <motion.ul
            variants={fadeInUp}
            className="mt-8 flex items-center gap-2"
          >
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
          </motion.ul>
        </motion.div>

        {/* Visual: glass profile / code card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="glass rounded-2xl p-6 shadow-glow">
            <div className="flex items-center gap-2 pb-4">
              <span className="size-3 rounded-full bg-destructive/70" />
              <span className="size-3 rounded-full bg-yellow-500/70" />
              <span className="size-3 rounded-full bg-green-500/70" />
              <span className="ml-2 font-mono text-xs text-muted-foreground">
                developer.ts
              </span>
            </div>
            <pre className="overflow-x-auto font-mono text-sm leading-relaxed text-muted-foreground">
              <code>
                <span className="text-primary">const</span> dev = {"{"}
                {"\n"}  name: <span className="text-gradient">{`"${siteConfig.author.name}"`}</span>,
                {"\n"}  role: <span className="text-gradient">&quot;Senior Full-Stack&quot;</span>,
                {"\n"}  focus: <span className="text-gradient">&quot;AI · Cloud · Scale&quot;</span>,
                {"\n"}  shipping: <span className="text-primary">true</span>,
                {"\n"}
                {"}"};
              </code>
            </pre>
            <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
              {techStack.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
