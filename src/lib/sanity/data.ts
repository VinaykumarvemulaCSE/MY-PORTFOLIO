import { cache } from "react";

import projectsFallback from "../../../public/data/projects.json";
import certificatesFallback from "../../../public/data/certificates.json";
import skillsFallback from "../../../public/data/skills.json";

import {
  toCertificateViewModel,
  toProfileViewModel,
  toProjectViewModel,
  toSkillGroupViewModel,
} from "./adapters";
import { sanityFetch } from "./client";
import { profileDefaults } from "./defaults";
import { isSanityConfigured } from "./env";
import {
  certificatesQuery,
  profileQuery,
  projectBySlugQuery,
  projectSlugsQuery,
  projectsQuery,
  siteSettingsQuery,
  skillGroupsQuery,
} from "./queries";
import type {
  CertificateViewModel,
  ProfileViewModel,
  ProjectViewModel,
  SanityCertificateDoc,
  SanityProfileDoc,
  SanityProjectDoc,
  SanitySiteSettingsDoc,
  SanitySkillGroupDoc,
  SkillGroupViewModel,
} from "./types";

/**
 * Data access for the public site.
 *
 * Sanity is the source of truth once it is configured. Until then — and as a
 * safety net if the API is unreachable during a build — the JSON files in
 * `public/data/` are used. This is what lets the site keep deploying while the
 * CMS is being populated.
 */

/* -------------------------------------------------------------------------- */
/* Fallbacks                                                                  */
/* -------------------------------------------------------------------------- */

export const fallbackProfile: ProfileViewModel = profileDefaults;

