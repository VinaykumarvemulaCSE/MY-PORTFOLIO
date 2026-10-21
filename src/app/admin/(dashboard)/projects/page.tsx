import Link from "next/link";

import { deleteProjectAction } from "@/app/admin/(dashboard)/actions";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { readProjects } from "@/lib/firebase/store";

export default async function AdminProjectsPage() {
  const projects = (await readProjects()) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {projects.length} document{projects.length === 1 ? "" : "s"} in Firestore.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          + New project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card/60 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No projects yet. Create one to get started.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card/60">
          <ul className="divide-y divide-border">
            {projects.map((project) => (
              <li
                key={project.slug}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/admin/projects/${project.slug}`}
                      className="truncate font-medium text-foreground hover:text-primary"
                    >
                      {project.title}
                    </Link>
                    {project.published === false ? (
                      <span className="rounded-full border border-amber-500/40 px-2 py-0.5 text-[10px] uppercase tracking-wide text-amber-300">
                        Draft
                      </span>
                    ) : null}
                    {project.featured ? (
                      <span className="rounded-full border border-primary/40 px-2 py-0.5 text-[10px] uppercase tracking-wide text-primary">
                        Featured
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    /work/{project.slug} · {project.status}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/work/${project.slug}`}
                    target="_blank"
                    className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/projects/${project.slug}`}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                  >
                    Edit
                  </Link>
                  <form action={deleteProjectAction}>
                    <input type="hidden" name="slug" value={project.slug} />
                    <DeleteButton label="project" />
                  </form>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
