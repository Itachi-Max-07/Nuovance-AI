"use client";

import { CheckCircle, PaperPlaneTilt, Sparkle } from "@phosphor-icons/react";
import useTypewriter from "@/components/workflow-story/useTypewriter";
import { workflowStory } from "@/lib/content";
import { cn } from "@/lib/utils";

interface EmailSceneProps {
  active: boolean;
  reduce: boolean;
}

const { email } = workflowStory;
const FULL_BODY = email.body.join("\n\n");
const AVATAR_INITIALS = email.recipientCompany
  .split(" ")
  .map((word) => word[0])
  .join("")
  .slice(0, 2);

/** Step 5 — the AI types a personalized cold email inside a glass interface. */
export default function EmailScene({ active, reduce }: EmailSceneProps) {
  const { text, done } = useTypewriter(active, FULL_BODY, reduce, 85);

  return (
    <div className="flex w-full max-w-3xl items-stretch justify-center gap-4 px-1">
      <div className="ws-item min-w-0 flex-1">
        <div className="ws-card flex h-full flex-col p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-accent/15 text-xs font-semibold text-brand-accent-deep">
              {AVATAR_INITIALS}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-brand-ink">
                {email.recipientName} · {email.recipientCompany}
              </p>
              <p className="text-2xs text-brand-faint">{email.recipientRole}</p>
            </div>
            <span className="ml-auto flex shrink-0 items-center gap-1 rounded-full border border-brand-accent/50 bg-brand-accent/10 px-2.5 py-1 text-2xs text-brand-accent-deep">
              <Sparkle size={11} aria-hidden="true" />
              {email.badge}
            </span>
          </div>

          <p className="mt-4 border-b border-brand-line pb-3 text-xs text-brand-body sm:text-sm">
            <span className="text-brand-faint">Subject: </span>
            <span className="font-medium text-brand-ink">{email.subject}</span>
          </p>

          <p className="mt-3 min-h-32 flex-1 whitespace-pre-line text-xs leading-relaxed text-brand-body sm:min-h-40 sm:text-sm">
            {text}
            {active && !done && (
              <span aria-hidden="true" className="ws-caret text-brand-accent-deep">
                ▍
              </span>
            )}
          </p>

          <div className="mt-4 flex items-center justify-end gap-3 border-t border-brand-line pt-4">
            <span
              className={cn(
                "text-2xs uppercase tracking-[0.16em] text-brand-green transition-opacity duration-500",
                done ? "opacity-100" : "opacity-0",
              )}
            >
              {email.sentLabel}
            </span>
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-full border-2 px-4 py-1.5 text-xs font-bold transition-press duration-500 ease-out-strong",
                done
                  ? "border-brand-ink bg-brand-accent text-brand-paper shadow-brutal-sm"
                  : "border-brand-line bg-brand-cream text-brand-faint",
              )}
            >
              <PaperPlaneTilt size={13} aria-hidden="true" />
              {email.sendLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="ws-item hidden w-52 shrink-0 lg:block" style={{ animationDelay: "220ms" }}>
        <div className="ws-card h-full p-4">
          <p className="text-2xs font-semibold uppercase tracking-[0.16em] text-brand-accent-deep">
            {email.researchTitle}
          </p>
          <ul className="mt-3 flex flex-col gap-3">
            {email.research.map((item) => (
              <li key={item} className="flex items-start gap-2 text-2xs leading-relaxed text-brand-body">
                <CheckCircle size={13} aria-hidden="true" className="mt-px shrink-0 text-brand-green" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
