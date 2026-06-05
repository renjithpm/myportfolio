# CLAUDE.md

## Project Overview

Build a production-ready personal portfolio website for:

**Renjith PM**

Professional Title:
Full Stack Developer | React Native Developer

Target Audience:

* Recruiters
* Hiring Managers
* Startup Founders
* Freelance Clients

The project must follow enterprise-grade architecture, clean code principles, scalability, accessibility, SEO best practices, and performance optimization.

---

# Tech Stack

Frontend:

* Next.js 16 App Router
* TypeScript (strict mode)
* Tailwind CSS
* Shadcn/UI
* Framer Motion
* React Hook Form
* Zod
* Lucide Icons
* TanStack Query
* next-themes

Backend (future phase):

* NestJS
* Prisma
* PostgreSQL

---

# Design Philosophy

Inspired by:

* Apple
* Linear
* Stripe
* Vercel
* Modern SaaS websites

Requirements:

* Premium UI
* Dark mode first
* Light mode support
* Glassmorphism
* Responsive design
* Mobile first
* Minimal but visually impressive
* Smooth animations
* High accessibility
* Lighthouse score >95

---

# Development Rules

Always follow:

1. SOLID principles
2. DRY principles
3. Reusable components
4. Composition over inheritance
5. Strict TypeScript
6. No any types
7. Feature-based architecture
8. Server Components by default
9. Client Components only when necessary
10. Accessibility first

---

# Folder Structure

src/

app/
components/
features/
hooks/
lib/
services/
types/
constants/
providers/
styles/

Each feature must remain self-contained.

---

# Component Rules

Use:

* Functional Components
* TypeScript interfaces
* Memoization when appropriate
* Shadcn UI primitives
* Tailwind utilities

Avoid:

* Inline styles
* Large monolithic components
* Business logic inside UI components

---

# State Management

Prefer:

1. URL State
2. Server Components
3. React State
4. Context

Avoid unnecessary global state.

---

# Styling Guidelines

Use Tailwind only.

Design Tokens:

* Consistent spacing
* Consistent border radius
* Consistent shadows
* Consistent typography

Animations:

* Framer Motion
* Subtle and elegant
* No excessive motion

---

# Performance Requirements

* Dynamic imports
* Image optimization
* Code splitting
* Lazy loading
* Metadata optimization
* SEO optimization

Target:

Performance: 95+
Accessibility: 100
SEO: 100

---

# Sections Required

1. Hero
2. About
3. Skills
4. Projects
5. Experience
6. Certifications
7. GitHub Activity
8. Blog
9. Contact
10. Footer

---

# Code Generation Rules

When generating code:

* Generate complete files
* Include imports
* Include types
* Include comments only when necessary
* Follow production standards

Never generate placeholder architecture without implementation.

Always provide:

1. File path
2. Code
3. Explanation

---

# Token Efficiency Rules

Never regenerate existing files.

Always:

1. Read existing structure.
2. Modify only impacted files.
3. Return only changed files.
4. Avoid repeating unchanged code.

When creating a new feature:

* Create the minimum required files.
* Reuse existing components.
* Keep responses concise.