interface LegacyProject {
  id: string;
  title?: string;
  tagline?: string;
  description?: string;
  tech?: string[];
  liveLink?: string;
  githubLink?: string;
  status?: string;
  coverImage?: string;
  gallery?: string[];
  featured?: boolean;
  difficulty?: string;
  timeInvestment?: string;
  demoCredentials?: ProjectViewModel["demoCredentials"];
  caseStudy?: ProjectViewModel["caseStudy"];
  slug?: string;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeLegacyProject(project: LegacyProject): ProjectViewModel {
  return {
    id: project.id,
    // Legacy JSON has no slug, so derive a readable one from the title and keep
    // the id as a last resort. Readable slugs matter for /work/[slug] SEO.
    slug: project.slug || slugify(project.title ?? "") || project.id,
    title: project.title ?? "Untitled project",
    tagline: project.tagline || undefined,
    description: project.description ?? "",
    tech: project.tech ?? [],
    liveLink: project.liveLink || undefined,
    githubLink: project.githubLink || undefined,
    status: project.status ?? "Live",
    coverImage: project.coverImage || undefined,
    gallery: project.gallery ?? [],
    featured: project.featured ?? false,
    difficulty: project.difficulty || undefined,
    timeInvestment: project.timeInvestment || undefined,
    demoCredentials: project.demoCredentials,
    caseStudy: project.caseStudy,
  };
}

export const fallbackProjects = (projectsFallback as unknown as LegacyProject[]).map(
  normalizeLegacyProject,
);

export const fallbackCertificates =
  certificatesFallback as unknown as CertificateViewModel[];

export const fallbackSkillGroups = skillsFallback as unknown as SkillGroupViewModel[];

/* -------------------------------------------------------------------------- */
/* Profile                                                                    */
/* -------------------------------------------------------------------------- */

export const getProfile = cache(async (): Promise<ProfileViewModel> => {
  if (!isSanityConfigured) return toProfileViewModel(null, fallbackProfile);

  try {
    const doc = await sanityFetch<SanityProfileDoc | null>(profileQuery);
    return toProfileViewModel(doc, fallbackProfile);
  } catch (error) {
    console.warn("[sanity] profile query failed, using JSON fallback:", error);
    return toProfileViewModel(null, fallbackProfile);
  }
});

/* -------------------------------------------------------------------------- */
/* Site settings                                                              */
/* -------------------------------------------------------------------------- */

export interface SiteSettings {
  title: string;
  description: string;
}

/**
 * The `siteSettings` singleton feeds the page title and meta description. The
 * canonical origin is configured through `NEXT_PUBLIC_SITE_URL` so a domain
 * change never requires a CMS edit.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  const fallback = fallbackProfile.siteConfig;
  if (!isSanityConfigured) return fallback;

  try {
    const doc = await sanityFetch<SanitySiteSettingsDoc | null>(
      siteSettingsQuery,
    );
    return {
      title: doc?.title || fallback.title,
      description: doc?.description || fallback.description,
    };
  } catch (error) {
    console.warn("[sanity] site settings query failed, using defaults:", error);
    return fallback;
  }
}

/* -------------------------------------------------------------------------- */
/* Projects                                                                   */
/* -------------------------------------------------------------------------- */

export async function getProjects(): Promise<ProjectViewModel[]> {
  if (!isSanityConfigured) return fallbackProjects;

  try {
    const docs = await sanityFetch<SanityProjectDoc[]>(projectsQuery);
    if (!docs?.length) return fallbackProjects;
    return docs.map(toProjectViewModel);
  } catch (error) {
    console.warn("[sanity] projects query failed, using JSON fallback:", error);
    return fallbackProjects;
  }
}

export async function getProjectBySlug(
  slug: string,
): Promise<ProjectViewModel | null> {
  if (!isSanityConfigured) {
    return fallbackProjects.find((project) => project.slug === slug) ?? null;
  }

  try {
    const doc = await sanityFetch<SanityProjectDoc | null>(
      projectBySlugQuery,
      { slug },
    );
    return (
      (doc ? toProjectViewModel(doc) : null) ??
      fallbackProjects.find((project) => project.slug === slug) ??
      null
    );
  } catch (error) {
    console.warn("[sanity] project query failed, using JSON fallback:", error);
    return fallbackProjects.find((project) => project.slug === slug) ?? null;
  }
}

/** Feeds `generateStaticParams`. */
export async function getProjectSlugs(): Promise<string[]> {
  if (!isSanityConfigured) return fallbackProjects.map((project) => project.slug);

  try {
    const slugs = await sanityFetch<string[]>(projectSlugsQuery);
    return slugs?.length
      ? slugs
      : fallbackProjects.map((project) => project.slug);
  } catch (error) {
    console.warn("[sanity] slug query failed, using JSON fallback:", error);
    return fallbackProjects.map((project) => project.slug);
  }
}

/* -------------------------------------------------------------------------- */
/* Certificates                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Certificates follow the same rule as projects: Sanity wins once it has
 * content, and `public/data/certificates.json` keeps the section usable until
 * the dataset is populated.
 */
export async function getCertificates(): Promise<CertificateViewModel[]> {
  if (!isSanityConfigured) return fallbackCertificates;

  try {
    const docs = await sanityFetch<SanityCertificateDoc[]>(
      certificatesQuery,
    );
    if (!docs?.length) return fallbackCertificates;
    return docs.map(toCertificateViewModel);
  } catch (error) {
    console.warn("[sanity] certificates query failed, using JSON fallback:", error);
    return fallbackCertificates;
  }
}

/* -------------------------------------------------------------------------- */
/* Skills                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Skill groups are editable in Sanity Studio. The JSON file is only a seed for
 * local development and for the first deploy before the dataset is populated.
 */
export async function getSkillGroups(): Promise<SkillGroupViewModel[]> {
  if (!isSanityConfigured) return fallbackSkillGroups;

  try {
    const docs = await sanityFetch<SanitySkillGroupDoc[]>(skillGroupsQuery);
    if (!docs?.length) return fallbackSkillGroups;

    const groups = docs
      .map(toSkillGroupViewModel)
      .filter((group) => group.skills.length > 0);

    return groups.length > 0 ? groups : fallbackSkillGroups;
  } catch (error) {
    console.warn("[sanity] skills query failed, using JSON fallback:", error);
    return fallbackSkillGroups;
  }
}
