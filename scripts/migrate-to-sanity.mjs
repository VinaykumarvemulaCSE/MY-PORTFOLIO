#!/usr/bin/env node
/**
 * Exports the JSON content in `public/data/` to Sanity's NDJSON import format.
 *
 *   node scripts/migrate-to-sanity.mjs
 *   cd studio
 *   npx sanity dataset import ../sanity-export/profile.ndjson production --replace
 *   npx sanity dataset import ../sanity-export/siteSettings.ndjson production --replace
 *   npx sanity dataset import ../sanity-export/projects.ndjson production --replace
 *   npx sanity dataset import ../sanity-export/certificates.ndjson production --replace
 *   npx sanity dataset import ../sanity-export/skills.ndjson production --replace
 *
 * Images and the resume are referenced with `_sanityAsset` and uploaded by the
 * importer itself, so there is no manual re-attach step. Paths must resolve to
 * files inside `public/`.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "sanity-export");

const readJson = (relative) =>
  JSON.parse(readFileSync(join(root, relative), "utf8"));

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);

/** Deterministic ids keep re-runs idempotent (import overwrites by _id). */
const projectId = (project) => `project-${slugify(project.title)}`;
const certificateId = (certificate) =>
  `certificate-${slugify(certificate.title)}`;

/** Turns `/images/foo.jpg` into an absolute file URL, or null if missing. */
function publicFile(publicPath) {
  if (!publicPath || !publicPath.startsWith("/")) return null;
  const absolute = join(root, "public", publicPath.replace(/^\/+/, ""));
  if (!existsSync(absolute)) {
    console.warn(`  ! missing file: ${publicPath}`);
    return null;
  }
  return pathToFileURL(absolute).href;
}

function imageAsset(publicPath, alt) {
  const url = publicFile(publicPath);
  if (!url) return undefined;
  return { _type: "altImage", alt, _sanityAsset: `image@${url}` };
}

function fileAsset(publicPath) {
  const url = publicFile(publicPath);
  if (!url) return undefined;
  return { _type: "file", _sanityAsset: `file@${url}` };
}

const projects = readJson("public/data/projects.json");
const profile = readJson("public/data/profile.json");
const skillGroups = readJson("public/data/skills.json");

let legacyCertificates = [];
try {
  legacyCertificates = readJson("public/data/certificates.json");
} catch {
  // Optional: the file may not exist.
}

mkdirSync(outDir, { recursive: true });

/* --------------------------------- projects -------------------------------- */

const projectDocs = projects.map((project, index) => ({
  _id: projectId(project),
  _type: "project",
  title: project.title,
  slug: { _type: "slug", current: project.slug || slugify(project.title) },
  tagline:
    project.tagline ||
    (project.description
      ? project.description
          .split("\n")
          .find((line) => line.trim().length > 40)
          ?.slice(0, 90)
      : undefined),
  description: project.description,
  tech: project.tech ?? [],
  status: project.status ?? "Live",
  liveLink: project.liveLink || undefined,
  githubLink: project.githubLink || undefined,
  demoCredentials: project.demoCredentials
    ? {
        _type: "demoCredentials",
        email: project.demoCredentials.email || undefined,
        password: project.demoCredentials.password || undefined,
        note: project.demoCredentials.note || undefined,
      }
    : undefined,
  cover: imageAsset(project.coverImage, `${project.title} cover screenshot`),
  gallery: (project.gallery ?? [])
    .map((src, shotIndex) => ({
      _key: `shot-${shotIndex + 1}`,
      ...imageAsset(src, `${project.title} screenshot ${shotIndex + 1}`),
    }))
    .filter((shot) => shot._sanityAsset),
  featured: project.featured ?? false,
  difficulty: project.difficulty || undefined,
  timeInvestment: project.timeInvestment || undefined,
  order: index,
  caseStudy: project.caseStudy
    ? {
        problemTitle: project.caseStudy.problemTitle,
        problem: project.caseStudy.problem,
        architectureTitle: project.caseStudy.architectureTitle,
        architecture: project.caseStudy.architecture,
        challengesTitle: project.caseStudy.challengesTitle,
        challenges: project.caseStudy.challenges ?? [],
        whatBroke: project.caseStudy.whatBroke || undefined,
        metrics: (project.caseStudy.metrics ?? []).map((metric) => ({
          _type: "metric",
          _key: slugify(metric.label),
          label: metric.label,
          value: metric.value,
        })),
      }
    : undefined,
}));

/* --------------------------------- profile --------------------------------- */

