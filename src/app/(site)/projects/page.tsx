import type { Metadata } from "next";

import ProjectsBrowser from "@/components/ProjectsBrowser";
import { getProfile, getProjects } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const title = `Projects — ${profile?.name ?? "Portfolio"}`;
  const description = profile
    ? `Full-stack applications, experiments and open-source tools built by ${profile.name}.`
    : "Projects and case studies.";

  return {
    title,
    description,
    alternates: { canonical: "/projects" },
    openGraph: {
      title,
      description,
      type: "website",
      url: "/projects",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ProjectsPage() {
  // Projects are resolved on the server so the archive is fully crawlable and
  // readable without JavaScript. The browser component only handles filtering.
  const projects = await getProjects();

  return <ProjectsBrowser projects={projects} />;
}
