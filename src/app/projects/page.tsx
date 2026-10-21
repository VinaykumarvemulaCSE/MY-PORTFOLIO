import type { Metadata } from "next";

import ProjectsBrowser from "@/components/ProjectsBrowser";
import { getProfile, getProjects } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const title = `Projects — ${profile.name}`;
  const description =
    "A comprehensive archive of full-stack applications, AI experiments and open-source tools built by Vinay Kumar Vemula.";

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
