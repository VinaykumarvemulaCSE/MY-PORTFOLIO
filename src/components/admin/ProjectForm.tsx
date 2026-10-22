"use client";

import { useActionState } from "react";

import { saveProjectAction } from "@/app/admin/(dashboard)/actions";
import { GalleryField } from "@/components/admin/GalleryField";
import { ImageField } from "@/components/admin/ImageField";
import { AdminCard, Field, FormMessage, inputClass, SubmitButton } from "@/components/admin/ui";
import { useActionToast } from "@/components/admin/useActionToast";
import { idleState } from "@/lib/action-state";
import type { ProjectViewModel } from "@/lib/types";

export function ProjectForm({
  project,
  submitLabel = "Save project",
}: {
  project: ProjectViewModel;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(saveProjectAction, idleState);
  useActionToast(state);
  const metrics = (project.caseStudy?.metrics ?? [])
    .map((metric) => `${metric.label} | ${metric.value}`)
    .join("\n");

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
          <Field label="Tech" hint="Comma separated.">
            <input name="tech" defaultValue={project.tech.join(", ")} className={inputClass} />
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

      <AdminCard title="Demo credentials" description="Leave blank to hide the demo card.">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Email / username">
            <input
              name="demo.email"
              defaultValue={project.demoCredentials?.email}
              className={inputClass}
            />
          </Field>
          <Field label="Password">
            <input
              name="demo.password"
              defaultValue={project.demoCredentials?.password}
              className={inputClass}
            />
          </Field>
          <Field label="Note">
            <input
              name="demo.note"
              defaultValue={project.demoCredentials?.note}
              className={inputClass}
            />
          </Field>
        </div>
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
