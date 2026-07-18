"use client";

import { motion, useReducedMotion, type Transition, type Variants } from "framer-motion";
import OrbitMotif from "@/components/ui/OrbitMotif";
import { techEcosystem } from "@/lib/content";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export default function TechEcosystem() {
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
    ? { opacity: 0.14 }
    : { opacity: 0.14, rotate: 360 };

  const accentTransition: Transition = shouldReduceMotion
    ? { duration: 1, ease: "easeOut" }
    : {
        opacity: { duration: 1, ease: "easeOut" },
        rotate: { duration: 90, repeat: Infinity, ease: "linear" },
      };

  return (
    <section
      id="tech-ecosystem"
      className="relative overflow-hidden bg-brand-cream pb-10 pt-20 sm:pb-12 sm:pt-24 md:pt-28 lg:pt-36"
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
        className="relative z-10 mx-auto max-w-6xl px-6 lg:px-8"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-2">
          <OrbitMotif className="h-4 w-4 text-brand-accent-deep" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent-deep sm:text-sm">
            Tech Ecosystem
          </span>
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className="mt-6 max-w-2xl text-balance text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl lg:text-5xl"
        >
          The Technology Stack Behind Every Build
        </motion.h2>

        <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {techEcosystem.map((group) => (
            <motion.div key={group.category} variants={itemVariants} className="flex">
              <div className="card-brutal flex w-full flex-col p-7 sm:p-8">
                <h3 className="flex items-center gap-2.5 text-sm font-extrabold uppercase tracking-[0.12em] text-brand-ink">
                  <span aria-hidden="true" className="h-1 w-6 shrink-0 rounded-full bg-brand-accent" />
                  {group.category}
                </h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.tools.map((tool) => (
                    <span key={tool} className="tag-brutal text-xs">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
