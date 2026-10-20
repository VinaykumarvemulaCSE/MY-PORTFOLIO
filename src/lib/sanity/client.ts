import { createClient, type SanityClient } from "@sanity/client";

import {
  isSanityConfigured,
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
  sanityReadToken,
} from "./env";

/**
 * Every Sanity request is tagged with this value so a single webhook call can
 * invalidate all CMS-driven content at once. See `src/app/api/revalidate`.
 */
export const SANITY_CACHE_TAG = "sanity";

/** Fallback lifetime (seconds) for when the webhook never fires. */
const REVALIDATE_SECONDS = 60 * 60;

/**
 * Next.js only caches `fetch` requests, and it only knows about tags passed
 * through its own `fetch` options. `@sanity/client` accepts those options per
 * call, which is why all reads go through `sanityFetch` rather than calling the
 * client directly — it is not possible to forget the tag if there is only one
 * way in.
 */
const QUERY_OPTIONS: { next: { revalidate: number; tags: string[] } } = {
  next: { revalidate: REVALIDATE_SECONDS, tags: [SANITY_CACHE_TAG] },
};

let client: SanityClient | null = null;

export function getSanityClient(): SanityClient {
  if (!isSanityConfigured) {
    throw new Error(
      "[sanity] SANITY_PROJECT_ID and SANITY_DATASET are required. " +
        "See .env.example, or leave them unset to use the JSON fallback.",
    );
  }

  if (!client) {
    client = createClient({
      projectId: sanityProjectId,
      dataset: sanityDataset,
      apiVersion: sanityApiVersion,
      // Only published documents are visible to the public site.
      perspective: "published",
      useCdn: true,
      token: sanityReadToken || undefined,
    });
  }

  return client;
}

/** Tagged, cached query helper. Use this instead of `getSanityClient().fetch`. */
export function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  return getSanityClient().fetch<T>(query, params, QUERY_OPTIONS);
}
