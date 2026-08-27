import { contact, feed } from "@/lib/content";
import { getAllPosts } from "@/lib/mdx";

const SITE_URL = `https://${contact.website}`;

// Baked at build time alongside the posts it lists.
export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** RFC-822 date, as RSS 2.0 requires for pubDate. */
function toRfc822(date: string): string {
  return new Date(`${date}T00:00:00Z`).toUTCString();
}

export function GET(): Response {
  const posts = getAllPosts("blog");
  const newest = posts[0];
  const lastBuild = newest
    ? toRfc822(newest.meta.updated ?? newest.meta.date)
    : new Date().toUTCString();

  const items = posts
    .map((post) => {
      const { meta } = post;
      const url = `${SITE_URL}/blog/${meta.slug}`;
      const categories = meta.tags
        .map((tag) => `      <category>${escapeXml(tag)}</category>`)
        .join("\n");

      return [
        "    <item>",
        `      <title>${escapeXml(meta.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <description>${escapeXml(meta.description)}</description>`,
        `      <pubDate>${toRfc822(meta.date)}</pubDate>`,
        // RSS 2.0 requires <author> to be an email address; a display name
        // belongs in Dublin Core, which every reader understands.
        meta.author ? `      <dc:creator>${escapeXml(meta.author)}</dc:creator>` : "",
        categories,
        "    </item>",
      ]
        .filter((line) => line.length > 0)
        .join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(feed.title)}</title>
    <link>${SITE_URL}/blog</link>
    <description>${escapeXml(feed.description)}</description>
    <language>${feed.language}</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
