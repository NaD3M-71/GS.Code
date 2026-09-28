import type { MetadataRoute } from "next";
import { SITIO_URL } from "@/lib/sitio";

// Genera /robots.txt
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin"],
    },
    sitemap: `${SITIO_URL}/sitemap.xml`,
  };
}
