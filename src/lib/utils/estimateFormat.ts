import type { EstimateStatus, MoveType } from "@/types/estimate";
import { parseDateOnly } from "@/lib/utils/date";

const MOVE_TYPE_LABEL: Record<MoveType, string> = {
  SMALL: "소형이사",
  HOME: "가정이사",
  OFFICE: "사무실이사",
};

const WEEKDAY_LABEL = ["일", "월", "화", "수", "목", "금", "토"] as const;
const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * 날짜 전용(`YYYY-MM-DD`)은 parseDateOnly, Date/ISO datetime은 기존처럼 처리합니다.
 * // 2026.07.24 정슬기 - [수정] 날짜 전용 문자열 타임존 밀림 방지
 */
function toDisplayDate(value: string | Date): Date {
  if (value instanceof Date) {
    return value;
  }

  if (DATE_ONLY_PATTERN.test(value)) {
    return parseDateOnly(value);
  }

  return new Date(value);
}

export function getMoveTypeLabel(moveType: MoveType): string {
  return MOVE_TYPE_LABEL[moveType];
}

export function formatRequestDateLabel(value: string | Date): string {
  // createdAt(ISO datetime) 기준. 날짜 전용 문자열이 들어오면 parseDateOnly 사용
  const date = toDisplayDate(value);
  const yy = String(date.getFullYear()).slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yy}. ${mm}. ${dd}.`;
}

export function formatMoveDateLabel(value: string | Date): string {
  // moveDate는 "YYYY-MM-DD" 날짜 전용
  const date = parseDateOnly(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const weekday = WEEKDAY_LABEL[date.getDay()];
  return `${year}년 ${month}월 ${day}일 (${weekday})`;
}

export function formatDetailDateLabel(value: string | Date): string {
  // createdAt(ISO datetime) 기준. 날짜 전용 문자열이 들어오면 parseDateOnly 사용
  const date = toDisplayDate(value);
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
