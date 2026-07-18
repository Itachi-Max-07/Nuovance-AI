"use client";

import { Database } from "@phosphor-icons/react";
import useCountUp from "@/components/workflow-story/useCountUp";
import { workflowStory } from "@/lib/content";
import { cn } from "@/lib/utils";

interface CrmSceneProps {
  active: boolean;
  reduce: boolean;
}

/** Step 4 — qualified leads populate CRM rows while a live counter climbs. */
export default function CrmScene({ active, reduce }: CrmSceneProps) {
  const { crm, companies } = workflowStory;
  const synced = useCountUp(active, crm.total, { duration: 2200, reduce });
  const qualified = companies.filter((company) => company.qualified);

  return (
    <div className="w-full max-w-2xl px-1">
      <div className="ws-item">
        <div className="ws-card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-brand-line px-4 py-3 sm:px-5">
            <Database size={16} aria-hidden="true" className="text-brand-accent-deep" />
            {crm.destinations.map((destination) => (
              <span
                key={destination}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-2xs",
                  destination === crm.activeDestination
                    ? "border-brand-accent/50 bg-brand-accent/10 text-brand-accent-deep"
                    : "border-brand-line text-brand-faint",
                )}
              >
                {destination}
              </span>
            ))}
          </div>

          <div className="px-4 py-3 sm:px-5">
            <div className="grid grid-cols-3 gap-2 border-b border-brand-line pb-2 text-2xs uppercase tracking-[0.14em] text-brand-faint sm:grid-cols-4">
              {crm.columns.map((column, index) => (
                <span key={column} className={cn(index === 3 && "hidden sm:block")}>
                  {column}
                </span>
              ))}
            </div>
            {qualified.map((company, index) => (
              <div
                key={company.name}
                className="ws-item grid grid-cols-3 gap-2 border-b border-brand-line py-2.5 text-xs text-brand-body last:border-b-0 sm:grid-cols-4 sm:text-sm"
                style={{ animationDelay: `${250 + index * 170}ms` }}
              >
                <span className="truncate font-medium text-brand-ink">{company.name}</span>
                <span className="truncate">{company.industry}</span>
                <span className="tabular-nums text-brand-green">{company.score}</span>
                <span className="hidden items-center gap-1.5 sm:flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
                  {crm.syncedStatus}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="ws-item mt-4 flex justify-center" style={{ animationDelay: "500ms" }}>
        <div className="ws-card flex items-baseline gap-2 px-5 py-3">
          <span className="font-heading text-2xl font-semibold tabular-nums text-brand-ink">
            {synced}
          </span>
          <span className="text-2xs uppercase tracking-[0.16em] text-brand-faint">
            {crm.counterLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
