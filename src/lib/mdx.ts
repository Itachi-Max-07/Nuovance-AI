import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

/* ---------- MDX content loader ----------
   Filesystem-backed content for /blog, /case-studies, and the legal pages.
   Node-only — this module reads from disk, so it must never be imported by a
   Client Component. Site copy still lives in content.ts; this file only
   handles .mdx documents. */

export type ContentType = "blog" | "case-studies" | "legal";

/** A single headline number on a case study ("Publishing time", "−82%"). */
export interface PostResult {
  label: string;
  value: string;
}

export interface PostMeta {
  type: ContentType;
  slug: string;
  title: string;
  description: string;
  /** ISO date string (YYYY-MM-DD) from frontmatter. */
  date: string;
  /** Last substantive edit; falls back to `date` when absent. */
  updated?: string;
  author?: string;
  tags: string[];
  /** Excluded from listings and static params in production only. */
  draft: boolean;
  /** Rounded whole minutes, computed from the MDX body. */
  readingMinutes: number;
  /** Prebuilt label, e.g. "6 min read". */
  readingLabel: string;
  /** Pins the post to the featured slot on its index page. */
  featured: boolean;
  cover?: string;
  coverAlt?: string;

  /* ---- case-studies only ---- */
  client?: string;
  industry?: string;
  results: PostResult[];
  services: string[];
}

export interface Post {
  meta: PostMeta;
  /** Raw MDX source, ready for <MDXRemote source={...} />. */
  body: string;
}

const CONTENT_ROOT = path.join(process.cwd(), "content");

// Frontmatter is untyped YAML — every field is narrowed through the helpers
// below rather than asserted, so a malformed file degrades instead of crashing
// the build with a type lie.
type Frontmatter = Record<string, unknown>;

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function asBoolean(value: unknown): boolean {
  return value === true;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

/** Accepts a real Date (YAML auto-parses unquoted dates) or a string. */
function asDate(value: unknown): string | undefined {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  const raw = asString(value);
  if (!raw) return undefined;
  return Number.isNaN(new Date(raw).getTime()) ? undefined : raw;
}

function asResults(value: unknown): PostResult[] {
  if (!Array.isArray(value)) return [];
  return value.reduce<PostResult[]>((acc, entry) => {
    if (typeof entry !== "object" || entry === null) return acc;
    const record = entry as Frontmatter;
    const label = asString(record.label);
    const result = asString(record.value);
    if (label && result) acc.push({ label, value: result });
    return acc;
  }, []);
}

// Route params arrive as arbitrary strings; anything that isn't a plain slug
// could escape CONTENT_ROOT via `../`, so reject it before touching the disk.
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function contentDir(type: ContentType): string {
  return path.join(CONTENT_ROOT, type);
}

/** Every slug on disk, drafts included. Empty when the directory is absent. */
export function getSlugs(type: ContentType): string[] {
  const dir = contentDir(type);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""))
    .filter((slug) => SLUG_PATTERN.test(slug));
}

/** Returns null for a missing, unreadable, or untitled post — never throws. */
export function getPost(type: ContentType, slug: string): Post | null {
  if (!SLUG_PATTERN.test(slug)) return null;

  const filePath = path.join(contentDir(type), `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
  const frontmatter = data as Frontmatter;

  const title = asString(frontmatter.title);
  const description = asString(frontmatter.description);
  const date = asDate(frontmatter.date);
  // A post without these three can't render a card, a canonical, or JSON-LD.
  if (!title || !description || !date) return null;

  const stats = readingTime(content);
  const readingMinutes = Math.max(1, Math.round(stats.minutes));

  return {
    meta: {
      type,
      slug,
      title,
      description,
      date,
      updated: asDate(frontmatter.updated),
      author: asString(frontmatter.author),
      tags: asStringArray(frontmatter.tags),
      draft: asBoolean(frontmatter.draft),
      readingMinutes,
      readingLabel: `${readingMinutes} min read`,
      featured: asBoolean(frontmatter.featured),
      cover: asString(frontmatter.cover),
      coverAlt: asString(frontmatter.coverAlt),
      client: asString(frontmatter.client),
      industry: asString(frontmatter.industry),
      results: asResults(frontmatter.results),
      services: asStringArray(frontmatter.services),
    },
    body: content,
  };
}

// Drafts stay visible in `next dev` so unpublished work can be previewed, and
// disappear from the production build.
const includeDrafts = process.env.NODE_ENV !== "production";

/** Published posts, newest first. */
export function getAllPosts(type: ContentType): Post[] {
  return getSlugs(type)
    .map((slug) => getPost(type, slug))
    .filter((post): post is Post => post !== null)
    .filter((post) => includeDrafts || !post.meta.draft)
    .sort((a, b) => b.meta.date.localeCompare(a.meta.date));
}

/** Slugs that should be prerendered — drafts excluded in production. */
export function getPublishedSlugs(type: ContentType): string[] {
  return getAllPosts(type).map((post) => post.meta.slug);
}

/** Shared display format for post dates, e.g. "28 July 2026". */
export function formatPostDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
