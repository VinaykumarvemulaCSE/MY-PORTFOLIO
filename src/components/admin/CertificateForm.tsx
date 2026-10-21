"use client";

import { useActionState } from "react";

import { saveCertificateAction } from "@/app/admin/(dashboard)/actions";
import { ImageField } from "@/components/admin/ImageField";
import { AdminCard, Field, FormMessage, inputClass, SubmitButton } from "@/components/admin/ui";
import { useActionToast } from "@/components/admin/useActionToast";
import { idleState } from "@/lib/action-state";
import type { CertificateViewModel } from "@/lib/types";

export function CertificateForm({
  certificate,
  submitLabel = "Save certificate",
}: {
  certificate: CertificateViewModel;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(saveCertificateAction, idleState);
  useActionToast(state);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <FormMessage ok={state.ok} message={state.message} />

      <input type="hidden" name="id" value={certificate.id} />
      <input type="hidden" name="order" value={certificate.order ?? 0} />

      <AdminCard title="Certificate">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title">
            <input name="title" defaultValue={certificate.title} required className={inputClass} />
          </Field>
          <Field label="Slug" hint="URL: /certificates/your-slug">
            <input name="slug" defaultValue={certificate.slug} required className={inputClass} />
          </Field>
          <Field label="Issuer">
            <input
              name="issuer"
              defaultValue={certificate.issuer}
              required
              className={inputClass}
            />
          </Field>
          <Field label="Awarded by">
            <input name="awardedBy" defaultValue={certificate.awardedBy} className={inputClass} />
          </Field>
          <Field label="Category">
            <input name="category" defaultValue={certificate.category} className={inputClass} />
          </Field>
          <Field label="Issue date" hint="Free text, e.g. Sep 2026.">
            <input name="issueDate" defaultValue={certificate.issueDate} className={inputClass} />
          </Field>
          <Field label="Term">
            <input name="term" defaultValue={certificate.term} className={inputClass} />
          </Field>
          <Field label="Duration">
            <input name="duration" defaultValue={certificate.duration} className={inputClass} />
          </Field>
          <Field label="Grade">
            <input name="grade" defaultValue={certificate.grade} className={inputClass} />
          </Field>
          <Field label="Score">
            <input name="score" defaultValue={certificate.score} className={inputClass} />
          </Field>
          <Field label="Credential ID">
            <input
              name="credentialId"
              defaultValue={certificate.credentialId}
              className={inputClass}
            />
          </Field>
          <Field label="Verify URL">
            <input
              name="verifyUrl"
              type="url"
              defaultValue={certificate.verifyUrl}
              className={inputClass}
            />
          </Field>
          <Field label="Skills" hint="Comma separated." className="sm:col-span-2">
            <input
              name="skills"
              defaultValue={certificate.skills.join(", ")}
              className={inputClass}
            />
          </Field>
          <Field label="Summary" className="sm:col-span-2">
            <textarea
              name="summary"
              defaultValue={certificate.summary}
              rows={5}
              className={inputClass}
            />
          </Field>
        </div>
        <div className="mt-4 flex flex-wrap gap-6 text-sm text-muted-foreground">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="published"
              defaultChecked={certificate.published ?? true}
              className="size-4 accent-[hsl(var(--primary))]"
            />
            Published
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={certificate.featured}
              className="size-4 accent-[hsl(var(--primary))]"
            />
            Featured
          </label>
        </div>
      </AdminCard>

      <AdminCard title="Certificate image">
        <ImageField name="image" label="Image" defaultValue={certificate.image} />
      </AdminCard>

      <div className="flex items-center gap-3">
        <SubmitButton pending={pending}>{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}
