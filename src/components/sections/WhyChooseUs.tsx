"use client";

import { motion, useReducedMotion, type Transition, type Variants } from "framer-motion";
import OrbitMotif from "@/components/ui/OrbitMotif";
import { whyChooseUs } from "@/lib/content";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export default function WhyChooseUs() {
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
    : { opacity: 0.12, rotate: -360 };

  const accentTransition: Transition = shouldReduceMotion
    ? { duration: 1, ease: "easeOut" }
    : {
        opacity: { duration: 1, ease: "easeOut" },
        rotate: { duration: 100, repeat: Infinity, ease: "linear" },
      };

  return (
    <section
      id="why-us"
      className="relative overflow-hidden bg-brand-cream pb-20 pt-8 sm:pb-24 sm:pt-10 md:pb-28 lg:pb-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 text-brand-accent sm:h-28 sm:w-28 lg:h-32 lg:w-32"
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
            Why Choose Us
          </span>
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className="mt-6 max-w-2xl text-balance text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl lg:text-5xl"
        >
          Why Businesses Choose Nuovance AI
        </motion.h2>

        <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {whyChooseUs.map((point, index) => (
            // Framer Motion owns only this entry wrapper; .card-brutal owns
            // the CSS tilt/hover transform, so the two never fight.
            <motion.div key={point} variants={itemVariants} className="flex">
              <div
                className={`card-brutal flex w-full items-start gap-3 p-5 sm:p-6 ${
                  index % 2 === 0 ? "card-brutal-tilt-l" : "card-brutal-tilt-r"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-accent/15"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
                </span>
                <span className="text-sm font-medium leading-snug text-brand-ink">
                  {point}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
