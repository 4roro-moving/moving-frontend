"use client";

import { useTranslations } from "next-intl";

import { Text } from "@/components/common/Text";
import { BoxIcon, CompanyIcon, HomeIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";
import type { MoveType } from "@/types/move";

import { iconChipVariants, ICON_CHIP_TEXT_VARIANT, type IconChipSize } from "./iconChipStyles";

interface MoveTypeChipProps {
  moveType: MoveType;
  className?: string;
  size?: IconChipSize;
}

const MOVE_TYPE_ICON = {
  SMALL: BoxIcon,
  HOME: HomeIcon,
  OFFICE: CompanyIcon,
};

export function MoveTypeChip({ moveType, size = "md", className }: MoveTypeChipProps) {
  const t = useTranslations("moverSearch");
  const Icon = MOVE_TYPE_ICON[moveType];
  const chipSize = size ?? "md";

  return (
    <span
      className={cn("bg-background-brand-muted", iconChipVariants({ size: chipSize }), className)}
    >
      <Icon className="text-icon-brand size-20 shrink-0" />
      <Text as="span" variant={ICON_CHIP_TEXT_VARIANT[chipSize]} className="text-text-brand">
        {t(`moveTypes.${moveType}`)}
      </Text>
    </span>
  );
}
