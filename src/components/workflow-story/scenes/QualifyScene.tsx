"use client";

import { CheckCircle, XCircle } from "@phosphor-icons/react";
import OrbitMotif from "@/components/ui/OrbitMotif";
import { workflowStory } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Step 3 — leads flow through the AI engine; weak fits fade, strong fits
    score. Entirely CSS-driven (ws-item/ws-bar react to the scene shell), so
    it takes no props even though the stage passes the shared scene props. */
export default function QualifyScene() {
  const { qualification, companies } = workflowStory;

  return (
    <div className="w-full max-w-2xl px-1">
      <div className="ws-item">
        <div className="ws-card flex items-center gap-3 px-5 py-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-accent/15 text-brand-accent-deep">
            <OrbitMotif className="h-6 w-6" />
          </span>
          <div>
            <p className="text-sm font-semibold text-brand-ink">
              {qualification.engineLabel}
            </p>
            <p className="text-2xs text-brand-faint">{qualification.analyzingLabel}</p>
          </div>
          <span className="relative ml-auto flex h-2 w-2">
            <span className="ws-pulse-ring absolute inset-0 rounded-full bg-brand-accent/60" />
            <span className="relative h-2 w-2 rounded-full bg-brand-accent" />
          </span>
        </div>
      </div>

      <ul className="mt-4 flex flex-col gap-2">
        {companies.map((company, index) => (
          <li
            key={company.name}
            className="ws-item"
            style={{ animationDelay: `${180 + index * 130}ms` }}
          >
            <div
              className={cn(
                "ws-card flex items-center gap-3 px-4 py-3",
                !company.qualified && "opacity-40",
              )}
            >
              <p
                className={cn(
                  "w-32 truncate text-xs font-medium sm:w-40 sm:text-sm",
                  company.qualified ? "text-brand-ink" : "text-brand-faint",
                )}
              >
                {company.name}
              </p>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-brand-cream">
                <div
                  className={cn(
                    "ws-bar h-full w-full rounded-full",
                    company.qualified ? "bg-brand-green" : "bg-brand-faint",
                  )}
                  style={{
                    ["--ws-bar" as string]: company.score / 100,
                    transitionDelay: `${300 + index * 130}ms`,
                  }}
                />
              </div>
              <p
                className={cn(
                  "w-8 text-right text-xs font-semibold tabular-nums",
                  company.qualified ? "text-brand-green" : "text-brand-faint",
                )}
              >
                {company.score}
              </p>
              <span
                className={cn(
                  "hidden items-center gap-1 rounded-full border px-2.5 py-0.5 text-2xs sm:flex",
                  company.qualified
                    ? "border-brand-green/40 text-brand-green"
                    : "border-brand-line text-brand-faint",
                )}
              >
                {company.qualified ? (
                  <CheckCircle size={12} aria-hidden="true" />
                ) : (
                  <XCircle size={12} aria-hidden="true" />
                )}
                {company.qualified ? qualification.qualifiedLabel : qualification.filteredLabel}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
