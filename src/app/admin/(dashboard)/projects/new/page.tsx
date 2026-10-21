import Link from "next/link";

import { ProjectForm } from "@/components/admin/ProjectForm";
import { readProjects } from "@/lib/firebase/store";

export default async function NewProjectPage() {
  const projects = (await readProjects()) ?? [];
  const nextOrder = projects.reduce((max, project) => Math.max(max, project.order ?? 0), -1) + 1;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin/projects"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          ← Projects
        </Link>
        <h1 className="mt-2 font-heading text-2xl font-semibold">New project</h1>
      </div>
      <ProjectForm
        submitLabel="Create project"
        project={{
          id: `project-${Date.now()}`,
          slug: "",
          title: "",
          tagline: "",
          description: "",
          tech: [],
          status: "Live",
          published: true,
          featured: false,
          order: nextOrder,
        }}
      />
    </div>
  );
}
