import { defineField, defineType } from "sanity";

/**
 * Singleton — exactly one document, always `_id: "profile"`.
 *
 * Every field here is optional because the site merges the document over the
 * JSON defaults in `public/data/profile.json`. An empty field therefore never
 * blanks out the live page.
 */
export default defineType({
  name: "profile",
  title: "Profile",
  type: "document",
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "education", title: "Education" },
    { name: "contact", title: "Contact" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Full name",
      type: "string",
      group: "identity",
    }),
    defineField({
      name: "roles",
      title: "Roles",
      type: "array",
      of: [{ type: "string" }],
      group: "identity",
      description:
        "First entry is the headline. Say what you actually build — “Full Stack Developer”, “Computer Science Student”, “React & TypeScript Builder”.",
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 6,
      group: "identity",
      description: "Write it in your own voice. Concrete beats passionate.",
    }),
    defineField({
      name: "statusText",
      title: "Availability text",
      type: "string",
      group: "identity",
      description: "e.g. “Open to Summer 2027 SDE internships” — be specific.",
    }),
    defineField({
      name: "availableForOpportunities",
      title: "Show the available badge?",
      type: "boolean",
      group: "identity",
      initialValue: true,
    }),
    defineField({
      name: "profileImage",
      title: "Profile photo",
      type: "altImage",
      group: "identity",
    }),
    defineField({
      name: "resumeFile",
      title: "Resume (PDF)",
      type: "file",
      group: "identity",
      options: { accept: "application/pdf" },
      description:
        "Stored on Sanity's CDN, so the file name is case-safe and always up to date.",
    }),

    defineField({
      name: "education",
      title: "Education",
      type: "education",
      group: "education",
    }),

    defineField({ name: "contact", title: "Contact", type: "contact", group: "contact" }),
    defineField({ name: "social", title: "Social", type: "social", group: "contact" }),
  ],
  preview: {
    select: { title: "name", subtitle: "statusText", media: "profileImage" },
  },
});
