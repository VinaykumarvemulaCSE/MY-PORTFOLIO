"use client";

import { useActionState, useState } from "react";

import { saveProjectAction } from "@/app/admin/(dashboard)/actions";
import { GalleryField } from "@/components/admin/GalleryField";
import { ImageField } from "@/components/admin/ImageField";
import { TechIconPicker } from "@/components/admin/TechIconPicker";
import { AdminCard, Field, FormMessage, inputClass, SubmitButton } from "@/components/admin/ui";
import { useActionToast } from "@/components/admin/useActionToast";
import { idleState } from "@/lib/action-state";
import type { ProjectDemoCredentials, ProjectViewModel } from "@/lib/types";

export function ProjectForm({
  project,
  submitLabel = "Save project",
}: {
  project: ProjectViewModel;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(saveProjectAction, idleState);
  const [tech, setTech] = useState(project.tech);
  const [demoCredentials, setDemoCredentials] = useState<ProjectDemoCredentials[]>(
    project.demoCredentials?.length ? project.demoCredentials : [{}]
  );
  useActionToast(state);
  const metrics = (project.caseStudy?.metrics ?? [])
    .map((metric) => `${metric.label} | ${metric.value}`)
    .join("\n");

  function updateDemoCredential(index: number, patch: Partial<ProjectDemoCredentials>) {
    setDemoCredentials((current) =>
      current.map((credential, credentialIndex) =>
        credentialIndex === index ? { ...credential, ...patch } : credential
      )
    );
  }

  function addDemoCredential() {
    setDemoCredentials((current) => (current.length >= 10 ? current : [...current, {}]));
  }

  function removeDemoCredential(index: number) {
    setDemoCredentials((current) => {
      const next = current.filter((_, credentialIndex) => credentialIndex !== index);
      return next.length > 0 ? next : [{}];
    });
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <FormMessage ok={state.ok} message={state.message} />

      <input type="hidden" name="id" value={project.id} />
      <input type="hidden" name="originalSlug" value={project.slug} />

      <AdminCard title="Basics">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title">
            <input name="title" defaultValue={project.title} required className={inputClass} />
          </Field>
          <Field label="Slug" hint="URL: /work/your-slug">
            <input name="slug" defaultValue={project.slug} required className={inputClass} />
          </Field>
          <Field label="Tagline" className="sm:col-span-2">
            <input name="tagline" defaultValue={project.tagline} className={inputClass} />
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <textarea
              name="description"
              defaultValue={project.description}
              rows={10}
              required
              className={inputClass}
            />
          </Field>
          <Field label="Tech" hint="Pick the icons shown on the card and case study.">
            <TechIconPicker
              name="tech"
              value={tech}
              onChange={setTech}
              multiple
              emptyLabel="Choose technologies"
            />
          </Field>
          <Field label="Status" hint="Live, In progress, Archived…">
            <input name="status" defaultValue={project.status} required className={inputClass} />
          </Field>
          <Field label="Display order" hint="Lower numbers appear first.">
            <input
              name="order"
              type="number"
              min={0}
              step={1}
              defaultValue={project.order ?? 0}
              className={inputClass}
            />
          </Field>
          <Field label="Difficulty / type">
            <input name="difficulty" defaultValue={project.difficulty} className={inputClass} />
          </Field>
          <Field label="Time investment">
            <input
              name="timeInvestment"
              defaultValue={project.timeInvestment}
              className={inputClass}
            />
          </Field>
          <Field label="Live URL">
            <input
              name="liveLink"
              type="url"
              defaultValue={project.liveLink}
              className={inputClass}
            />
          </Field>
          <Field label="GitHub URL">
            <input
              name="githubLink"
              type="url"
              defaultValue={project.githubLink}
              className={inputClass}
            />
          </Field>
        </div>
        <div className="mt-4 flex flex-wrap gap-6 text-sm text-muted-foreground">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="published"
              defaultChecked={project.published ?? true}
              className="size-4 accent-[hsl(var(--primary))]"
            />
            Published
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={project.featured}
              className="size-4 accent-[hsl(var(--primary))]"
            />
            Featured
          </label>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Featured projects appear on the home page. Lower display order wins when several are
          featured.
        </p>
      </AdminCard>

      <AdminCard title="Images">
        <div className="flex flex-col gap-6">
          <ImageField name="coverImage" label="Cover image" defaultValue={project.coverImage} />
          <GalleryField
            name="gallery"
            label="Gallery"
            defaultValue={project.gallery}
            altDefaultValue={project.galleryAlt}
            coverFieldName="coverImage"
            coverImage={project.coverImage}
          />
        </div>
      </AdminCard>

      <AdminCard title="Case study">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Problem heading">
            <input
              name="caseStudy.problemTitle"
              defaultValue={project.caseStudy?.problemTitle}
              className={inputClass}
            />
          </Field>
          <Field label="Architecture heading">
            <input
              name="caseStudy.architectureTitle"
              defaultValue={project.caseStudy?.architectureTitle}
              className={inputClass}
            />
          </Field>
          <Field label="Problem" className="sm:col-span-2">
            <textarea
              name="caseStudy.problem"
              defaultValue={project.caseStudy?.problem}
              rows={5}
              className={inputClass}
            />
          </Field>
          <Field label="Architecture" className="sm:col-span-2">
            <textarea
              name="caseStudy.architecture"
              defaultValue={project.caseStudy?.architecture}
              rows={5}
              className={inputClass}
            />
          </Field>
          <Field label="Challenges heading">
            <input
              name="caseStudy.challengesTitle"
              defaultValue={project.caseStudy?.challengesTitle}
              className={inputClass}
            />
          </Field>
          <Field label="What broke">
            <input
              name="caseStudy.whatBroke"
              defaultValue={project.caseStudy?.whatBroke}
              className={inputClass}
            />
          </Field>
          <Field label="Challenges" hint="One per line." className="sm:col-span-2">
            <textarea
              name="caseStudy.challenges"
              defaultValue={(project.caseStudy?.challenges ?? []).join("\n")}
              rows={5}
              className={inputClass}
            />
          </Field>
          <Field label="Metrics" hint="One per line as: Label | Value" className="sm:col-span-2">
            <textarea
              name="caseStudy.metrics"
              defaultValue={metrics}
              rows={4}
              className={inputClass}
            />
          </Field>
        </div>
      </AdminCard>

      <AdminCard
        title="Demo credentials"
        description="Add demo accounts for visitors. These details are public, so only use test accounts."
      >
        <input type="hidden" name="demoCredentials" value={JSON.stringify(demoCredentials)} />

        <div className="flex flex-col gap-3">
          {demoCredentials.map((credential, index) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: rows are edited in place and have no id yet
              key={index}
              className="rounded-xl border border-border bg-background/40 p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Credential {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeDemoCredential(index)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-destructive/50 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Field label="Label (optional)">
                  <input
                    value={credential.label ?? ""}
                    onChange={(event) => updateDemoCredential(index, { label: event.target.value })}
                    placeholder="Admin"
                    className={inputClass}
                  />
                </Field>
                <Field label="Email / username">
                  <input
                    value={credential.email ?? ""}
                    onChange={(event) => updateDemoCredential(index, { email: event.target.value })}
                    placeholder="demo@example.com"
                    className={inputClass}
                  />
                </Field>
                <Field label="Password">
                  <input
                    value={credential.password ?? ""}
                    onChange={(event) =>
                      updateDemoCredential(index, { password: event.target.value })
                    }
                    placeholder="Password"
                    className={inputClass}
                  />
                </Field>
                <Field label="Note">
                  <input
                    value={credential.note ?? ""}
                    onChange={(event) => updateDemoCredential(index, { note: event.target.value })}
                    placeholder="Role or access notes"
                    className={inputClass}
                  />
                </Field>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addDemoCredential}
            disabled={demoCredentials.length >= 10}
            className="self-start rounded-lg border border-dashed border-border px-4 py-2 text-xs text-muted-foreground transition hover:border-primary/50 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            + Add credential
          </button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Up to 10 accounts. Blank rows are ignored.
        </p>
      </AdminCard>

      <div className="flex items-center gap-3">
        <SubmitButton pending={pending}>{submitLabel}</SubmitButton>
        <span className="text-xs text-muted-foreground">
          Saving with a new slug creates a new project document.
        </span>
      </div>
    </form>
  );
}
