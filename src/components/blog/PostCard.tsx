import Image from "next/image";
import Link from "next/link";
import OrbitMotif from "@/components/ui/OrbitMotif";
import { formatPostDate, type PostMeta } from "@/lib/mdx";

interface PostCardProps {
  meta: PostMeta;
  /** Wide two-column treatment for the lead slot on an index page. */
  featured?: boolean;
}

/* Shared card for both /blog and /case-studies. `meta.type` doubles as the
   route segment, so one component links correctly from either index. */
export default function PostCard({ meta, featured = false }: PostCardProps) {
  // Case studies lead with the industry; articles lead with their first tag.
  const chip = meta.industry ?? meta.tags[0];

  return (
    <Link
      href={`/${meta.type}/${meta.slug}`}
      className={`group card-brutal flex w-full ${
        featured ? "flex-col md:flex-row" : "flex-col"
      }`}
    >
      <div
        className={`relative overflow-hidden bg-brand-cream ${
          featured
            ? "aspect-[16/10] border-b-3 border-brand-ink md:aspect-auto md:w-5/12 md:shrink-0 md:border-b-0 md:border-r-3"
            : "aspect-[16/10] border-b-3 border-brand-ink"
        }`}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-out group-hover:rotate-45"
        >
          <OrbitMotif className="h-16 w-16 text-brand-ink/20 sm:h-20 sm:w-20" />
        </div>
        {meta.cover && (
          <Image
            src={meta.cover}
            alt={meta.coverAlt ?? ""}
            fill
            sizes={featured ? "(max-width: 768px) 100vw, 42vw" : "(max-width: 640px) 100vw, 33vw"}
            className="transform-gpu object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        )}
        {chip && (
          <span className="absolute left-4 top-4 inline-flex items-center rounded-full border-2 border-brand-ink bg-brand-card px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-brand-ink shadow-brutal-sm">
            {chip}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6 sm:p-7">
        <div className="flex items-start gap-2.5">
          <span
            aria-hidden="true"
            className="mt-2.5 h-1 w-6 shrink-0 rounded-full bg-brand-accent transition-transform duration-300 group-hover:scale-x-125"
          />
          <h3
            className={`font-bold leading-snug tracking-tight text-brand-ink ${
              featured ? "text-xl sm:text-2xl lg:text-3xl" : "text-lg sm:text-xl"
            }`}
          >
            {meta.title}
          </h3>
        </div>

        <p className="text-sm leading-relaxed text-brand-body sm:text-base">
          {meta.description}
        </p>

        {meta.results.length > 0 && (
          <ul className="flex flex-wrap gap-x-6 gap-y-3 pt-1">
            {meta.results.slice(0, 3).map((result) => (
              <li key={result.label} className="flex flex-col">
                <span className="font-heading text-xl font-extrabold tabular-nums text-brand-accent sm:text-2xl">
                  {result.value}
                </span>
                <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-brand-faint">
                  {result.label}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-xs text-brand-faint">
          <time dateTime={meta.date}>{formatPostDate(meta.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{meta.readingLabel}</span>
        </div>
      </div>
    </Link>
  );
}
