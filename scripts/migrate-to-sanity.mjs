#!/usr/bin/env node
/**
 * Exports the legacy JSON content in `public/data/` to Sanity's NDJSON import
 * format.
 *
 *   node scripts/migrate-to-sanity.mjs
 *   npx sanity dataset import sanity-export/projects.ndjson production
 *
 * Run the image step separately (see `sanity-export/README.md`) — Sanity assets
 * must be uploaded before documents can reference them, so the exported
 * documents intentionally have no `cover`/`gallery` fields. Add images in the
 * Studio once the documents exist.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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
const certificateId = (certificate) => `certificate-${slugify(certificate.title)}`;

const projects = readJson("public/data/projects.json");
const profile = readJson("public/data/profile.json");

let legacyCertificates = [];
try {
  legacyCertificates = readJson("public/data/certificates.json");
} catch {
  // Optional — the file may not exist.
}

mkdirSync(outDir, { recursive: true });

/* --------------------------------- projects -------------------------------- */

const projectDocs = projects.map((project, index) => ({
  _id: projectId(project),
  _type: "project",
  title: project.title,
  slug: { _type: "slug", current: slugify(project.title) },
  tagline: project.description
    ? project.description.split("\n").find((line) => line.trim().length > 40)?.slice(0, 90)
    : undefined,
  description: project.description,
  tech: project.tech ?? [],
  status: project.status ?? "Live",
  live: project.live ?? true,
  liveLink: project.liveLink || undefined,
  githubLink: project.githubLink || undefined,
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
  education: profile.education
    ? {
        degree: profile.education.degree,
        institution: profile.education.institution,
        period: profile.education.period,
        status: profile.education.status,
        highlights: profile.education.highlights ?? [],
      }
    : undefined,
  contact: profile.contact ? { ...profile.contact } : undefined,
  social: profile.social ? { ...profile.social } : undefined,
};

const siteSettingsDoc = {
  _id: "siteSettings",
  _type: "siteSettings",
  title: profile.siteConfig?.title,
  description: profile.siteConfig?.description,
  url: profile.siteConfig?.url,
  availability: profile.statusText,
  availableForOpportunities: profile.availableForOpportunities ?? true,
};

/* ------------------------------- certificates ------------------------------ */

const certificateDocs = legacyCertificates.map((certificate, index) => ({
  _id: certificateId(certificate),
  _type: "certificate",
  title: certificate.title,
  slug: { _type: "slug", current: slugify(certificate.title) },
  issuer: certificate.issuer,
  issueDate: certificate.issueDate ? `${certificate.issueDate}-01-01` : undefined,
  credentialId: certificate.credentialId,
  verifyUrl: certificate.verifyUrl,
  category: certificate.category,
  skills: certificate.skills ?? [],
  order: index,
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

writeFileSync(
  join(outDir, "README.md"),
  `# Sanity import

Generated by \`node scripts/migrate-to-sanity.mjs\`.

## 1. Import the documents

\`\`\`bash
npx sanity dataset import sanity-export/profile.ndjson production --replace
npx sanity dataset import sanity-export/siteSettings.ndjson production --replace
npx sanity dataset import sanity-export/projects.ndjson production
npx sanity dataset import sanity-export/certificates.ndjson production
\`\`\`

## 2. Re-attach media by hand

Documents are exported **without** images. Reasons:

- Sanity image assets must exist before a document can reference them.
- The files currently live in \`public/\`, which is exactly the thing we are
  removing from git.

Upload the screenshots in the Studio (drag and drop into the Cover / Screenshots
fields). Files are then served from \`cdn.sanity.io\` and the \`public/\` copies can
be deleted.

## 3. Check the old certificates

\`public/data/certificates.json\` contains placeholder credential IDs and generic
verify links. Review each one before publishing — publish only what is real.
`,
);

console.log("\nDone. Read sanity-export/README.md for the import commands.");
