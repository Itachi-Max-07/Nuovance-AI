import type { Metadata } from "next";
import ContentIndex from "@/components/blog/ContentIndex";
import { caseStudiesIndex } from "@/lib/content";
import { getAllPosts } from "@/lib/mdx";

export const metadata: Metadata = {
  title: `${caseStudiesIndex.heading} — ${caseStudiesIndex.eyebrow} | Nuovance AI`,
  description: caseStudiesIndex.intro,
  alternates: { canonical: "/case-studies" },
  openGraph: {
    type: "website",
    title: `${caseStudiesIndex.heading} — Nuovance AI`,
    description: caseStudiesIndex.intro,
    url: "/case-studies",
  },
  twitter: {
    card: "summary_large_image",
    title: `${caseStudiesIndex.heading} — Nuovance AI`,
    description: caseStudiesIndex.intro,
  },
};

export default function CaseStudiesPage() {
  return <ContentIndex copy={caseStudiesIndex} posts={getAllPosts("case-studies")} />;
}
