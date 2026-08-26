"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils/cn";
import type { MoveType } from "@/types/move";
import { MoveTypeChip } from "@/components/common/Chip/MoveTypeChip";

interface MoverServiceTypeChipsProps {
  serviceTypes: MoveType[];
  size: "sm" | "md";
  className?: string;
}

export function MoverServiceTypeChips({
  serviceTypes,
  size,
  className,
}: MoverServiceTypeChipsProps) {
  const t = useTranslations("profile");

  return (
    <ul
      className={cn("flex flex-wrap items-start", size === "sm" ? "gap-8" : "gap-12", className)}
      aria-label={t("moverMoveTypesAria")}
    >
      {serviceTypes.map((moveType) => (
        <li key={moveType}>
          <MoveTypeChip moveType={moveType} size={size} />
        </li>
      ))}
    </ul>
  );
}
