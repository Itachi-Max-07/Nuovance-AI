"use client";

import { useState } from "react";
import { motion, useReducedMotion, type Transition, type Variants } from "framer-motion";
import OrbitMotif from "@/components/ui/OrbitMotif";
import { capabilities, type CapabilityGroup } from "@/lib/content";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const PREVIEW_COUNT = 6;

interface CapabilityCardProps {
  group: CapabilityGroup;
  variants: Variants;
}

function CapabilityCard({ group, variants }: CapabilityCardProps) {
  const [expanded, setExpanded] = useState(false);
  const hasOverflow = group.items.length > PREVIEW_COUNT;
  const visibleItems = expanded ? group.items : group.items.slice(0, PREVIEW_COUNT);
  const remaining = group.items.length - PREVIEW_COUNT;

  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative flex flex-col rounded-card bg-brand-surface p-6 ring-1 ring-brand-line transition-hover duration-300 hover:shadow-glow-sm hover:ring-brand-accent/40 sm:p-7"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-6 text-brand-accent/25 transition-all duration-700 ease-out group-hover:rotate-90 group-hover:text-brand-accent/50"
      >
        <OrbitMotif className="h-6 w-6" />
      </div>

      <h3 className="pr-8 text-base font-semibold leading-snug text-brand-offwhite sm:text-lg">
        {group.category}
      </h3>

      {group.description && (
        <p className="mt-2 text-sm leading-relaxed text-brand-slate">{group.description}</p>
      )}

      <ul className="mt-4 flex flex-col gap-2">
        {visibleItems.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-sm leading-relaxed text-brand-slate"
          >
            <span
              aria-hidden="true"
              className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-accent/70 transition-transform duration-300 group-hover:scale-150"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {hasOverflow && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          className="mt-3 self-start text-xs font-semibold uppercase tracking-[0.1em] text-brand-accent-2 transition-colors hover:text-brand-offwhite"
        >
          {expanded ? "Show less" : `+${remaining} more`}
        </button>
      )}
    </motion.div>
  );
}

export default function Capabilities() {
  const shouldReduceMotion = useReducedMotion();

  const itemVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.2 } },
      }
    : {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        },
      };

  const accentAnimate = shouldReduceMotion
    ? { opacity: 0.12 }
    : { opacity: 0.12, rotate: 360 };

  const accentTransition: Transition = shouldReduceMotion
    ? { duration: 1, ease: "easeOut" }
    : {
        opacity: { duration: 1, ease: "easeOut" },
        rotate: { duration: 90, repeat: Infinity, ease: "linear" },
      };

  return (
    <section
      id="capabilities"
      className="relative overflow-hidden bg-brand-dark-2 py-20 sm:py-24 md:py-28 lg:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 text-brand-accent sm:h-28 sm:w-28 lg:h-32 lg:w-32"
      >
        <motion.div
          className="h-full w-full"
          initial={{ opacity: 0, rotate: 0 }}
          animate={accentAnimate}
          transition={accentTransition}
        >
          <OrbitMotif className="h-full w-full" />
        </motion.div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-2">
          <OrbitMotif className="h-4 w-4 text-brand-accent-2" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent-2 sm:text-sm">
            Capabilities
          </span>
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className="mt-6 max-w-2xl text-balance text-3xl font-semibold tracking-tight text-brand-offwhite sm:text-4xl lg:text-5xl"
        >
          End-to-End Technology Capabilities
        </motion.h2>

        <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {capabilities.map((group) => (
            <CapabilityCard key={group.category} group={group} variants={itemVariants} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
