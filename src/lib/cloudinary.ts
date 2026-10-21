import { cloudinaryConfig, isCloudinaryConfigured } from "@/lib/firebase/config";

/**
 * Deletes uploaded media from Cloudinary.
 *
 * Only assets in this account's `portfolio/` folder are touched, so deleting a
 * project can never remove media belonging to another site on the same cloud.
 * Failures are logged but never break the admin action that triggered them.
 */

type CloudinaryAsset = {
  resourceType: "image" | "raw" | "video";
  publicId: string;
};

function assetFromUrl(rawUrl: string): CloudinaryAsset | null {
  try {
    const url = new URL(rawUrl);
    if (url.hostname !== "res.cloudinary.com") return null;

    const parts = url.pathname.split("/").filter(Boolean);
    // /<cloud>/<resource>/upload/[transformations/][v123]/<folder>/<name>.<ext>
    if (parts[0] !== cloudinaryConfig.cloudName) return null;

    const resourceType = parts[1];
    if (resourceType !== "image" && resourceType !== "raw" && resourceType !== "video") return null;

    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;

    const afterUpload = parts.slice(uploadIndex + 1);
    const versionIndex = afterUpload.findIndex((part) => /^v\d+$/.test(part));
    const idParts = versionIndex === -1 ? afterUpload : afterUpload.slice(versionIndex + 1);
    const publicId = decodeURIComponent(idParts.join("/")).replace(/\.[a-z0-9]+$/i, "");

    return publicId.startsWith("portfolio/") ? { resourceType, publicId } : null;
  } catch {
    return null;
  }
}

export async function deleteCloudinaryAssets(urls: string[]): Promise<void> {
  if (!isCloudinaryConfigured()) return;

  const byType = new Map<CloudinaryAsset["resourceType"], string[]>();

  for (const url of urls) {
    const asset = assetFromUrl(url);
    if (!asset) continue;
    const ids = byType.get(asset.resourceType) ?? [];
    if (!ids.includes(asset.publicId)) ids.push(asset.publicId);
    byType.set(asset.resourceType, ids);
  }

  const { cloudName, apiKey, apiSecret } = cloudinaryConfig;
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

  for (const [resourceType, ids] of byType) {
    // Cloudinary's admin API accepts up to 100 ids per request.
    for (let index = 0; index < ids.length; index += 100) {
      const batch = ids.slice(index, index + 100);
      const body = new URLSearchParams();
      for (const id of batch) body.append("public_ids[]", id);

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/resources/${resourceType}/upload`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Basic ${auth}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body,
          }
        );

        if (!response.ok) {
          console.error("[cloudinary] cleanup failed", response.status, await response.text());
        }
      } catch (error) {
        console.error("[cloudinary] cleanup failed", error);
      }
    }
  }
}
