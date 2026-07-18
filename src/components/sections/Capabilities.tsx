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
  index: number;
  variants: Variants;
}

function CapabilityCard({ group, index, variants }: CapabilityCardProps) {
  const [expanded, setExpanded] = useState(false);
  const hasOverflow = group.items.length > PREVIEW_COUNT;
  const visibleItems = expanded ? group.items : group.items.slice(0, PREVIEW_COUNT);

  return (
    // Framer Motion owns only this entry wrapper; the card below owns its own
    // CSS hover transform, so the two never fight over `transform`.
    <motion.div variants={variants} className="flex">
      <div className="card-brutal flex w-full flex-col p-7 sm:p-8">
        <span className="font-grotesk text-xs font-bold tracking-[0.2em] text-brand-accent">
          {String(index + 1).padStart(2, "0")}
        </span>

        <h3 className="mt-4 flex items-start gap-2.5 font-grotesk text-lg font-bold leading-snug tracking-wide text-brand-ink sm:text-xl">
          <span aria-hidden="true" className="mt-2.5 h-1 w-6 shrink-0 rounded-full bg-brand-accent" />
          {group.category}
        </h3>

        {group.description && (
          <p className="mt-2 text-sm leading-relaxed text-brand-body">{group.description}</p>
        )}

        <div aria-hidden="true" className="mt-5 h-0.5 w-full bg-brand-line" />

        <ul className="mt-5 flex flex-col gap-2.5">
          {visibleItems.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 text-sm leading-relaxed text-brand-body"
            >
              <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-brand-accent" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {hasOverflow && (
          <div className="mt-auto pt-6">
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              aria-expanded={expanded}
              className="flex w-full items-center justify-between rounded-xl border-2 border-brand-ink bg-brand-card px-4 py-2.5 font-grotesk text-xs font-bold uppercase tracking-[0.2em] text-brand-ink shadow-brutal-sm transition-press duration-160 ease-spring hover:bg-brand-accent hover:text-brand-paper active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <span>{expanded ? "Show Less" : "View All"}</span>
              <span
                aria-hidden="true"
                className={`transition-transform duration-200 ease-out-strong ${
                  expanded ? "-rotate-90" : ""
                }`}
              >
                →
              </span>
            </button>
          </div>
        )}
      </div>
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
      className="relative overflow-hidden bg-brand-cream py-20 sm:py-24 md:py-28 lg:py-36"
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
          <OrbitMotif className="h-4 w-4 text-brand-accent-deep" />
          <span className="font-grotesk text-xs font-bold uppercase tracking-[0.2em] text-brand-accent-deep sm:text-sm">
            Capabilities
          </span>
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className="mt-6 max-w-2xl text-balance font-grotesk text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl lg:text-5xl"
        >
          End-to-End Technology Capabilities
        </motion.h2>

        <div className="mt-12 grid gap-6 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((group, index) => (
            <CapabilityCard
              key={group.category}
              group={group}
              index={index}
              variants={itemVariants}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
