"use client";

import { motion, useReducedMotion, type Transition, type Variants } from "framer-motion";
import OrbitMotif from "@/components/ui/OrbitMotif";
import { about } from "@/lib/content";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

// Curated subset of about.executiveSummary / about.overview — a lead identity
// statement, the problem context, and the closing values line — merged into
// one flowing narrative rather than rendering all six source paragraphs.
const paragraphs = [about.executiveSummary[0], about.overview[0], about.overview[2]];

export default function About() {
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
      id="about"
      className="relative overflow-hidden bg-brand-offwhite py-16 sm:py-20 md:py-24 lg:py-28"
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
        className="relative z-10 mx-auto max-w-4xl px-6 lg:px-8"
      >
        <motion.h2
          variants={itemVariants}
          className="max-w-2xl text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl lg:text-5xl"
        >
          {about.heading}
        </motion.h2>

        <div className="mt-6 flex flex-col gap-4 sm:mt-8 sm:gap-5">
          {paragraphs.map((paragraph) => (
            <motion.p
              key={paragraph}
              variants={itemVariants}
              className="max-w-2xl text-base leading-relaxed text-brand-slate sm:text-lg"
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
