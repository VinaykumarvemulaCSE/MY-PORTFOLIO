import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vinay Kumar Vemula | Portfolio",
    short_name: "Vinay Portfolio",
    description: "Creative Full Stack Developer Portfolio - Vinay Kumar Vemula",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0070F3",
    icons: [
      {
        src: "/demo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/demo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
