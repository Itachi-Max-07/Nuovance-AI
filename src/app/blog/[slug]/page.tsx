import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import MdxContent from "@/components/mdx-content";
import OrbitMotif from "@/components/ui/OrbitMotif";
import Reveal, { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { articleLabels, brand, contact } from "@/lib/content";
import { formatPostDate, getPost, getPublishedSlugs } from "@/lib/mdx";

const SITE_URL = `https://${contact.website}`;

interface BlogPostPageProps {
  params: { slug: string };
}

// Every published slug is prerendered; anything else 404s instead of being
// rendered on demand, so drafts stay invisible in production.
export const dynamicParams = false;

export function generateStaticParams(): Array<{ slug: string }> {
  return getPublishedSlugs("blog").map((slug) => ({ slug }));
}

export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const post = getPost("blog", params.slug);
  if (!post) return {};

  const { meta } = post;
  const path = `/blog/${meta.slug}`;

  return {
    title: `${meta.title} | ${brand.name}`,
    description: meta.description,
    keywords: meta.tags,
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

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPost("blog", params.slug);
  if (!post) notFound();

  const { meta } = post;
  const url = `${SITE_URL}/blog/${meta.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
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
    keywords: meta.tags.join(", "),
    url,
  };

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
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-accent-deep transition-colors hover:text-brand-ink"
          >
            <span aria-hidden="true">←</span>
            {articleLabels.backToBlog}
          </Link>
        </Reveal>

        <RevealGroup className="mt-8">
          {meta.tags.length > 0 && (
            <RevealItem>
              <div className="flex items-center gap-2">
                <OrbitMotif className="h-4 w-4 text-brand-accent-deep" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent-deep sm:text-sm">
                  {meta.tags[0]}
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

          <RevealItem>
            <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 border-t-2 border-brand-ink/10 pt-6 text-xs text-brand-faint sm:text-sm">
              {meta.author && (
                <>
                  <span className="font-semibold text-brand-body">{meta.author}</span>
                  <span aria-hidden="true">·</span>
                </>
              )}
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
          </RevealItem>
        </RevealGroup>

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

        {meta.tags.length > 0 && (
          <ul className="mt-16 flex flex-wrap gap-3 border-t-2 border-brand-ink/10 pt-8">
            {meta.tags.map((tag) => (
              <li key={tag} className="tag-brutal text-xs uppercase tracking-[0.1em]">
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
