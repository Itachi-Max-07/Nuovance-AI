import Button from "@/components/ui/Button";
import OrbitMotif from "@/components/ui/OrbitMotif";
import { bookingHref, contentCta } from "@/lib/content";

/* Closing conversion block for case studies. Both CTAs reuse the site-wide
   booking href and the contact anchor on the home page. */
export default function ContentCta() {
  return (
    <aside className="card-brutal mt-20 px-6 py-10 sm:px-10 sm:py-12">
      <div className="flex items-center gap-2">
        <OrbitMotif className="h-4 w-4 text-brand-accent-deep" />
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent-deep">
          {contentCta.eyebrow}
        </span>
      </div>

      <h2 className="mt-5 max-w-xl text-balance text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">
        {contentCta.heading}
      </h2>

      <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-body">
        {contentCta.body}
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button href={bookingHref} target="_blank" rel="noopener noreferrer">
          {contentCta.primaryLabel}
        </Button>
        <Button href="/#contact" variant="outline">
          {contentCta.secondaryLabel}
        </Button>
      </div>
    </aside>
  );
}
