"use client";

import StatTile from "@/components/workflow-story/StatTile";
import { workflowStory } from "@/lib/content";
import { cn } from "@/lib/utils";

interface SummarySceneProps {
  active: boolean;
  reduce: boolean;
}

/** Step 9 — executive summary of everything the automation produced. */
export default function SummaryScene({ active, reduce }: SummarySceneProps) {
  const { summary } = workflowStory;

  return (
    <div className="w-full max-w-3xl px-1">
      <p className="ws-item text-center text-2xs font-semibold uppercase tracking-[0.2em] text-brand-accent-2 sm:text-xs">
        {summary.heading}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {summary.stats.map((stat, index) => (
          <div
            key={stat.label}
            // Center the odd tile on the last row at each breakpoint.
            className={cn(index === summary.stats.length - 1 && "col-span-2 md:col-span-1")}
          >
            <StatTile stat={stat} active={active} reduce={reduce} delay={index * 110} />
          </div>
        ))}
      </div>
    </div>
  );
}
