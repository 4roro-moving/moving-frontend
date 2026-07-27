import type { MoveType } from "@/types/move";

export const MOVE_TYPE_LABEL: Record<MoveType, string> = {
  SMALL: "소형이사",
  HOME: "가정이사",
  OFFICE: "사무실이사",
};

export const MOVE_TYPE_OPTIONS = (Object.entries(MOVE_TYPE_LABEL) as [MoveType, string][]).map(
  ([value, label]) => ({ value, label }),
);
