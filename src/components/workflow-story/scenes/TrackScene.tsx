"use client";

import { ChartLineUp } from "@phosphor-icons/react";
import StatTile from "@/components/workflow-story/StatTile";
import { workflowStory } from "@/lib/content";

interface TrackSceneProps {
  active: boolean;
  reduce: boolean;
}

/** Step 7 — live analytics dashboard; every metric counts up smoothly. */
export default function TrackScene({ active, reduce }: TrackSceneProps) {
  const { analytics } = workflowStory;

  return (
    <div className="w-full max-w-3xl px-1">
      <p className="ws-item flex items-center justify-center gap-2 text-2xs font-semibold uppercase tracking-[0.2em] text-brand-accent-deep sm:text-xs">
        <ChartLineUp size={14} aria-hidden="true" />
        {analytics.heading}
        <span className="relative ml-1 flex h-2 w-2">
          <span className="ws-pulse-ring absolute inset-0 rounded-full bg-brand-green/60" />
          <span className="relative h-2 w-2 rounded-full bg-brand-green" />
        </span>
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {analytics.stats.map((stat, index) => (
          <StatTile
            key={stat.label}
            stat={stat}
            active={active}
            reduce={reduce}
            delay={index * 120}
          />
        ))}
      </div>
    </div>
  );
}
