import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/jobs",
    "/accommodation",
    "/marketplace",
    "/pricing",
    "/privacy",
    "/terms",
    "/contact",
    "/sign-in",
    "/sign-up",
  ];

  return pages.map((path) => ({
    url: `${env.siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "daily",
    priority: path === "" ? 1 : 0.7,
  }));
}
