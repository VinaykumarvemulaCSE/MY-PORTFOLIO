import type { Metadata } from "next";
import Link from "next/link";
import { FiArrowLeft, FiCheckCircle, FiMail, FiSmartphone, FiTrash2 } from "react-icons/fi";

export const metadata: Metadata = {
  title: "Delete your Guessify account",
  description:
    "How to permanently delete your Guessify account, match history and leaderboard entries.",
  alternates: { canonical: "/delete-account/guessify" },
  robots: { index: true, follow: true },
};

const CONTACT_EMAIL = "kumarvinay072007@gmail.com";

const deleted = [
  "Your profile: display name, email address and account id",
  "Solo and multiplayer match history",
  "Your public profile and weekly, monthly and all-time leaderboard entries",
  "The Firebase Authentication sign-in itself",
];

export default function GuessifyDeleteAccountPage() {
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    "Guessify account deletion request"
  )}&body=${encodeURIComponent(
    "Please delete my Guessify account.\n\nAccount email: \nDisplay name: \n"
  )}`;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/30">
        <div className="max-w-4xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <FiArrowLeft size={15} />
            Back to portfolio
          </Link>
          <span className="text-xs font-mono text-muted-foreground">Guessify</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 md:px-8 py-12 pb-28 md:py-16">
        <p className="text-[11px] font-mono uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full inline-block">
          Account deletion
        </p>
        <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground leading-tight mt-4">
          Delete your Guessify account
        </h1>
        <p className="text-muted-foreground text-base mt-4 leading-relaxed">
          You can delete your account and all of its data yourself, at any time, without contacting
          anyone.
        </p>

        <section className="mt-10 rounded-2xl border border-border/50 bg-secondary/30 p-6">
          <h2 className="flex items-center gap-2.5 text-lg font-heading font-bold text-foreground">
            <FiSmartphone size={18} className="text-primary" />
            In the app (fastest)
          </h2>
          <ol className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="font-mono text-primary">1.</span>
              Open Guessify and go to the <strong className="text-foreground">Profile</strong> tab,
              then <strong className="text-foreground">Settings</strong>.
            </li>
            <li className="flex gap-3">
              <span className="font-mono text-primary">2.</span>
              Scroll to the bottom and tap{" "}
              <strong className="text-foreground">Delete account</strong>.
            </li>
            <li className="flex gap-3">
              <span className="font-mono text-primary">3.</span>
              Confirm. Email accounts enter their password once; guest accounts confirm directly.
            </li>
          </ol>
          <p className="text-xs text-muted-foreground mt-4">
            The deletion happens immediately and cannot be undone.
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-border/50 bg-secondary/30 p-6">
          <h2 className="flex items-center gap-2.5 text-lg font-heading font-bold text-foreground">
            <FiMail size={18} className="text-primary" />
            By email
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground mt-2">
            If you no longer have the app installed, email us from the address you signed up with.
            We action requests within 30 days.
          </p>
          <a
            href={mailto}
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 py-3 px-6 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20 mt-4"
          >
            <FiMail size={16} />
            Email a deletion request
          </a>
        </section>

        <section className="mt-10">
          <h2 className="flex items-center gap-2.5 text-xl font-heading font-bold text-foreground">
            <FiTrash2 size={18} className="text-primary" />
            What gets deleted
          </h2>
          <ul className="mt-3 space-y-2.5">
            {deleted.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <FiCheckCircle size={15} className="text-primary mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-sm leading-relaxed text-muted-foreground mt-4">
            Nothing is kept for analytics or marketing. Encrypted backups held by our database
            provider are rotated out within 30 days. See the{" "}
            <Link href="/privacy/guessify" className="text-primary hover:underline">
              privacy policy
            </Link>{" "}
            for the full picture.
          </p>
        </section>
      </main>
    </div>
  );
}
