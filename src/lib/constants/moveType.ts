import type { MoveType } from "@/types/move";

export const MOVE_TYPE_VALUES = ["SMALL", "HOME", "OFFICE"] as const satisfies readonly MoveType[];

export const MOVE_TYPE_LABEL: Record<MoveType, string> = {
  SMALL: "소형이사",
  HOME: "가정이사",
  OFFICE: "사무실이사",
};

export const MOVE_TYPE_OPTIONS = (Object.entries(MOVE_TYPE_LABEL) as [MoveType, string][]).map(
  ([value, label]) => ({ value, label }),
);

export interface MoveTypeCardInfo {
  id: MoveType;
  title: string;
  description: string;
  imageSrc: string;
}

export const MOVE_TYPE_CARDS: MoveTypeCardInfo[] = [
  {
    id: "SMALL",
    title: "소형이사",
    description: "원룸, 투룸, 20평대 미만",
    imageSrc: "/images/move-type/small.svg",
  },
  {
    id: "HOME",
    title: "가정이사",
    description: "쓰리룸, 20평대 이상",
    imageSrc: "/images/move-type/home.svg",
  },
  {
    id: "OFFICE",
    title: "사무실이사",
    description: "사무실, 상업공간",
    imageSrc: "/images/move-type/office.svg",
  },
];
