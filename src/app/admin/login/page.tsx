import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/LoginForm";
import { isFirebaseAdminConfigured, isFirebaseClientConfigured } from "@/lib/firebase/config";
import { getAdminSession } from "@/lib/firebase/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in — Portfolio CMS",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin");

  const clientConfigured = isFirebaseClientConfigured();
  const adminConfigured = isFirebaseAdminConfigured();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Portfolio CMS
          </p>
          <h1 className="mt-2 font-heading text-2xl font-semibold text-foreground">
            Sign in to manage content
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Use the Firebase Auth account listed in <code>ADMIN_EMAILS</code>.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-6 sm:p-8">
          <LoginForm configured={clientConfigured && adminConfigured} />
        </div>

        {!clientConfigured || !adminConfigured ? (
          <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs leading-relaxed text-amber-200/90">
            <p className="font-semibold text-amber-200">Backend not configured yet</p>
            <p className="mt-1">
              Add the Firebase environment variables to <code>.env.local</code>:{" "}
              <code>NEXT_PUBLIC_FIREBASE_*</code>, <code>FIREBASE_PROJECT_ID</code>,{" "}
              <code>FIREBASE_CLIENT_EMAIL</code>, <code>FIREBASE_PRIVATE_KEY</code> and{" "}
              <code>ADMIN_EMAILS</code>. See <code>.env.example</code>.
            </p>
          </div>
        ) : null}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <a href="/" className="hover:text-foreground">
            ← Back to the site
          </a>
        </p>
      </div>
    </main>
  );
}
