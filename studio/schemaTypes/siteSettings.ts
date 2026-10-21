import { defineField, defineType } from "sanity";

/**
 * Singleton — always `_id: "siteSettings"`.
 *
 * Anything that should be editable without touching code or redeploying: SEO
 * metadata and the availability banner. The canonical origin lives in the
 * deployment environment (`NEXT_PUBLIC_SITE_URL`), not in the CMS.
 */
export default defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "SEO title",
      type: "string",
      description: "Shown in the browser tab and search results.",
      validation: (rule) => rule.max(60).warning("Search results truncate past ~60 characters."),
    }),
    defineField({
      name: "description",
      title: "SEO description",
      type: "text",
      rows: 3,
      validation: (rule) =>
        rule.max(160).warning("Search results truncate past ~160 characters."),
    }),
    defineField({
      name: "availability",
      title: "Availability line",
      type: "string",
      description: "e.g. “Open to Summer 2027 SDE internships · Hyderabad / Remote”.",
    }),
    defineField({
      name: "availableForOpportunities",
      title: "Available for opportunities?",
      type: "boolean",
      initialValue: true,
    }),
  ],
});
