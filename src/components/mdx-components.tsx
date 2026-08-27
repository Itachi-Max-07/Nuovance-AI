import Image from "next/image";
import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import OrbitMotif from "@/components/ui/OrbitMotif";

/* ---------- MDX element map ----------
   Every element an article can emit, styled with the brand tokens. Server
   components throughout — nothing here is interactive. Custom blocks carry
   `not-prose` so the typography plugin doesn't restyle them from the inside. */

type HeadingProps = ComponentPropsWithoutRef<"h2">;

/** Hover-revealed permalink. `id` comes from rehype-slug. */
function HeadingAnchor({ id }: { id: string }) {
  return (
    <a
      href={`#${id}`}
      aria-label="Link to this section"
      className="absolute -left-7 top-1/2 hidden -translate-y-1/2 font-normal text-brand-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100 lg:block"
    >
      #
    </a>
  );
}

function H2({ id, children, ...props }: HeadingProps) {
  return (
    <h2
      id={id}
      className="group relative mt-16 text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl"
      {...props}
    >
      {id && <HeadingAnchor id={id} />}
      {children}
    </h2>
  );
}

function H3({ id, children, ...props }: HeadingProps) {
  return (
    <h3
      id={id}
      className="group relative mt-10 text-xl font-bold tracking-tight text-brand-ink sm:text-2xl"
      {...props}
    >
      {id && <HeadingAnchor id={id} />}
      {children}
    </h3>
  );
}

function Paragraph(props: ComponentPropsWithoutRef<"p">) {
  return <p className="mt-6 text-base leading-relaxed text-brand-body sm:text-lg" {...props} />;
}

// Markers carry the cobalt accent used by every other list on the site.
function UnorderedList(props: ComponentPropsWithoutRef<"ul">) {
  return (
    <ul
      className="mt-6 flex list-disc flex-col gap-3 pl-5 marker:text-brand-accent"
      {...props}
    />
  );
}

function OrderedList(props: ComponentPropsWithoutRef<"ol">) {
  return (
    <ol
      className="mt-6 flex list-decimal flex-col gap-3 pl-5 marker:font-bold marker:text-brand-accent"
      {...props}
    />
  );
}

function ListItem(props: ComponentPropsWithoutRef<"li">) {
  return <li className="text-base leading-relaxed text-brand-body sm:text-lg" {...props} />;
}

function Blockquote(props: ComponentPropsWithoutRef<"blockquote">) {
  return (
    <blockquote
      className="mt-8 border-l-4 border-brand-accent py-1 pl-6 text-lg font-semibold leading-relaxed text-brand-ink sm:text-xl"
      {...props}
    />
  );
}

// rehype-pretty-code tags the <code> inside a fenced block with data-language;
// bare inline code has no such attribute. One component serves both.
type CodeProps = ComponentPropsWithoutRef<"code"> & { "data-language"?: string };

function Code({ className = "", ...props }: CodeProps) {
  const isBlock = typeof props["data-language"] === "string";

  if (isBlock) {
    return <code className={`${className} text-sm leading-relaxed`} {...props} />;
  }

  return (
    <code
      className={`${className} rounded border-2 border-brand-ink/15 bg-brand-cream px-1.5 py-0.5 font-mono text-[0.875em] font-semibold text-brand-ink`}
      {...props}
    />
  );
}

// Horizontal scroll is contained here so a long line never widens the page.
function Pre({ className = "", ...props }: ComponentPropsWithoutRef<"pre">) {
  return (
    <pre
      className={`${className} mt-8 overflow-x-auto rounded-card border-3 border-brand-ink bg-brand-cream p-5 shadow-brutal-sm sm:p-6`}
      {...props}
    />
  );
}

type MdxImageProps = ComponentPropsWithoutRef<"img">;

// Markdown carries no intrinsic dimensions, so a 16:9 box reserves the space
// and `h-auto` hands the final ratio back to the decoded image.
function MdxImage({ src, alt, title }: MdxImageProps) {
  if (typeof src !== "string" || src.length === 0) return null;

  return (
    <figure className="not-prose mt-10">
      <div className="overflow-hidden rounded-card border-3 border-brand-ink bg-brand-cream shadow-brutal">
        <Image
          src={src}
          alt={alt ?? ""}
          width={1600}
          height={900}
          sizes="(max-width: 768px) 100vw, 768px"
          className="h-auto w-full"
        />
      </div>
      {title && (
        <figcaption className="mt-3 text-sm text-brand-faint">{title}</figcaption>
      )}
    </figure>
  );
}

