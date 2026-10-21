import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * A project case study.
 *
 * The field order is deliberate: it mirrors the order a reader should encounter
 * the story, and it matches the `/work/[slug]` page layout. Problem → what made
 * it hard → architecture → the genuinely difficult part → what broke and how it
 * was fixed → measurable outcome.
 */
export default defineType({
  name: "project",
  title: "Project",
  type: "document",
  groups: [
    { name: "summary", title: "Summary", default: true },
    { name: "caseStudy", title: "Case study" },
    { name: "media", title: "Media" },
    { name: "meta", title: "Meta" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "summary",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "summary",
      options: { source: "title", maxLength: 96 },
      description: "Becomes /work/<slug>. Keep it short and stable.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "summary",
      description: "One line, shown on cards. Max 90 characters.",
      validation: (rule) => rule.max(90).warning("Cards truncate past ~90 characters."),
    }),
    defineField({
      name: "description",
      title: "Full project notes",
      type: "text",
      rows: 5,
      group: "summary",
      description:
        "Optional long-form notes. The work page shows the first paragraph and keeps the rest in a collapsible.",
    }),
    defineField({
      name: "tech",
      title: "Tech stack",
      type: "array",
      of: [{ type: "string" }],
      group: "summary",
      options: { layout: "tags" },
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "summary",
      options: {
        list: [
          { title: "Live", value: "Live" },
          { title: "In progress", value: "In Progress" },
          { title: "Coming soon", value: "Coming Soon" },
          { title: "Archived", value: "Archived" },
        ],
        layout: "radio",
      },
      initialValue: "Live",
    }),
    defineField({
      name: "liveLink",
      title: "Live URL",
      type: "url",
      group: "summary",
      validation: (rule) =>
        rule.uri({ scheme: ["https"] }).warning("Use https — mixed content breaks the page."),
    }),
    defineField({
      name: "githubLink",
      title: "Repository URL",
      type: "url",
      group: "summary",
    }),
    defineField({
      name: "demoCredentials",
      title: "Demo access (optional)",
      type: "object",
      group: "summary",
      description:
        "Only fill this in if the live demo actually works with these credentials. Never publish an invented login.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "email", title: "Demo email / username", type: "string" }),
        defineField({ name: "password", title: "Demo password", type: "string" }),
        defineField({
          name: "note",
          title: "Note",
          type: "string",
          description: "e.g. “Recruiter demo account — read-only”.",
        }),
      ],
    }),

    /* ---------------------------- Case study ---------------------------- */
    defineField({
      name: "caseStudy",
      title: "Case study",
      type: "object",
      group: "caseStudy",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "problemTitle", title: "Problem heading", type: "string" }),
        defineField({ name: "problem", title: "Problem", type: "text", rows: 5 }),
        defineField({
          name: "architectureTitle",
          title: "Architecture heading",
          type: "string",
        }),
        defineField({ name: "architecture", title: "Architecture", type: "text", rows: 6 }),
        defineField({
          name: "challengesTitle",
          title: "Challenges heading",
          type: "string",
        }),
        defineField({
          name: "challenges",
          title: "Hardest problems",
          type: "array",
          of: [{ type: "string" }],
          description:
            "Name the actual hard thing, not a feature. “Race condition on concurrent accept” beats “real-time sync”.",
        }),
        defineField({
          name: "whatBroke",
          title: "What broke, and how you fixed it",
          type: "text",
          rows: 5,
          description:
            "The most senior-looking field on the page. One real bug, its cause, and the fix.",
        }),
        defineField({
          name: "metrics",
          title: "Metrics",
          type: "array",
          of: [defineArrayMember({ type: "metric" })],
          description: "Verifiable numbers only.",
        }),
      ],
    }),

    /* ------------------------------ Media ------------------------------ */
    defineField({
      name: "cover",
      title: "Cover image",
      type: "altImage",
      group: "media",
    }),
    defineField({
      name: "gallery",
      title: "Screenshots",
      type: "array",
      group: "media",
      of: [defineArrayMember({ type: "altImage" })],
      options: { layout: "grid" },
    }),

    /* ------------------------------- Meta ------------------------------ */
    defineField({
      name: "featured",
      title: "Featured on the home page?",
      type: "boolean",
      group: "meta",
      initialValue: false,
    }),
    defineField({
      name: "difficulty",
      title: "Difficulty",
      type: "string",
      group: "meta",
      description: "Free text shown as a badge, e.g. “Full Stack System”.",
    }),
    defineField({
      name: "timeInvestment",
      title: "Time investment",
      type: "string",
      group: "meta",
      description: "e.g. “6 weeks”.",
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      group: "meta",
      description: "Lower numbers appear first. Leave empty to sort by date.",
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
      by: [{ field: "_createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "tagline",
      media: "cover",
      status: "status",
    },
    prepare: ({ title, subtitle, media, status }) => ({
      title,
      subtitle: [status, subtitle].filter(Boolean).join(" · "),
      media,
    }),
  },
});
