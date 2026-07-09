"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import OrbitMotif from "@/components/ui/OrbitMotif";
import { businessOutcomes } from "@/lib/content";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

export default function BusinessOutcomes() {
  const shouldReduceMotion = useReducedMotion();

  const itemVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.2 } },
      }
    : {
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
        },
      };

  return (
    <section id="outcomes" className="relative bg-brand-dark-2 py-16 sm:py-20 md:py-24">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto max-w-6xl px-6 lg:px-8"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-2">
          <OrbitMotif className="h-4 w-4 text-brand-accent-2" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent-2 sm:text-sm">
            Business Outcomes
          </span>
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className="mt-4 max-w-xl text-balance text-2xl font-semibold tracking-tight text-brand-offwhite sm:text-3xl"
        >
          Measurable Impact, Engineered In
        </motion.h2>

        <motion.div
          variants={itemVariants}
          className="mt-8 grid gap-x-6 gap-y-3 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3"
        >
          {businessOutcomes.map((outcome) => (
            <div
              key={outcome}
              className="flex items-center gap-3 rounded-input bg-brand-surface px-4 py-3 ring-1 ring-brand-line"
            >
              <span
                aria-hidden="true"
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-accent/15"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
              </span>
              <span className="text-sm font-medium leading-snug text-brand-slate">
                {outcome}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
