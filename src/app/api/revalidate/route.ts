import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

import { SANITY_CACHE_TAG } from "@/lib/sanity";

/**
 * Sanity webhook target.
 *
 * Configure in Sanity:
 *   manage.sanity.io → API → Webhooks → Create webhook
 *   URL:    https://<your-domain>/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>
 *   Trigger: Create, Update, Delete
 *   Filter: _type in ["project", "profile", "certificate", "siteSettings"]
 *
 * Every Sanity fetch in `src/lib/sanity/client.ts` is tagged with `sanity`, so
 * one call here invalidates all CMS-driven output. `{ expire: 0 }` is used
 * because a webhook runs outside a Server Action and we want the next visitor
 * to see the change immediately rather than stale-while-revalidate.
 */

export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest, secret: string): boolean {
  const fromQuery = request.nextUrl.searchParams.get("secret");
  const fromHeader =
    request.headers.get("x-sanity-secret") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  return fromQuery === secret || fromHeader === secret;
}

async function handle(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json(
      {
        error:
          "SANITY_REVALIDATE_SECRET is not set. Add it to your environment before wiring the webhook.",
      },
      { status: 500 },
    );
  }

  if (!isAuthorized(request, secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let documentType: string | null = null;
  try {
    const body = (await request.json()) as { _type?: string } | null;
    documentType = body?._type ?? null;
  } catch {
    // Sanity can be configured to send an empty body; that is not an error.
  }

  revalidateTag(SANITY_CACHE_TAG, { expire: 0 });

  return NextResponse.json({
    revalidated: true,
    tag: SANITY_CACHE_TAG,
    documentType,
    at: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  return handle(request);
}

// Useful for a quick manual smoke test from the browser.
export async function GET(request: NextRequest) {
  return handle(request);
}
