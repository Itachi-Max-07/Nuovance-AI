"use client";

import { motion, useReducedMotion, type Transition, type Variants } from "framer-motion";
import OrbitMotif from "@/components/ui/OrbitMotif";
import { closing } from "@/lib/content";

export default function Closing() {
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
          transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        },
      };

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  };

  const accentAnimate = shouldReduceMotion
    ? { opacity: 0.16 }
    : { opacity: 0.16, rotate: 360 };

  const accentTransition: Transition = shouldReduceMotion
    ? { duration: 1, ease: "easeOut" }
    : {
        opacity: { duration: 1, ease: "easeOut" },
        rotate: { duration: 70, repeat: Infinity, ease: "linear" },
      };

  return (
    <section className="relative overflow-hidden border-t border-brand-line bg-brand-dark-2 py-16 sm:py-20 md:py-24">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-6 text-center lg:px-8"
      >
        <motion.div
          variants={itemVariants}
          className="h-10 w-10 text-brand-accent"
          initial={{ opacity: 0, rotate: 0 }}
          animate={accentAnimate}
          transition={accentTransition}
        >
          <OrbitMotif className="h-full w-full" />
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="mt-6 text-balance text-2xl font-semibold tracking-tight text-brand-offwhite sm:text-3xl"
        >
          {closing.tagline}
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-brand-accent sm:text-sm"
        >
          {closing.motto}
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="mt-6 text-sm leading-relaxed text-brand-slate sm:text-base"
        >
          {closing.statement}
        </motion.p>
      </motion.div>
    </section>
  );
}
