"use client";

import { motion, useReducedMotion, type Transition, type Variants } from "framer-motion";
import Button from "@/components/ui/Button";
import Globe from "@/components/ui/Globe";
import OrbitMotif from "@/components/ui/OrbitMotif";
import { hero } from "@/lib/content";

const contentVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

export default function Hero() {
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

  const backgroundAnimate = shouldReduceMotion
    ? { opacity: 0.14 }
    : { opacity: 0.14, rotate: 360 };

  const backgroundTransition: Transition = shouldReduceMotion
    ? { duration: 1.2, ease: "easeOut" }
    : {
        opacity: { duration: 1.2, ease: "easeOut" },
        rotate: { duration: 90, repeat: Infinity, ease: "linear" },
      };

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-brand-dark py-20 sm:flex sm:min-h-[80dvh] sm:items-center sm:py-24 md:min-h-[85dvh] md:py-28 lg:min-h-[90dvh] lg:py-32 xl:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 flex justify-center"
      >
        <div className="h-96 w-full max-w-3xl -translate-y-1/2 rounded-full bg-brand-accent/15 blur-3xl" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
      >
        <motion.div
          className="h-[130vw] w-[130vw] max-h-[880px] max-w-[880px] text-brand-accent-2 sm:h-[95vw] sm:w-[95vw] md:h-[75vw] md:w-[75vw] lg:h-[60vw] lg:w-[60vw]"
          initial={{ opacity: 0, rotate: 0 }}
          animate={backgroundAnimate}
          transition={backgroundTransition}
        >
          <OrbitMotif className="h-full w-full" />
        </motion.div>
      </div>

      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 z-0 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
      >
        <div className="relative aspect-square w-[140vw] max-w-[900px] translate-y-[58%] sm:w-[100vw] md:w-[80vw] lg:w-[64vw]">
          <Globe className="max-w-none" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-brand-dark to-transparent" />
        </div>
      </motion.div>

      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-5 px-6 text-center sm:gap-6 md:gap-8 lg:px-8"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-2">
          <OrbitMotif className="h-4 w-4 text-brand-accent-2" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent-2 sm:text-sm">
            {hero.eyebrow}
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-brand-offwhite sm:text-5xl lg:text-7xl"
        >
          {hero.headline}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="max-w-2xl text-lg font-normal leading-relaxed text-brand-slate sm:text-xl"
        >
          {hero.positioning}
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex w-full flex-col gap-4 pt-2 sm:w-auto sm:flex-row"
        >
          <motion.span
            whileHover={{ y: -2 }}
            whileTap={{ y: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="inline-block w-full sm:w-auto"
          >
            <Button variant="primary" href={hero.primaryCta.href} className="w-full sm:w-auto">
              {hero.primaryCta.label}
            </Button>
          </motion.span>

          <motion.span
            whileHover={{ y: -2 }}
            whileTap={{ y: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="inline-block w-full sm:w-auto"
          >
            <Button
              variant="outline"
              href={hero.secondaryCta.href}
              className="w-full text-brand-offwhite sm:w-auto"
            >
              {hero.secondaryCta.label}
            </Button>
          </motion.span>
        </motion.div>

        <motion.ul
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 pt-2"
        >
          {hero.disciplines.map((discipline, index) => (
            <li
              key={discipline}
              className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-brand-muted"
            >
              <span>{discipline}</span>
              {index < hero.disciplines.length - 1 && (
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
