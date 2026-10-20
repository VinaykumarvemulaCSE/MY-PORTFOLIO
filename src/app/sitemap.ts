import type { MetadataRoute } from "next";

import { getCertificates, getProfile, getProjectSlugs } from "@/lib/sanity";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [profile, projectSlugs, certificates] = await Promise.all([
    getProfile(),
    getProjectSlugs(),
    getCertificates(),
  ]);

  const baseUrl = (
    profile.siteConfig.url ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://vinaykumar.eu.cc"
  ).replace(/\/$/, "");

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
    ...certificates.map((certificate) => ({
      url: `${baseUrl}/certificates/${certificate.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
