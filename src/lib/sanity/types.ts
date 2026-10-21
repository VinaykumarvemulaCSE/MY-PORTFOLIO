/**
 * Types for what comes *out of* Sanity, and for the view models the UI
 * consumes.
 *
 * Keeping the two separate matters: the document shape is whatever the Studio
 * schema says, while the view model is what the existing components already
 * expect. `adapters.ts` sits between them, which means swapping the CMS later
 * would not ripple into the UI.
 */

/* -------------------------------------------------------------------------- */
/* Sanity primitives                                                          */
/* -------------------------------------------------------------------------- */

export interface SanityImageAssetRef {
  _ref: string;
  _type?: string;
}

export interface SanityImage {
  _type?: "image";
  asset?: SanityImageAssetRef | null;
  hotspot?: { x: number; y: number; height: number; width: number } | null;
  crop?: { top: number; bottom: number; left: number; right: number } | null;
  alt?: string;
}

export interface SanitySlug {
  _type?: "slug";
  current: string | null;
}

/* -------------------------------------------------------------------------- */
/* Documents                                                                  */
/* -------------------------------------------------------------------------- */

export interface ProjectMetric {
  label?: string;
  value?: string;
}

export interface ProjectDemoCredentials {
  email?: string;
  password?: string;
  note?: string;
}

export interface ProjectCaseStudy {
  problemTitle?: string;
  problem?: string;
  architectureTitle?: string;
  architecture?: string;
  challengesTitle?: string;
  challenges?: string[];
  whatBroke?: string;
  metrics?: ProjectMetric[];
}

export interface SanityProjectDoc {
  _id: string;
  _type: "project";
  title?: string;
  slug?: SanitySlug | null;
  tagline?: string;
  description?: string;
  tech?: string[];
  status?: string;
  featured?: boolean;
  order?: number;
  liveLink?: string;
  githubLink?: string;
  difficulty?: string;
  timeInvestment?: string;
  demoCredentials?: ProjectDemoCredentials | null;
  cover?: SanityImage | null;
  gallery?: (SanityImage | null)[] | null;
  caseStudy?: ProjectCaseStudy | null;
}

export interface SanityEducation {
  degree?: string;
  institution?: string;
  period?: string;
  status?: string;
  highlights?: string[];
}

export interface SanityContact {
  email?: string;
  customEmail?: string;
  phone?: string;
  location?: string;
}

export interface SanitySocial {
  github?: string;
  linkedin?: string;
  whatsapp?: string;
}

export interface SanityProfileDoc {
  _id: string;
  _type: "profile";
  name?: string;
  roles?: string[];
  bio?: string;
  statusText?: string;
  availableForOpportunities?: boolean;
  profileImage?: SanityImage | null;
  resumeFile?: { asset?: { _ref: string; mimeType?: string } | null } | null;
  education?: SanityEducation | null;
  contact?: SanityContact | null;
  social?: SanitySocial | null;
}

export interface SanityCertificateDoc {
  _id: string;
  _type: "certificate";
  title?: string;
  slug?: SanitySlug | null;
  issuer?: string;
  awardedBy?: string;
  grade?: string;
  score?: string;
  duration?: string;
  term?: string;
  issueDate?: string;
  credentialId?: string;
  verifyUrl?: string;
  category?: string;
  summary?: string;
  skills?: string[];
  image?: SanityImage | null;
  featured?: boolean;
  order?: number;
}

export interface SanitySiteSettingsDoc {
  _id: string;
  _type: "siteSettings";
  title?: string;
  description?: string;
  availability?: string;
  availableForOpportunities?: boolean;
}

export interface SanitySkill {
  _key?: string;
  name?: string;
  icon?: string;
  color?: string;
}

export interface SanitySkillGroupDoc {
  _id: string;
  _type: "skillGroup";
  title?: string;
  order?: number;
  skills?: SanitySkill[];
}

/* -------------------------------------------------------------------------- */
/* View models (what components consume)                                      */
/* -------------------------------------------------------------------------- */

export interface ProjectViewModel {
  id: string;
  slug: string;
  title: string;
  /** Short, card-friendly summary. Falls back to `description` in the UI. */
  tagline?: string;
  description: string;
  tech: string[];
  liveLink?: string;
  githubLink?: string;
  status: string;
  coverImage?: string;
  gallery?: string[];
  featured?: boolean;
  difficulty?: string;
  timeInvestment?: string;
  demoCredentials?: ProjectDemoCredentials;
  caseStudy?: ProjectCaseStudy;
}

export interface EducationViewModel {
  degree: string;
  institution: string;
  period: string;
  status: string;
  highlights: string[];
}

export interface ProfileViewModel {
  name: string;
  roles: string[];
  bio: string;
  statusText: string;
  availableForOpportunities: boolean;
  profileImage: string;
  resumeUrl: string;
  education: EducationViewModel;
  contact: Required<SanityContact>;
  social: Required<SanitySocial>;
  siteConfig: { title: string; description: string };
}

export interface SkillViewModel {
  name: string;
  icon?: string;
  color?: string;
}

export interface SkillGroupViewModel {
  id: string;
  title: string;
  skills: SkillViewModel[];
}

export interface CertificateViewModel {
  id: string;
  slug: string;
  title: string;
  issuer: string;
  awardedBy?: string;
  grade?: string;
  score?: string;
  duration?: string;
  term?: string;
  issueDate?: string;
  credentialId?: string;
  verifyUrl?: string;
  category?: string;
  summary?: string;
  skills: string[];
  image?: string;
  featured?: boolean;
}
