/** SVGR 공통 옵션 — turbopack/webpack 빌드 모두 동일하게 적용 */
export const svgrOptions = {
  /** next.config에서 options로 직접 주입하므로 cosmiconfig 파일 탐색 비활성화 */
  runtimeConfig: false,
  icon: true,
  svgProps: {
    focusable: "false",
    "aria-hidden": "true",
  },
  // 단색 아이콘은 SVG 원본의 fill/stroke를 currentColor로 작성합니다.
  // ProfileDefault 등 고정색 SVG가 섞여 있어 빌드 시 색상을 일괄 변환하지 않습니다.
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
