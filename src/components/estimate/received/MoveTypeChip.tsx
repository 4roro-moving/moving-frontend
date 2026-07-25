import { cva, type VariantProps } from "class-variance-authority";
import { BoxIcon, DocumentIcon, HomeIcon, CompanyIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";
import { getMoveTypeLabel } from "@/lib/utils/estimateFormat";
import type { MoveType } from "@/types/move";
import { Text } from "@/components/common/Text";

type ChipSize = "sm" | "md";

const chipVariants = cva(
  "inline-flex w-fit items-center justify-center shadow-[4px_4px_4px_0_rgba(217,217,217,0.1)]",
  {
    variants: {
      size: {
        sm: "gap-2 rounded-4 py-2 pr-8 pl-4",
        md: "gap-4 rounded-6 py-4 pr-8 pl-6",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const CHIP_TEXT_VARIANT = {
  sm: "sm-semibold",
  md: "md-semibold",
} as const;

interface MoveTypeChipProps extends VariantProps<typeof chipVariants> {
  moveType: MoveType;
  className?: string;
  size?: ChipSize;
}

const MOVE_TYPE_ICON = {
  SMALL: BoxIcon,
  HOME: HomeIcon,
  OFFICE: CompanyIcon,
};

export function MoveTypeChip({ moveType, size = "md", className }: MoveTypeChipProps) {
  const Icon = MOVE_TYPE_ICON[moveType];
  const chipSize = size ?? "md";

  return (
    <span className={cn("bg-background-brand-muted", chipVariants({ size: chipSize }), className)}>
      <Icon className="text-icon-brand size-20 shrink-0" />
      <Text as="span" variant={CHIP_TEXT_VARIANT[chipSize]} className="text-text-brand">
        {getMoveTypeLabel(moveType)}
      </Text>
    </span>
  );
}

interface DesignatedChipProps extends VariantProps<typeof chipVariants> {
  className?: string;
}

export function DesignatedChip({ size = "md", className }: DesignatedChipProps) {
  const chipSize = size ?? "md";
  return (
    <span className={cn("bg-red-100", chipVariants({ size: chipSize }), className)}>
      <DocumentIcon className="size-20 shrink-0 text-red-200" />
      <Text as="span" variant={CHIP_TEXT_VARIANT[chipSize]} className="text-red-200">
        지정 견적 요청
      </Text>
    </span>
  );
}
