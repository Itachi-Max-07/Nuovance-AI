"use client";

import type { StoryStat } from "@/lib/content";
import useCountUp from "@/components/workflow-story/useCountUp";

interface StatTileProps {
  stat: StoryStat;
  active: boolean;
  reduce: boolean;
  /** Entry stagger, in ms. */
  delay?: number;
}

/**
 * Glass KPI tile whose value counts up each time its scene activates.
 * Shared by the analytics dashboard (step 7) and the summary (step 9).
 */
export default function StatTile({ stat, active, reduce, delay = 0 }: StatTileProps) {
  const value = useCountUp(active, stat.value, {
    decimals: stat.decimals ?? 0,
    reduce,
  });

  return (
    <div className="ws-item" style={{ animationDelay: `${delay}ms` }}>
      <div className="ws-card px-4 py-4 sm:px-5 sm:py-5">
        <p className="font-heading text-xl font-semibold tabular-nums text-brand-ink sm:text-2xl lg:text-3xl">
          {stat.prefix}
          {value}
          {stat.suffix}
        </p>
        <p className="mt-1 text-2xs uppercase tracking-[0.14em] text-brand-faint sm:text-xs">
          {stat.label}
        </p>
      </div>
    </div>
  );
}
