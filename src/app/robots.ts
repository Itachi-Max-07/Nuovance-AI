import type { MetadataRoute } from "next";
import { contact } from "@/lib/content";

const SITE_URL = `https://${contact.website}`;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
