import * as React from "react";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion";

interface SectionProps extends React.ComponentProps<"section"> {
  /** Anchor id used by in-page navigation (e.g. "about"). */
  id?: string;
  /** Optional eyebrow label rendered above the title. */
  eyebrow?: string;
  /** Section heading. When provided, renders an accessible <h2>. */
  title?: string;
  /** Supporting copy under the title. */
  description?: string;
  /** Constrain content width. Defaults to the standard container. */
  containerClassName?: string;
  /** Disable the default scroll-reveal on the header. */
  noReveal?: boolean;
}

/**
 * Standard page section: consistent vertical rhythm, max-width container,
 * scroll-margin for anchored navigation, and an optional animated header.
 * Used as the shell for every content section of the portfolio.
 */
export function Section({
  id,
  eyebrow,
  title,
  description,
  className,
  containerClassName,
  noReveal = false,
  children,
  ...props
}: SectionProps) {
  const hasHeader = Boolean(eyebrow || title || description);
  const headingId = id ? `${id}-heading` : undefined;

  return (
    <section
      id={id}
      aria-labelledby={title ? headingId : undefined}
      className={cn("relative scroll-mt-24 py-20 sm:py-28", className)}
      {...props}
    >
      <div
        className={cn(
          "mx-auto w-full max-w-6xl px-6 lg:px-8",
          containerClassName
        )}
      >
        {hasHeader && (
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            description={description}
            headingId={headingId}
            noReveal={noReveal}
          />
        )}
        {children}
      </div>
    </section>
  );
}

interface SectionHeaderProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  headingId?: string;
  noReveal?: boolean;
}

function SectionHeader({
  eyebrow,
  title,
  description,
  headingId,
  noReveal,
}: SectionHeaderProps) {
  const content = (
    <div className="mb-12 max-w-2xl sm:mb-16">
      {eyebrow && (
        <p className="mb-3 text-sm font-medium tracking-wide text-primary uppercase">
          {eyebrow}
        </p>
      )}
      {title && (
        <h2
          id={headingId}
          className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
        >
          {title}
        </h2>
      )}
      {description && (
        <p className="mt-4 text-lg text-pretty text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );

  return noReveal ? content : <Reveal>{content}</Reveal>;
}
