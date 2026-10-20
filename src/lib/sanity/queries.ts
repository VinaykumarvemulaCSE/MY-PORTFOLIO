/**
 * GROQ queries.
 *
 * Kept in one file so the exact projection is reviewable in a single diff. Each
 * query asks only for the fields the UI renders — no over-fetching, and adding a
 * field is a deliberate edit here.
 */

const PROJECT_FIELDS = /* groq */ `
  _id,
  _type,
  title,
  slug,
  tagline,
  description,
  tech,
  status,
  featured,
  order,
  live,
  liveLink,
  githubLink,
  difficulty,
  timeInvestment,
  cover,
  gallery,
  caseStudy{
    problemTitle,
    problem,
    architectureTitle,
    architecture,
    challengesTitle,
    challenges,
    metrics[]{ label, value }
  }
`;

export const projectsQuery = /* groq */ `
  *[_type == "project" && defined(slug.current)]
  | order(coalesce(order, 9999) asc, _createdAt desc)
  { ${PROJECT_FIELDS} }
`;

export const projectBySlugQuery = /* groq */ `
  *[_type == "project" && slug.current == $slug][0]
  { ${PROJECT_FIELDS} }
`;

export const profileQuery = /* groq */ `
  *[_type == "profile"] | order(_updatedAt desc) [0] {
    _id,
    _type,
    name,
    roles,
    bio,
    statusText,
    availableForOpportunities,
    profileImage,
    resumeFile,
    education{
      degree,
      institution,
      period,
      status,
      highlights
    },
    contact{
      email,
      customEmail,
      phone,
      location
    },
    social{
      github,
      linkedin,
      whatsapp
    }
  }
`;

export const certificatesQuery = /* groq */ `
  *[_type == "certificate" && defined(slug.current)]
  | order(coalesce(order, 9999) asc, issueDate desc)
  {
    _id,
    _type,
    title,
    slug,
    issuer,
    awardedBy,
    grade,
    score,
    duration,
    issueDate,
    credentialId,
    verifyUrl,
    category,
    summary,
    skills,
    image,
    featured,
    order
  }
`;

export const certificateBySlugQuery = /* groq */ `
  *[_type == "certificate" && slug.current == $slug][0]
  {
    _id,
    _type,
    title,
    slug,
    issuer,
    awardedBy,
    grade,
    score,
    duration,
    issueDate,
    credentialId,
    verifyUrl,
    category,
    summary,
    skills,
    image,
    featured,
    order
  }
`;

export const siteSettingsQuery = /* groq */ `
  *[_type == "siteSettings"][0] {
    _id,
    _type,
    title,
    description,
    url,
    availability,
    availableForOpportunities
  }
`;

/** Used by `generateStaticParams` so every project gets its own static page. */
export const projectSlugsQuery = /* groq */ `
  *[_type == "project" && defined(slug.current)][].slug.current
`;

export const certificateSlugsQuery = /* groq */ `
  *[_type == "certificate" && defined(slug.current)][].slug.current
`;
