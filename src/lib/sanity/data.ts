import projectsFallback from "../../../public/data/projects.json";

import {
  toCertificateViewModel,
  toProfileViewModel,
  toProjectViewModel,
} from "./adapters";
import { sanityFetch } from "./client";
import { profileDefaults } from "./defaults";
import { isSanityConfigured } from "./env";
import {
  certificateBySlugQuery,
  certificateSlugsQuery,
  certificatesQuery,
  profileQuery,
  projectBySlugQuery,
  projectSlugsQuery,
  projectsQuery,
} from "./queries";
import type {
  CertificateViewModel,
  ProfileViewModel,
  ProjectViewModel,
  SanityCertificateDoc,
  SanityProfileDoc,
  SanityProjectDoc,
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
  description?: string;
  tech?: string[];
  live?: boolean;
  liveLink?: string;
  githubLink?: string;
  status?: string;
  coverImage?: string;
  gallery?: string[];
  featured?: boolean;
  difficulty?: string;
  timeInvestment?: string;
  caseStudy?: ProjectViewModel["caseStudy"];
}

function normalizeLegacyProject(project: LegacyProject): ProjectViewModel {
  return {
    id: project.id,
    // Legacy JSON has no slug; the id is stable and already unique.
    slug: project.id,
    title: project.title ?? "Untitled project",
    description: project.description ?? "",
    tech: project.tech ?? [],
    live: project.live ?? false,
    liveLink: project.liveLink || undefined,
    githubLink: project.githubLink || undefined,
    status: project.status ?? "Live",
    coverImage: project.coverImage || undefined,
    gallery: project.gallery ?? [],
    featured: project.featured ?? false,
    difficulty: project.difficulty || undefined,
    timeInvestment: project.timeInvestment || undefined,
    caseStudy: project.caseStudy,
  };
}

export const fallbackProjects = (projectsFallback as unknown as LegacyProject[]).map(
  normalizeLegacyProject,
);

/* -------------------------------------------------------------------------- */
/* Profile                                                                    */
/* -------------------------------------------------------------------------- */

export async function getProfile(): Promise<ProfileViewModel> {
  if (!isSanityConfigured) return toProfileViewModel(null, fallbackProfile);

  try {
    const doc = await sanityFetch<SanityProfileDoc | null>(profileQuery);
    return toProfileViewModel(doc, fallbackProfile);
  } catch (error) {
    console.warn("[sanity] profile query failed, using JSON fallback:", error);
    return toProfileViewModel(null, fallbackProfile);
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
    return doc ? toProjectViewModel(doc) : null;
  } catch (error) {
    console.warn("[sanity] project query failed, using JSON fallback:", error);
    return fallbackProjects.find((project) => project.slug === slug) ?? null;
  }
}

/** Feeds `generateStaticParams`. */
export async function getProjectSlugs(): Promise<string[]> {
  if (!isSanityConfigured) return fallbackProjects.map((project) => project.slug);

  try {
    return await sanityFetch<string[]>(projectSlugsQuery);
  } catch (error) {
    console.warn("[sanity] slug query failed, using JSON fallback:", error);
    return fallbackProjects.map((project) => project.slug);
  }
}

/* -------------------------------------------------------------------------- */
/* Certificates                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Certificates have no JSON counterpart yet. While the CMS is being filled in
 * this simply returns an empty list, which lets the page render a real empty
 * state instead of crashing.
 */
export async function getCertificates(): Promise<CertificateViewModel[]> {
  if (!isSanityConfigured) return [];

  try {
    const docs = await sanityFetch<SanityCertificateDoc[]>(
      certificatesQuery,
    );
    return (docs ?? []).map(toCertificateViewModel);
  } catch (error) {
    console.warn("[sanity] certificates query failed:", error);
    return [];
  }
}

export async function getCertificateBySlug(
  slug: string,
): Promise<CertificateViewModel | null> {
  if (!isSanityConfigured) return null;

  try {
    const doc = await sanityFetch<SanityCertificateDoc | null>(
      certificateBySlugQuery,
      { slug },
    );
    return doc ? toCertificateViewModel(doc) : null;
  } catch (error) {
    console.warn("[sanity] certificate query failed:", error);
    return null;
  }
}

export async function getCertificateSlugs(): Promise<string[]> {
  if (!isSanityConfigured) return [];

  try {
    return await sanityFetch<string[]>(certificateSlugsQuery);
  } catch {
    return [];
  }
}