const profileDoc = {
  _id: "profile",
  _type: "profile",
  name: profile.name,
  roles: profile.roles ?? [],
  bio: profile.bio,
  statusText: profile.statusText,
  availableForOpportunities: profile.availableForOpportunities ?? true,
  profileImage: imageAsset(
    profile.profileImage,
    `Portrait of ${profile.name ?? "the site owner"}`,
  ),
  resumeFile: fileAsset(profile.resumeUrl),
  education: profile.education
    ? {
        _type: "education",
        degree: profile.education.degree,
        institution: profile.education.institution,
        period: profile.education.period,
        status: profile.education.status,
        highlights: profile.education.highlights ?? [],
      }
    : undefined,
  contact: profile.contact
    ? { _type: "contact", ...profile.contact }
    : undefined,
  social: profile.social ? { _type: "social", ...profile.social } : undefined,
};

const siteSettingsDoc = {
  _id: "siteSettings",
  _type: "siteSettings",
  title: profile.siteConfig?.title,
  description: profile.siteConfig?.description,
  availability: profile.statusText,
  availableForOpportunities: profile.availableForOpportunities ?? true,
};

/* ------------------------------- certificates ------------------------------ */

const certificateDocs = legacyCertificates.map((certificate, index) => ({
  _id: certificateId(certificate),
  _type: "certificate",
  title: certificate.title,
  slug: { _type: "slug", current: certificate.slug || slugify(certificate.title) },
  issuer: certificate.issuer,
  awardedBy: certificate.awardedBy || undefined,
  grade: certificate.grade || undefined,
  score: certificate.score || undefined,
  duration: certificate.duration || undefined,
  term: certificate.term || undefined,
  issueDate: certificate.issueDate || undefined,
  credentialId: certificate.credentialId,
  verifyUrl: certificate.verifyUrl,
  category: certificate.category,
  summary: certificate.summary,
  skills: certificate.skills ?? [],
  image: imageAsset(
    certificate.image,
    `${certificate.title} certificate from ${certificate.issuer}`,
  ),
  featured: certificate.featured ?? false,
  order: index,
}));

/* ---------------------------------- skills --------------------------------- */

const skillGroupDocs = skillGroups.map((group, index) => ({
  _id: `skillGroup-${group.id || slugify(group.title)}`,
  _type: "skillGroup",
  title: group.title,
  order: group.order ?? index,
  skills: (group.skills ?? []).map((skill, skillIndex) => ({
    _key: `skill-${skillIndex + 1}`,
    _type: "skill",
    name: skill.name,
    icon: skill.icon || undefined,
    color: skill.color || undefined,
  })),
}));

/* ---------------------------------- write ---------------------------------- */

const write = (name, docs) => {
  const path = join(outDir, name);
  writeFileSync(path, docs.map((doc) => JSON.stringify(doc)).join("\n") + "\n");
  console.log(`  ${name.padEnd(24)} ${docs.length} document(s)`);
};

console.log("Exporting to sanity-export/");
write("projects.ndjson", projectDocs);
write("profile.ndjson", [profileDoc]);
write("siteSettings.ndjson", [siteSettingsDoc]);
write("certificates.ndjson", certificateDocs);
write("skills.ndjson", skillGroupDocs);

writeFileSync(
  join(outDir, "README.md"),
  `# Sanity import

Generated by \`node scripts/migrate-to-sanity.mjs\`.

## 1. Import the documents

Run these from \`studio/\` so the CLI picks up the project config:

\`\`\`bash
npx sanity dataset import ../sanity-export/profile.ndjson production --replace
npx sanity dataset import ../sanity-export/siteSettings.ndjson production --replace
npx sanity dataset import ../sanity-export/projects.ndjson production --replace
npx sanity dataset import ../sanity-export/certificates.ndjson production --replace
npx sanity dataset import ../sanity-export/skills.ndjson production --replace
\`\`\`

\`--replace\` makes re-runs idempotent: the document with the same \`_id\` is
overwritten instead of failing. Images referenced with \`_sanityAsset\` are
uploaded again, so run this only when the source content actually changed.

## 2. What gets uploaded

Project covers, project screenshots, the certificate image, the profile photo
and the resume PDF are embedded with \`_sanityAsset\` and uploaded by the
importer. The resulting documents reference assets on \`cdn.sanity.io\`.

After verifying the Studio, the copies in \`public/\` can be deleted. Keep
\`public/resume.pdf\` until the profile's \`resumeFile\` asset has been checked.

## 3. Review

- Open the Studio and confirm both projects, the certificate, the profile and
  the four skill groups.
- Fill in the missing college name on the profile before publishing.
- Add demo credentials to a project only if the live demo really accepts them.
`,
);

console.log("\nDone. See sanity-export/README.md for the import commands.");
