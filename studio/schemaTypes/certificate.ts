import { defineField, defineType } from "sanity";

/**
 * Certificates.
 *
 * Two rules shape this schema:
 *
 * 1. `verifyUrl` must point at a page that actually shows the credential. A link
 *    to `coursera.org/verify` with no credential slug is worse than no link at
 *    all — it reads as fabricated to anyone who clicks it.
 * 2. `credentialId` is shown publicly, so it doubles as proof.
 */
export default defineType({
  name: "certificate",
  title: "Certificate",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Course / credential title",
      type: "string",
      description: "Exactly as printed on the certificate.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "issuer",
      title: "Issuer",
      type: "string",
      description: "e.g. NPTEL, Coursera, HackerRank, freeCodeCamp.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "awardedBy",
      title: "Awarding institution",
      type: "string",
      description: "For NPTEL, the IIT that ran the course (e.g. IIT Madras).",
    }),
    defineField({
      name: "grade",
      title: "Grade band",
      type: "string",
      options: {
        list: [
          { title: "Gold", value: "Gold" },
          { title: "Elite + Silver", value: "Elite + Silver" },
          { title: "Elite", value: "Elite" },
          { title: "Completed", value: "Completed" },
          { title: "Participation", value: "Participation" },
        ],
      },
      description: "NPTEL bands: Elite, Elite + Silver, Gold. Leave empty for non-graded certs.",
    }),
    defineField({
      name: "score",
      title: "Score",
      type: "string",
      description: "e.g. “87%” or “92/100”.",
    }),
    defineField({
      name: "duration",
      title: "Duration",
      type: "string",
      description: "e.g. “12 weeks”.",
    }),
    defineField({
      name: "issueDate",
      title: "Issue date",
      type: "date",
      options: { dateFormat: "MMM YYYY" },
    }),
    defineField({
      name: "credentialId",
      title: "Credential / roll number",
      type: "string",
      description: "Printed on the certificate. Shown publicly as proof.",
    }),
    defineField({
      name: "verifyUrl",
      title: "Verification URL",
      type: "url",
      description:
        "The exact archive link that displays this credential. For NPTEL this looks like archive.nptel.ac.in/noc/Ecertificate/?q=…",
      validation: (rule) =>
        rule
          .uri({ scheme: ["https"] })
          .warning("Use the full credential URL, not a generic issuer homepage."),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Computer Science", value: "Computer Science" },
          { title: "Web Development", value: "Web Development" },
          { title: "Data & Algorithms", value: "Data & Algorithms" },
          { title: "Cloud & DevOps", value: "Cloud & DevOps" },
          { title: "Other", value: "Other" },
        ],
      },
    }),
    defineField({
      name: "summary",
      title: "What it covered",
      type: "text",
      rows: 3,
      description: "Two sentences on the syllabus and what you actually learned.",
    }),
    defineField({
      name: "skills",
      title: "Skills covered",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "image",
      title: "Certificate image",
      type: "altImage",
      description: "Render the PDF to PNG so it displays inline as proof.",
    }),
    defineField({
      name: "featured",
      title: "Show on the resume section?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      description: "Lower numbers appear first.",
    }),
  ],
  orderings: [
    {
      title: "Manual order",
      name: "manualOrder",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Newest first",
      name: "newest",
      by: [{ field: "issueDate", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      issuer: "issuer",
      grade: "grade",
      media: "image",
    },
    prepare: ({ title, issuer, grade, media }) => ({
      title,
      subtitle: [issuer, grade].filter(Boolean).join(" · "),
      media,
    }),
  },
});
