import PostCard from "@/components/blog/PostCard";
import OrbitMotif from "@/components/ui/OrbitMotif";
import Reveal, { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import type { ContentIndexCopy } from "@/lib/content";
import type { Post } from "@/lib/mdx";

interface ContentIndexProps {
  copy: ContentIndexCopy;
  posts: Post[];
}

/* Listing layout shared by /blog and /case-studies: lead card, then a grid.
   A Server Component — only the entry animations cross into the client, via
   the shared Reveal wrappers. */
export default function ContentIndex({ copy, posts }: ContentIndexProps) {
  // An explicit `featured: true` wins; otherwise the newest post leads.
  const lead = posts.find((post) => post.meta.featured) ?? posts[0];
  const rest = posts.filter((post) => post !== lead);

  return (
    <section className="relative overflow-hidden bg-brand-paper py-20 sm:py-24 md:py-28 lg:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 text-brand-accent opacity-10 sm:h-28 sm:w-28 lg:h-32 lg:w-32"
      >
        <OrbitMotif className="h-full w-full" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-8">
        <RevealGroup>
          <RevealItem>
            <div className="flex items-center gap-2">
              <OrbitMotif className="h-4 w-4 text-brand-accent-deep" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent-deep sm:text-sm">
                {copy.eyebrow}
              </span>
            </div>
          </RevealItem>

          <RevealItem>
            <h1 className="mt-6 max-w-3xl text-balance text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl lg:text-5xl">
              {copy.heading}
            </h1>
          </RevealItem>

          <RevealItem>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-body sm:text-lg">
              {copy.intro}
            </p>
          </RevealItem>
        </RevealGroup>

        {posts.length === 0 ? (
          <Reveal className="mt-12 sm:mt-16">
            <p className="card-brutal px-6 py-12 text-center text-base text-brand-body sm:px-8">
              {copy.empty}
            </p>
          </Reveal>
        ) : (
          <>
            <Reveal className="mt-12 sm:mt-16">
              <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-brand-ink">
                {copy.featuredLabel}
              </h2>
            </Reveal>

            <Reveal className="mt-6 flex sm:mt-8">
              <PostCard meta={lead.meta} featured />
            </Reveal>

            {rest.length > 0 && (
              <>
                <Reveal className="mt-16 sm:mt-20">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-brand-ink">
                    {copy.listLabel}
                  </h2>
                </Reveal>

                <RevealGroup className="mt-6 grid gap-6 sm:mt-8 sm:grid-cols-2 lg:gap-8">
                  {rest.map((post) => (
                    <RevealItem key={post.meta.slug} className="flex">
                      <PostCard meta={post.meta} />
                    </RevealItem>
                  ))}
                </RevealGroup>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
