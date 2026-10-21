/**
 * The shapes the UI consumes.
 *
 * These are deliberately decoupled from any storage layer: today the data comes
 * from `src/content/*`, later it will come from the CMS. Components only ever
 * see these types, so swapping the source never ripples into the UI.
 */

export interface ProjectMetric {
  label: string;
  value: string;
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
  /** CMS-only flags. Public pages ignore `published`; the content layer filters on it. */
  published?: boolean;
  order?: number;
}

export interface EducationViewModel {
  degree: string;
  institution: string;
  period: string;
  status: string;
  cgpa?: string;
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
  contact: {
    email: string;
    customEmail: string;
    phone: string;
    location: string;
  };
  social: {
    github: string;
    linkedin: string;
    whatsapp: string;
  };
  siteConfig: {
    title: string;
    description: string;
  };
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
  order?: number;
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
  published?: boolean;
  order?: number;
}
