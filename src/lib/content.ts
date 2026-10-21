import { cache } from "react";

import { readCertificates, readProfile, readProjects, readSkillGroups } from "@/lib/firebase/store";
import type {
  CertificateViewModel,
  ProfileViewModel,
  ProjectViewModel,
  SkillGroupViewModel,
} from "@/lib/types";

/**
 * Public data access.
 *
 * Firestore is the only source of truth — there is no hardcoded content to fall
 * back to. Reads are wrapped in React `cache()` so a layout and a page in the
 * same request don't hit Firestore twice. Pages handle `null`/empty results with
 * an empty state, which is what you see before anything is published.
 */

function publishedOnly<T extends { published?: boolean }>(items: T[]): T[] {
  return items.filter((item) => item.published !== false);
}

export const getProfile = cache(async (): Promise<ProfileViewModel | null> => {
  return readProfile();
});

export async function getSiteSettings(): Promise<{
  title: string;
  description: string;
} | null> {
  const profile = await getProfile();
  return profile?.siteConfig ?? null;
}

export const getProjects = cache(async (): Promise<ProjectViewModel[]> => {
  return publishedOnly((await readProjects()) ?? []);
});

export async function getProjectBySlug(slug: string): Promise<ProjectViewModel | null> {
  const all = await getProjects();
  return all.find((project) => project.slug === slug) ?? null;
}

export async function getProjectSlugs(): Promise<string[]> {
  return (await getProjects()).map((project) => project.slug);
}

export const getCertificates = cache(async (): Promise<CertificateViewModel[]> => {
  return publishedOnly((await readCertificates()) ?? []);
});

export async function getCertificateBySlug(slug: string): Promise<CertificateViewModel | null> {
  const all = await getCertificates();
  return all.find((certificate) => certificate.slug === slug) ?? null;
}

export async function getCertificateSlugs(): Promise<string[]> {
  return (await getCertificates()).map((certificate) => certificate.slug);
}

export const getSkillGroups = cache(async (): Promise<SkillGroupViewModel[]> => {
  return (await readSkillGroups()) ?? [];
});
