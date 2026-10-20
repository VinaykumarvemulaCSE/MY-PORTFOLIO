/**
 * Single source of truth for Sanity configuration.
 *
 * Everything is read from environment variables so that the site keeps
 * building and rendering before a Sanity project exists. When the values are
 * missing, `isSanityConfigured` is false and the data layer falls back to the
 * JSON files in `public/data/`.
 *
 * Project ID and dataset are not secrets (they appear in every CDN URL), but
 * the read token is only ever used on the server.
 */

export const sanityProjectId =
  process.env.SANITY_PROJECT_ID ??
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??
  "";

export const sanityDataset =
  process.env.SANITY_DATASET ??
  process.env.NEXT_PUBLIC_SANITY_DATASET ??
  "production";

export const sanityApiVersion = process.env.SANITY_API_VERSION ?? "2025-01-01";

/**
 * Optional. Only needed when the dataset is private. The free plan ships
 * public datasets, so this can normally stay empty.
 */
export const sanityReadToken = process.env.SANITY_API_READ_TOKEN ?? "";

export const isSanityConfigured =
  sanityProjectId.trim().length > 0 && sanityDataset.trim().length > 0;
