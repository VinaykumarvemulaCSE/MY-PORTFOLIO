import Link from "next/link";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";

import { deleteProjectAction, reorderProjectAction } from "@/app/admin/(dashboard)/actions";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { readProfile, readProjects } from "@/lib/firebase/store";

export default async function AdminProjectsPage() {
  const [projects, profile] = await Promise.all([readProjects(), readProfile()]);
  const allProjects = projects ?? [];
  const limit = profile?.siteConfig.homepageProjectLimit ?? 5;
  const published = allProjects.filter((project) => project.published !== false);
  const featured = published.filter((project) => project.featured);
  const homePool = featured.length > 0 ? featured : published;
  const homeSlugs = new Set(
    [...homePool]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .slice(0, limit)
      .map((project) => project.slug)
  );
  const belowCut = Math.max(0, featured.length - homeSlugs.size);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {allProjects.length} document{allProjects.length === 1 ? "" : "s"} in Firestore. Home
            shows up to {limit} project{limit === 1 ? "" : "s"}.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          + New project
        </Link>
      </div>

      {belowCut > 0 ? (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-200/90">
          {belowCut} featured project{belowCut === 1 ? " is" : "s are"} below the homepage cut.
          Reorder them or raise the homepage limit in Profile → Site metadata.
        </p>
      ) : null}

      {allProjects.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card/60 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No projects yet. Create one to get started.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card/60">
          <ul className="divide-y divide-border">
            {allProjects.map((project, index) => (
              <li
                key={project.slug}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                      #{index + 1}
                    </span>
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
                    {homeSlugs.has(project.slug) ? (
                      <span className="rounded-full border border-emerald-500/40 px-2 py-0.5 text-[10px] uppercase tracking-wide text-emerald-300">
                        On home
                      </span>
                    ) : project.published !== false ? (
                      <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                        {project.featured ? "Below cut" : "Not on home"}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    /work/{project.slug} · {project.status}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <form action={reorderProjectAction} className="flex items-center">
                    <input type="hidden" name="slug" value={project.slug} />
                    <button
                      type="submit"
                      name="direction"
                      value="up"
                      disabled={index === 0}
                      aria-label={`Move ${project.title} up`}
                      title="Move up"
                      className="rounded-l-lg border border-r-0 border-border p-1.5 text-muted-foreground transition hover:text-foreground disabled:opacity-25"
                    >
                      <FiArrowUp size={13} />
                    </button>
                    <button
                      type="submit"
                      name="direction"
                      value="down"
                      disabled={index === allProjects.length - 1}
                      aria-label={`Move ${project.title} down`}
                      title="Move down"
                      className="rounded-r-lg border border-border p-1.5 text-muted-foreground transition hover:text-foreground disabled:opacity-25"
                    >
                      <FiArrowDown size={13} />
                    </button>
                  </form>
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
