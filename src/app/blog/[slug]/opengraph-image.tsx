import { ImageResponse } from "next/og";
import OgCard, { OG_CONTENT_TYPE, OG_SIZE } from "@/components/og-card";
import { blogIndex, brand, contact } from "@/lib/content";
import { formatPostDate, getPost } from "@/lib/mdx";

// Rendered on demand rather than prerendered, like the root card. The Node
// runtime is required (this route reads MDX frontmatter off disk, which the
// edge runtime can't do), and Next's vendored @vercel/og cannot prerender
// under Node on Windows — it path.join()s a file:// URL, which corrupts the
// separators. Deferring to request time sidesteps that and costs nothing:
// Vercel caches the response at the CDN.
export const dynamic = "force-dynamic";
export const alt = `${brand.name} article`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

interface OpengraphImageProps {
  params: { slug: string };
}

export default function OpengraphImage({ params }: OpengraphImageProps) {
  const post = getPost("blog", params.slug);
  const meta = post?.meta;

  return new ImageResponse(
    (
      <OgCard
        eyebrow={blogIndex.eyebrow}
        title={meta?.title ?? blogIndex.heading}
        footerLeft={
          meta ? `${formatPostDate(meta.date)} · ${meta.readingLabel}` : brand.name
        }
        footerRight={contact.website}
      />
    ),
    { ...size },
  );
}
