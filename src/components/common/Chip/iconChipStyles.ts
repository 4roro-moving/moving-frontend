import { cva } from "class-variance-authority";

export type IconChipSize = "sm" | "md";

export const iconChipVariants = cva(
  "inline-flex w-fit items-center justify-center shadow-[4px_4px_4px_0_rgba(217,217,217,0.1)]",
  {
    variants: {
      size: {
        sm: "gap-2 rounded-4 py-2 pr-8 pl-4",
        md: "gap-4 rounded-6 py-4 pr-8 pl-6",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export const ICON_CHIP_TEXT_VARIANT = {
  sm: "sm-semibold",
  md: "md-semibold",
} as const;
