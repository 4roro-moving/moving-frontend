"use client";

import { useTranslations } from "next-intl";

import { Text } from "@/components/common/Text";
import {
  iconChipVariants,
  ICON_CHIP_TEXT_VARIANT,
  type IconChipSize,
} from "@/components/common/Chip/iconChipStyles";
import { DocumentIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";

interface DesignatedChipProps {
  size?: IconChipSize;
  className?: string;
}

export default function DesignatedChip({ size = "md", className }: DesignatedChipProps) {
  const t = useTranslations("estimates");
  const chipSize = size ?? "md";

  return (
    <span className={cn("bg-red-100", iconChipVariants({ size: chipSize }), className)}>
      <DocumentIcon className="size-20 shrink-0 text-red-200" />
      <Text as="span" variant={ICON_CHIP_TEXT_VARIANT[chipSize]} className="text-red-200">
        {t("mover.designated")}
      </Text>
    </span>
  );
}
