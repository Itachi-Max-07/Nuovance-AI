"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { about, brand } from "@/lib/content";

// Strong ease-out — built-in CSS easings are too weak for entrances.
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const VIEWPORT = { once: true, margin: "-100px" } as const;

// Curated subset of about.executiveSummary / about.overview — a lead identity
// statement, the problem context, and the closing values line — merged into
// one flowing narrative rather than rendering all six source paragraphs.
const paragraphs = [about.executiveSummary[0], about.overview[0], about.overview[2]];

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

  // One-shot reveal (spec): fade in + rise 20px -> 0 over 0.8s, ease-out,
  // played once when the card scrolls into view (viewport `once`). The wrapper
  // animates `y`; the continuous CSS motion below animates other elements, so
  // Framer and CSS never share a transform target.
  const imageVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
      }
    : {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: "easeOut" },
        },
      };

  return (
    <section
      id="about"
      className="bg-brand-cream py-20 sm:py-24 md:py-28 lg:py-36"
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
            className="max-w-2xl text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl lg:text-5xl"
          >
            {about.heading}
          </motion.h2>

          <div className="mt-6 flex flex-col gap-4 sm:mt-8 sm:gap-5">
            {paragraphs.map((paragraph) => (
              <motion.p
                key={paragraph}
                variants={textItemVariants}
                className="max-w-2xl text-base leading-relaxed text-brand-body sm:text-lg"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={imageVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mx-auto w-full max-w-md"
        >
          {/* Framer Motion owns only the reveal on the wrapper above. The
              continuous motion is CSS (globals.css `.logo-*`), split across
              elements so nothing shares a transform: the ring/dot spin, the
              logo floats, the aura breathes via opacity. */}
          <div className="card-brutal logo-stage flex aspect-square w-full items-center justify-center">
            {/* The whole composition is nudged up ~14px so it optically centers
                in the square card. Full-size box so the orbit's inset geometry
                is unchanged. */}
            <div className="logo-composition relative flex h-full w-full items-center justify-center">
              {/* Soft radial aura behind the logo — a faint accent tint that
                  fades to transparent (no square edge, no glow/blur). */}
              <div aria-hidden="true" className="logo-aura" />

              {/* Orbit motif split from the shared OrbitMotif into ring (20s)
                  and dot (8s) so each spins at its own speed. Scaled to 90% for
                  breathing room; the resting composite matches the original. */}
              <div
                aria-hidden="true"
                className="absolute inset-8 rotate-45 scale-90 text-brand-accent-deep"
              >
                <svg
                  viewBox="0 0 32 32"
                  fill="none"
                  aria-hidden="true"
                  className="logo-orbit-ring absolute inset-0 h-full w-full"
                >
                  <circle
                    cx="16"
                    cy="16"
                    r="12"
                    stroke="currentColor"
                    strokeWidth="1.1"
                    strokeOpacity="0.4"
                  />
                </svg>
                <svg
                  viewBox="0 0 32 32"
                  fill="none"
                  aria-hidden="true"
                  className="logo-orbit-dot absolute inset-0 h-full w-full"
                >
                  <circle cx="16" cy="4" r="1.5" fill="currentColor" fillOpacity="0.6" />
                </svg>
              </div>

              {/* Wrapper floats; the image scales on hover — kept on separate
                  elements so the two transforms never collide. */}
              <div className="logo-float relative z-10 flex items-center justify-center">
                <Image
                  src={brand.logo.src}
                  alt={brand.logo.alt}
                  width={144}
                  height={144}
                  className="logo-mark h-32 w-32 sm:h-36 sm:w-36"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
