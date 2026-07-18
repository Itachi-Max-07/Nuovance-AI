"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentType,
} from "react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProgressRail from "@/components/workflow-story/ProgressRail";
import SceneShell from "@/components/workflow-story/SceneShell";
import StoryBackdrop from "@/components/workflow-story/StoryBackdrop";
import StoryHeader from "@/components/workflow-story/StoryHeader";
import CrmScene from "@/components/workflow-story/scenes/CrmScene";
import EmailScene from "@/components/workflow-story/scenes/EmailScene";
import LaunchScene from "@/components/workflow-story/scenes/LaunchScene";
import LeadsScene from "@/components/workflow-story/scenes/LeadsScene";
import MeetingScene from "@/components/workflow-story/scenes/MeetingScene";
import QualifyScene from "@/components/workflow-story/scenes/QualifyScene";
import ScanScene from "@/components/workflow-story/scenes/ScanScene";
import SummaryScene from "@/components/workflow-story/scenes/SummaryScene";
import TrackScene from "@/components/workflow-story/scenes/TrackScene";
import { workflowStory } from "@/lib/content";

interface StorySceneProps {
  active: boolean;
  reduce: boolean;
}

// Index-aligned with workflowStory.steps.
const SCENES: ComponentType<StorySceneProps>[] = [
  ScanScene,
  LeadsScene,
  QualifyScene,
  CrmScene,
  EmailScene,
  LaunchScene,
  TrackScene,
  MeetingScene,
  SummaryScene,
];

const STEP_COUNT = workflowStory.steps.length;
// Scroll distance dedicated to each step while the section is pinned.
const SCROLL_PER_STEP = 720;
// The stage fades out over the final stretch so the pin releases into
// Vision & Mission without a hard cut (and the story never replays).
const FADE_START = 0.95;

// Snap targets = the CENTER of each step's scroll band (aligned with
// handleSelect below), plus 1 so the reader can always glide out past the
// final step instead of being pulled back into it. Snapping lets the wheel
// settle onto a step rather than stranding it mid-crossfade — the core of
// the "smooth" feel for a stepped, pinned story.
const SNAP_POINTS = [
  ...Array.from({ length: STEP_COUNT }, (_, i) => (i + 0.5) / STEP_COUNT),
  1,
];

// Avoids the SSR useLayoutEffect warning; ScrollTrigger only exists client-side.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function WorkflowStory() {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const fadeRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const activeStepRef = useRef(0);
  const [activeStep, setActiveStep] = useState(0);

  useIsomorphicLayoutEffect(() => {
    if (shouldReduceMotion) return undefined;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      triggerRef.current = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${STEP_COUNT * SCROLL_PER_STEP}`,
        pin: true,
        anticipatePin: 1,
        // Glide the scroll to the nearest step center once the wheel/trackpad
        // settles. `delay` lets a fast flick pass straight through the section;
        // the ease + duration make the settle feel intentional, not grabby.
        snap: {
          snapTo: SNAP_POINTS,
          duration: { min: 0.25, max: 0.6 },
          delay: 0.08,
          ease: "power2.inOut",
        },
        onUpdate: (self) => {
          const index = Math.min(STEP_COUNT - 1, Math.floor(self.progress * STEP_COUNT));
          if (index !== activeStepRef.current) {
            activeStepRef.current = index;
            setActiveStep(index);
          }
          if (fadeRef.current) {
            const fade =
              self.progress > FADE_START
                ? 1 - (self.progress - FADE_START) / (1 - FADE_START)
                : 1;
            fadeRef.current.style.opacity = String(fade);
          }
        },
      });
    }, sectionRef);

    return () => {
      triggerRef.current = null;
      ctx.revert();
    };
  }, [shouldReduceMotion]);

  const handleSelect = useCallback((index: number) => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const target =
      trigger.start + ((index + 0.5) / STEP_COUNT) * (trigger.end - trigger.start);
    window.scrollTo({ top: target, behavior: "smooth" });
  }, []);

  const step = workflowStory.steps[activeStep];

  // Reduced motion: no pinning, no scroll hijack — the nine steps render as a
  // calm vertical sequence in their finished states.
  if (shouldReduceMotion) {
    return (
      <section
        id="workflow-story"
        aria-label={workflowStory.ariaLabel}
        className="ws-section-bg relative overflow-hidden py-20 sm:py-24 md:py-28"
      >
        <StoryBackdrop />
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <StoryHeader />
          <ol className="mt-12 flex flex-col gap-16">
            {workflowStory.steps.map((storyStep, index) => {
              const SceneComponent = SCENES[index];
              return (
                <li key={storyStep.id}>
                  <div className="mx-auto max-w-2xl text-center">
                    <p className="text-2xs font-semibold uppercase tracking-[0.2em] text-brand-accent-deep">
                      Step {index + 1} of {STEP_COUNT}
                    </p>
                    <h3 className="mt-2 text-xl font-bold text-brand-ink sm:text-2xl">
                      {storyStep.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-brand-body">
                      {storyStep.description}
                    </p>
                  </div>
                  <div className="ws-stage mt-6">
                    <SceneShell state="active">
                      <SceneComponent active reduce />
                    </SceneShell>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="workflow-story"
      aria-label={workflowStory.ariaLabel}
      className="ws-section-bg relative overflow-hidden"
    >
      <StoryBackdrop />
      <div className="relative z-10 flex min-h-screen flex-col justify-center pb-8 pt-20 sm:pt-24">
        <div ref={fadeRef} className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <StoryHeader />

          <div className="mt-6 flex flex-col gap-5 sm:mt-8 lg:flex-row lg:items-center lg:gap-10">
            <ProgressRail
              steps={workflowStory.steps}
              activeStep={activeStep}
              onSelect={handleSelect}
            />

            <div className="min-w-0 flex-1">
              {/* Re-keyed per step so the title/description morph in sync
                  with the scene crossfade. */}
              <div
                key={step.id}
                aria-live="polite"
                className="ws-fade-in mx-auto min-h-16 max-w-2xl text-center"
              >
                <h3 className="text-lg font-bold text-brand-ink sm:text-xl lg:text-2xl">
                  <span className="mr-3 font-heading text-brand-accent-deep">
                    {String(activeStep + 1).padStart(2, "0")}
                  </span>
                  {step.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-brand-body sm:text-sm">
                  {step.description}
                </p>
              </div>

              <div className="ws-stage mt-4 sm:mt-6">
                {SCENES.map((SceneComponent, index) => {
                  const state =
                    index === activeStep ? "active" : index < activeStep ? "past" : "future";
                  return (
                    <SceneShell key={workflowStory.steps[index].id} state={state}>
                      <SceneComponent active={index === activeStep} reduce={false} />
                    </SceneShell>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
