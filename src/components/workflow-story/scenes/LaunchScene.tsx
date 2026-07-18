"use client";

import { useEffect, useState } from "react";
import { Buildings, PaperPlaneTilt } from "@phosphor-icons/react";
import { workflowStory } from "@/lib/content";
import { cn } from "@/lib/utils";

interface LaunchSceneProps {
  active: boolean;
  reduce: boolean;
}

const { launch } = workflowStory;
const MAX_PHASE = launch.targets.length + launch.states.length;

// Curved delivery paths from the sender node to each target row.
const PATHS = [
  "M70,150 C160,150 220,52 330,52",
  "M70,150 C170,150 230,150 330,150",
  "M70,150 C160,150 220,248 330,248",
];

/** Step 6 — personalized emails launch along glowing paths with live states. */
export default function LaunchScene({ active, reduce }: LaunchSceneProps) {
  // One shared phase counter; target i shows state clamp(phase - i, 0..2),
  // so rows upgrade Sending → Delivered → Sent in a stagger. Runs once per
  // activation — it stops at MAX_PHASE and never loops.
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!active) return undefined;
    if (reduce) {
      setPhase(MAX_PHASE);
      return undefined;
    }
    setPhase(0);
    const interval = window.setInterval(() => {
      setPhase((previous) => {
        if (previous + 1 >= MAX_PHASE) window.clearInterval(interval);
        return Math.min(previous + 1, MAX_PHASE);
      });
    }, 650);
    return () => window.clearInterval(interval);
  }, [active, reduce]);

  return (
    <div className="w-full max-w-2xl px-1">
      <p className="ws-item text-center text-2xs font-semibold uppercase tracking-[0.2em] text-brand-accent-deep sm:text-xs">
        {launch.heading}
      </p>

      <div className="relative mt-5 h-64 sm:h-72">
        <svg
          viewBox="0 0 400 300"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute inset-0 hidden h-full w-full sm:block"
        >
          {PATHS.map((path) => (
            <g key={path}>
              <path d={path} className="stroke-brand-accent/15" strokeWidth="2" fill="none" />
              <path d={path} className="ws-dash stroke-brand-accent-deep/70" strokeWidth="2" fill="none" />
            </g>
          ))}
        </svg>

        <div className="absolute left-0 top-1/2 hidden -translate-y-1/2 sm:block">
          <div className="ws-item">
            <div className="ws-card flex h-16 w-16 items-center justify-center rounded-full text-brand-accent-deep">
              <PaperPlaneTilt size={26} aria-hidden="true" />
            </div>
          </div>
        </div>

        <div className="absolute inset-y-0 right-0 flex w-full flex-col justify-between sm:w-56">
          {launch.targets.map((target, index) => {
            const state = Math.max(0, Math.min(phase - index, launch.states.length - 1));
            const label = launch.states[state];
            const isSent = state === launch.states.length - 1;
            const isDelivered = state === 1;
            return (
              <div key={target} className="ws-item" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="ws-card flex items-center gap-2.5 px-4 py-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-accent/15 text-brand-accent-deep">
                    <Buildings size={14} aria-hidden="true" />
                  </span>
                  <p className="min-w-0 flex-1 truncate text-xs font-medium text-brand-ink">
                    {target}
                  </p>
                  <span
                    className={cn(
                      "shrink-0 rounded-full border px-2.5 py-0.5 text-2xs transition-hover duration-500",
                      isSent && "border-brand-green/40 text-brand-green",
                      isDelivered && "border-brand-accent/40 text-brand-accent-deep",
                      !isSent && !isDelivered && "border-brand-line text-brand-faint",
                    )}
                  >
                    {label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
