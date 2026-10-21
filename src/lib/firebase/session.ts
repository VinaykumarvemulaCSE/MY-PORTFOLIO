import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getAdminAuth } from "./admin";
import { isAdminEmail, isFirebaseAdminConfigured } from "./config";

export const SESSION_COOKIE = "admin_session";
/** Firebase allows 5 minutes to 14 days. */
export const SESSION_MAX_AGE_SECONDS = 5 * 24 * 60 * 60;

export interface AdminSession {
  uid: string;
  email: string;
}

/**
 * Verify the session cookie with Firebase. Returns `null` for missing/invalid
 * cookies, revoked sessions, or an unconfigured backend.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  if (!isFirebaseAdminConfigured()) return null;

  const cookieStore = await cookies();
  const value = cookieStore.get(SESSION_COOKIE)?.value;
  if (!value) return null;

  try {
    const auth = getAdminAuth();
    if (!auth) return null;
    const decoded = await auth.verifySessionCookie(value, true);
    // Re-check the allowlist on every request so removing an email from
    // ADMIN_EMAILS invalidates existing cookies immediately, not in five days.
    if (!isAdminEmail(decoded.email)) return null;
    return { uid: decoded.uid, email: decoded.email ?? "" };
  } catch {
    return null;
  }
}

/** Server-component / server-action guard. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export function sessionCookieOptions(maxAge = SESSION_MAX_AGE_SECONDS) {
  return {
    name: SESSION_COOKIE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}
