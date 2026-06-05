"use client";

import * as React from "react";
import { motion, type Variants, type HTMLMotionProps } from "framer-motion";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Shared easing + variant presets                                    */
/* ------------------------------------------------------------------ */

const EASE = [0.22, 1, 0.36, 1] as const;

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: EASE } },
};

/** Parent that staggers its children's `visible` transitions. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

/* ------------------------------------------------------------------ */
/*  Components                                                          */
/* ------------------------------------------------------------------ */

type RevealProps = HTMLMotionProps<"div"> & {
  /** Seconds to delay the reveal. */
  delay?: number;
  /** Animate once when scrolled into view (default) vs. every time. */
  once?: boolean;
};

/**
 * Fades + slides its content in when scrolled into view.
 * Honors `prefers-reduced-motion` automatically via framer-motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  once = true,
  ...props
}: RevealProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Container that staggers the reveal of its `MotionItem` children.
 * Pair with <MotionItem> for list / grid entrance animations.
 */
export function StaggerGroup({
  children,
  className,
  once = true,
  ...props
}: RevealProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** A single staggered child. Must live inside <StaggerGroup>. */
export function MotionItem({
  children,
  className,
  ...props
}: HTMLMotionProps<"div">) {
  return (
    <motion.div className={cn(className)} variants={fadeInUp} {...props}>
      {children}
    </motion.div>
  );
}
