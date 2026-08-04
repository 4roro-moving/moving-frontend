import type { StorybookConfig } from "@storybook/nextjs-vite";
import svgr from "vite-plugin-svgr";

/** next.config.ts와 동일한 단색 아이콘 SVGR 설정입니다. */
const svgrOptions = {
  runtimeConfig: false,
  icon: true,
  svgProps: { focusable: "false", "aria-hidden": "true" },
};

const svgrColorOptions = {
  runtimeConfig: false,
  icon: true,
  svgProps: { focusable: "false", "aria-hidden": "true" },
};

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
  ],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {
      image: {
        excludeFiles: ["**/*.svg"],
      },
    },
  },
  viteFinal: async (viteConfig) => {
    viteConfig.plugins = [
      svgr({
        include: "**/icons/color/*.svg",
        svgrOptions: svgrColorOptions,
      }),
      svgr({
        include: "**/*.svg",
        exclude: "**/icons/color/**",
        svgrOptions,
      }),
      ...(viteConfig.plugins ?? []),
    ];

    return viteConfig;
  },
  staticDirs: [
    "../public",
    { from: "../node_modules/pretendard/dist/web/static/woff", to: "/woff" },
    { from: "../node_modules/pretendard/dist/web/static/woff2", to: "/woff2" },
  ],
};
export default config;
