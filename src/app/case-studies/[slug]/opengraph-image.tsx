import { ImageResponse } from "next/og";
import OgCard, { OG_CONTENT_TYPE, OG_SIZE } from "@/components/og-card";
import { brand, caseStudiesIndex, contact } from "@/lib/content";
import { getPost } from "@/lib/mdx";

// Rendered on demand — see the note in blog/[slug]/opengraph-image.tsx.
export const dynamic = "force-dynamic";
export const alt = `${brand.name} case study`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

interface OpengraphImageProps {
  params: { slug: string };
}

export default function OpengraphImage({ params }: OpengraphImageProps) {
  const post = getPost("case-studies", params.slug);
  const meta = post?.meta;

  // The lead metric is the most persuasive thing to put on a shared card;
  // the client name is the fallback when no results are recorded.
  const headline = meta?.results[0];
  const footerLeft = headline
    ? `${headline.value} · ${headline.label}`
    : meta?.client ?? brand.name;

  return new ImageResponse(
    (
      <OgCard
        eyebrow={caseStudiesIndex.eyebrow}
        title={meta?.title ?? caseStudiesIndex.heading}
        footerLeft={footerLeft}
        footerRight={contact.website}
      />
    ),
    { ...size },
  );
}
