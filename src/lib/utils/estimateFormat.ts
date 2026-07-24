import type { EstimateStatus, MoveType } from "@/types/estimate";

const MOVE_TYPE_LABEL: Record<MoveType, string> = {
  SMALL: "소형이사",
  HOME: "가정이사",
  OFFICE: "사무실이사",
};

const WEEKDAY_LABEL = ["일", "월", "화", "수", "목", "금", "토"] as const;

export function getMoveTypeLabel(moveType: MoveType): string {
  return MOVE_TYPE_LABEL[moveType];
}

export function formatRequestDateLabel(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  const yy = String(date.getFullYear()).slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yy}. ${mm}. ${dd}.`;
}

export function formatMoveDateLabel(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const weekday = WEEKDAY_LABEL[date.getDay()];
  return `${year}년 ${month}월 ${day}일 (${weekday})`;
}

export function formatDetailDateLabel(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  const yy = String(date.getFullYear()).slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yy}.${mm}.${dd}`;
}

export function formatPrice(price: number): string {
  return `${price.toLocaleString("ko-KR")}원`;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function isPendingEstimate(status: EstimateStatus): boolean {
  return status === "SENT";
}

export function isConfirmedEstimate(status: EstimateStatus): boolean {
  return status === "CONFIRMED";
}
