import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import MdxContent from "@/components/mdx-content";
import OrbitMotif from "@/components/ui/OrbitMotif";
import Reveal, { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { brand, legalLabels } from "@/lib/content";
import { formatPostDate, getPost } from "@/lib/mdx";

/* The policy body lives in content/legal/privacy.mdx and compiles through the
   same pipeline as /blog and /case-studies. This route is only the frame.
   Rendered in the light paper scope — like the Hero and the article pages, it
   reads the untouched `:root` tokens, not the black system. */

const SLUG = "privacy";

export function generateMetadata(): Metadata {
  const doc = getPost("legal", SLUG);
  if (!doc) return {};

  const { meta } = doc;

  return {
    title: `${meta.title} | ${brand.name}`,
    description: meta.description,
    alternates: { canonical: "/privacy" },
    // Platform API reviewers fetch this URL directly, so it must stay indexable.
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      title: meta.title,
      description: meta.description,
      url: "/privacy",
      siteName: brand.name,
      modifiedTime: meta.updated ?? meta.date,
    },
  };
}

export default function PrivacyPage() {
  const doc = getPost("legal", SLUG);
  if (!doc) notFound();

  const { meta } = doc;

  return (
    <article className="relative min-h-screen overflow-hidden bg-brand-paper py-16 sm:py-20 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 text-brand-accent opacity-10 sm:h-28 sm:w-28 lg:h-32 lg:w-32"
      >
        <OrbitMotif className="h-full w-full" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 lg:px-8">
        <Reveal>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-accent-deep transition-colors hover:text-brand-ink"
          >
            <span aria-hidden="true">←</span>
            {legalLabels.backHome}
          </Link>
        </Reveal>

        <RevealGroup className="mt-8">
          <RevealItem>
            <div className="flex items-center gap-2">
              <OrbitMotif className="h-4 w-4 text-brand-accent-deep" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent-deep sm:text-sm">
                {legalLabels.eyebrow}
              </span>
            </div>
          </RevealItem>

          <RevealItem>
            <h1 className="mt-5 text-balance text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl lg:text-5xl">
              {meta.title}
            </h1>
          </RevealItem>

          <RevealItem>
            <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 border-t-2 border-brand-ink/10 pt-6 text-xs text-brand-faint sm:text-sm">
              <span className="font-semibold text-brand-body">
                {legalLabels.updatedPrefix}{" "}
                <time dateTime={meta.updated ?? meta.date}>
                  {formatPostDate(meta.updated ?? meta.date)}
                </time>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {legalLabels.effectivePrefix}{" "}
                <time dateTime={meta.date}>{formatPostDate(meta.date)}</time>
              </span>
            </div>
          </RevealItem>
        </RevealGroup>

        <div className="prose mt-4 max-w-none">
          <MdxContent source={doc.body} />
        </div>

        <aside className="mt-16 rounded-card border-3 border-brand-ink bg-brand-card p-6 shadow-brutal sm:p-8">
          <h2 className="text-xl font-bold tracking-tight text-brand-ink sm:text-2xl">
            {legalLabels.contactHeading}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-brand-body">
            {legalLabels.contactBody}
          </p>
          <a
            href={`mailto:${legalLabels.contactEmail}?subject=Privacy%20Request`}
            className="btn-brutal btn-brutal-primary mt-6 inline-flex"
          >
            {legalLabels.contactCtaLabel}
          </a>
        </aside>
      </div>
    </article>
  );
}
