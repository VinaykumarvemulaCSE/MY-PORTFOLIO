import type { CertificateViewModel } from "@/lib/types";

/**
 * Certificates. The archive at /certificates and the detail pages at
 * /certificates/[slug] are generated from this array.
 */
export const certificates: CertificateViewModel[] = [
  {
    id: "nptel-introduction-to-programming-in-c",
    slug: "nptel-introduction-to-programming-in-c",
    title: "Introduction to Programming in C",
    issuer: "NPTEL",
    awardedBy: "IIT Kanpur",
    grade: "Elite",
    score: "85%",
    duration: "8 weeks",
    term: "JUL–SEP 2026",
    credentialId: "NPTEL26CS113S357401348",
    verifyUrl: "https://nptel.ac.in/verify/NOC-9BV6-0SWA-KZKRB",
    category: "Computer Science",
    summary:
      "Eight-week NPTEL course on programming fundamentals in C, assessed through weekly assignments and a proctored exam. Scored 25/25 on the assignments and 59.25/75 in the exam for a consolidated 85%.",
    skills: ["C", "Programming Fundamentals", "Problem Solving"],
    image: "/certificates/nptel-introduction-to-programming-in-c.jpg",
    featured: true,
  },
];
