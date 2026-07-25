import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              // cosmiconfig가 svgr.config.ts를 잘못 로드하며 실패하는 것을 방지
              runtimeConfig: false,
              icon: true,
              svgProps: {
                focusable: "false",
                "aria-hidden": "true",
              },
              svgoConfig: {
                plugins: [
                  {
                    name: "convertColors",
                    params: {
                      currentColor: true,
                    },
                  },
                ],
              },
            },
          },
        ],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
