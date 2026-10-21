"use client";

import { useFormStatus } from "react-dom";

function PendingButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(`Delete this ${label}? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
      className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-destructive/50 hover:text-red-300 disabled:opacity-60"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}

export function DeleteButton({ label }: { label: string }) {
  return <PendingButton label={label} />;
}
