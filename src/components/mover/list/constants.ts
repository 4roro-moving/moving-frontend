import type { MoverSort } from "@/types/mover";

export const SORT_OPTIONS: { value: MoverSort; label: string }[] = [
  { value: "reviewCount", label: "리뷰 많은순" },
  { value: "rating", label: "평점 높은순" },
  { value: "career", label: "경력 높은순" },
  { value: "confirmedCount", label: "확정 많은순" },
];
