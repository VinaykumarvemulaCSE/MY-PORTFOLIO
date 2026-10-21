import type { ImageLoaderProps } from "next/image";

/**
 * Sanity's image CDN already resizes (`w`), negotiates modern formats
 * (`auto=format`) and crops (`fit`). Running every image through
 * `/_next/image` would resize it a second time, add a Vercel function hop to
 * each request, and — on networks that reach the CDN through NAT64 — trip
 * Next's private-IP guard even though the upstream is public.
 *
 * Everything that is not a Sanity asset (the local fallbacks in `public/`) is
 * returned unchanged. Keeping the loader tiny also keeps `next/image`'s
 * responsive `srcSet` working without a custom image server.
 */
const SANITY_CDN = "https://cdn.sanity.io/";

export default function sanityImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  if (!src.startsWith(SANITY_CDN)) return src;

  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  return url.toString();
}
