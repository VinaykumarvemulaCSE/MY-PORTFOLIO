"use client";

/** Upload a file through the signed Cloudinary route and return its URL. */
export async function uploadFile(file: File): Promise<string> {
  const body = new FormData();
  body.set("file", file);

  const response = await fetch("/api/admin/upload", { method: "POST", body });
  const data = (await response.json()) as { url?: string; error?: string };

  if (!response.ok || !data.url) {
    throw new Error(data.error ?? "Upload failed.");
  }

  return data.url;
}

export function isPdf(url: string): boolean {
  return /\.pdf($|\?)/i.test(url);
}
