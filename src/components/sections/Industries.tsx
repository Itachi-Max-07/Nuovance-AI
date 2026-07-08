"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import OrbitMotif from "@/components/ui/OrbitMotif";
import { industries } from "@/lib/content";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

export default function Industries() {
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
    <section id="industries" className="relative bg-brand-offwhite py-12 sm:py-14 md:py-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto max-w-6xl px-6 lg:px-8"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-2">
          <OrbitMotif className="h-4 w-4 text-brand-accent" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent sm:text-sm">
            Industries
          </span>
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className="mt-4 max-w-xl text-balance text-2xl font-bold tracking-tight text-brand-dark sm:text-3xl"
        >
          Industries We Serve
        </motion.h2>

        <motion.ul variants={itemVariants} className="mt-8 flex flex-wrap gap-3 sm:mt-10">
          {industries.map((industry) => (
            <li
              key={industry}
              className="rounded-full border border-brand-dark/10 bg-white px-4 py-2 text-sm font-medium text-brand-dark transition-colors duration-200 hover:border-brand-accent/50 hover:text-brand-accent"
            >
              {industry}
            </li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  );
}
