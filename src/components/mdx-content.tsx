import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/mdx-components";

/* Single place the MDX pipeline is configured, so /blog and /case-studies
   compile articles identically. Runs at build time (both routes are fully
   static), so shiki never ships to the browser. */

const prettyCodeOptions: PrettyCodeOptions = {
  // Light syntax theme to match the paper palette these pages render on.
  // The <pre> surface itself is ours (bg-brand-cream), so the theme's own
  // background is dropped — only token colours come from shiki.
  theme: "github-light",
  keepBackground: false,
  defaultLang: "plaintext",
};

interface MdxContentProps {
  /** Raw MDX body from `getPost().body`. */
  source: string;
}

export default function MdxContent({ source }: MdxContentProps) {
  return (
    <MDXRemote
      source={source}
      components={mdxComponents}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug, [rehypePrettyCode, prettyCodeOptions]],
        },
      }}
    />
  );
}
