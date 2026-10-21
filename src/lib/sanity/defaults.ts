import profileJson from "../../../public/data/profile.json";

import type { ProfileViewModel } from "./types";

/**
 * The complete profile used whenever Sanity has nothing to say — either because
 * it is not configured yet, or because a field was left empty in the Studio.
 *
 * `public/data/profile.json` only holds the fields the old JSON-driven UI needed.
 * The components also read contact, social, education and resume details, so
 * those live here as explicit defaults instead of being scattered across
 * `|| "..."` fallbacks in a dozen components.
 */
export const profileDefaults: ProfileViewModel = {
  name: profileJson.name ?? "Vinay Kumar Vemula",
  roles: profileJson.roles ?? [],
  bio: profileJson.bio ?? "",

  // Be specific. "Open to work" tells a recruiter nothing they can act on.
  statusText: "Open to Summer 2027 software engineering internships",
  availableForOpportunities: profileJson.availableForOpportunities ?? true,

  profileImage: profileJson.profileImage ?? "/profile.png",
  resumeUrl: "/resume.pdf",

  education: {
    degree: "B.Tech in Computer Science & Engineering",
    // TODO(content): replace with the real college name. Shipping a placeholder
    // institution is worse than shipping no education section at all.
    institution: "",
    period: "2025 – 2029 (Expected)",
    status: "In progress",
    highlights: [
      "Coursework: Data Structures & Algorithms, OOP, Database Systems, Computer Networks",
      "Building production applications alongside coursework",
    ],
  },

  contact: {
    email: "kumarvinay072007@gmail.com",
    // Keep this a mailbox you actually read. The contact form opens the
    // visitor's mail client instead of relying on a backend or a dead domain
    // address.
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
