/**
 * Canonical site origin.
 *
 * The portfolio no longer owns a permanent domain, so the URL is configured in
 * Vercel (`NEXT_PUBLIC_SITE_URL`) rather than committed to the repository.
 * Vercel exposes a deployment URL during builds, which keeps preview deployments
 * correct even before the environment variable is set.
 */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() || process.env.VERCEL_URL?.trim();

  const raw = configured || (vercelHost ? `https://${vercelHost}` : "http://localhost:3000");

  return raw.replace(/\/+$/, "");
}
