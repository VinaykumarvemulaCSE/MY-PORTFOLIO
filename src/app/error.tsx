"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FiAlertTriangle, FiHome, FiRefreshCw } from "react-icons/fi";

/**
 * Route-level error boundary. It renders inside the root layout, so the theme,
 * fonts and background tokens are already applied.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[75vh] flex items-center justify-center px-4 py-24">
      <div className="max-w-md text-center">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
          <FiAlertTriangle size={22} />
        </div>
        <h1 className="font-heading text-3xl font-bold mt-6">
          Something went wrong
        </h1>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          This page hit an unexpected error. Try again, or head back to the home
          page.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-3 rounded-xl text-sm font-semibold transition-colors"
          >
            <FiRefreshCw size={15} />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-secondary/40 hover:bg-secondary border border-border/50 text-foreground px-5 py-3 rounded-xl text-sm font-semibold transition-colors"
          >
            <FiHome size={15} />
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
