"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import type { HeroWorkflowNode, HeroWorkflowStatusTone } from "@/lib/content";
import { floatStyle, nodeVariants } from "./Animations";

interface WorkflowNodeProps {
  node: HeroWorkflowNode;
  index: number;
  /** Seconds before this node's entrance begins. */
  entranceDelay: number;
  reducedMotion: boolean;
  /** Idle translateY float — enabled on the desktop canvas only. */
  floating?: boolean;
  onHoverChange?: (index: number | null) => void;
  /** Positioning comes from the canvas: absolute + coords, or flow layout. */
  className?: string;
  style?: CSSProperties;
}

const statusToneClasses: Record<HeroWorkflowStatusTone, string> = {
  live: "border-brand-green/25 bg-brand-green/10 text-brand-green",
  working: "border-brand-violet/25 bg-brand-violet/10 text-brand-violet",
  done: "border-brand-green/25 bg-brand-green/10 text-brand-green",
};

function StatusIndicator({ tone }: { tone: HeroWorkflowStatusTone }) {
  if (tone === "done") {
    return (
      <svg viewBox="0 0 10 10" className="h-2 w-2 shrink-0" aria-hidden="true">
        <path
          d="M1.5 5.5 4 8l4.5-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden="true">
      <span className="hero-pulse-ring absolute inline-flex h-full w-full rounded-full bg-current" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
    </span>
  );
}

/**
 * An authentic n8n-style workflow node: frosted glass card with the tool's
 * logo, its current action, live metrics, and a pulsing status pill.
 */
export default function WorkflowNode({
  node,
  index,
  entranceDelay,
  reducedMotion,
  floating = false,
  onHoverChange,
  className = "",
  style,
}: WorkflowNodeProps) {
  const shouldFloat = floating && !reducedMotion;

  return (
    <motion.div
      className={className}
      style={style}
      variants={nodeVariants(reducedMotion)}
      custom={entranceDelay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      onPointerEnter={() => onHoverChange?.(index)}
      onPointerLeave={() => onHoverChange?.(null)}
    >
      {/* Float on its own layer so it never fights the entrance transform. */}
      <div
        className={shouldFloat ? "hero-float" : undefined}
        style={shouldFloat ? floatStyle(index) : undefined}
      >
        <div
          className={`rounded-node border-3 bg-brand-card p-4 transition-brutal duration-200 ease-spring hover:-translate-x-0.5 hover:-translate-y-0.5 ${
            node.highlight
              ? "border-brand-accent shadow-brutal-accent"
              : "border-brand-ink shadow-brutal-sm hover:shadow-brutal"
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-brand-line bg-brand-cream">
                <Image
                  src={node.logo.src}
                  alt={node.logo.alt}
                  width={20}
                  height={20}
                  className="h-5 w-5 object-contain"
                />
              </span>
              <span className="truncate text-sm font-bold leading-tight text-brand-ink">
                {node.tool}
              </span>
            </div>
            <span
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-2xs font-semibold ${statusToneClasses[node.status.tone]}`}
            >
              <StatusIndicator tone={node.status.tone} />
              {node.status.label}
            </span>
          </div>

          <p className="mt-2 text-xs leading-snug text-brand-body">{node.action}</p>

          {node.metrics.length > 0 && (
            <ul className="mt-2.5 flex flex-wrap gap-1.5">
              {node.metrics.map((metric) => (
                <li
                  key={metric}
                  className="whitespace-nowrap rounded-full border border-brand-line bg-brand-cream px-2 py-0.5 text-2xs font-medium text-brand-body"
                >
                  {metric}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </motion.div>
  );
}
