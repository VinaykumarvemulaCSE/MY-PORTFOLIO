import type { MetadataRoute } from "next";

import { getCertificateSlugs, getProjectSlugs } from "@/lib/content";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectSlugs, certificateSlugs] = await Promise.all([
    getProjectSlugs(),
    getCertificateSlugs(),
  ]);
  const baseUrl = getSiteUrl();

  const now = new Date();

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...projectSlugs.map((slug) => ({
      url: `${baseUrl}/work/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${baseUrl}/certificates`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...certificateSlugs.map((slug) => ({
      url: `${baseUrl}/certificates/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
