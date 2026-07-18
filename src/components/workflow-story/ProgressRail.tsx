"use client";

import type { StoryStep } from "@/lib/content";
import { cn } from "@/lib/utils";

interface ProgressRailProps {
  steps: StoryStep[];
  activeStep: number;
  onSelect: (index: number) => void;
}

/**
 * Step indicator for the pinned story: a vertical 1–9 rail on desktop and a
 * compact horizontal dot row on smaller screens. Buttons scrub the page to
 * the matching point inside the pinned range.
 */
export default function ProgressRail({ steps, activeStep, onSelect }: ProgressRailProps) {
  return (
    <nav aria-label="Workflow steps">
      {/* Desktop: vertical numbered rail */}
      <ol className="hidden flex-col gap-1 lg:flex">
        {steps.map((step, index) => {
          const isActive = index === activeStep;
          const isDone = index < activeStep;
          return (
            <li key={step.id} className="flex flex-col items-center">
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-5 w-0.5 transition-colors duration-500",
                    isDone || isActive ? "bg-brand-ink/50" : "bg-brand-ink/15",
                  )}
                />
              )}
              <button
                type="button"
                onClick={() => onSelect(index)}
                aria-label={`Step ${index + 1}: ${step.title}`}
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-bold transition-press duration-160 ease-spring",
                  isActive &&
                    "border-brand-ink bg-brand-accent text-brand-paper shadow-brutal-sm",
                  isDone && !isActive && "border-brand-ink bg-brand-card text-brand-ink",
                  !isActive && !isDone && "border-brand-ink/25 bg-brand-card text-brand-faint",
                )}
              >
                {index + 1}
              </button>
            </li>
          );
        })}
      </ol>

      {/* Mobile / tablet: horizontal dots */}
      <ol className="flex items-center justify-center gap-2 lg:hidden">
        {steps.map((step, index) => {
          const isActive = index === activeStep;
          const isDone = index < activeStep;
          return (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => onSelect(index)}
                aria-label={`Step ${index + 1}: ${step.title}`}
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "block h-2.5 rounded-full transition-press duration-160 ease-spring",
                  isActive && "w-7 bg-brand-accent",
                  isDone && !isActive && "w-2.5 bg-brand-ink/60",
                  !isActive && !isDone && "w-2.5 bg-brand-ink/15",
                )}
              />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
