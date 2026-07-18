"use client";

import { motion } from "framer-motion";
import { DRAW_DURATION, EASE_OUT_STRONG } from "./Animations";

export interface ConnectionGeometry {
  /** Cubic bezier path from the source port to the target port. */
  d: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
}

interface ConnectionLineProps {
  connection: ConnectionGeometry;
  /** Seconds before the path starts drawing itself in. */
  drawDelay: number;
  /** True while an adjacent node is hovered — brightens the connection. */
  active: boolean;
  reducedMotion: boolean;
}

/**
 * A single workflow connection: a thin blue curve with a wide soft
 * under-stroke for glow, drawn in like pen on paper, plus port dots
 * where it meets the cards.
 */
export default function ConnectionLine({
  connection,
  drawDelay,
  active,
  reducedMotion,
}: ConnectionLineProps) {
  const { d, from, to } = connection;

  const drawTransition = {
    pathLength: reducedMotion
      ? { duration: 0 }
      : { duration: DRAW_DURATION, ease: EASE_OUT_STRONG, delay: drawDelay },
    opacity: { duration: 0.25, ease: "easeOut", delay: reducedMotion ? 0 : drawDelay },
  } as const;

  return (
    <g>
      {/* Wide, faint under-stroke — soft shadow beneath the wire. */}
      <motion.path
        d={d}
        fill="none"
        stroke="rgb(var(--color-ink))"
        strokeWidth={6}
        strokeLinecap="round"
        initial={{ pathLength: reducedMotion ? 1 : 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: active ? 0.14 : 0.06 }}
        transition={drawTransition}
      />
      {/* Crisp charcoal wire — hand-drawn schematic, not neon circuitry. */}
      <motion.path
        d={d}
        fill="none"
        stroke="rgb(var(--color-ink))"
        strokeWidth={2}
        strokeLinecap="round"
        initial={{ pathLength: reducedMotion ? 1 : 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: active ? 0.9 : 0.45 }}
        transition={drawTransition}
      />
      {/* Port dots where the connection meets each card. */}
      {[from, to].map((port, portIndex) => (
        <motion.circle
          key={portIndex}
          cx={port.x}
          cy={port.y}
          r={3}
          fill="rgb(var(--color-card))"
          stroke="rgb(var(--color-ink))"
          strokeWidth={2}
          initial={{ opacity: 0 }}
          animate={{ opacity: active ? 1 : 0.75 }}
          transition={{ duration: 0.25, delay: reducedMotion ? 0 : drawDelay }}
        />
      ))}
    </g>
  );
}
