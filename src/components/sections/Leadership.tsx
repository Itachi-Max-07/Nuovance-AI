"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Transition, type Variants } from "framer-motion";
import OrbitMotif from "@/components/ui/OrbitMotif";
import { leadership, type TeamMember } from "@/lib/content";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const FEATURED_COUNT = 2;
const featured = leadership.slice(0, FEATURED_COUNT);
const rest = leadership.slice(FEATURED_COUNT);

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

interface TeamCardProps {
  member: TeamMember;
  variants: Variants;
  featured?: boolean;
}

function TeamCard({ member, variants, featured: isFeatured }: TeamCardProps) {
  return (
    // Framer Motion owns only this entry wrapper; .card-brutal owns the CSS
    // hover transform, so the two never fight over `transform`.
    <motion.div variants={variants} className="flex">
      <div
        className={`group card-brutal flex w-full flex-col items-center p-7 text-center ${
          isFeatured ? "sm:p-8" : ""
        }`}
      >
        {member.photo ? (
          <div
            className={`relative shrink-0 overflow-hidden rounded-full bg-brand-cream shadow-brutal-sm ${
              isFeatured
                ? "h-24 w-24 border-3 border-brand-accent sm:h-28 sm:w-28"
                : "h-20 w-20 border-3 border-brand-ink"
            }`}
          >
            <Image
              src={member.photo.src}
              alt={member.photo.alt}
              fill
              sizes={isFeatured ? "112px" : "80px"}
              className="object-cover"
            />
          </div>
        ) : (
          <div
            aria-hidden="true"
            className={`flex shrink-0 items-center justify-center rounded-full bg-brand-cream font-heading font-bold text-brand-ink shadow-brutal-sm ${
              isFeatured
                ? "h-24 w-24 border-3 border-brand-accent text-2xl sm:h-28 sm:w-28 sm:text-3xl"
                : "h-20 w-20 border-3 border-brand-ink text-xl"
            }`}
          >
            {getInitials(member.name)}
          </div>
        )}

        <h3
          className={`mt-5 font-extrabold tracking-wide text-brand-ink ${
            isFeatured ? "text-xl sm:text-2xl" : "text-lg"
          }`}
        >
          {member.name}
        </h3>

        <p className="mt-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-brand-faint">
          <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent" />
          {member.role}
        </p>

        <p className="mt-3 max-w-xs text-sm leading-relaxed text-brand-body">
          {member.responsibilities}
        </p>
      </div>
    </motion.div>
  );
}

export default function Leadership() {
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
      id="leadership"
      className="relative overflow-hidden bg-brand-paper py-20 sm:py-24 md:py-28 lg:py-36"
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
        className="relative z-10 mx-auto max-w-6xl px-6 lg:px-8"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-2">
          <OrbitMotif className="h-4 w-4 text-brand-accent-deep" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent-deep sm:text-sm">
            Leadership
          </span>
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className="mt-6 max-w-2xl text-balance text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl lg:text-5xl"
        >
          The Team Behind the Engineering
        </motion.h2>

        <div className="mt-12 grid gap-6 sm:mt-14 sm:grid-cols-2">
          {featured.map((member) => (
            <TeamCard key={member.name} member={member} variants={itemVariants} featured />
          ))}
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {rest.map((member) => (
            <TeamCard key={member.name} member={member} variants={itemVariants} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
