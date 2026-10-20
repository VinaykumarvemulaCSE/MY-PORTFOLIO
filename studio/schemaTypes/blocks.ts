import { defineField, defineType } from "sanity";

/**
 * Reusable field groups.
 *
 * `altImage` always carries alt text. Accessibility is a hard requirement on the
 * site, and a caption-less screenshot is useless to a screen reader (and to
 * search engines).
 */
export const altImage = defineType({
  name: "altImage",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description:
        "Describe what the image shows, e.g. “Admin dashboard showing the live order queue”.",
      validation: (rule) =>
        rule.required().min(8).warning("Alt text helps accessibility and SEO."),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Optional. Shown under the image in the gallery.",
    }),
  ],
});

export const metric = defineType({
  name: "metric",
  title: "Metric",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "value",
      title: "Value",
      type: "string",
      description: "Keep it verifiable — “< 250 ms”, “1,400 lines”, “Gold”.",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "value" },
  },
});

export const education = defineType({
  name: "education",
  title: "Education",
  type: "object",
  fields: [
    defineField({ name: "degree", title: "Degree", type: "string" }),
    defineField({
      name: "institution",
      title: "Institution",
      type: "string",
      description: "Use the real name of your college — no placeholders.",
    }),
    defineField({
      name: "period",
      title: "Period",
      type: "string",
      description: "e.g. 2025 – 2029",
    }),
    defineField({ name: "status", title: "Status", type: "string" }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
});

export const contact = defineType({
  name: "contact",
  title: "Contact",
  type: "object",
  fields: [
    defineField({ name: "email", title: "Private email", type: "string" }),
    defineField({
      name: "customEmail",
      title: "Public email",
      type: "string",
      description:
        "Only use an address that actually receives mail — this is what visitors will click.",
      validation: (rule) => rule.email().warning("Check this address receives mail."),
    }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "location", title: "Location", type: "string" }),
  ],
});

export const social = defineType({
  name: "social",
  title: "Social links",
  type: "object",
  fields: [
    defineField({ name: "github", title: "GitHub URL", type: "url" }),
    defineField({ name: "linkedin", title: "LinkedIn URL", type: "url" }),
    defineField({ name: "whatsapp", title: "WhatsApp URL", type: "url" }),
  ],
});

export default [altImage, metric, education, contact, social];
