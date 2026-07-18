// Shared motion vocabulary for the hero and its workflow canvas.
// All entrances use transform strings (not x/y shorthands) so Framer Motion
// can hand them to the compositor instead of animating on the main thread.

import type { CSSProperties } from "react";
import type { Variants } from "framer-motion";

/** Strong ease-out — the built-in `ease-out` is too weak for entrances. */
export const EASE_OUT_STRONG: [number, number, number, number] = [0.23, 1, 0.32, 1];

/** Seconds before the first workflow node appears (lets the copy land first). */
export const CANVAS_DELAY = 0.5;

/** Gap between consecutive node entrances. */
export const NODE_STAGGER = 0.14;

/** How long each connection takes to draw itself in. */
export const DRAW_DURATION = 0.55;

export const nodeEntranceDelay = (index: number): number =>
  CANVAS_DELAY + index * NODE_STAGGER;

/** Each connection starts drawing just after its source node has landed. */
export const connectionDrawDelay = (index: number): number =>
  nodeEntranceDelay(index) + 0.22;

/** Particles start once the whole chain has drawn, then loop forever. */
export const flowStart = (nodeCount: number): number =>
  nodeEntranceDelay(nodeCount - 1) + DRAW_DURATION + 0.4;

/** Fade-in for workflow nodes; pass the entrance delay (seconds) as `custom`. */
export const nodeVariants = (reducedMotion: boolean): Variants =>
  reducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: (delay: number) => ({
          opacity: 1,
          transition: { duration: 0.2, delay },
        }),
      }
    : {
        hidden: { opacity: 0, transform: "translateY(16px) scale(0.96)" },
        visible: (delay: number) => ({
          opacity: 1,
          transform: "translateY(0px) scale(1)",
          transition: { duration: 0.6, ease: EASE_OUT_STRONG, delay },
        }),
      };

/** Staggered fade-up for the editorial copy column. */
export const copyContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

export const copyItemVariants = (reducedMotion: boolean): Variants =>
  reducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.2 } },
      }
    : {
        hidden: { opacity: 0, transform: "translateY(18px)" },
        visible: {
          opacity: 1,
          transform: "translateY(0px)",
          transition: { duration: 0.55, ease: EASE_OUT_STRONG },
        },
      };

/**
 * De-synchronised idle float per card — shared keyframes (`.hero-float`),
 * unique duration/delay so the canvas never reads as one rigid grid.
 */
export const floatStyle = (index: number): CSSProperties => ({
  animationDuration: `${5.4 + (index % 3) * 0.9}s`,
  animationDelay: `${(index % 4) * 0.65}s`,
});
