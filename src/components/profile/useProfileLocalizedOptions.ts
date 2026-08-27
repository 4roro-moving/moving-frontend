"use client";

import { useTranslations } from "next-intl";

import { REGION_DISPLAY_ORDER, type RegionId } from "@/lib/constants/region";
import type { MoveType } from "@/types/move";

const MOVE_TYPES: MoveType[] = ["SMALL", "HOME", "OFFICE"];

export function useProfileLocalizedOptions() {
  const t = useTranslations("moverSearch");

  return {
    moveTypeOptions: MOVE_TYPES.map((value) => ({ value, label: t(`moveTypes.${value}`) })),
    regionOptions: REGION_DISPLAY_ORDER.map((value: RegionId) => ({
      value,
      label: t(`regions.${value}`),
    })),
  };
}
