import type { NextConfig } from "next";
import { getAllowedImageRemotePatterns } from "./src/lib/constants/allowedImageHosts";
import { svgrColorOptions, svgrOptions } from "./svgr.options";

const nextConfig: NextConfig = {
  images: {
    // https://** 제거. seed picsum + NEXT_PUBLIC_PROFILE_IMAGE_HOSTS만 허용
    remotePatterns: getAllowedImageRemotePatterns(),
  },
  turbopack: {
    rules: {
      // 다색: convertColors 없음 (원색 유지)
      "**/icons/color/*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: svgrColorOptions,
          },
        ],
        as: "*.js",
      },
      // 단색: currentColor 변환. icons/color는 위 규칙만 타도록 제외
      "*.svg": {
        condition: {
          not: {
            path: "**/icons/color/**",
          },
        },
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
