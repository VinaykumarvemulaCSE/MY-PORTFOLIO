import type { ProfileViewModel } from "@/lib/types";

/**
 * Profile content.
 *
 * This is the single place to edit the hero, about and contact details until the
 * CMS takes over. The CMS will write the same shape, so nothing in the UI has to
 * change when it lands.
 */
export const profile: ProfileViewModel = {
  name: "Vinay Kumar Vemula",
  roles: ["Full Stack Developer", "Computer Science Student", "React & TypeScript Builder"],
  bio: "Computer Science student building full-stack web applications with Next.js, TypeScript, and Firebase. I like understanding how the whole system fits together, from the UI to the data layer.",
  statusText: "Open to Summer 2027 software engineering internships",
  availableForOpportunities: true,

  profileImage: "/profile.png",
  resumeUrl: "/resume.pdf",

  education: {
    degree: "B.Tech in Computer Science & Engineering",
    institution: "Anurag University",
    period: "2025 – 2029 (Expected)",
    status: "In progress",
    highlights: [
      "Coursework: Data Structures & Algorithms, OOP, Database Systems, Computer Networks",
      "Building and shipping full-stack side projects alongside coursework",
    ],
  },

  contact: {
    email: "kumarvinay072007@gmail.com",
    customEmail: "kumarvinay072007@gmail.com",
    phone: "+91 80195 51015",
    location: "Hyderabad, India",
  },

  social: {
    github: "https://github.com/VinaykumarvemulaCSE",
    linkedin: "https://www.linkedin.com/in/vinaykumarvemula",
    whatsapp: "https://wa.me/918019551015",
  },

  siteConfig: {
    title: "Vinay Kumar Vemula | Full Stack Developer",
    description:
      "Computer Science student building full-stack web applications with Next.js, TypeScript and Firebase.",
  },
};
