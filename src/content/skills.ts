import type { SkillGroupViewModel } from "@/lib/types";

/**
 * Skill groups. Reorder by moving entries; the array order is the render order.
 */
export const skillGroups: SkillGroupViewModel[] = [
  {
    id: "frontend",
    title: "Frontend",
    skills: [
      {
        name: "HTML5",
        icon: "HTML",
      },
      {
        name: "CSS3",
        icon: "CSS",
      },
      {
        name: "JavaScript",
        icon: "Javascript",
      },
      {
        name: "TypeScript",
        icon: "TypeScript",
      },
      {
        name: "React",
        icon: "React",
      },
      {
        name: "Next.js",
        icon: "Next.js",
      },
      {
        name: "Tailwind CSS",
        icon: "Tailwind",
      },
    ],
  },
  {
    id: "backend",
    title: "Backend & Data",
    skills: [
      {
        name: "Node.js",
        icon: "Node.js",
      },
      {
        name: "Express",
        icon: "Express",
      },
      {
        name: "REST APIs",
        icon: "REST APIs",
      },
      {
        name: "Firebase",
        icon: "Firebase",
      },
      {
        name: "SQL",
        icon: "SQL",
      },
      {
        name: "MongoDB",
        icon: "MongoDB",
      },
    ],
  },
  {
    id: "tools",
    title: "Tools",
    skills: [
      {
        name: "Git",
        icon: "Git",
      },
      {
        name: "GitHub",
        icon: "GitHub",
      },
      {
        name: "Vercel",
        icon: "Vercel",
      },
      {
        name: "Postman",
        icon: "Postman",
      },
    ],
  },
  {
    id: "cs-fundamentals",
    title: "CS Fundamentals",
    skills: [
      {
        name: "Data Structures & Algorithms",
        icon: "DSA",
      },
      {
        name: "Object-Oriented Programming",
        icon: "OOP",
      },
      {
        name: "Database Management",
        icon: "DBMS",
      },
      {
        name: "Operating Systems",
        icon: "OS",
      },
    ],
  },
];
