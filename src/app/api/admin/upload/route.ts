import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

import { cloudinaryConfig, isCloudinaryConfigured } from "@/lib/firebase/config";
import { getAdminSession } from "@/lib/firebase/session";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_PREFIXES = ["image/", "application/pdf"];

/**
 * Signed Cloudinary upload for the CMS.
 *
 * The browser posts the file here (never to Cloudinary directly), the route
 * signs the request with the API secret and streams back the secure URL. The
 * secret stays on the server.
 */
export async function POST(request: Request) {
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

  let file: File | null = null;
  try {
    const form = await request.formData();
    const value = form.get("file");
    if (value instanceof File) file = value;
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  if (!file) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File is larger than 8 MB." }, { status: 413 });
  }

  if (!ALLOWED_PREFIXES.some((prefix) => file.type.startsWith(prefix))) {
    return NextResponse.json({ error: "Only images and PDFs can be uploaded." }, { status: 415 });
  }

  const { cloudName, apiKey, apiSecret } = cloudinaryConfig;
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "portfolio";
  const signature = createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  const body = new FormData();
  body.set("file", file);
  body.set("api_key", apiKey as string);
  body.set("timestamp", String(timestamp));
  body.set("folder", folder);
  body.set("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body,
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("[cloudinary] upload failed", detail);
    return NextResponse.json(
      { error: "Upload failed. Check Cloudinary settings." },
      { status: 502 }
    );
  }

  const result = (await response.json()) as { secure_url?: string };
  if (!result.secure_url) {
    return NextResponse.json({ error: "Cloudinary did not return a URL." }, { status: 502 });
  }

  return NextResponse.json({ url: result.secure_url });
}
