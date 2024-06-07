import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#2196f3",
    display: "standalone",
    name: "Next-13 PWA",
    orientation: "portrait",
    scope: "/",
    short_name: "PWA",
    start_url: "/",
    theme_color: "#2196f3",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
