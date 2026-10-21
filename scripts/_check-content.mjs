import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || "0pmm1cx4",
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  useCdn: false,
});

const [profile, projects, skills] = await Promise.all([
  client.fetch(`*[_id == "profile"][0]{
    name,
    roles,
    education,
    contact,
    social,
    resumeFile
  }`),
  client.fetch(`*[_type == "project"] | order(order asc) {
    title,
    "slug": slug.current,
    tagline,
    liveLink,
    githubLink,
    difficulty,
    demoCredentials,
    "metrics": caseStudy.metrics
  }`),
  client.fetch(`*[_type == "skillGroup"] | order(order asc) {
    title,
    "count": count(skills)
  }`),
]);

console.log(JSON.stringify({ profile, projects, skills }, null, 2));
