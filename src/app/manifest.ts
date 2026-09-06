import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "무빙",
    short_name: "무빙",
    description: "이사 견적을 비교하고 믿을 수 있는 기사님을 찾는 플랫폼, 무빙",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#f9502e",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
