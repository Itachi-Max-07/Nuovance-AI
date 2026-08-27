"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/* ---------- Shared entrance-animation primitives ----------
   The same rise-and-fade used by every section (see Experience.tsx), packaged
   as small client wrappers so Server Components can animate without becoming
   Client Components themselves. Motion only ever touches these wrappers —
   never a .card-brutal, which owns its hover transform in CSS. */

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const reducedItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

const fullItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const viewport = { once: true, margin: "-100px" } as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
}

/** Standalone element that rises in when it scrolls into view. */
export default function Reveal({ children, className }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={shouldReduceMotion ? reducedItemVariants : fullItemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Staggers any <RevealItem> descendants via Framer's variant propagation. */
export function RevealGroup({ children, className }: RevealProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** One staggered child. Inherits its animation state from RevealGroup. */
export function RevealItem({ children, className }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={shouldReduceMotion ? reducedItemVariants : fullItemVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
