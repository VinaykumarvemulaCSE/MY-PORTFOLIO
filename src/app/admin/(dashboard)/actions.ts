"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { ActionState } from "@/lib/action-state";
import { deleteCloudinaryAssets } from "@/lib/cloudinary";
import { isFirebaseAdminConfigured } from "@/lib/firebase/config";
import { requireAdmin } from "@/lib/firebase/session";
import {
  COLLECTIONS,
  deleteDoc,
  readCertificates,
  readProfile,
  readProjects,
  readSkillGroups,
  saveCertificate,
  saveProfile,
  saveProject,
  saveSkillGroup,
} from "@/lib/firebase/store";
import { certificateSchema, profileSchema, projectSchema, skillGroupSchema } from "@/lib/schemas";
import type {
  CertificateViewModel,
  ProfileViewModel,
  ProjectCaseStudy,
  ProjectDemoCredentials,
  ProjectMetric,
  ProjectViewModel,
} from "@/lib/types";

const NOT_CONFIGURED: ActionState = {
  ok: false,
  message: "Firebase is not configured. Add the service account env vars first.",
};

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function lines(formData: FormData, key: string): string[] {
  return text(formData, key)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Keep blank rows so gallery alt text stays aligned with gallery URLs. */
function rawLines(formData: FormData, key: string): string[] {
  const value = formData.get(key);
  return typeof value === "string"
    ? value
        .replace(/\r/g, "")
        .split("\n")
        .map((line) => line.trim())
    : [];
}

function readFocusAreas(formData: FormData): ProfileViewModel["focusAreas"] {
  const areas = lines(formData, "focusAreas")
    .map((line) => {
      const [title, ...rest] = line.split("|");
      return { title: title?.trim() ?? "", description: rest.join("|").trim() };
    })
    .filter((area) => area.title && area.description);
  return areas.length > 0 ? areas : undefined;
}

function commaList(formData: FormData, key: string): string[] {
  return text(formData, key)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function checkbox(formData: FormData, key: string): boolean {
  const value = formData.get(key);
  return value === "on" || value === "true";
}

function optional(value: string): string | undefined {
  return value ? value : undefined;
}

function refreshProfile() {
  // Profile data is used by the shared layout, metadata routes and every page.
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
  revalidatePath("/manifest.webmanifest");
  revalidatePath("/opengraph-image");
}

function refreshProjects(slug?: string) {
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/work/${slug}`);
}

function refreshCertificates(slug?: string) {
  revalidatePath("/");
  revalidatePath("/certificates");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/certificates/${slug}`);
}

function projectImageUrls(project: ProjectViewModel): string[] {
  return [project.coverImage, ...(project.gallery ?? [])].filter((url): url is string => !!url);
}

/**
 * Deletes media that is no longer referenced by any project, certificate or the
 * profile. Checking every document first means a reused image is never removed
 * just because one project stopped using it.
 */
async function cleanupImages(candidates: string[]): Promise<void> {
  if (candidates.length === 0) return;

  try {
    const [projects, certificates, profile] = await Promise.all([
      readProjects(),
      readCertificates(),
      readProfile(),
    ]);

    const referenced = new Set<string>();
    for (const project of projects ?? []) {
      for (const url of projectImageUrls(project)) referenced.add(url);
    }
    for (const certificate of certificates ?? []) {
      if (certificate.image) referenced.add(certificate.image);
    }
    if (profile?.profileImage) referenced.add(profile.profileImage);
    if (profile?.resumeUrl) referenced.add(profile.resumeUrl);

    // If either public collection could not be read, skip deletion rather than
    // risk removing media that is still referenced somewhere.
    if (!projects || !certificates) return;

    await deleteCloudinaryAssets([...new Set(candidates)].filter((url) => !referenced.has(url)));
  } catch (error) {
    console.error("[admin] image cleanup failed", error);
  }
}

function errorMessage(error: unknown): ActionState {
  if (error instanceof z.ZodError) {
    const first = error.issues[0];
    return {
      ok: false,
      message: first ? `${first.path.join(".")}: ${first.message}` : "Invalid data.",
    };
  }
  console.error("[admin] action failed", error);
  return { ok: false, message: "Could not save. Check the server logs." };
}

/* ------------------------------------------------------------------ profile */

export async function saveProfileAction(
  _previous: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  if (!isFirebaseAdminConfigured()) return NOT_CONFIGURED;

  const candidate: ProfileViewModel = {
    name: text(formData, "name"),
    roles: lines(formData, "roles"),
    bio: text(formData, "bio"),
    statusText: text(formData, "statusText"),
    availableForOpportunities: checkbox(formData, "availableForOpportunities"),
    profileImage: text(formData, "profileImage"),
    resumeUrl: text(formData, "resumeUrl"),
    focusAreas: readFocusAreas(formData),
    education: {
      degree: text(formData, "education.degree"),
      institution: text(formData, "education.institution"),
      period: text(formData, "education.period"),
      status: text(formData, "education.status"),
      cgpa: optional(text(formData, "education.cgpa")),
      highlights: lines(formData, "education.highlights"),
    },
    contact: {
      email: text(formData, "contact.email"),
      customEmail: text(formData, "contact.customEmail"),
      phone: text(formData, "contact.phone"),
      location: text(formData, "contact.location"),
    },
    social: {
      github: text(formData, "social.github"),
      linkedin: text(formData, "social.linkedin"),
      whatsapp: text(formData, "social.whatsapp"),
    },
    siteConfig: {
      title: text(formData, "siteConfig.title"),
      description: text(formData, "siteConfig.description"),
      homepageProjectLimit: Math.min(
        20,
        Math.max(1, Math.trunc(Number(text(formData, "siteConfig.homepageProjectLimit")) || 5))
      ),
    },
  };

  try {
    const parsed = profileSchema.parse(candidate);
    const previous = await readProfile();
    await saveProfile(parsed);

    if (previous) {
      const removed = [previous.profileImage, previous.resumeUrl].filter(
        (url) => url !== parsed.profileImage && url !== parsed.resumeUrl
      );
      await cleanupImages(removed);
    }

    refreshProfile();
    return { ok: true, message: "Profile saved." };
  } catch (error) {
    return errorMessage(error);
  }
}

/* ----------------------------------------------------------------- projects */

function readMetrics(formData: FormData): ProjectMetric[] | undefined {
  const metrics = lines(formData, "caseStudy.metrics")
    .map((line) => {
      const [label, ...rest] = line.split("|");
      return { label: label?.trim() ?? "", value: rest.join("|").trim() };
    })
    .filter((metric) => metric.label && metric.value);
  return metrics.length > 0 ? metrics : undefined;
}

function readCaseStudy(formData: FormData): ProjectCaseStudy | undefined {
  const challenges = lines(formData, "caseStudy.challenges");
  const candidate: ProjectCaseStudy = {
    problemTitle: optional(text(formData, "caseStudy.problemTitle")),
    problem: optional(text(formData, "caseStudy.problem")),
    architectureTitle: optional(text(formData, "caseStudy.architectureTitle")),
    architecture: optional(text(formData, "caseStudy.architecture")),
    challengesTitle: optional(text(formData, "caseStudy.challengesTitle")),
    challenges: challenges.length > 0 ? challenges : undefined,
    whatBroke: optional(text(formData, "caseStudy.whatBroke")),
    metrics: readMetrics(formData),
  };
  return Object.values(candidate).some((value) => value !== undefined) ? candidate : undefined;
}

function readDemoCredentials(formData: FormData): ProjectDemoCredentials | undefined {
  const candidate: ProjectDemoCredentials = {
    email: optional(text(formData, "demo.email")),
    password: optional(text(formData, "demo.password")),
    note: optional(text(formData, "demo.note")),
  };
  return Object.values(candidate).some((value) => value !== undefined) ? candidate : undefined;
}

export async function saveProjectAction(
  _previous: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  if (!isFirebaseAdminConfigured()) return NOT_CONFIGURED;

  const slug = text(formData, "slug");
  const originalSlug = text(formData, "originalSlug");
  const candidate: ProjectViewModel = {
    id: text(formData, "id") || `project-${Date.now()}`,
    slug,
    title: text(formData, "title"),
    tagline: optional(text(formData, "tagline")),
    description: text(formData, "description"),
    tech: commaList(formData, "tech"),
    liveLink: optional(text(formData, "liveLink")),
    githubLink: optional(text(formData, "githubLink")),
    status: text(formData, "status"),
    coverImage: optional(text(formData, "coverImage")),
    gallery: lines(formData, "gallery"),
    galleryAlt: (() => {
      const alts = rawLines(formData, "galleryAlt");
      return alts.some(Boolean) ? alts : undefined;
    })(),
    featured: checkbox(formData, "featured"),
    difficulty: optional(text(formData, "difficulty")),
    timeInvestment: optional(text(formData, "timeInvestment")),
    demoCredentials: readDemoCredentials(formData),
    caseStudy: readCaseStudy(formData),
    published: checkbox(formData, "published"),
    order: Math.max(0, Math.trunc(Number(text(formData, "order")) || 0)),
  };

  try {
    const parsed = projectSchema.parse(candidate);
    const existing = (await readProjects()) ?? [];
    if (existing.some((project) => project.slug === parsed.slug && project.slug !== originalSlug)) {
      return { ok: false, message: "A project with that slug already exists." };
    }

    const previous = existing.find((project) => project.slug === originalSlug) ?? null;

    await saveProject(parsed);
    if (originalSlug && originalSlug !== parsed.slug) {
      await deleteDoc(COLLECTIONS.projects, originalSlug);
    }

    if (previous) {
      const currentImages = new Set(projectImageUrls(parsed));
      await cleanupImages(projectImageUrls(previous).filter((url) => !currentImages.has(url)));
    }

    refreshProjects(parsed.slug);
    if (originalSlug && originalSlug !== parsed.slug) revalidatePath(`/work/${originalSlug}`);
    return { ok: true, message: "Project saved." };
  } catch (error) {
    return errorMessage(error);
  }
}

export async function deleteProjectAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const slug = text(formData, "slug");
  if (slug && isFirebaseAdminConfigured()) {
    const projects = await readProjects();
    const target = projects?.find((project) => project.slug === slug) ?? null;

    await deleteDoc(COLLECTIONS.projects, slug);
    if (target) await cleanupImages(projectImageUrls(target));
    refreshProjects(slug);
  }
  revalidatePath("/admin/projects");
}

