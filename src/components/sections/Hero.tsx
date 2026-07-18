"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import OrbitMotif from "@/components/ui/OrbitMotif";
import WorkflowCanvas from "@/components/hero/WorkflowCanvas";
import {
  copyContainerVariants,
  copyItemVariants,
} from "@/components/hero/Animations";
import { contact, hero, heroWorkflow } from "@/lib/content";
import { whatsappLink } from "@/lib/utils";

function Headline() {
  const accent = hero.headlineAccent;
  const accentIndex = accent ? hero.headline.indexOf(accent) : -1;

  if (accentIndex === -1) return <>{hero.headline}</>;

  return (
    <>
      {hero.headline.slice(0, accentIndex)}
      <span className="text-brand-accent-deep">{accent}</span>
      {hero.headline.slice(accentIndex + accent.length)}
    </>
  );
}

export default function Hero() {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const itemVariants = copyItemVariants(shouldReduceMotion);

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-brand-paper py-16 sm:py-20 lg:flex lg:min-h-[90dvh] lg:items-center lg:py-24"
    >
      {/* ---- Background: flat warm paper with a charcoal graph-paper dot
           grid — geometric, tactile, no gradients or blur. ---- */}
      <div aria-hidden="true" className="hero-dots absolute inset-0" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:items-center lg:gap-10 lg:px-8 xl:gap-16">
        {/* ---- Editorial copy column ---- */}
        <motion.div
          variants={copyContainerVariants}
          initial="hidden"
          animate="visible"
          className="flex max-w-2xl flex-col items-start gap-6 sm:gap-7"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full border-2 border-brand-ink bg-brand-card px-4 py-2 shadow-brutal-sm"
          >
            <OrbitMotif className="h-3.5 w-3.5 text-brand-accent" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-ink">
              {hero.eyebrow}
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-balance text-4xl font-bold leading-[1.08] tracking-tight text-brand-ink sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            <Headline />
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="max-w-xl text-lg leading-relaxed text-brand-body sm:text-xl"
          >
            {hero.positioning}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex w-full flex-col gap-3 pt-2 sm:w-auto sm:flex-row sm:gap-4"
          >
            <Link
              href={hero.primaryCta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-brutal btn-brutal-primary group"
            >
              {hero.primaryCta.label}
              <ArrowRight
                size={16}
                weight="bold"
                aria-hidden="true"
                className="transition-transform duration-160 ease-out-strong group-hover:translate-x-0.5"
              />
            </Link>
            <a
              href={whatsappLink(contact.whatsapp, contact.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-brutal btn-brutal-outline"
            >
              {hero.secondaryCta.label}
            </a>
          </motion.div>

          <motion.ul
            variants={itemVariants}
            className="flex flex-wrap items-center gap-x-2 gap-y-2 pt-3"
          >
            {hero.disciplines.map((discipline, index) => (
              <li
                key={discipline}
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-brand-faint"
              >
                <span>{discipline}</span>
                {index < hero.disciplines.length - 1 && (
                  <span aria-hidden="true" className="text-brand-faint/50">
                    ·
                  </span>
                )}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* ---- The workflow is the hero illustration ---- */}
        <WorkflowCanvas
          nodes={heroWorkflow.nodes}
          caption={heroWorkflow.caption}
          captionStatus={heroWorkflow.captionStatus}
          ariaLabel={heroWorkflow.ariaLabel}
        />
      </div>
    </section>
  );
}
