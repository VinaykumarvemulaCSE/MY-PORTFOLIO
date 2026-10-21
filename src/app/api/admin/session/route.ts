import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getAdminAuth } from "@/lib/firebase/admin";
import { isAdminEmail, isFirebaseAdminConfigured } from "@/lib/firebase/config";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  sessionCookieOptions,
} from "@/lib/firebase/session";

export const dynamic = "force-dynamic";

/**
 * Exchanges a Firebase ID token for an httpOnly session cookie.
 *
 * The client signs in with the Firebase SDK, posts the ID token here, and the
 * server keeps the credential in an httpOnly cookie so server components can
 * call `requireAdmin()` without shipping the token to the browser again.
 */
export async function POST(request: Request) {
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json(
      { error: "Firebase Admin is not configured. Add the service account env vars." },
      { status: 503 }
    );
  }

  let idToken: unknown;
  try {
    const body = await request.json();
    idToken = body?.idToken;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof idToken !== "string" || !idToken) {
    return NextResponse.json({ error: "Missing ID token." }, { status: 400 });
  }

  const auth = getAdminAuth();
  if (!auth) {
    return NextResponse.json({ error: "Firebase Admin is not configured." }, { status: 503 });
  }

  try {
    const decoded = await auth.verifyIdToken(idToken);
    if (!isAdminEmail(decoded.email)) {
      return NextResponse.json(
        { error: "This account is not allowed to access the dashboard." },
        { status: 403 }
      );
    }

    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE_SECONDS * 1000,
    });

    const response = NextResponse.json({ ok: true, email: decoded.email });
    response.cookies.set({ ...sessionCookieOptions(), value: sessionCookie });
    return response;
  } catch {
    return NextResponse.json({ error: "Could not verify that sign-in." }, { status: 401 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const cookieStore = await cookies();
  return NextResponse.json(
    { signedIn: Boolean(cookieStore.get(SESSION_COOKIE)?.value) },
    { headers: { "Cache-Control": "no-store" } }
  );
}
