import type { MetadataRoute } from "next";

import { getProfile } from "@/lib/content";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const profile = await getProfile();
  const name = profile?.siteConfig.title || profile?.name || "Portfolio";

  return {
    name,
    short_name: profile?.name || "Portfolio",
    description: profile?.siteConfig.description ?? "",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0b0907",
    theme_color: "#f59e0b",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
