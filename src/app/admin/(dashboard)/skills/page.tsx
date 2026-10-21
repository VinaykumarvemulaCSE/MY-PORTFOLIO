import Link from "next/link";

import { SkillsEditor } from "@/components/admin/SkillsEditor";
import { readSkillGroups } from "@/lib/firebase/store";

export default async function AdminSkillsPage() {
  const groups = (await readSkillGroups()) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin" className="text-xs text-muted-foreground hover:text-foreground">
          ← Overview
        </Link>
        <h1 className="mt-2 font-heading text-2xl font-semibold">Skills</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Groups render in the order shown here. Icon keys are resolved by the public site.
        </p>
      </div>

      {groups.length === 0 ? (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-200/90">
          No skill groups in Firestore yet. Add a group below.
        </p>
      ) : null}

      <SkillsEditor initial={groups} />
    </div>
  );
}
