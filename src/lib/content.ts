import { certificates } from "@/content/certificates";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { skillGroups } from "@/content/skills";
import type {
  CertificateViewModel,
  ProfileViewModel,
  ProjectViewModel,
  SkillGroupViewModel,
} from "@/lib/types";

/**
 * Data access for the public site.
 *
 * Every function is async on purpose. Today they resolve static content, but the
 * custom CMS will replace the bodies with database reads. Keeping the signature
 * identical means no component has to change when that happens.
 */

export async function getProfile(): Promise<ProfileViewModel> {
  return profile;
}

export async function getSiteSettings(): Promise<{
  title: string;
  description: string;
}> {
  return profile.siteConfig;
}

export async function getProjects(): Promise<ProjectViewModel[]> {
  return projects;
}

export async function getProjectBySlug(slug: string): Promise<ProjectViewModel | null> {
  return projects.find((project) => project.slug === slug) ?? null;
}

export async function getProjectSlugs(): Promise<string[]> {
  return projects.map((project) => project.slug);
}

export async function getCertificates(): Promise<CertificateViewModel[]> {
  return certificates;
}

export async function getCertificateBySlug(slug: string): Promise<CertificateViewModel | null> {
  return certificates.find((certificate) => certificate.slug === slug) ?? null;
}

export async function getCertificateSlugs(): Promise<string[]> {
  return certificates.map((certificate) => certificate.slug);
}

export async function getSkillGroups(): Promise<SkillGroupViewModel[]> {
  return skillGroups;
}
