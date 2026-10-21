"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { inputClass, labelClass } from "@/components/admin/ui";
import { getFirebaseAuth } from "@/lib/firebase/client";

export function LoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!configured) {
      setError("Firebase is not configured yet. Add the NEXT_PUBLIC_FIREBASE_* variables.");
      return;
    }

    const auth = getFirebaseAuth();
    if (!auth) {
      setError("Firebase could not initialise.");
      return;
    }

    setPending(true);
    try {
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const idToken = await credential.user.getIdToken();

      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Sign-in failed.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch (signInError) {
      const code =
        signInError && typeof signInError === "object" && "code" in signInError
          ? String(signInError.code)
          : "";
      setError(
        code === "auth/invalid-credential" || code === "auth/wrong-password"
          ? "Wrong email or password."
          : code === "auth/too-many-requests"
            ? "Too many attempts. Try again in a few minutes."
            : code === "auth/configuration-not-found"
              ? "Email/Password sign-in is disabled. Enable it in Firebase Console → Authentication → Sign-in method."
              : code === "auth/user-not-found"
                ? "No Firebase user with that email. Create it in Firebase Console → Authentication → Users."
                : "Sign-in failed. Check your credentials and Firebase Auth users."
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>Email</span>
        <input
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>Password</span>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={`${inputClass} pr-10`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition hover:text-foreground"
          >
            {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        </div>
      </label>

      {error ? (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
