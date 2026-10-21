import { z } from "zod";

/**
 * Validation for everything the CMS writes. Firestore documents are stored in
 * exactly the shape of the view models in `@/lib/types`, plus `published` and
 * `order`, which only the content layer and admin UI care about.
 */

const optionalText = z.string().trim().optional();
const optionalUrl = z.union([z.literal(""), z.url()]).optional();

export const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens");

export const projectMetricSchema = z.object({
  label: z.string().trim().min(1),
  value: z.string().trim().min(1),
});

export const projectDemoCredentialsSchema = z.object({
  email: optionalText,
  password: optionalText,
  note: optionalText,
});

export const projectCaseStudySchema = z.object({
  problemTitle: optionalText,
  problem: optionalText,
  architectureTitle: optionalText,
  architecture: optionalText,
  challengesTitle: optionalText,
  challenges: z.array(z.string().trim().min(1)).optional(),
  whatBroke: optionalText,
  metrics: z.array(projectMetricSchema).optional(),
});

export const projectSchema = z.object({
  id: z.string().trim().min(1),
  slug: slugSchema,
  title: z.string().trim().min(1, "Title is required"),
  tagline: optionalText,
  description: z.string().trim().min(1, "Description is required"),
  tech: z.array(z.string().trim().min(1)),
  liveLink: optionalUrl,
  githubLink: optionalUrl,
  status: z.string().trim().min(1),
  coverImage: optionalText,
  gallery: z.array(z.string().trim().min(1)).optional(),
  featured: z.boolean().optional(),
  difficulty: optionalText,
  timeInvestment: optionalText,
  demoCredentials: projectDemoCredentialsSchema.optional(),
  caseStudy: projectCaseStudySchema.optional(),
  published: z.boolean().optional(),
  order: z.number().optional(),
});

export const educationSchema = z.object({
  degree: z.string().trim().min(1),
  institution: z.string().trim().min(1),
  period: z.string().trim().min(1),
  status: z.string().trim().min(1),
  cgpa: optionalText,
  highlights: z.array(z.string().trim().min(1)),
});

export const profileSchema = z.object({
  name: z.string().trim().min(1),
  roles: z.array(z.string().trim().min(1)).min(1),
  bio: z.string().trim().min(1),
  statusText: z.string().trim().min(1),
  availableForOpportunities: z.boolean(),
  profileImage: z.string().trim().min(1),
  resumeUrl: z.string().trim().min(1),
  education: educationSchema,
  contact: z.object({
    email: z.email(),
    customEmail: z.email(),
    phone: z.string().trim().min(1),
    location: z.string().trim().min(1),
  }),
  social: z.object({
    github: z.url(),
    linkedin: z.url(),
    whatsapp: z.url(),
  }),
  siteConfig: z.object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
  }),
});

export const skillSchema = z.object({
  name: z.string().trim().min(1),
  icon: optionalText,
  color: optionalText,
});

export const skillGroupSchema = z.object({
  id: slugSchema,
  title: z.string().trim().min(1),
  skills: z.array(skillSchema).min(1),
  order: z.number().optional(),
});

export const certificateSchema = z.object({
  id: z.string().trim().min(1),
  slug: slugSchema,
  title: z.string().trim().min(1),
  issuer: z.string().trim().min(1),
  awardedBy: optionalText,
  grade: optionalText,
  score: optionalText,
  duration: optionalText,
  term: optionalText,
  issueDate: optionalText,
  credentialId: optionalText,
  verifyUrl: optionalUrl,
  category: optionalText,
  summary: optionalText,
  skills: z.array(z.string().trim().min(1)),
  image: optionalText,
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  order: z.number().optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type SkillGroupInput = z.infer<typeof skillGroupSchema>;
export type CertificateInput = z.infer<typeof certificateSchema>;
