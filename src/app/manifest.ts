import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vinay Kumar Vemula | Full Stack Developer",
    short_name: "Vinay Vemula",
    description:
      "Portfolio of Vinay Kumar Vemula — full stack developer working with React, Next.js and TypeScript.",
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
