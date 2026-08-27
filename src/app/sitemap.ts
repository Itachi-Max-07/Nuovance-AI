import type { MetadataRoute } from "next";
import { contact } from "@/lib/content";
import { getAllPosts, getPost, type ContentType, type Post } from "@/lib/mdx";

const SITE_URL = `https://${contact.website}`;

/** A post's last meaningful change — the explicit `updated`, else its date. */
function lastTouched(post: Post): Date {
  return new Date(`${post.meta.updated ?? post.meta.date}T00:00:00Z`);
}

/** Index pages age with their newest entry. */
function newestOf(posts: Post[]): Date {
  return posts.length > 0 ? lastTouched(posts[0]) : new Date();
}

function postEntries(posts: Post[]): MetadataRoute.Sitemap {
  return posts.map((post) => ({
    url: `${SITE_URL}/${post.meta.type}/${post.meta.slug}`,
    lastModified: lastTouched(post),
    changeFrequency: "yearly",
    priority: 0.6,
  }));
}

function indexEntry(type: ContentType, posts: Post[]): MetadataRoute.Sitemap[number] {
  return {
    url: `${SITE_URL}/${type}`,
    lastModified: newestOf(posts),
    changeFrequency: "weekly",
    priority: 0.8,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  // getAllPosts already sorts newest-first and drops drafts in production.
  const blogPosts = getAllPosts("blog");
  const caseStudies = getAllPosts("case-studies");

  // Legal docs live under content/legal but are served from the site root, so
  // they get an explicit entry rather than going through postEntries().
  const privacy = getPost("legal", "privacy");

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    indexEntry("blog", blogPosts),
    indexEntry("case-studies", caseStudies),
    ...postEntries(blogPosts),
    ...postEntries(caseStudies),
    {
      url: `${SITE_URL}/privacy`,
      lastModified: privacy ? lastTouched(privacy) : new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];
}
