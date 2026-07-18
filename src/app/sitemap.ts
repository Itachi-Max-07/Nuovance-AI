import type { MetadataRoute } from "next";
import { contact } from "@/lib/content";

const SITE_URL = `https://${contact.website}`;

// Single-page marketing site — one canonical entry.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
