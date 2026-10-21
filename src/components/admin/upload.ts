"use client";

/** Cloudinary's free plan caps a single upload at 10 MB. */
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

interface UploadSignature {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
  error?: string;
}

interface CloudinaryResult {
  secure_url?: string;
  error?: { message?: string };
}

/**
 * Upload a file straight to Cloudinary using a signature from the admin API.
 * Going browser → Cloudinary avoids serverless request-body limits.
 */
export async function uploadFile(file: File): Promise<string> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("File is larger than 10 MB.");
  }

  if (!(file.type.startsWith("image/") || file.type === "application/pdf")) {
    throw new Error("Only images and PDFs can be uploaded.");
  }

  const signResponse = await fetch("/api/admin/upload", { cache: "no-store" });
  const signature = (await signResponse.json()) as UploadSignature;

  if (!signResponse.ok || !signature.signature) {
    throw new Error(signature.error ?? "Could not start the upload.");
  }

  const body = new FormData();
  body.set("file", file);
  body.set("api_key", signature.apiKey);
  body.set("timestamp", String(signature.timestamp));
  body.set("folder", signature.folder);
  body.set("signature", signature.signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${signature.cloudName}/auto/upload`,
    { method: "POST", body }
  );
  const result = (await response.json()) as CloudinaryResult;

  if (!response.ok || !result.secure_url) {
    throw new Error(result.error?.message ?? "Upload failed.");
  }

  return result.secure_url;
}

export function isPdf(url: string): boolean {
  return /\.pdf($|\?)/i.test(url);
}
