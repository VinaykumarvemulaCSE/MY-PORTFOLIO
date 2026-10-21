import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * A group of technologies shown in the Tech Stack section.
 *
 * Groups and their items are regular documents, so adding, removing or
 * reordering a skill never requires a redeploy. The icon is optional: when it
 * is empty the site tries to match the skill name against its icon map, and
 * falls back to a generic code icon.
 */
export default defineType({
  name: "skillGroup",
  title: "Skill group",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Group title",
      type: "string",
      description: 'e.g. "Frontend", "Backend & Data", "CS Fundamentals".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      description: "Lower numbers appear first.",
      initialValue: 0,
    }),
    defineField({
      name: "skills",
      title: "Skills",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "skill",
          title: "Skill",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "icon",
              title: "Icon key (optional)",
              type: "string",
              description:
                'Optional key from the site icon map, e.g. "React", "Node.js", "SQL". Leave blank to match the name automatically.',
            }),
            defineField({
              name: "color",
              title: "Colour override (optional)",
              type: "string",
              description: 'Optional hex colour, e.g. "#61DAFB".',
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "icon" },
          },
        }),
      ],
      validation: (rule) => rule.min(1).warning("Add at least one skill."),
    }),
  ],
  orderings: [
    {
      title: "Manual order",
      name: "manualOrder",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", skills: "skills" },
    prepare: ({ title, skills }) => ({
      title,
      subtitle: `${skills?.length ?? 0} skill${skills?.length === 1 ? "" : "s"}`,
    }),
  },
});
