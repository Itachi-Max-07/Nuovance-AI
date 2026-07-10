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
                    "h-5 w-px transition-colors duration-500",
                    isDone || isActive ? "bg-brand-accent/50" : "bg-brand-line",
                  )}
                />
              )}
              <button
                type="button"
                onClick={() => onSelect(index)}
                aria-label={`Step ${index + 1}: ${step.title}`}
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border text-xs font-semibold transition-press duration-160 ease-out-strong",
                  isActive &&
                    "border-brand-accent bg-brand-accent/15 text-brand-offwhite shadow-glow-sm",
                  isDone && !isActive && "border-brand-accent/40 text-brand-accent-2",
                  !isActive && !isDone && "border-brand-line text-brand-muted",
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
                  "block h-2 rounded-full transition-press duration-160 ease-out-strong",
                  isActive && "w-6 bg-brand-accent shadow-glow-sm",
                  isDone && !isActive && "w-2 bg-brand-accent/50",
                  !isActive && !isDone && "w-2 bg-brand-line",
                )}
              />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
