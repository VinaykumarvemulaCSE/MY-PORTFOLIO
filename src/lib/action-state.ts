export interface ActionState {
  ok: boolean;
  message: string;
}

export const idleState: ActionState = { ok: false, message: "" };
