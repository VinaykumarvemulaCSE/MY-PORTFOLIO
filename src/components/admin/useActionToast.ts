"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

import type { ActionState } from "@/lib/action-state";

/**
 * Fires a sonner toast whenever a server action returns a new result. The ref
 * keeps the initial (idle) state from producing a toast on mount.
 */
export function useActionToast(state: ActionState) {
  const previous = useRef(state);

  useEffect(() => {
    if (state === previous.current) return;
    previous.current = state;
    if (!state.message) return;
    if (state.ok) toast.success(state.message);
    else toast.error(state.message);
  }, [state]);
}
