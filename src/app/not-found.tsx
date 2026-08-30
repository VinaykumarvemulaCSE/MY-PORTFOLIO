import Link from "next/link";
import { FiArrowLeft, FiAlertTriangle } from "react-icons/fi";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center section-padding bg-background text-foreground text-center">
      <div className="max-w-md w-full p-8 rounded-2xl glass border border-border/50 shadow-xl space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <FiAlertTriangle size={32} />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-heading font-bold">404</h1>
          <h2 className="text-xl font-semibold text-foreground">Page Not Found</h2>
          <p className="text-sm text-muted-foreground">
            The page you're looking for doesn't exist, was moved, or never made it to this branch.
          </p>
        </div>

        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all glow-sm"
          >
            <FiArrowLeft size={16} /> Back to Safety
          </Link>
        </div>
      </div>
    </main>
  );
}
