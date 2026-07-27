export const svgrOptions = {
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
} satisfies Record<string, unknown>;
