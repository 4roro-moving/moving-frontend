/** SVGR 공통 옵션 — turbopack/webpack 빌드 모두 동일하게 적용 */
export const svgrOptions = {
  /** next.config에서 options로 직접 주입하므로 cosmiconfig 파일 탐색 비활성화 */
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
/** 다색 아이콘: convertColors 없이 fill/stroke 그대로 */
export const svgrColorOptions = {
  runtimeConfig: false,
  icon: true,
  svgProps: {
    focusable: "false",
    "aria-hidden": "true",
  },
} satisfies Record<string, unknown>;
