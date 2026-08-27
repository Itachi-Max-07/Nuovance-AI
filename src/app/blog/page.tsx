import type { Metadata } from "next";
import ContentIndex from "@/components/blog/ContentIndex";
import { blogIndex } from "@/lib/content";
import { getAllPosts } from "@/lib/mdx";

export const metadata: Metadata = {
  title: `${blogIndex.heading} — ${blogIndex.eyebrow} | Nuovance AI`,
  description: blogIndex.intro,
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    title: `${blogIndex.heading} — Nuovance AI`,
    description: blogIndex.intro,
    url: "/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: `${blogIndex.heading} — Nuovance AI`,
    description: blogIndex.intro,
  },
};

export default function BlogPage() {
  return <ContentIndex copy={blogIndex} posts={getAllPosts("blog")} />;
}
