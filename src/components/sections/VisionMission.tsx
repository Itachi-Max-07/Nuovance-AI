"use client";

import { motion, useReducedMotion, type Transition, type Variants } from "framer-motion";
import OrbitMotif from "@/components/ui/OrbitMotif";
import { philosophy, visionMission } from "@/lib/content";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

export default function VisionMission() {
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
      id="vision-mission"
      className="relative overflow-hidden bg-brand-dark py-20 sm:py-24 md:py-28 lg:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-6 -left-6 h-24 w-24 text-brand-accent sm:h-28 sm:w-28 lg:h-32 lg:w-32"
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
        className="relative z-10 mx-auto max-w-5xl px-6 lg:px-8"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-2">
          <OrbitMotif className="h-4 w-4 text-brand-accent-2" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent-2 sm:text-sm">
            Vision &amp; Mission
          </span>
        </motion.div>

        <div className="mt-6 grid gap-5 sm:mt-8 sm:grid-cols-2 sm:gap-6 lg:gap-8">
          <motion.div
            variants={itemVariants}
            className="rounded-card bg-brand-surface p-6 ring-1 ring-brand-line sm:p-8"
          >
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-brand-offwhite">
              Vision
            </h3>
            <p className="mt-4 text-base leading-relaxed text-brand-slate sm:text-lg">
              {visionMission.vision}
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="rounded-card bg-brand-surface p-6 ring-1 ring-brand-line sm:p-8"
          >
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-brand-offwhite">
              Mission
            </h3>
            <p className="mt-4 text-base leading-relaxed text-brand-slate sm:text-lg">
              {visionMission.mission}
            </p>
          </motion.div>
        </div>

        <motion.p
          variants={itemVariants}
          className="mx-auto mt-14 max-w-2xl text-balance text-center font-heading text-xl font-semibold leading-snug text-brand-offwhite sm:mt-20 sm:text-2xl lg:text-3xl"
        >
          &ldquo;{visionMission.brandPromise}&rdquo;
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-brand-slate sm:mt-8 sm:text-base"
        >
          {philosophy.statement}
        </motion.p>

        <motion.ul
          variants={itemVariants}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-2 gap-y-3 sm:mt-12"
        >
          {philosophy.principles.map((principle, index) => (
            <li
              key={principle.title}
              className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-brand-slate"
            >
              <span>{principle.title}</span>
              {index < philosophy.principles.length - 1 && (
                <span aria-hidden="true" className="text-brand-muted/50">
                  ·
                </span>
              )}
            </li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  );
}
