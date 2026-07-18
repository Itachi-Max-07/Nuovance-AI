"use client";

import GermanyMap from "@/components/workflow-story/GermanyMap";
import useCountUp from "@/components/workflow-story/useCountUp";
import { workflowStory } from "@/lib/content";

interface ScanSceneProps {
  active: boolean;
  reduce: boolean;
}

/** Step 1 — radar sweeps a dark map of Germany while business pins appear. */
export default function ScanScene({ active, reduce }: ScanSceneProps) {
  const { scan } = workflowStory;
  const discovered = useCountUp(active, scan.total, { duration: 2600, reduce });

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {/* On phones the stage is narrow, so the map is sized down to leave a
          clear band above and below for the two floating cards; from sm up the
          stage is wide enough for the map to fill it and the cards to sit in
          the corners. */}
      <div className="relative h-3/4 py-1 sm:h-full sm:py-2">
        <GermanyMap pins={scan.pins} className="h-full w-auto" />
        {/* Rotating radar sweep — centering lives on the wrapper so the
            rotation animation never overwrites the translate. */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 aspect-square h-4/5 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="ws-radar h-full w-full" />
        </div>
      </div>

      <div className="ws-item absolute right-0 top-0 sm:right-4 sm:top-2">
        <div className="ws-card flex items-center gap-1.5 px-2.5 py-1.5 sm:gap-2 sm:px-3 sm:py-2">
          <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
            <span className="ws-pulse-ring absolute inset-0 rounded-full bg-brand-green/60" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-brand-green sm:h-2 sm:w-2" />
          </span>
          <span className="text-2xs font-medium uppercase tracking-[0.08em] text-brand-body sm:tracking-[0.16em]">
            {scan.statusLabel} · {scan.region}
          </span>
        </div>
      </div>

      <div className="ws-item absolute bottom-0 left-0 sm:bottom-2 sm:left-4" style={{ animationDelay: "250ms" }}>
        <div className="ws-card px-4 py-3 sm:px-5 sm:py-4">
          <p className="font-heading text-2xl font-semibold tabular-nums text-brand-ink sm:text-4xl">
            {discovered}
          </p>
          <p className="mt-1 text-2xs uppercase tracking-[0.12em] text-brand-faint sm:tracking-[0.16em] sm:text-xs">
            {scan.counterLabel}
          </p>
        </div>
      </div>
    </div>
  );
}
