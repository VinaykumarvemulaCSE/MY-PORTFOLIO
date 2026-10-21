import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

import { cloudinaryConfig, isCloudinaryConfigured } from "@/lib/firebase/config";
import { getAdminSession } from "@/lib/firebase/session";

export const dynamic = "force-dynamic";

/**
 * Returns a short-lived signature so the browser can upload straight to
 * Cloudinary.
 *
 * Uploading through this route would cap files at Vercel's ~4.5 MB request-body
 * limit; signing here and posting the file to Cloudinary keeps large images and
 * résumé PDFs working in production. The API secret never leaves the server.
 */
export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Cloudinary is not configured. Add CLOUDINARY_* env vars." },
      { status: 503 }
    );
  }

  const { cloudName, apiKey, apiSecret } = cloudinaryConfig;
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "portfolio";
  const signature = createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  return NextResponse.json(
    { cloudName, apiKey, timestamp, folder, signature },
    { headers: { "Cache-Control": "no-store" } }
  );
}