export async function reorderProjectAction(formData: FormData): Promise<void> {
  await requireAdmin();
  if (!isFirebaseAdminConfigured()) return;

  const slug = text(formData, "slug");
  const direction = text(formData, "direction");
  const projects = (await readProjects()) ?? [];
  const index = projects.findIndex((project) => project.slug === slug);
  const target = index + (direction === "up" ? -1 : 1);

  if (index === -1 || target < 0 || target >= projects.length) return;

  const reordered = [...projects];
  [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
  await Promise.all(
    reordered.map((project, position) =>
      project.order === position + 1 ? null : saveProject({ ...project, order: position + 1 })
    )
  );

  refreshProjects();
  revalidatePath("/admin/projects");
}

/* ------------------------------------------------------------- certificates */

export async function saveCertificateAction(
  _previous: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  if (!isFirebaseAdminConfigured()) return NOT_CONFIGURED;

  const slug = text(formData, "slug");
  const originalSlug = text(formData, "originalSlug");
  const candidate: CertificateViewModel = {
    id: text(formData, "id") || slug,
    slug,
    title: text(formData, "title"),
    issuer: text(formData, "issuer"),
    awardedBy: optional(text(formData, "awardedBy")),
    grade: optional(text(formData, "grade")),
    score: optional(text(formData, "score")),
    duration: optional(text(formData, "duration")),
    term: optional(text(formData, "term")),
    issueDate: optional(text(formData, "issueDate")),
    credentialId: optional(text(formData, "credentialId")),
    verifyUrl: optional(text(formData, "verifyUrl")),
    category: optional(text(formData, "category")),
    summary: optional(text(formData, "summary")),
    skills: commaList(formData, "skills"),
    image: optional(text(formData, "image")),
    featured: checkbox(formData, "featured"),
    published: checkbox(formData, "published"),
    order: Math.max(0, Math.trunc(Number(text(formData, "order")) || 0)),
  };

  try {
    const parsed = certificateSchema.parse(candidate);
    const existing = (await readCertificates()) ?? [];
    if (
      existing.some(
        (certificate) => certificate.slug === parsed.slug && certificate.slug !== originalSlug
      )
    ) {
      return { ok: false, message: "A certificate with that slug already exists." };
    }

    const previous = existing.find((certificate) => certificate.slug === originalSlug) ?? null;

    await saveCertificate(parsed);
    if (originalSlug && originalSlug !== parsed.slug) {
      await deleteDoc(COLLECTIONS.certificates, originalSlug);
    }

    if (previous?.image && previous.image !== parsed.image) {
      await cleanupImages([previous.image]);
    }

    refreshCertificates(parsed.slug);
    if (originalSlug && originalSlug !== parsed.slug) {
      revalidatePath(`/certificates/${originalSlug}`);
    }
    return { ok: true, message: "Certificate saved." };
  } catch (error) {
    return errorMessage(error);
  }
}

export async function deleteCertificateAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const slug = text(formData, "slug");
  if (slug && isFirebaseAdminConfigured()) {
    const certificates = await readCertificates();
    const target = certificates?.find((certificate) => certificate.slug === slug) ?? null;

    await deleteDoc(COLLECTIONS.certificates, slug);
    if (target?.image) await cleanupImages([target.image]);
    refreshCertificates(slug);
  }
  revalidatePath("/admin/certificates");
}

/* -------------------------------------------------------------------- skills */

export async function saveSkillGroupsAction(
  _previous: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  if (!isFirebaseAdminConfigured()) return NOT_CONFIGURED;

  try {
    const raw = text(formData, "groups");
    const groups = z.array(skillGroupSchema).parse(JSON.parse(raw || "[]"));
    if (groups.length === 0) {
      return { ok: false, message: "Add at least one skill group." };
    }

    const existing = (await readSkillGroups()) ?? [];
    const nextIds = new Set(groups.map((group) => group.id));

    await Promise.all(groups.map((group, index) => saveSkillGroup({ ...group, order: index })));
    await Promise.all(
      existing
        .filter((group) => !nextIds.has(group.id))
        .map((group) => deleteDoc(COLLECTIONS.skills, group.id))
    );

    revalidatePath("/");
    return { ok: true, message: "Skills saved." };
  } catch (error) {
    return errorMessage(error);
  }
}
