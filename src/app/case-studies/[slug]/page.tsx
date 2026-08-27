import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ContentCta from "@/components/blog/ContentCta";
import MdxContent from "@/components/mdx-content";
import OrbitMotif from "@/components/ui/OrbitMotif";
import Reveal, { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { articleLabels, brand, contact } from "@/lib/content";
import { formatPostDate, getPost, getPublishedSlugs } from "@/lib/mdx";

const SITE_URL = `https://${contact.website}`;

interface CaseStudyPageProps {
  params: { slug: string };
}

export const dynamicParams = false;

export function generateStaticParams(): Array<{ slug: string }> {
  return getPublishedSlugs("case-studies").map((slug) => ({ slug }));
}

export function generateMetadata({ params }: CaseStudyPageProps): Metadata {
  const post = getPost("case-studies", params.slug);
  if (!post) return {};

  const { meta } = post;
  const path = `/case-studies/${meta.slug}`;

  return {
    title: `${meta.title} | ${brand.name}`,
    description: meta.description,
    keywords: [...meta.tags, ...meta.services],
    authors: meta.author ? [{ name: meta.author }] : undefined,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: meta.title,
      description: meta.description,
      url: path,
      siteName: brand.name,
      publishedTime: meta.date,
      modifiedTime: meta.updated ?? meta.date,
      authors: meta.author ? [meta.author] : undefined,
      tags: meta.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      site: contact.social.handle,
      creator: contact.social.handle,
    },
  };
}

export default function CaseStudyPage({ params }: CaseStudyPageProps) {
  const post = getPost("case-studies", params.slug);
  if (!post) notFound();

  const { meta } = post;
  const url = `${SITE_URL}/case-studies/${meta.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    dateModified: meta.updated ?? meta.date,
    author: { "@type": "Organization", name: meta.author ?? brand.name },
    publisher: {
      "@type": "Organization",
      name: brand.name,
      url: SITE_URL,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: [`${url}/opengraph-image`],
    keywords: [...meta.tags, ...meta.services].join(", "),
    about: meta.industry,
    url,
  };

  // Client / industry / services — only the fields the frontmatter supplied.
  const factRows: Array<{ label: string; value: string }> = [
    meta.client ? { label: articleLabels.clientLabel, value: meta.client } : null,
    meta.industry ? { label: articleLabels.industryLabel, value: meta.industry } : null,
    meta.services.length > 0
      ? { label: articleLabels.servicesLabel, value: meta.services.join(" · ") }
      : null,
  ].filter((row): row is { label: string; value: string } => row !== null);

  return (
    <article className="relative overflow-hidden bg-brand-paper py-16 sm:py-20 lg:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 text-brand-accent opacity-10 sm:h-28 sm:w-28 lg:h-32 lg:w-32"
      >
        <OrbitMotif className="h-full w-full" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 lg:px-8">
        <Reveal>
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-accent-deep transition-colors hover:text-brand-ink"
          >
            <span aria-hidden="true">←</span>
            {articleLabels.backToCaseStudies}
          </Link>
        </Reveal>

        <RevealGroup className="mt-8">
          {meta.industry && (
            <RevealItem>
              <div className="flex items-center gap-2">
                <OrbitMotif className="h-4 w-4 text-brand-accent-deep" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent-deep sm:text-sm">
                  {meta.industry}
                </span>
              </div>
            </RevealItem>
          )}

          <RevealItem>
            <h1 className="mt-5 text-balance text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl lg:text-5xl">
              {meta.title}
            </h1>
          </RevealItem>

          <RevealItem>
            <p className="mt-6 text-base leading-relaxed text-brand-body sm:text-lg">
              {meta.description}
            </p>
          </RevealItem>
        </RevealGroup>

        {/* Results strip: the headline numbers lead, before any prose. */}
        {meta.results.length > 0 && (
          <Reveal className="mt-10 sm:mt-12">
            <section aria-label={articleLabels.resultsLabel}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-faint">
                {articleLabels.resultsLabel}
              </h2>
              <dl className="card-brutal mt-4 grid grid-cols-1 divide-y divide-brand-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {meta.results.map((result) => (
                  <div
                    key={result.label}
                    className="flex flex-col items-center gap-1 px-4 py-6 text-center sm:py-8"
                  >
                    <dt className="order-2 text-[11px] font-medium uppercase tracking-[0.1em] text-brand-body sm:text-xs">
                      {result.label}
                    </dt>
                    <dd className="order-1 font-heading text-3xl font-extrabold tabular-nums text-brand-accent sm:text-4xl lg:text-5xl">
                      {result.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </Reveal>
        )}

        {factRows.length > 0 && (
          <Reveal className="mt-8">
            <dl className="flex flex-col gap-4 border-t-2 border-brand-ink/10 pt-6 sm:flex-row sm:flex-wrap sm:gap-x-10">
              {factRows.map((row) => (
                <div key={row.label} className="flex flex-col gap-1">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.15em] text-brand-faint">
                    {row.label}
                  </dt>
                  <dd className="text-sm font-semibold text-brand-ink">{row.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-brand-faint sm:text-sm">
          <time dateTime={meta.date}>{formatPostDate(meta.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{meta.readingLabel}</span>
          {meta.updated && meta.updated !== meta.date && (
            <>
              <span aria-hidden="true">·</span>
              <span>
                {articleLabels.updatedPrefix}{" "}
                <time dateTime={meta.updated}>{formatPostDate(meta.updated)}</time>
              </span>
            </>
          )}
        </div>

        {meta.cover && (
          <Reveal className="mt-10">
            <figure className="relative aspect-[3/2] overflow-hidden rounded-card border-3 border-brand-ink shadow-brutal">
              <Image
                src={meta.cover}
                alt={meta.coverAlt ?? ""}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </figure>
          </Reveal>
        )}

        <div className="prose mt-4 max-w-none">
          <MdxContent source={post.body} />
        </div>

        <ContentCta />
      </div>
    </article>
  );
}
