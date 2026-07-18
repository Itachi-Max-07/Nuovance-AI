import OrbitMotif from "@/components/ui/OrbitMotif";
import { workflowStory } from "@/lib/content";

/** Compact eyebrow + heading block shared by both story layouts. */
export default function StoryHeader() {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2">
        <OrbitMotif className="h-4 w-4 text-brand-accent-deep" />
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent-deep sm:text-sm">
          {workflowStory.eyebrow}
        </span>
      </div>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl lg:text-4xl">
        {workflowStory.heading}
      </h2>
      <p className="mx-auto mt-2 hidden max-w-xl text-sm leading-relaxed text-brand-body sm:block">
        {workflowStory.subheading}
      </p>
    </div>
  );
}
