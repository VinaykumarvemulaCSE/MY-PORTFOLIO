"use client";

import { useActionState } from "react";

import { saveProfileAction } from "@/app/admin/(dashboard)/actions";
import { ImageField } from "@/components/admin/ImageField";
import { AdminCard, Field, FormMessage, inputClass, SubmitButton } from "@/components/admin/ui";
import { useActionToast } from "@/components/admin/useActionToast";
import { idleState } from "@/lib/action-state";
import type { ProfileViewModel } from "@/lib/types";

export function ProfileForm({ profile }: { profile: ProfileViewModel }) {
  const [state, formAction, pending] = useActionState(saveProfileAction, idleState);
  useActionToast(state);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <FormMessage ok={state.ok} message={state.message} />

      <AdminCard title="Identity" description="Hero text and availability badge.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <input name="name" defaultValue={profile.name} required className={inputClass} />
          </Field>
          <Field label="Status text">
            <input
              name="statusText"
              defaultValue={profile.statusText}
              required
              className={inputClass}
            />
          </Field>
          <Field label="Roles" hint="One per line." className="sm:col-span-2">
            <textarea
              name="roles"
              defaultValue={profile.roles.join("\n")}
              rows={3}
              className={inputClass}
            />
          </Field>
          <Field label="Bio" className="sm:col-span-2">
            <textarea name="bio" defaultValue={profile.bio} rows={4} className={inputClass} />
          </Field>
          <label className="flex items-center gap-2 text-sm text-muted-foreground sm:col-span-2">
            <input
              type="checkbox"
              name="availableForOpportunities"
              defaultChecked={profile.availableForOpportunities}
              className="size-4 accent-[hsl(var(--primary))]"
            />
            Available for opportunities
          </label>
        </div>
      </AdminCard>

      <AdminCard title="Media" description="Upload a new image or keep the local path.">
        <div className="grid gap-4 sm:grid-cols-2">
          <ImageField
            name="profileImage"
            label="Profile image"
            defaultValue={profile.profileImage}
          />
          <ImageField
            name="resumeUrl"
            label="Résumé"
            defaultValue={profile.resumeUrl}
            accept="application/pdf"
            hint="PDF upload or /resume.pdf"
          />
        </div>
      </AdminCard>

      <AdminCard title="Education">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Degree">
            <input
              name="education.degree"
              defaultValue={profile.education.degree}
              required
              className={inputClass}
            />
          </Field>
          <Field label="Institution">
            <input
              name="education.institution"
              defaultValue={profile.education.institution}
              required
              className={inputClass}
            />
          </Field>
          <Field label="Period">
            <input
              name="education.period"
              defaultValue={profile.education.period}
              required
              className={inputClass}
            />
          </Field>
          <Field label="Status">
            <input
              name="education.status"
              defaultValue={profile.education.status}
              required
              className={inputClass}
            />
          </Field>
          <Field label="Highlights" hint="One per line." className="sm:col-span-2">
            <textarea
              name="education.highlights"
              defaultValue={profile.education.highlights.join("\n")}
              rows={3}
              className={inputClass}
            />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="Contact & socials">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email">
            <input
              name="contact.email"
              type="email"
              defaultValue={profile.contact.email}
              required
              className={inputClass}
            />
          </Field>
          <Field label="Public email">
            <input
              name="contact.customEmail"
              type="email"
              defaultValue={profile.contact.customEmail}
              required
              className={inputClass}
            />
          </Field>
          <Field label="Phone">
            <input
              name="contact.phone"
              defaultValue={profile.contact.phone}
              required
              className={inputClass}
            />
          </Field>
          <Field label="Location">
            <input
              name="contact.location"
              defaultValue={profile.contact.location}
              required
              className={inputClass}
            />
          </Field>
          <Field label="GitHub URL">
            <input
              name="social.github"
              type="url"
              defaultValue={profile.social.github}
              required
              className={inputClass}
            />
          </Field>
          <Field label="LinkedIn URL">
            <input
              name="social.linkedin"
              type="url"
              defaultValue={profile.social.linkedin}
              required
              className={inputClass}
            />
          </Field>
          <Field label="WhatsApp URL">
            <input
              name="social.whatsapp"
              type="url"
              defaultValue={profile.social.whatsapp}
              required
              className={inputClass}
            />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="Site metadata">
        <div className="grid gap-4">
          <Field label="Title">
            <input
              name="siteConfig.title"
              defaultValue={profile.siteConfig.title}
              required
              className={inputClass}
            />
          </Field>
          <Field label="Description">
            <textarea
              name="siteConfig.description"
              defaultValue={profile.siteConfig.description}
              rows={3}
              required
              className={inputClass}
            />
          </Field>
        </div>
      </AdminCard>

      <div className="flex items-center gap-3">
        <SubmitButton pending={pending}>Save profile</SubmitButton>
        <span className="text-xs text-muted-foreground">
          Changes go live on the public site immediately.
        </span>
      </div>
    </form>
  );
}
