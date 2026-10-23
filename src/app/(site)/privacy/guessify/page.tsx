import type { Metadata } from "next";
import Link from "next/link";
import { FiArrowLeft, FiDatabase, FiMail, FiShare2, FiShield, FiTrash2, FiUser } from "react-icons/fi";

export const metadata: Metadata = {
  title: "Guessify Privacy Policy",
  description:
    "What Guessify stores, why it stores it, how long it keeps it and how to delete your account.",
  alternates: { canonical: "/privacy/guessify" },
  robots: { index: true, follow: true },
};

const CONTACT_EMAIL = "kumarvinay072007@gmail.com";
const LAST_UPDATED = "24 October 2026";

const sections = [
  {
    icon: FiUser,
    title: "What we collect",
    body: [
      "Account details: your email address, display name and an internal account id. Guest players get an anonymous id and a generated name; no email is required.",
      "Gameplay data: guesses, attempts, hints used, scores, points, wins, losses, streaks, match history and the difficulty or duel mode you played.",
      "Duel data: the 6-character room code, who hosted the room, the guesses exchanged and the result. The secret number is never stored while a round is live; it is revealed only when the round ends.",
      "Leaderboard data: your display name, points, wins and tier for the weekly, monthly and all-time boards.",
    ],
  },
  {
    icon: FiDatabase,
    title: "How we use it",
    body: [
      "To run solo games, live duels, match history and the leaderboards you see in the app.",
      "To keep your session signed in and to sync results that were finished while you were offline.",
      "To detect and limit obviously invalid writes (for example impossible scores or room results).",
      "We do not use your data for advertising, profiling or automated decisions, and there are no third-party analytics or tracking SDKs in the app.",
    ],
  },
  {
    icon: FiShare2,
    title: "Who can see it",
    body: [
      "Your email and private match history are readable only by your account.",
      "Your display name, points, wins and tier are public on the leaderboards unless you turn off \"Show me on leaderboards\" in Settings.",
      "Duel rooms are readable by signed-in players so they can join with a code; they contain display names and guesses, never email addresses.",
      "Data is stored with Google Firebase (Authentication and Cloud Firestore), which processes it on our behalf. We do not sell your data or share it with anyone else.",
    ],
  },
  {
    icon: FiShield,
    title: "Security and retention",
    body: [
      "Traffic is encrypted in transit (HTTPS/TLS). Access is enforced by Firestore security rules, so one account cannot read another account's private documents.",
      "Duel rooms expire five minutes after their last activity and are cleared by the database.",
      "Everything else is kept until you delete your account or ask us to delete it.",
    ],
  },
  {
    icon: FiTrash2,
    title: "Deleting your data",
    body: [
      "You can delete your account inside the app: Profile → Settings → Delete account. Email accounts confirm with their password first.",
      "Deletion removes your profile, email, match history, public profile and leaderboard entries. The sign-in itself is removed from Firebase Authentication.",
      "You can also request deletion from the dedicated page or by emailing us; we action requests within 30 days.",
    ],
  },
];

export default function GuessifyPrivacyPage() {
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
          Privacy policy
        </p>
        <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground leading-tight mt-4">
          Guessify Privacy Policy
        </h1>
        <p className="text-muted-foreground text-base mt-4 leading-relaxed">
          Guessify is a number-guessing game for Android. This page explains exactly what the app
          stores, who can read it and how to remove it.
        </p>
        <p className="text-xs font-mono text-muted-foreground mt-3">Last updated: {LAST_UPDATED}</p>

        <div className="mt-10 space-y-9">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="flex items-center gap-2.5 text-xl font-heading font-bold text-foreground">
                <section.icon size={18} className="text-primary" />
                {section.title}
              </h2>
              <ul className="mt-3 space-y-2.5">
                {section.body.map((line) => (
                  <li
                    key={line}
                    className="text-sm leading-relaxed text-muted-foreground pl-4 border-l border-border/50"
                  >
                    {line}
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section>
            <h2 className="text-xl font-heading font-bold text-foreground">Children</h2>
            <p className="text-sm leading-relaxed text-muted-foreground mt-3">
              Guessify is not directed at children under 13. We do not knowingly collect personal
              information from children. If a child has created an account, contact us and we will
              delete it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold text-foreground">Changes</h2>
            <p className="text-sm leading-relaxed text-muted-foreground mt-3">
              If this policy changes, the updated version will be published on this page and the
              date above will change. Material changes will also be noted in the app.
            </p>
          </section>

          <section className="rounded-2xl border border-border/50 bg-secondary/30 p-6">
            <h2 className="flex items-center gap-2.5 text-lg font-heading font-bold text-foreground">
              <FiMail size={18} className="text-primary" />
              Contact
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground mt-2">
              Questions about privacy or a deletion request? Email{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Guessify%20privacy`}
                className="text-primary hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
              . You can also read the{" "}
              <Link href="/delete-account/guessify" className="text-primary hover:underline">
                account deletion instructions
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
