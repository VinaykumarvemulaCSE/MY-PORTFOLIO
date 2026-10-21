import { sanityDataset, sanityProjectId } from "./env";
import { urlForImageAt } from "./image";
import type {
  CertificateViewModel,
  ProfileViewModel,
  ProjectViewModel,
  SanityCertificateDoc,
  SanityImage,
  SanityProfileDoc,
  SanityProjectDoc,
  SanitySkillGroupDoc,
  SkillGroupViewModel,
} from "./types";

/**
 * Turns a Sanity image reference into a URL. `width` keeps the CDN honest —
 * without it we would ship full-size camera uploads to phones.
 */
function imageUrl(
  source: SanityImage | null | undefined,
  width: number,
): string | undefined {
  return urlForImageAt(source, width) ?? undefined;
}

/**
 * Sanity stores file assets as a reference like `file-<hash>-<ext>`. The public
 * URL is deterministic, so we build it rather than adding a separate resolver
 * dependency.
 */
export function fileUrl(
  ref: string | null | undefined,
  download?: string,
): string | undefined {
  if (!ref) return undefined;
  const slash = ref.indexOf("-");
  if (slash === -1) return undefined;

  const build = `https://cdn.sanity.io/files/${sanityProjectId}/${sanityDataset}/${ref.slice(
    slash + 1,
  )}`;

  return download ? `${build}?dl=${encodeURIComponent(download)}` : build;
}

export function toProjectViewModel(doc: SanityProjectDoc): ProjectViewModel {
  const gallery = (doc.gallery ?? [])
    .map((image) => imageUrl(image, 1600))
    .filter((url): url is string => Boolean(url));

  return {
    id: doc._id,
    slug: doc.slug?.current ?? doc._id,
    title: doc.title ?? "Untitled project",
    tagline: doc.tagline || undefined,
    description: doc.description ?? doc.tagline ?? "",
    tech: doc.tech ?? [],
    liveLink: doc.liveLink || undefined,
    githubLink: doc.githubLink || undefined,
    status: doc.status ?? "Live",
    coverImage: imageUrl(doc.cover, 1200),
    gallery,
    featured: doc.featured ?? false,
    difficulty: doc.difficulty || undefined,
    timeInvestment: doc.timeInvestment || undefined,
    demoCredentials:
      doc.demoCredentials?.email || doc.demoCredentials?.password
        ? {
            email: doc.demoCredentials.email || undefined,
            password: doc.demoCredentials.password || undefined,
            note: doc.demoCredentials.note || undefined,
          }
        : undefined,
    caseStudy: doc.caseStudy
      ? {
          ...doc.caseStudy,
          metrics: (doc.caseStudy.metrics ?? []).filter(
            (metric) => metric?.label && metric?.value,
          ),
        }
      : undefined,
  };
}

/**
 * The profile document is merged over the JSON defaults so an incomplete Studio
 * entry never blanks out the site.
 */
export function toProfileViewModel(
  doc: SanityProfileDoc | null,
  defaults: ProfileViewModel,
): ProfileViewModel {
  if (!doc) return defaults;

  const resumeUrl =
    fileUrl(doc.resumeFile?.asset?._ref, "Vinay-Kumar-Vemula-Resume.pdf") ??
    defaults.resumeUrl;

  return {
    name: doc.name || defaults.name,
    roles: doc.roles?.length ? doc.roles : defaults.roles,
    bio: doc.bio || defaults.bio,
    statusText: doc.statusText || defaults.statusText,
    availableForOpportunities:
      doc.availableForOpportunities ?? defaults.availableForOpportunities,
    profileImage: imageUrl(doc.profileImage, 800) ?? defaults.profileImage,
    resumeUrl,
    education: {
      degree: doc.education?.degree || defaults.education.degree,
      institution: doc.education?.institution || defaults.education.institution,
      period: doc.education?.period || defaults.education.period,
      status: doc.education?.status || defaults.education.status,
      highlights: doc.education?.highlights?.length
        ? doc.education.highlights
        : defaults.education.highlights,
    },
    contact: {
      email: doc.contact?.email || defaults.contact.email,
      customEmail: doc.contact?.customEmail || defaults.contact.customEmail,
      phone: doc.contact?.phone || defaults.contact.phone,
      location: doc.contact?.location || defaults.contact.location,
    },
    social: {
      github: doc.social?.github || defaults.social.github,
      linkedin: doc.social?.linkedin || defaults.social.linkedin,
      whatsapp: doc.social?.whatsapp || defaults.social.whatsapp,
    },
    siteConfig: defaults.siteConfig,
  };
}

export function toCertificateViewModel(
  doc: SanityCertificateDoc,
): CertificateViewModel {  return {
    id: doc._id,
    slug: doc.slug?.current ?? doc._id,
    title: doc.title ?? "Untitled certificate",
    issuer: doc.issuer ?? "",
    awardedBy: doc.awardedBy || undefined,
    grade: doc.grade || undefined,
    score: doc.score || undefined,
    duration: doc.duration || undefined,
    term: doc.term || undefined,
    issueDate: doc.issueDate || undefined,
    credentialId: doc.credentialId || undefined,
    verifyUrl: doc.verifyUrl || undefined,
    category: doc.category || undefined,
    summary: doc.summary || undefined,
    skills: doc.skills ?? [],
    image: imageUrl(doc.image, 1600),
    featured: doc.featured ?? false,
  };
}

export function toSkillGroupViewModel(
  doc: SanitySkillGroupDoc,
): SkillGroupViewModel {
  return {
    id: doc._id,
    title: doc.title ?? "Skills",
    skills: (doc.skills ?? [])
      .filter((skill) => Boolean(skill?.name?.trim()))
      .map((skill) => ({
        name: skill.name!.trim(),
        icon: skill.icon?.trim() || undefined,
        color: skill.color?.trim() || undefined,
      })),
  };
}
