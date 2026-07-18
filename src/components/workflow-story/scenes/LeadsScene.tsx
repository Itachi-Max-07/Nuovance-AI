"use client";

import { Buildings, EnvelopeSimple, Globe, MapPin, Users } from "@phosphor-icons/react";
import { workflowStory } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Step 2 — map pins become floating company record cards. Entirely
    CSS-driven (ws-item/ws-float react to the scene shell), so it takes no
    props even though the stage passes the shared scene props. */
export default function LeadsScene() {
  const companies = workflowStory.companies.filter((company) => company.qualified);

  return (
    <div className="grid w-full max-w-3xl grid-cols-1 gap-4 px-1 sm:grid-cols-2 lg:grid-cols-3">
      {companies.map((company, index) => (
        <div
          key={company.name}
          className={cn(
            "ws-item",
            index === 1 && "lg:mt-8", // subtle parallax offset on the middle card
            index === 2 && "hidden sm:block lg:mt-3",
          )}
          style={{ animationDelay: `${index * 140}ms` }}
        >
          <div
            className="ws-float"
            style={{ animationDelay: `${-index * 1.7}s`, animationDuration: `${6 + index}s` }}
          >
            <div className="ws-card flex flex-col gap-3 p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-accent/15 text-brand-accent-deep">
                  <Buildings size={18} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-brand-ink">{company.name}</p>
                  <p className="flex items-center gap-1 text-2xs text-brand-faint">
                    <Globe size={11} aria-hidden="true" />
                    {company.website}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="rounded-full border border-brand-line px-2.5 py-0.5 text-2xs text-brand-body">
                  {company.industry}
                </span>
                <span className="flex items-center gap-1 rounded-full border border-brand-line px-2.5 py-0.5 text-2xs text-brand-body">
                  <Users size={11} aria-hidden="true" />
                  {company.employees}
                </span>
              </div>
              <div className="flex flex-col gap-1 text-2xs text-brand-faint">
                <p className="flex items-center gap-1.5">
                  <EnvelopeSimple size={12} aria-hidden="true" />
                  {company.email}
                </p>
                <p className="flex items-center gap-1.5">
                  <MapPin size={12} aria-hidden="true" />
                  {company.location}, Germany
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
