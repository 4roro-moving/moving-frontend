/** SVGR 공통 옵션 — turbopack/webpack 빌드 모두 동일하게 적용 */
export const svgrOptions = {
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
} satisfies Record<string, unknown>;
