import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectForm } from "@/components/admin/ProjectForm";
import { readProjects } from "@/lib/firebase/store";

export default async function EditProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const projects = (await readProjects()) ?? [];
  const project = projects.find((item) => item.slug === slug);

  if (!project) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin/projects"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          ← Projects
        </Link>
        <h1 className="mt-2 font-heading text-2xl font-semibold">{project.title}</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          /work/{project.slug} · order {project.order ?? 0}
        </p>
      </div>
      <ProjectForm project={project} />
    </div>
  );
}
