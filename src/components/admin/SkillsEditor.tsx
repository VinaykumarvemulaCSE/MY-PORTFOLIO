"use client";

import { useActionState, useState } from "react";

import { saveSkillGroupsAction } from "@/app/admin/(dashboard)/actions";
import { TechIconPicker } from "@/components/admin/TechIconPicker";
import { AdminCard, Field, FormMessage, inputClass, SubmitButton } from "@/components/admin/ui";
import { useActionToast } from "@/components/admin/useActionToast";
import { idleState } from "@/lib/action-state";
import type { SkillGroupViewModel } from "@/lib/types";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function SkillsEditor({ initial }: { initial: SkillGroupViewModel[] }) {
  const [groups, setGroups] = useState<SkillGroupViewModel[]>(initial);
  const [state, formAction, pending] = useActionState(saveSkillGroupsAction, idleState);
  useActionToast(state);

  function updateGroup(index: number, patch: Partial<SkillGroupViewModel>) {
    setGroups((current) =>
      current.map((group, groupIndex) => (groupIndex === index ? { ...group, ...patch } : group))
    );
  }

  function updateSkill(groupIndex: number, skillIndex: number, name: string, icon: string) {
    setGroups((current) =>
      current.map((group, index) =>
        index === groupIndex
          ? {
              ...group,
              skills: group.skills.map((skill, currentSkill) =>
                currentSkill === skillIndex ? { ...skill, name, icon } : skill
              ),
            }
          : group
      )
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <FormMessage ok={state.ok} message={state.message} />
      <input type="hidden" name="groups" value={JSON.stringify(groups)} />

      {groups.map((group, groupIndex) => (
        <AdminCard
          key={group.id}
          title={`Group ${groupIndex + 1}`}
          description="Pick from the full icon library; the preview matches the public site."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title">
              <input
                value={group.title}
                onChange={(event) => {
                  const title = event.target.value;
                  updateGroup(groupIndex, {
                    title,
                    ...(group.id ? {} : { id: slugify(title) }),
                  });
                }}
                className={inputClass}
              />
            </Field>
            <Field label="ID" hint="Stable key, lowercase-with-hyphens.">
              <input
                value={group.id}
                onChange={(event) => updateGroup(groupIndex, { id: slugify(event.target.value) })}
                className={inputClass}
              />
            </Field>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {group.skills.map((skill, skillIndex) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: rows are edited in place and have no id yet
                key={`${group.id}-skill-${skillIndex}`}
                className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(10rem,0.85fr)_auto]"
              >
                <input
                  value={skill.name}
                  onChange={(event) =>
                    updateSkill(groupIndex, skillIndex, event.target.value, skill.icon ?? "")
                  }
                  placeholder="Skill name"
                  className={`${inputClass} min-w-0`}
                />
                <TechIconPicker
                  value={skill.icon ? [skill.icon] : []}
                  onChange={(next) =>
                    updateSkill(groupIndex, skillIndex, skill.name, next[0] ?? "")
                  }
                  emptyLabel="Choose icon"
                  className="min-w-0"
                />
                <button
                  type="button"
                  onClick={() =>
                    updateGroup(groupIndex, {
                      skills: group.skills.filter((_, index) => index !== skillIndex),
                    })
                  }
                  className="rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:border-destructive/50 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                updateGroup(groupIndex, {
                  skills: [...group.skills, { name: "", icon: "" }],
                })
              }
              className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground"
            >
              + Add skill
            </button>
            <button
              type="button"
              onClick={() =>
                setGroups((current) => current.filter((_, index) => index !== groupIndex))
              }
              className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-destructive/50 hover:text-red-300"
            >
              Remove group
            </button>
          </div>
        </AdminCard>
      ))}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() =>
            setGroups((current) => [
              ...current,
              { id: `group-${current.length + 1}`, title: "New group", skills: [{ name: "" }] },
            ])
          }
          className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground"
        >
          + Add group
        </button>
        <SubmitButton pending={pending}>Save skills</SubmitButton>
      </div>
    </form>
  );
}
