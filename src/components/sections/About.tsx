"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import OrbitMotif from "@/components/ui/OrbitMotif";
import { about, brand, leadership } from "@/lib/content";

// Strong ease-out — built-in CSS easings are too weak for entrances.
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const VIEWPORT = { once: true, margin: "-100px" } as const;

// Curated subset of about.executiveSummary / about.overview — a lead identity
// statement, the problem context, and the closing values line — merged into
// one flowing narrative rather than rendering all six source paragraphs.
const paragraphs = [about.executiveSummary[0], about.overview[0], about.overview[2]];

const cto = leadership.find((member) => member.role.includes("CTO")) ?? null;

export default function About() {
  const shouldReduceMotion = useReducedMotion();

  const textContainerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05 } },
  };

  // Reduced motion keeps the opacity fades that aid comprehension but drops
  // every transform-based movement.
  const textItemVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.2 } },
      }
    : {
        hidden: { opacity: 0, y: 12 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.2, ease: EASE_OUT },
        },
      };

  const imageVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
      }
    : {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { duration: 0.3, ease: EASE_OUT },
        },
      };

  const cardVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
      }
    : {
        hidden: { opacity: 0, y: 24, scale: 0.97 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.3, ease: EASE_OUT, delay: 0.15 },
        },
      };

  return (
    <section
      id="about"
      className="bg-brand-offwhite py-16 sm:py-20 md:py-24 lg:py-28"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <motion.div
          variants={textContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.h2
            variants={textItemVariants}
            className="max-w-2xl text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl lg:text-5xl"
          >
            {about.heading}
          </motion.h2>

          <div className="mt-6 flex flex-col gap-4 sm:mt-8 sm:gap-5">
            {paragraphs.map((paragraph) => (
              <motion.p
                key={paragraph}
                variants={textItemVariants}
                className="max-w-2xl text-base leading-relaxed text-brand-slate sm:text-lg"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </motion.div>

        <div>
          <motion.div
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="orbit-3d-stage relative mx-auto flex aspect-square w-full max-w-md items-center justify-center overflow-hidden rounded-3xl bg-brand-dark"
          >
            <div
              aria-hidden="true"
              className="absolute inset-8 rotate-45 text-brand-accent opacity-60"
            >
              <div className="orbit-3d h-full w-full">
                <OrbitMotif className="h-full w-full" />
              </div>
            </div>
            <Image
              src={brand.logo.src}
              alt={brand.logo.alt}
              width={144}
              height={144}
              className="relative h-32 w-32 sm:h-36 sm:w-36"
            />
          </motion.div>

          {cto ? (
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
              className="relative z-10 mx-auto -mt-10 max-w-sm origin-top rounded-2xl border border-brand-light-blue bg-white p-6 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <OrbitMotif className="h-6 w-6 shrink-0 text-brand-accent" />
                <div>
                  <p className="text-base font-semibold text-brand-dark">
                    {cto.name}
                  </p>
                  <p className="text-sm font-medium text-brand-slate">
                    {cto.role}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-brand-slate">
                {cto.responsibilities}
              </p>
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
