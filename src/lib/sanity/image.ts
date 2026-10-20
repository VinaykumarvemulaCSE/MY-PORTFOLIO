import { createImageUrlBuilder } from "@sanity/image-url";

import { getSanityClient } from "./client";
import { isSanityConfigured } from "./env";
import type { SanityImage } from "./types";

/**
 * Builds a fully-qualified, CDN-backed image URL.
 *
 * Returns `null` when Sanity is not configured or the image reference is
 * missing, which lets adapters fall back to a local `/public` path.
 */
export function urlForImage(source: SanityImage | null | undefined): string | null {
  if (!isSanityConfigured || !source?.asset) return null;

  const builder = createImageUrlBuilder(getSanityClient());

  return builder.image(source).auto("format").fit("max").url();
}

/**
 * Convenience wrapper that also requests a specific width, so the CDN serves an
 * appropriately sized file instead of the original upload.
 */
export function urlForImageAt(
  source: SanityImage | null | undefined,
  width: number,
  height?: number,
): string | null {
  if (!isSanityConfigured || !source?.asset) return null;

  const builder = createImageUrlBuilder(getSanityClient());
  const image = builder.image(source).auto("format").fit("max").width(width);

  return (height ? image.height(height) : image).url();
}
