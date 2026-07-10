"use client";

import { ArrowUpRight, Buildings, CalendarCheck, CheckCircle } from "@phosphor-icons/react";
import { workflowStory } from "@/lib/content";

/** Step 8 — the payoff: a premium success card with a booked meeting.
    Entirely CSS-driven (ws-item/ws-pulse-ring react to the scene shell), so
    it takes no props even though the stage passes the shared scene props. */
export default function MeetingScene() {
  const { meeting } = workflowStory;

  return (
    <div className="ws-item w-full max-w-md px-1">
      <div className="ws-glass p-6 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <span className="relative flex h-14 w-14 items-center justify-center">
            <span className="ws-pulse-ring absolute inset-0 rounded-full bg-brand-green/40" />
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-green/15 text-brand-green">
              <CheckCircle size={30} aria-hidden="true" />
            </span>
          </span>
          <h4 className="mt-4 text-xl font-semibold text-brand-offwhite sm:text-2xl">
            {meeting.title}
          </h4>
        </div>

        <ul className="mt-6 flex flex-col gap-3 border-t border-brand-line pt-5">
          <li className="flex items-center gap-3 text-xs text-brand-slate sm:text-sm">
            <CalendarCheck size={16} aria-hidden="true" className="shrink-0 text-brand-accent-2" />
            {meeting.event}
          </li>
          <li className="flex items-center gap-3 text-xs text-brand-slate sm:text-sm">
            <Buildings size={16} aria-hidden="true" className="shrink-0 text-brand-accent-2" />
            {meeting.company} · {meeting.attendee}
          </li>
          <li className="flex items-center gap-3 text-xs text-brand-slate sm:text-sm">
            <ArrowUpRight size={16} aria-hidden="true" className="shrink-0 text-brand-accent-2" />
            {meeting.opportunity}
          </li>
        </ul>

        <div className="mt-5 flex items-center justify-between border-t border-brand-line pt-5">
          <span className="text-2xs uppercase tracking-[0.16em] text-brand-muted">
            {meeting.dealValueLabel}
          </span>
          <span className="font-heading text-2xl font-semibold tabular-nums text-brand-green">
            {meeting.dealValue}
          </span>
        </div>
      </div>
    </div>
  );
}