const linkStyles =
  "link-reveal font-semibold text-brand-accent-deep hover:text-brand-ink";

function MdxLink({ href, children, ...props }: ComponentPropsWithoutRef<"a">) {
  if (!href) return <span {...props}>{children}</span>;

  const isInternal = href.startsWith("/") || href.startsWith("#");

  if (isInternal) {
    return (
      <Link href={href} className={linkStyles} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={linkStyles}
      {...props}
    >
      {children}
    </a>
  );
}

function Divider() {
  return (
    <hr className="mt-14 border-0 border-t-2 border-brand-ink/10" />
  );
}

function Strong(props: ComponentPropsWithoutRef<"strong">) {
  return <strong className="font-bold text-brand-ink" {...props} />;
}

/* ---------- Tables ----------
   remark-gfm emits these, and the legal pages lean on them heavily. The
   wrapper owns the frame and the horizontal scroll so a wide table never
   widens the page on mobile; `not-prose` keeps the typography plugin from
   adding a second set of margins inside that frame. */

function Table(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="not-prose mt-8 overflow-x-auto rounded-card border-3 border-brand-ink bg-brand-card shadow-brutal-sm">
      <table className="w-full min-w-[38rem] border-collapse text-left" {...props} />
    </div>
  );
}

function TableHead(props: ComponentPropsWithoutRef<"thead">) {
  return <thead className="border-b-2 border-brand-ink bg-brand-cream" {...props} />;
}

function TableRow(props: ComponentPropsWithoutRef<"tr">) {
  return <tr className="border-b-2 border-brand-line last:border-b-0" {...props} />;
}

function TableHeaderCell(props: ComponentPropsWithoutRef<"th">) {
  return (
    <th
      className="px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-brand-ink sm:px-5"
      {...props}
    />
  );
}

function TableCell(props: ComponentPropsWithoutRef<"td">) {
  return (
    <td
      className="px-4 py-3 align-top text-sm leading-relaxed text-brand-body sm:px-5"
      {...props}
    />
  );
}

/* ---------- Authoring components, usable directly inside .mdx ---------- */

interface CalloutProps {
  /** `note` uses the cobalt accent; `success` uses the green token. */
  tone?: "note" | "success";
  title?: string;
  children: ReactNode;
}

export function Callout({ tone = "note", title, children }: CalloutProps) {
  const toneStyles =
    tone === "success"
      ? { rule: "bg-brand-green", motif: "text-brand-green" }
      : { rule: "bg-brand-accent", motif: "text-brand-accent" };

  return (
    <aside className="not-prose mt-10 flex gap-4 rounded-card border-3 border-brand-ink bg-brand-cream p-6 shadow-brutal-sm sm:p-7">
      <span aria-hidden="true" className={`w-1 shrink-0 rounded-full ${toneStyles.rule}`} />
      <div className="flex flex-1 flex-col gap-2">
        {title && (
          <div className="flex items-center gap-2">
            <OrbitMotif className={`h-4 w-4 ${toneStyles.motif}`} />
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-ink">
              {title}
            </p>
          </div>
        )}
        <div className="text-base leading-relaxed text-brand-body">{children}</div>
      </div>
    </aside>
  );
}

interface MetricProps {
  value: string;
  label: string;
  /** Optional qualifier, e.g. "measured over 8 weeks". */
  hint?: string;
}

export function Metric({ value, label, hint }: MetricProps) {
  return (
    <span className="not-prose mt-8 flex flex-col items-center gap-1 rounded-card border-3 border-brand-ink bg-brand-card px-6 py-7 text-center shadow-brutal-sm">
      <span className="font-heading text-3xl font-extrabold tabular-nums text-brand-accent sm:text-4xl">
        {value}
      </span>
      <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-brand-body sm:text-xs">
        {label}
      </span>
      {hint && <span className="mt-1 text-xs text-brand-faint">{hint}</span>}
    </span>
  );
}

export const mdxComponents: MDXComponents = {
  h2: H2,
  h3: H3,
  p: Paragraph,
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,
  strong: Strong,
  blockquote: Blockquote,
  code: Code,
  pre: Pre,
  img: MdxImage,
  a: MdxLink,
  hr: Divider,
  table: Table,
  thead: TableHead,
  tr: TableRow,
  th: TableHeaderCell,
  td: TableCell,
  Callout,
  Metric,
};
