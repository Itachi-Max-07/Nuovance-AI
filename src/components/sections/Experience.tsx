"use client";

import { motion, useReducedMotion, type Transition, type Variants } from "framer-motion";
import OrbitMotif from "@/components/ui/OrbitMotif";
import { experience, type ProjectItem } from "@/lib/content";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

interface ProjectCardProps {
  project: ProjectItem;
  variants: Variants;
}

function ProjectCard({ project, variants }: ProjectCardProps) {
  return (
    <motion.article
      variants={variants}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative flex flex-col overflow-hidden rounded-card bg-brand-surface ring-1 ring-brand-line transition-colors duration-300 hover:ring-brand-accent/40"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-brand-dark-2 via-brand-dark-2 to-brand-accent/10">
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-out group-hover:rotate-45"
        >
          <OrbitMotif className="h-16 w-16 text-brand-accent/30 sm:h-20 sm:w-20" />
        </div>
        <span className="absolute left-4 top-4 inline-flex items-center rounded-full border border-brand-accent/25 bg-brand-dark/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-accent-2 backdrop-blur-sm">
          {project.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6 sm:p-7">
        <div className="flex items-start gap-2">
          <span
            aria-hidden="true"
            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent transition-transform duration-300 group-hover:scale-150"
          />
          <h3 className="text-lg font-bold leading-snug text-brand-offwhite sm:text-xl">
            {project.title}
          </h3>
        </div>

        <p className="text-sm leading-relaxed text-brand-slate sm:text-base">
          {project.description}
        </p>

        <ul className="flex flex-col gap-2">
          {project.outcomes.map((outcome) => (
            <li key={outcome} className="flex items-start gap-2 text-sm leading-relaxed text-brand-slate">
              <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-accent/70" />
              <span>{outcome}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-brand-line px-3 py-1 text-xs font-medium text-brand-slate"
            >
              {tech}
            </span>
          ))}
        </div>

        {project.link && (
          <a
            href={project.link}
            className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand-accent transition-colors hover:text-brand-offwhite"
          >
            View case study →
          </a>
        )}
      </div>
    </motion.article>
  );
}

export default function Experience() {
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
      id="experience"
      className="relative overflow-hidden bg-brand-dark py-20 sm:py-24 md:py-28 lg:py-36"
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
            {experience.heading}
          </span>
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className="mt-6 max-w-2xl text-balance text-3xl font-semibold tracking-tight text-brand-offwhite sm:text-4xl lg:text-5xl"
        >
          {experience.subheading}
        </motion.h2>

        <div className="mt-6 flex max-w-2xl flex-col gap-4 sm:mt-8 sm:gap-5">
          {experience.intro.map((paragraph) => (
            <motion.p
              key={paragraph}
              variants={itemVariants}
              className="text-base leading-relaxed text-brand-slate sm:text-lg"
            >
              {paragraph}
            </motion.p>
          ))}
        </div>

        <motion.blockquote
          variants={itemVariants}
          className="mt-8 max-w-2xl border-l-2 border-brand-accent py-1 pl-6 text-base font-medium leading-relaxed text-brand-offwhite sm:mt-10 sm:text-lg"
        >
          {experience.commitment}
        </motion.blockquote>

        <motion.ul
          variants={itemVariants}
          className="mt-10 flex flex-wrap gap-3 sm:mt-12"
        >
          {experience.highlights.map((highlight) => (
            <li
              key={highlight}
              className="rounded-full border border-brand-line bg-brand-surface px-4 py-2 text-xs font-medium uppercase tracking-[0.1em] text-brand-slate sm:text-sm"
            >
              {highlight}
            </li>
          ))}
        </motion.ul>

        <motion.div
          variants={itemVariants}
          className="mt-12 grid grid-cols-2 divide-x divide-y divide-brand-line overflow-hidden rounded-card bg-brand-surface ring-1 ring-brand-line sm:mt-16 sm:grid-cols-4 sm:divide-y-0"
        >
          {experience.stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1 px-4 py-6 text-center sm:py-8">
              <span className="font-heading text-3xl font-semibold tabular-nums text-brand-accent-2 sm:text-4xl lg:text-5xl">
                {stat.value}
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-brand-slate sm:text-xs">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        <motion.h3
          variants={itemVariants}
          className="mt-16 text-sm font-semibold uppercase tracking-[0.15em] text-brand-offwhite sm:mt-20"
        >
          Selected Work
        </motion.h3>

        <div className="mt-6 grid gap-6 sm:mt-8 sm:grid-cols-2 lg:gap-8">
          {experience.projects.map((project) => (
            <ProjectCard key={project.title} project={project} variants={itemVariants} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
