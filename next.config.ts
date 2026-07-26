import type { NextConfig } from "next";

/** SVGR 공통 옵션 — turbopack/webpack 빌드 모두 동일하게 적용 */
const svgrOptions = {
  // cosmiconfig가 svgr.config.ts를 잘못 로드하며 실패하는 것을 방지
  runtimeConfig: false,
  icon: true,
  svgProps: {
    focusable: "false",
    "aria-hidden": "true",
  },
  // 2026.07.26 정슬기 - [수정] preset-default 유지 + 전역 currentColor 변환 제거
  // ProfileDefault 등 고정색 SVG 보존. 단색 아이콘은 #ABABAB만 currentColor로 치환
  replaceAttrValues: {
    "#ABABAB": "currentColor",
    "#ababab": "currentColor",
  },
  svgoConfig: {
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            removeViewBox: false,
            convertColors: {
              currentColor: false,
            },
          },
        },
      },
    ],
  },
};

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
            options: svgrOptions,
          },
        ],
        as: "*.js",
      },
    },
  },
  // 2026.07.26 정슬기 - [추가] production webpack 빌드에도 동일 SVGR 옵션 적용
  webpack(config) {
    // Next 기본 asset 규칙과 충돌하지 않도록 svg만 제외 후 SVGR로 처리
    const fileLoaderRule = config.module.rules.find(
      (rule: { test?: RegExp }) => rule.test instanceof RegExp && rule.test.test(".svg"),
    ) as { exclude?: RegExp | RegExp[] } | undefined;

    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    config.module.rules.push({
      test: /\.svg$/i,
      use: [
        {
          loader: "@svgr/webpack",
          options: { ...svgrOptions },
        },
      ],
    });
    return config;
  },
};

export default nextConfig;
