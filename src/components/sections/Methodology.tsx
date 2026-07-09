"use client";

import { motion, useReducedMotion, type Transition, type Variants } from "framer-motion";
import OrbitMotif from "@/components/ui/OrbitMotif";
import { methodology, type MethodologyStep } from "@/lib/content";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const ROW_SIZE = 5;
const firstRow = methodology.slice(0, ROW_SIZE);
const secondRow = methodology.slice(ROW_SIZE);

interface StepNodeProps {
  step: MethodologyStep;
  variants: Variants;
}

function StepNode({ step, variants }: StepNodeProps) {
  return (
    <motion.div
      variants={variants}
      className="group flex flex-col items-center gap-3 text-center"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-accent text-sm font-bold text-white ring-4 ring-brand-dark-2 transition-transform duration-300 group-hover:scale-110 sm:h-12 sm:w-12">
        {step.step}
      </span>
      <span className="max-w-[9rem] text-xs font-semibold leading-snug text-brand-slate sm:text-sm">
        {step.title}
      </span>
    </motion.div>
  );
}

interface StepRowProps {
  steps: MethodologyStep[];
  variants: Variants;
}

function DesktopStepRow({ steps, variants }: StepRowProps) {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute left-[10%] right-[10%] top-[22px] h-px bg-brand-accent/30 sm:top-6"
      />
      <div className="relative grid grid-cols-5 gap-4">
        {steps.map((step) => (
          <StepNode key={step.step} step={step} variants={variants} />
        ))}
      </div>
    </div>
  );
}

export default function Methodology() {
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
      id="methodology"
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
        className="relative z-10 mx-auto max-w-6xl px-6 lg:px-8"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-2">
          <OrbitMotif className="h-4 w-4 text-brand-accent-2" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent-2 sm:text-sm">
            Methodology
          </span>
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className="mt-6 max-w-2xl text-balance text-3xl font-semibold tracking-tight text-brand-offwhite sm:text-4xl lg:text-5xl"
        >
          A Proven, End-to-End Delivery Process
        </motion.h2>

        {/* Mobile / tablet: vertical stepper */}
        <div className="mt-12 flex flex-col lg:hidden">
          {methodology.map((step, index) => (
            <motion.div key={step.step} variants={itemVariants} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-accent text-xs font-bold text-white sm:h-10 sm:w-10 sm:text-sm">
                  {step.step}
                </span>
                {index < methodology.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="my-1 w-px flex-1 bg-brand-accent/30"
                  />
                )}
              </div>
              <span className="pb-8 pt-2 text-sm font-semibold leading-snug text-brand-slate sm:text-base">
                {step.title}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Desktop: two-row horizontal flow */}
        <div className="mt-16 hidden flex-col gap-14 lg:flex">
          <DesktopStepRow steps={firstRow} variants={itemVariants} />
          <DesktopStepRow steps={secondRow} variants={itemVariants} />
        </div>
      </motion.div>
    </section>
  );
}
