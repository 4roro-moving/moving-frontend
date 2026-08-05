import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

import { Text, type TextVariantProp } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

const selectableChipVariants = cva(
  "inline-flex items-center justify-center gap-10 rounded-100 border transition-colors disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "px-12 py-6",
        md: "px-20 py-10",
        responsive: "px-12 py-6 md:px-20 md:py-10",
      },
      selected: {
        true: "border-border-brand bg-background-brand-muted text-text-brand",
        false: "border-border-muted bg-background-subtle text-text-secondary",
      },
    },
    defaultVariants: {
      size: "sm",
      selected: false,
    },
  },
);

type SelectableChipSize = NonNullable<VariantProps<typeof selectableChipVariants>["size"]>;

const SELECTABLE_CHIP_TEXT_VARIANT: Record<
  SelectableChipSize,
  Record<"selected" | "default", TextVariantProp>
> = {
  sm: { selected: "md-medium", default: "md-medium" },
  md: { selected: "2lg-medium", default: "2lg-regular" },
  responsive: {
    selected: { base: "md-medium", md: "2lg-medium" },
    default: { base: "md-medium", md: "2lg-regular" },
  },
};

export interface SelectableChipProps extends VariantProps<typeof selectableChipVariants> {
  children: ReactNode;
  /** 클릭 시 선택 상태를 변경하는 핸들러. 전달하면 button으로 렌더링합니다. */
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function SelectableChip({
  children,
  size = "sm",
  selected = false,
  onClick,
  disabled,
  className,
}: SelectableChipProps) {
  const resolvedSize = size ?? "sm";
  const isSelected = selected ?? false;
  const textVariant =
    SELECTABLE_CHIP_TEXT_VARIANT[resolvedSize][isSelected ? "selected" : "default"];
  const content = (
    <Text as="span" variant={textVariant}>
      {children}
    </Text>
  );

  if (onClick) {
    return (
      <button
        type="button"
        aria-pressed={isSelected}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          selectableChipVariants({ size: resolvedSize, selected: isSelected }),
          className,
        )}
      >
        {content}
      </button>
    );
  }

  return (
    <span
      className={cn(
        selectableChipVariants({ size: resolvedSize, selected: isSelected }),
        className,
      )}
    >
      {content}
    </span>
  );
}
